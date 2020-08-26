import { createElement } from './createElement';

export default class TabPanel {
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

  // 控制显示那个panel
  select(i) {
    for (let view of this.childViews) {
      view.style.display = 'none';
    }
    this.childViews[i].style.display = '';

    for (let view of this.titleViews) {
      view.classList.remove('selected');
    }
    this.titleViews[i].classList.add('selected');
  }

  render() {
    this.childViews = this.children.map(child => <div style="width: 300px; min-height: 300px;">{child}</div>);

    this.titleViews = this.children.map((child, i) => {
      return (
        <span style="display: inline-block; background-color: lightgreen; font-size: 20px; margin: 0 5px; padding: 5px; border-radius: 10px 10px 0 0;" onClick={() => this.select(i)}>
          {child.getAttribute('title')}
        </span>
      );
    });

    setTimeout(() => this.select(0), 16);

    return (
      <div class="tab-panel" style="width: 300px; margin: 20px;">
        <h1 style="width:300px;margin:0;"> {this.titleViews}</h1>
        <div style="border:solid 1px lightgreen">{this.childViews}</div>
      </div>
    );
  }

  // 挂载在parent元素，首次挂载在body元素下，然后循环挂载child在this.root下
  mountTo(parent) {
    this.render().mountTo(parent);
  }
}
