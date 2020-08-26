import { enableGesture } from '../gesture/gesture.js';

export class Text {
  constructor(text) {
    this.root = document.createTextNode(text);
  }
  mountTo(parent) {
    parent.appendChild(this.root);
  }
  getAttribute(name) {
    this.root.getAttribute(name);
  }
  get classList() {
    return this.root.classList;
  }
}

export class Wrapper {
  //config
  constructor(type) {
    this.children = [];
    this.root = document.createElement(type);
  }
  // attribute
  setAttribute(name, value) {
    // console.log('Parent -> setAttribute -> name, value', name, value);
    this.root.setAttribute(name, value);

    if (name.match(/^on([\s\S]+)$/)) {
      const eventName = RegExp.$1.replace(/^[\s\S]/, c => c.toLowerCase());
      this.root.addEventListener(eventName, value);
    }

    if (name === 'enableGesture') {
      enableGesture(this.root);
    }
  }
  getAttribute(name) {
    return this.root.getAttribute(name) || '';
  }
  addEventListener() {
    this.root.addEventListener(...arguments);
  }

  // children
  appendChild(child) {
    this.children.push(child);
    child.mountTo(this.root);
  }
  // 挂载在parent元素，首次挂载在body元素下，然后循环挂载child在this.root下
  get style() {
    return this.root.style;
  }
  set innerText(text) {
    return (this.root.innerText = text);
  }
  get classList() {
    return this.root.classList;
  }
  mountTo(parent) {
    parent.appendChild(this.root);

    for (let child of this.children) {
      child.mountTo(this.root);
    }
  }
}

export function createElement(Cls, attributes, ...children) {
  // 传入config
  let o = null;

  if (typeof Cls === 'string') {
    o = new Wrapper(Cls);
  } else {
    o = new Cls({});
  }

  for (let name in attributes) {
    o.setAttribute(name, attributes[name]);
  }

  let visit = children => {
    for (let child of children) {
      if (typeof child === 'object' && child instanceof Array) {
        visit(child);
        continue;
      }

      if (typeof child === 'string') {
        child = new Text(child);
      }

      o.appendChild(child);
    }
  };

  visit(children);

  return o;
}
