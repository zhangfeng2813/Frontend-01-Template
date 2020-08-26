
/**
 * 简单选择器的 
 *   [x] hash
 *   [x] class 
 *   [x] tagName
 *   [x] 属性选择器
 * 
 * [x] 复合选择器
 * 
 * 复杂选择器
 *   [x] 后代选择器
 *   [ ] 子代选择器
 *   [ ] 紧接兄弟选择器
 *   [ ] 后续兄弟选择器
 */

// 获取元素的path，如 div的parents [body, html]
function getElementParents(element, path = []) {
  if (element.parentNode.nodeType !== Node.DOCUMENT_NODE) {
    path.push(element.parentNode);
    getElementParents(element.parentNode, path)
  }
  return path
}

function match(selectors, element) {
  // 将复合选择器拆开
  const simpleSelectors = splitSimpleSelector(selectors);
  // 3. 判断复合选择器是否匹配当前元素，例如 div#id.class => ['div', '#id', '.class']
  let matchCount = 0;
  for (let i = 0; i < simpleSelectors.length; i++) {
    const selector = simpleSelectors[i];

    if (!selector) {
      continue;
    }
    // 判断选择其是否为id
    if (selector.charAt(0) === '#') {
      // 找出id属性
      const attr = element.attributes.getNamedItem('id')
      if (attr && attr.value === selector.slice(1)) {
        matchCount++;
      }
    } else if (selector.charAt(0) === '.') { // 判断选择器是否为class
      const attr = element.attributes.getNamedItem('class')
      if (attr && attr.value === selector.slice(1)) {
        matchCount++;
      }
    } else if (selector.charAt(0) === '[') {
      const [attrKey, attrValue] = selector.slice(1, -1).split('=');
      const attr = element.attributes.getNamedItem(attrKey)
      if (attr && attr.value === attrValue) {
        matchCount++;
      }
    } else { // 最后处理tag选择器
      if (element.tagName.toLowerCase() === selector) {
        matchCount++;
      }
    }
  }

  // 当前元素上满足了复合选择器满足的条件才返回true
  return matchCount === simpleSelectors.length
}


function splitSimpleSelector(selector = '') {
  // 2. 利用零宽断言拆开 tagName标签名 ， hash id ， class 类， [attr=value] 属性
  return selector.split(/(?=[#.\[])/);
}

function matches(selector, element) {
  // element.matches(selector) 原生提供的api

  // 1. 实现复合的简单选择器
  const selectors = selector.split(/\s/).reverse();

  // 判断最右的简单选择器是否当前元素
  if (selectors[0]) {
    if (!match(selectors[0], element)) {
      return false;
    }
  }

  let matched = false;

  // 4. 从左到右进行判断，如果到了这里，说明已经满足rules的最右的选择器
  const parentElements = getElementParents(element);
  let j = 1;

  // 5. 判断父元素是否匹配
  for (let i = 0; i < parentElements.length; i++) {
    if (match(selectors[j], parentElements[i])) {
      j++;
    }
  }

  if (j >= selectors.length) {
    matched = true;
  }

  return matched;
}

[
  ["div #id.class", document.getElementById("id")],
  ['section div.box span#text', document.getElementById('text')],
  ['[data-name=jeff]', document.getElementById('attr-el')],
  ['[data-age=22][data-name=jeff]', document.getElementById('attr-el')],
].forEach(([selector, element]) => {
  console.log(selector,element, 'result: ', matches(selector, element))
})


