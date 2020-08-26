import { createElement } from './createElement';
import { Timeline, Animation } from '../animation/animation.js';
import { ease } from '../animation/cubicBezier.js';
import './carousel.css';

export default class Carousel {
  constructor(type) {
    this.root = null;
    this.children = [];
    this.attributes = new Map();
    this.properties = new Map();
  }
  // attribute
  setAttribute(name, value) {
    // console.log('Parent -> setAttribute -> name, value', name, value);
    this.attributes.set(name, value);
  }

  appendChild(child) {
    this.children.push(child);
  }

  autoCarousel() {
    const children = this.children;
    let position = 0;
    const data = this.attributes.get('data');

    // 不能有DOM操作，不能改变元素结构，因为语义变了,所以需要改变CSS
    this.nextPic = () => {
      let nextPosition = (position + 1) % data.length;
      // 当前播放到哪里
      let current = children[position];
      let next = children[nextPosition];

      let currentAnimation = new Animation({
        object: current.style,
        property: 'transform',
        template: v => `translateX(${5 * v}px)`,
        start: -100 * position,
        end: -100 - 100 * position,
        duration: 500,
        delay: 0,
        timingFunction: ease,
      });

      let nextAnimation = new Animation({
        object: next.style,
        property: 'transform',
        template: v => `translateX(${5 * v}px)`,
        start: 100 - 100 * nextPosition,
        end: -100 * nextPosition,
        duration: 500,
        delay: 0,
        timingFunction: ease,
      });

      this.timeline.add(currentAnimation);
      this.timeline.add(nextAnimation);

      this.timeline.start();

      position = nextPosition;

      this.nextPicStopHandler = setTimeout(this.nextPic, 3000);
    };

    this.nextPicStopHandler = setTimeout(this.nextPic, 3000);
  }

  render() {
    this.timeline = new Timeline();
    this.timeline.start();

    this.nextPicStopHandler = null;

    const data = this.attributes.get('data');
    this.children = data.map((url, currentPosition) => {
      let lastPosition = (currentPosition - 1 + data.length) % data.length;
      let nextPosition = (currentPosition + 1) % data.length;

      let offset = 0;

      let onStart = () => {
        this.timeline.pause();
        clearTimeout(this.nextPicStopHandler);

        let currentElement = this.children[currentPosition];
        let currentTransformValue = Number(currentElement.style.transform.match(/translateX\(([\s\S]+)px\)/)[1]);

        offset = currentTransformValue + 500 * currentPosition;
      };

      let onPan = event => {
        let lastElement = this.children[lastPosition];
        let currentElement = this.children[currentPosition];
        let nextElement = this.children[nextPosition];
        let dx = event.clientX - event.startX;

        let currentTransformValue = -500 * currentPosition + offset + dx;
        let lastTransformValue = -500 - 500 * lastPosition + offset + dx;
        let nextTransformValue = 500 - 500 * nextPosition + offset + dx;

        lastElement.style.transform = `translateX(${lastTransformValue}px)`;
        currentElement.style.transform = `translateX(${currentTransformValue}px)`;
        nextElement.style.transform = `translateX(${nextTransformValue}px)`;
      };

      let onPanend = event => {
        const isFlick = event.isFlick;
        let direction = 0;
        let dx = event.clientX - event.startX;
        if (dx + offset > 250) {
          direction = 1;
        } else if (dx + offset < -250) {
          direction = -1;
        }
        if (isFlick) {
          if (dx + offset > 0) {
            direction = 1;
          } else {
            direction = -1;
          }
        }

        this.timeline.reset();
        this.timeline.start();

        let lastElement = this.children[lastPosition];
        let currentElement = this.children[currentPosition];
        let nextElement = this.children[nextPosition];

        let lastAnimation = new Animation({
          object: lastElement.style,
          property: 'transform',
          template: v => `translateX(${v}px)`,
          start: -500 - 500 * lastPosition + offset + dx,
          end: -500 - 500 * lastPosition + direction * 500,
          duration: 500,
          delay: 0,
          timingFunction: ease,
        });

        let currentAnimation = new Animation({
          object: currentElement.style,
          property: 'transform',
          template: v => `translateX(${v}px)`,
          start: -500 * currentPosition + offset + dx,
          end: -500 * currentPosition + currentPosition + direction * 500,
          duration: 500,
          delay: 0,
          timingFunction: ease,
        });

        let nextAnimation = new Animation({
          object: nextElement.style,
          property: 'transform',
          template: v => `translateX(${v}px)`,
          start: 500 - 500 * nextPosition + offset + dx,
          end: 500 - 500 * nextPosition + direction * 500,
          duration: 500,
          delay: 0,
          timingFunction: ease,
        });

        this.timeline.add(lastAnimation);
        this.timeline.add(currentAnimation);
        this.timeline.add(nextAnimation);

        this.nextPicStopHandler = setTimeout(this.nextPic, 3000);
      };
      let element = <img class="" src={url} onStart={onStart} onPan={onPan} onPanend={onPanend} enableGesture />;
      element.style.transform = 'translateX(0px)';
      element.addEventListener('dragstart', e => e.preventDefault());
      return element;
    });
    this.root = <div class="carousel">{this.children}</div>;

    // 自动播放
    this.autoCarousel();
    // 鼠标滑动
    // this.moveCarousel();

    return this.root;
  }

  // 挂载在parent元素，首次挂载在body元素下，然后循环挂载child在this.root下
  mountTo(parent) {
    this.render().mountTo(parent);
  }
}
