const css = require('css');
require('./polyfill-flat');

function getCssRules(style = '') {
  const ast = css.parse(style)
  return ast.stylesheet.rules
}

// 获取元素的path，如 div的parents [body, html]
function getElementParents(element, path = []) {
  if (element.parent.type !== 'document') {
    path.push(element.parent);
    getElementParents(element.parent, path)
  }
  return path
}

/**
 * 匹配元素和选择器
 * @param {Object} element 
 * @param {Array} selectors 支持复合选择器 div.img => ['div', '.img']
 */
function match(element, selectors = []) {
  let matchCount = 0;
  for (let i = 0; i < selectors.length; i++) {
    const selector = selectors[i];

    if (!selector) {
      continue;
    }
  
    // 判断选择其是否为id
    if (selector.charAt(0) === '#') {
      // 找出id属性
      const attr = element.attributes.find(attr => attr.name === 'id');
      if (attr && attr.value === selector.slice(1)) {
        matchCount++;
      }
    } else if (selector.charAt(0) === '.') { // 判断选择器是否为class
      const attr = element.attributes.find(attr => attr.name === 'class');
      if (attr && attr.value === selector.slice(1)) {
        matchCount++;
      }
    } else { // 最后处理tag选择器
      if (element.tagName === selector) {
        matchCount++;
      }
    }
  }

  // 当前元素上满足了复合选择器满足的条件才返回true
  return matchCount === selectors.length
}

/**
 * 计算权重
 */
function specificity(selector) {
  const pObj = {
    inline: 0,
    id: 0,
    class: 0,
    tag: 0,
  }
  // 将[['div', '.img'], 'div', 'body'] => ["div", ".img", "div", "body"]
  const selectorParts = selector.flat();
  for (let part of selectorParts) {
    if (part.charAt(0) === '#') {
      pObj.id += 1;
    } else if (part.charAt(0) === '.') {
      pObj.class += 1;
    } else {
      pObj.tag += 1;
    }
  }
  return Object.keys(pObj).map(key => pObj[key]);
}

/**
 * 
 * @param {*} sp1 
 * @param {*} sp2 
 * @return 大于0: sp1 覆盖 sp2
 */
function compare(sp1, sp2) {
  for (let i = 0; i < sp1.length; i++) {
    if (sp1[i] - sp2[i]) {
      // 如果当前位得出结果后就return
      return sp1[i] - sp2[i];
    }
  }
  // 如果全部一样则return 1, 覆盖之前的属性
  return 1;
}

// 对代码的修复
// function compare(sp1, sp2) {
//   if (sp1[0] - sp2[0]) {
//     return sp1[0] - sp2[0]
//   }
//   if (sp1[1] - sp2[1]) {
//     return sp1[1] - sp2[1]
//   }
//   if (sp1[2] - sp2[2]) {
//     return sp1[2] - sp2[2]
//   }
//   if (sp1[3] - sp2[3]) {
//     return sp1[3] - sp2[3]
//   }
//   return -1;
// }

// 处理基本选择器
function matchRules(element, rules) {
  const parentElements = getElementParents(element);

  let matched = false;

  for (let rule of rules) {
    let selectorParts = rule.customSelectors;

    if (!match(element, selectorParts[0])) {
      continue;
    }

    // 如果到了这里，说明已经满足rules的最右的选择器
    let j = 1;

    for (let i = 0; i < parentElements.length; i++) {
      if (match(parentElements[i], selectorParts[j])) {
        j++;
      }
    }

    if (j >= selectorParts.length) {
      matched = true;
    }

    if (matched) {
      const sp = specificity(rule.customSelectors)
      // 生成计算属性
      let computedStyle = element.computedStyle;
      // 获取rule中的属性， { height: 100px; width: 100px } 
      for (let declaration of rule.declarations) {
        if (!computedStyle[declaration.property]) {
          computedStyle[declaration.property] = {}
        }
        if (!computedStyle[declaration.property].specificity) {
          computedStyle[declaration.property].value = declaration.value;
          computedStyle[declaration.property].specificity = sp;
          // } else if (compare(computedStyle[declaration.property].specificity, sp) < 0) {
        } else if (compare(sp, computedStyle[declaration.property].specificity) > 0) {
          // 当前属性的specificity和属性上的specificity对比，如果大于则替换当前的属性值
          computedStyle[declaration.property].value = declaration.value;
          computedStyle[declaration.property].specificity = sp;
        }
      }
    }
  }
}

/**
 * 处理element的selector,支持复合选择器
 * @param {*} element 
 */
function handleRulesSelector(rules) {
  for (let i = 0; i < rules.length; i++) {
    // 创建一个拆解每个selector
    if (!rules[i].customSelectors) {
      rules[i].customSelectors = []
    }
    const selectors = rules[i].selectors;
    for (let j = 0; j < selectors.length; j++) {
      const customSelectors = [];
      // 处理的结果:
      // body div div.img => [['div', '.img'], ['div'], ['body']]

      // 先将selectors分割反转。得出["div.img", "div", "body"]
      const splitSelect = selectors[j].split(/\s/).reverse();
      // 再对数组分析出复合选择器
      for (let s = 0; s < splitSelect.length; s++) {
        // 目前只支持 tag && id && class
        // 将 div.img#id => ["div", ".img", "#id"]
        const result = splitSelect[s].match(/([.#]?[0-9a-zA-Z-_]+)/g)
        customSelectors[s] = result || [];
      }
      rules[i].customSelectors = customSelectors;
    }
  }
}

/**
 * 计算CSS
 * @param {*} element 当前元素
 * @param {*} rules 规则
 */
function computeCss(element, rules) {
  if (!element.computedStyle) {
    element.computedStyle = {};
  }
  
  handleRulesSelector(rules);

  matchRules(element, rules)
}

module.exports = {
  getCssRules,
  computeCss,
}