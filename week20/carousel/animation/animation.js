export class Timeline {
  constructor() {
    this.state = 'inited';
    this.animations = new Set();
    this.finishedAnimations = new Set();
    this.addTimes = new Map();
    this.requestID = null;
    this.tick = () => {
      let t = Date.now() - this.startTime;

      for (let animation of this.animations) {
        let { object, property, duration, timingFunction, template, delay } = animation;
        let addTime = this.addTimes.get(animation);
        if (t < delay + addTime) {
          continue;
        }

        let progression = timingFunction((t - delay - addTime) / duration); // 0 - 1之间的数
        if (t > duration + delay + addTime) {
          progression = 1;
          this.animations.delete(animation);
          this.finishedAnimations.add(animation);
        }

        let value = animation.valueFromProgression(progression); // value就是根据progresstion 算出的当前值

        object[property] = template(value);
      }

      if (this.animations.size) {
        this.requestID = requestAnimationFrame(this.tick);
      } else {
        this.requestID = null;
      }
    };
  }
  // 下一帧

  pause() {
    if (this.state != 'playing') return;
    this.state = 'paused';
    this.pauseTime = Date.now();
    if (this.requestID !== null) {
      cancelAnimationFrame(this.requestID);
      this.requestID = null;
    }
  }

  resume() {
    if (this.state === 'paused') {
      this.state = 'playing';
      this.startTime += Date.now() - this.pauseTime;
      this.tick();
    }
  }

  start() {
    if (this.state != 'inited') {
      return;
    }
    this.state = 'playing';
    this.startTime = Date.now();
    this.tick();
  }

  reset() {
    if (this.state === 'playing') {
      this.pause();
    }

    this.state = 'inited';
    this.animations = new Set();
    this.finishedAnimations = new Set();
    this.addTimes = new Map();
    this.requestID = null;
    this.startTime = Date.now();
    this.pauseTime = null;
  }

  restart() {
    if (this.state === 'playing') {
      this.pause();
    }

    for (let animation of this.finishedAnimations) {
      this.animations.add(animation);
    }

    this.state = 'playing';
    this.finishedAnimations = new Set();

    this.requestID = null;
    this.startTime = Date.now();
    this.pauseTime = null;
    this.tick();
  }

  add(animation, addTime) {
    this.animations.add(animation);

    if (this.state === 'playing' && this.requestID === null) {
      this.tick();
    }

    if (this.state === 'playing') {
      this.addTimes.set(animation, addTime !== void 0 ? addTime : Date.now() - this.startTime);
    } else {
      this.addTimes.set(animation, addTime !== void 0 ? addTime : 0);
    }
  }
}

export class Animation {
  constructor({ object, property, template, start, end, duration, delay, timingFunction }) {
    this.object = object;
    this.template = template;
    this.property = property;
    this.start = start;
    this.end = end;
    this.duration = duration;
    this.delay = delay;
    this.timingFunction = timingFunction;
  }
  valueFromProgression(progression) {
    return this.start + progression * (this.end - this.start);
  }
}

export class ColorAnimation {
  constructor({ object, property, template, start, end, duration, delay, timingFunction }) {
    this.object = object;
    this.template = template || (v => `rgba(${v.r}, ${v.g}, ${v.b}, ${v.a})`);
    this.property = property;
    this.start = start;
    this.end = end;
    this.duration = duration;
    this.delay = delay;
    this.timingFunction = timingFunction;
  }
  valueFromProgression(progression) {
    return {
      r: this.start.r + progression * (this.end.r - this.start.r),
      g: this.start.g + progression * (this.end.g - this.start.g),
      b: this.start.b + progression * (this.end.b - this.start.b),
      a: this.start.a + progression * (this.end.a - this.start.a),
    };
  }
}

/**


let animation = new Animation(object, property, start, end, duration, delay, timingFunction)

用单个不好管理多个animation

let timeline = new Timeline();

timeline.add(animation)
timeline.add(animation2)

timeline.start();
timeline.pause();
timeline.resume();
timeline.stop();

*/
