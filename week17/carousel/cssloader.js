let css = require('css');

module.exports = function (source) {
  let stylesheet = css.parse(source);
  let name = this.resourcePath.match(/([^/\\]+).css$/)[1];

  for (let rule of stylesheet.stylesheet.rules) {
    rule.selectors = rule.selectors.map(selector => (selector.match(new RegExp(`^.${name}`)) ? selector : `.${name} ${selector}`));
  }

  let res = css.stringify(stylesheet);
  console.log('res', JSON.stringify(res));
  return `
let style = document.createElement('style');
style.innerHTML = ${JSON.stringify(res)};
document.documentElement.appendChild(style);
  `;
};
