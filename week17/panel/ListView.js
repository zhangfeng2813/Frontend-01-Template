import { createElement } from './createElement';

export default class ListView {
  constructor(type) {
    this.root = null;
    this.children = [];
    this.attributes = new Map();
    this.properties = new Map();

    this.state = Object.create(null);
  }
  setAttribute(name, value) {
    this.attributes.set(name, value);
  }

  appendChild(child) {
    this.children.push(child);
  }

  render() {
    let data = this.attributes.get('data');
    return (
      <div class="list-view" style="width: 300; max-height: 500px; overflow: scroll">
        {data.map(this.children[0])}
      </div>
    );
  }

  // 挂载在parent元素，首次挂载在body元素下，然后循环挂载child在this.root下
  mountTo(parent) {
    this.render().mountTo(parent);
  }
}
