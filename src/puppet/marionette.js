// A string marionette simulated with Verlet integration.
// The wooden controller is kinematic (driven by the pointer or an idle dance);
// head and hands hang from it on ropes, the body swings as a pendulum and the
// skirt lags behind on a damped spring so it flares when the puppet twirls.
import { headParts, torsoPart, upperArmPart, forearmPart, skirtPart, controllerPart } from './costumes.js';
import { C } from '../art/palette.js';

const NS = 'http://www.w3.org/2000/svg';
const el = (tag, attrs = {}, parent) => {
  const n = document.createElementNS(NS, tag);
  for (const [k, v] of Object.entries(attrs)) n.setAttribute(k, v);
  if (parent) parent.appendChild(n);
  return n;
};
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const deg = (r) => (r * 180) / Math.PI;
const rot = (x, y, a) => [x * Math.cos(a) - y * Math.sin(a), x * Math.sin(a) + y * Math.cos(a)];

const HEAD = 50;
const TORSO = 92;
const SH_X = 36;
const SH_Y = 12;
const UPPER = 50;
const FORE = 46;
const HEAD_ANCHOR = 30;
const HAND_ANCHOR = 104;

class P {
  constructor(x, y) {
    this.x = x; this.y = y; this.px = x; this.py = y;
  }
}

export class Marionette {
  /**
   * @param {SVGGElement} host  group inside an <svg>; puppet coordinates are in that svg's user space
   * @param {object} costume    entry from COSTUMES
   * @param {object} opts       { x, y, scale, headString, handLift, idle, reduced }
   */
  constructor(host, costume, opts = {}) {
    this.o = { x: 0, y: 0, scale: 1, headString: 230, handLift: 34, idle: true, idleAmp: 1, jigEvery: 2.2, phase: 0, reduced: false, ...opts };
    this.host = host;
    this.svg = host.ownerSVGElement;
    this.t = 0;
    this.lastInput = -10;
    this.target = { x: 0, y: 0 };
    this.base = { x: 0, y: 0 };
    this.ctrl = { x: 0, y: 0, px: 0, tilt: 0, vx: 0 };
    this.manualTilt = 0;
    this.jig = { t: 0, side: 0 };
    this.hop = 0;
    this.nextJig = 2.2;
    this.skirt = { a: 0, v: 0 };
    this.look = { x: 0, y: 0 };
    this.blink = 3;
    this.acc = 0;
    this.build(costume);
    this.reset();
    this.render();
  }

  build(c) {
    const root = el('g', { class: 'puppet', transform: `translate(${this.o.x} ${this.o.y}) scale(${this.o.scale})` }, this.host);
    this.root = root;
    const head = headParts(c.head);
    this.gHeadBack = el('g', { class: 'p-head-back' }, root);
    this.gHeadBack.innerHTML = head.back;
    this.gSkirt = el('g', { class: 'p-skirt' }, root);
    this.gSkirt.innerHTML = skirtPart(c.skirt);
    this.gUpperL = el('g', {}, root);
    this.gUpperR = el('g', {}, root);
    this.gUpperL.innerHTML = upperArmPart(c.upperArm);
    this.gUpperR.innerHTML = upperArmPart(c.upperArm);
    this.gTorso = el('g', { class: 'p-torso' }, root);
    this.gTorso.innerHTML = torsoPart(c.torso);
    this.gHead = el('g', { class: 'p-head' }, root);
    this.gHead.innerHTML = head.front;
    this.gForeL = el('g', {}, root);
    this.gForeR = el('g', {}, root);
    this.gForeL.innerHTML = forearmPart({ skin: c.head.skin, ...c.forearmL });
    this.gForeR.innerHTML = forearmPart({ skin: c.head.skin, ...c.forearmR });
    this.gStrings = el('g', { class: 'p-strings', stroke: C.thread, 'stroke-width': 1.3, 'stroke-linecap': 'round', opacity: 0.9 }, root);
    this.strings = [0, 1, 2, 3].map(() => el('line', {}, this.gStrings));
    this.gCtrl = el('g', { class: 'p-ctrl' }, root);
    this.gCtrl.innerHTML = controllerPart();
    this.eyes = [...this.gHead.querySelectorAll('.eye')];
    this.hit = el('rect', { x: -90, y: 120, width: 180, height: 420, fill: 'transparent', class: 'p-hit' }, root);
    this.hit.style.cursor = 'grab';
  }

  reset() {
    const L = this.o.headString;
    const ay = Math.sqrt(L * L - HEAD_ANCHOR * HEAD_ANCHOR);
    this.A = new P(0, ay);
    this.B = new P(0, ay + HEAD);
    this.Cp = new P(0, ay + HEAD + TORSO);
    const sy = this.B.y + SH_Y;
    this.EL = new P(-SH_X - 4, sy + UPPER);
    this.ER = new P(SH_X + 4, sy + UPPER);
    this.HL = new P(-SH_X - 6, sy + UPPER + FORE);
    this.HR = new P(SH_X + 6, sy + UPPER + FORE);
    const free = Math.hypot(HAND_ANCHOR - SH_X, sy + UPPER + FORE);
    this.handLen = free - this.o.handLift;
    this.parts = [this.A, this.B, this.Cp, this.EL, this.ER, this.HL, this.HR];
  }

  /** Move/scale the whole puppet (e.g. on resize). */
  setFrame(x, y, scale) {
    Object.assign(this.o, { x, y, scale });
    this.root.setAttribute('transform', `translate(${x} ${y}) scale(${scale})`);
  }

  /** Walk the controller to a new resting x (local units). */
  setBase(x, y = 0) {
    this.base.x = x;
    this.base.y = y;
  }

  /** A burst of dancing. */
  celebrate(times = 4, gap = 0.6) {
    for (let i = 0; i < times; i++) setTimeout(() => this.dance(i % 3 === 2 ? 0 : i % 2 ? 1 : -1), i * gap * 1000);
  }

  /** Pointer position in svg user space → controller target. */
  pointTo(wx, wy) {
    const lx = (wx - this.o.x) / this.o.scale;
    const ly = (wy - this.o.y) / this.o.scale;
    this.target.x = clamp(lx, -240, 240);
    this.target.y = clamp(ly * 0.25, -50, 60);
    this.look.x = clamp((lx - this.A.x) / 160, -1, 1);
    this.look.y = clamp((ly - this.A.y) / 200, -1, 1);
    this.lastInput = this.t;
  }

  /** Tilt the controller directly (−1…1), e.g. from keyboard or device motion. */
  setTilt(v) {
    this.manualTilt = clamp(v, -1, 1) * 30;
    this.lastInput = this.t;
  }

  /** A quick upward flick of the strings: the puppet dances. side: -1 left, 1 right, 0 both. */
  dance(side = 0) {
    this.jig = { t: 0.55, side };
  }

  clientToSvg(cx, cy) {
    const m = this.svg.getScreenCTM();
    if (!m) return [0, 0];
    const p = new DOMPoint(cx, cy).matrixTransform(m.inverse());
    return [p.x, p.y];
  }

  /** Where the head is, in client (screen) coordinates — for speech bubbles. */
  headClientPos() {
    const m = this.root.getScreenCTM();
    if (!m) return { x: 0, y: 0 };
    const p = new DOMPoint(this.A.x, this.A.y - 40).matrixTransform(m);
    return { x: p.x, y: p.y };
  }

  update(dtFrame) {
    const dt = 1 / 120;
    this.acc = Math.min(this.acc + dtFrame, 0.1);
    while (this.acc >= dt) {
      this.step(dt);
      this.acc -= dt;
    }
    this.render();
  }

  anchors() {
    const a = (this.ctrl.tilt * Math.PI) / 180;
    const pt = (ax) => {
      const [x, y] = rot(ax, 0, a);
      return [this.ctrl.x + x, this.ctrl.y + this.hop + y];
    };
    return { hl: pt(-HEAD_ANCHOR), hr: pt(HEAD_ANCHOR), handL: pt(-HAND_ANCHOR), handR: pt(HAND_ANCHOR) };
  }

  step(dt) {
    this.t += dt;
    const idle = this.o.idle && this.t - this.lastInput > 2.6;
    const amp = this.o.reduced ? 0.25 : this.o.idleAmp;
    if (idle) {
      this.target.x = this.base.x + Math.sin(this.t * 0.7 + this.o.phase) * 110 * amp;
      this.target.y = this.base.y + Math.sin(this.t * 1.3 + this.o.phase) * 16 * amp;
      this.look.x *= 0.98; this.look.y *= 0.98;
      if (!this.o.reduced && this.t > this.nextJig) {
        this.dance(Math.random() < 0.34 ? 0 : Math.random() < 0.5 ? -1 : 1);
        this.nextJig = this.t + this.o.jigEvery + Math.random() * this.o.jigEvery;
      }
    }

    // Controller: smoothed follow with a speed limit (a real hand can only
    // move so fast — and an unbounded jerk would fling the puppet over its strings).
    const k = 1 - Math.exp(-dt * 7);
    const maxStep = 900 * dt;
    const prevX = this.ctrl.x;
    this.ctrl.x += clamp((this.target.x - this.ctrl.x) * k, -maxStep, maxStep);
    this.ctrl.y += clamp((this.target.y - this.ctrl.y) * k, -maxStep, maxStep);
    this.ctrl.vx = (this.ctrl.x - prevX) / dt;
    const idleSway = Math.sin(this.t * 1.7) * 7 * amp;
    const tiltTarget = clamp(-this.ctrl.vx * 0.045, -26, 26) + idleSway + this.manualTilt;
    this.ctrl.tilt += (tiltTarget - this.ctrl.tilt) * (1 - Math.exp(-dt * 6));
    this.manualTilt *= 0.995;

    if (this.jig.t > 0) this.jig.t = Math.max(0, this.jig.t - dt);
    const jigPhase = this.jig.t > 0 ? Math.sin((this.jig.t / 0.55) * Math.PI) : 0;
    const jigAmt = jigPhase * 110;
    this.hop = -jigPhase * 22; // the puppeteer's hand lifts smoothly during a jig

    // Verlet integration (with a velocity cap for stability).
    const g = 1700 * dt * dt;
    const vmax = 16;
    for (const p of this.parts) {
      const vx = clamp((p.x - p.px) * 0.988, -vmax, vmax);
      const vy = clamp((p.y - p.py) * 0.988, -vmax, vmax);
      p.px = p.x; p.py = p.y;
      p.x += vx; p.y += vy + g;
    }

    const an = this.anchors();
    const lenL = this.handLen - (this.jig.side <= 0 ? jigAmt : jigAmt * 0.2);
    const lenR = this.handLen - (this.jig.side >= 0 ? jigAmt : jigAmt * 0.2);
    for (let i = 0; i < 10; i++) {
      this.rope(an.hl, this.A, this.o.headString);
      this.rope(an.hr, this.A, this.o.headString);
      this.stick(this.A, this.B, HEAD, 1);
      this.stick(this.B, this.Cp, TORSO, 1);
      this.stick(this.A, this.Cp, HEAD + TORSO, 0.12);
      const { sl, sr } = this.shoulders();
      this.pin(sl, this.EL, UPPER);
      this.pin(sr, this.ER, UPPER);
      this.stick(this.EL, this.HL, FORE, 1);
      this.stick(this.ER, this.HR, FORE, 1);
      this.rope(an.handL, this.HL, lenL);
      this.rope(an.handR, this.HR, lenR);
      // keep hands from tucking into the chest
      this.repel(this.HL, this.B, 26);
      this.repel(this.HR, this.B, 26);
    }
    // Upright guard: a marionette's head stays below the controller and above its hips.
    const floorY = this.ctrl.y + 80;
    if (this.A.y < floorY) this.A.y += (floorY - this.A.y) * 0.25;
    if (this.Cp.y < this.A.y + 40) this.Cp.y += (this.A.y + 40 - this.Cp.y) * 0.25;

    // Skirt: damped spring towards the torso angle.
    const ta = this.torsoAngle();
    const acc = (ta - this.skirt.a) * 140 - this.skirt.v * 9;
    this.skirt.v += acc * dt;
    this.skirt.a += this.skirt.v * dt;

    // Blink.
    this.blink -= dt;
  }

  torsoAngle() {
    return Math.atan2(this.Cp.y - this.B.y, this.Cp.x - this.B.x) - Math.PI / 2;
  }

  shoulders() {
    const a = this.torsoAngle();
    const [lx, ly] = rot(-SH_X, SH_Y, a);
    const [rx, ry] = rot(SH_X, SH_Y, a);
    return { sl: [this.B.x + lx, this.B.y + ly], sr: [this.B.x + rx, this.B.y + ry] };
  }

  rope([ax, ay], p, L) {
    const dx = p.x - ax;
    const dy = p.y - ay;
    const d = Math.hypot(dx, dy);
    if (d > L) {
      p.x = ax + (dx / d) * L;
      p.y = ay + (dy / d) * L;
    }
  }

  stick(a, b, L, k) {
    const dx = b.x - a.x;
    const dy = b.y - a.y;
    const d = Math.hypot(dx, dy) || 1e-6;
    const diff = ((d - L) / d) * 0.5 * k;
    a.x += dx * diff; a.y += dy * diff;
    b.x -= dx * diff; b.y -= dy * diff;
  }

  pin([ax, ay], p, L) {
    const dx = p.x - ax;
    const dy = p.y - ay;
    const d = Math.hypot(dx, dy) || 1e-6;
    p.x = ax + (dx / d) * L;
    p.y = ay + (dy / d) * L;
  }

  repel(p, c, r) {
    const dx = p.x - c.x;
    const dy = p.y - (c.y + 30);
    const d = Math.hypot(dx, dy);
    if (d < r && d > 0) {
      p.x = c.x + (dx / d) * r;
      p.y = c.y + 30 + (dy / d) * r;
    }
  }

  render() {
    const tf = (g, x, y, a, extra = '') => g.setAttribute('transform', `translate(${x.toFixed(2)} ${y.toFixed(2)}) rotate(${deg(a).toFixed(2)})${extra}`);
    const { A, B, Cp, EL, ER, HL, HR } = this;
    const headA = Math.atan2(A.y - B.y, A.x - B.x) + Math.PI / 2;
    tf(this.gHead, B.x, B.y, headA);
    tf(this.gHeadBack, B.x, B.y, headA);
    tf(this.gTorso, B.x, B.y, this.torsoAngle());
    const { sl, sr } = this.shoulders();
    tf(this.gUpperL, sl[0], sl[1], Math.atan2(EL.y - sl[1], EL.x - sl[0]) - Math.PI / 2);
    tf(this.gUpperR, sr[0], sr[1], Math.atan2(ER.y - sr[1], ER.x - sr[0]) - Math.PI / 2);
    const foreL = Math.atan2(HL.y - EL.y, HL.x - EL.x) - Math.PI / 2;
    const foreR = Math.atan2(HR.y - ER.y, HR.x - ER.x) - Math.PI / 2;
    tf(this.gForeL, EL.x, EL.y, foreL);
    tf(this.gForeR, ER.x, ER.y, foreR);
    const flare = clamp(Math.abs(this.skirt.v) * 0.05, 0, 0.32);
    tf(this.gSkirt, Cp.x, Cp.y, this.skirt.a, ` scale(${(1 + flare).toFixed(3)} ${(1 - flare * 0.25).toFixed(3)})`);
    this.gCtrl.setAttribute('transform', `translate(${this.ctrl.x.toFixed(2)} ${(this.ctrl.y + this.hop).toFixed(2)}) rotate(${this.ctrl.tilt.toFixed(2)})`);

    // strings → temples and hands
    const an = this.anchors();
    const [tlx, tly] = rot(-22, -64, headA);
    const [trx, try_] = rot(22, -64, headA);
    const [hlx, hly] = rot(0, 50, foreL);
    const [hrx, hry] = rot(0, 50, foreR);
    const ends = [
      [an.hl, [B.x + tlx, B.y + tly]],
      [an.hr, [B.x + trx, B.y + try_]],
      [an.handL, [EL.x + hlx, EL.y + hly]],
      [an.handR, [ER.x + hrx, ER.y + hry]],
    ];
    ends.forEach(([a, b], i) => {
      const s = this.strings[i];
      s.setAttribute('x1', a[0].toFixed(1)); s.setAttribute('y1', a[1].toFixed(1));
      s.setAttribute('x2', b[0].toFixed(1)); s.setAttribute('y2', b[1].toFixed(1));
    });

    // eyes follow the audience; blink now and then
    const px = this.look.x * 3.2;
    const py = this.look.y * 1.6;
    let sy = 1;
    if (this.blink < 0.12) sy = 0.12;
    if (this.blink < 0) this.blink = 2.5 + Math.random() * 3;
    for (const e of this.eyes) {
      e.setAttribute('transform', `translate(0 -56) scale(1 ${sy}) translate(0 56)`);
      const side = Number(e.dataset.side) || 1;
      for (const p of e.querySelectorAll('.pupil')) p.setAttribute('transform', `translate(${(px * side).toFixed(2)} ${py.toFixed(2)})`);
    }

    // hit area follows the body
    this.hit.setAttribute('x', (B.x - 90).toFixed(1));
    this.hit.setAttribute('y', (A.y - 120).toFixed(1));
    this.hit.setAttribute('height', 380);
  }
}
