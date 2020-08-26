import { createElement } from './createElement';

export default class Panel {
  constructor(type) {
    this.root = null;
    this.children = [];
    this.attributes = new Map();
    this.properties = new Map();
  }
  setAttribute(name, value) {
    this.attributes.set(name, value);
  }

  appendChild(child) {
    this.children.push(child);
  }

  render() {
    return (
      <div class="panel">
        <h1>{this.attributes.get('title')}</h1>
        <div>{this.children}</div>
      </div>
    );
  }

  // 挂载在parent元素，首次挂载在body元素下，然后循环挂载child在this.root下
  mountTo(parent) {
    this.render().mountTo(parent);
  }
}
