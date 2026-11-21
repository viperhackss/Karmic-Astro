// A synthesized tanpura drone (Pa–Sa–Sa–Sa) and ghungroo bells, built with
// the Web Audio API. Nothing loads until the visitor turns sound on.
export class Sound {
  constructor() {
    this.ctx = null;
    this.on = false;
    this.timer = null;
  }

  ensure() {
    if (this.ctx) return;
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return;
    const ctx = new AC();
    this.ctx = ctx;
    this.master = ctx.createGain();
    this.master.gain.value = 0;
    const comp = ctx.createDynamicsCompressor();
    // A short synthetic hall.
    const verb = ctx.createConvolver();
    const len = ctx.sampleRate * 2.6;
    const ir = ctx.createBuffer(2, len, ctx.sampleRate);
    for (let c = 0; c < 2; c++) {
      const d = ir.getChannelData(c);
      for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 3);
    }
    verb.buffer = ir;
    const wet = ctx.createGain();
    wet.gain.value = 0.35;
    this.master.connect(comp);
    this.master.connect(verb);
    verb.connect(wet);
    wet.connect(comp);
    comp.connect(ctx.destination);
  }

  pluck(freq, when) {
    const ctx = this.ctx;
    const out = ctx.createGain();
    out.gain.setValueAtTime(0, when);
    out.gain.linearRampToValueAtTime(0.2, when + 0.03);
    out.gain.exponentialRampToValueAtTime(0.001, when + 4.2);
    const lp = ctx.createBiquadFilter();
    lp.type = 'lowpass';
    lp.frequency.setValueAtTime(2600, when);
    lp.frequency.exponentialRampToValueAtTime(700, when + 3.5);
    lp.Q.value = 0.8;
    // jawari: the buzzing bridge brightens the upper partials
    const jaw = ctx.createBiquadFilter();
    jaw.type = 'peaking';
    jaw.frequency.value = 2200;
    jaw.gain.value = 9;
    jaw.Q.value = 2.5;
    lp.connect(jaw).connect(out).connect(this.master);
    [1, 1.0028, 0.9971].forEach((m) => {
      const o = ctx.createOscillator();
      o.type = 'sawtooth';
      o.frequency.value = freq * m;
      o.connect(lp);
      o.start(when);
      o.stop(when + 4.4);
    });
  }

  loop() {
    const ctx = this.ctx;
    const sa = 130.81;
    const notes = [sa * 0.75, sa, sa, sa / 2];
    const t0 = ctx.currentTime + 0.05;
    notes.forEach((f, i) => this.pluck(f, t0 + i * 0.95));
    this.timer = setTimeout(() => this.on && this.loop(), 4200);
  }

  toggle() {
    this.ensure();
    if (!this.ctx) return false;
    this.on = !this.on;
    const now = this.ctx.currentTime;
    if (this.on) {
      this.ctx.resume();
      this.master.gain.cancelScheduledValues(now);
      this.master.gain.linearRampToValueAtTime(0.5, now + 1.2);
      this.loop();
    } else {
      this.master.gain.cancelScheduledValues(now);
      this.master.gain.linearRampToValueAtTime(0, now + 0.6);
      clearTimeout(this.timer);
    }
    return this.on;
  }

  /** Ghungroo: a handful of tiny bells. */
  bells(level = 0.8) {
    if (!this.on || !this.ctx) return;
    const ctx = this.ctx;
    const now = ctx.currentTime;
    const n = Math.round(5 + level * 7);
    for (let i = 0; i < n; i++) {
      const t = now + Math.random() * 0.35;
      const g = ctx.createGain();
      g.gain.setValueAtTime(0, t);
      g.gain.linearRampToValueAtTime(0.06 * level, t + 0.003);
      g.gain.exponentialRampToValueAtTime(0.0005, t + 0.35);
      g.connect(this.master);
      const f = 3600 + Math.random() * 2800;
      [1, 2.76].forEach((m, k) => {
        const o = ctx.createOscillator();
        o.type = 'sine';
        o.frequency.value = f * m;
        const og = ctx.createGain();
        og.gain.value = k ? 0.35 : 1;
        o.connect(og).connect(g);
        o.start(t);
        o.stop(t + 0.4);
      });
    }
  }
}
