function getStyle(element) {
  if (!element.style) {
    element.style = {};
  }

  // 将computedStyle克隆到style中，并处理px，目前只支持px单位
  for (let prop in element.computedStyle) {
    // 转为驼峰
    const newKey = String(prop).replace(/-([a-zA-Z])/, () => RegExp.$1.toUpperCase())
    element.style[newKey] = element.computedStyle[prop].value;
    
    if (String(element.style[prop]).match(/px$/)) {
      // 利用为运算符来toNumber
      element.style[prop] = parseInt(element.style[prop], 10);
    } else if (String(element.style[prop]).match(/^[0-9\.]+$/)) {
      element.style[prop] = parseFloat(element.style[prop]);
    }
  }

  return element.style;
}

function settDefaultValue(style) { 
  if (!style.flexDirection || !style.flexDirection === 'auto') {
    style.flexDirection = 'row';
  }
  if (!style.alignItems || !style.alignItems === 'auto') {
    style.alignItems = 'stretch';
  }
  if (!style.justifyContent || !style.justifyContent === 'auto') {
    style.justifyContent = 'flex-start';
  }
  if (!style.flexWrap || !style.flexWrap === 'auto') {
    style.flexWrap = 'nowrap';
  }
  if (!style.alignContent || !style.alignContent === 'auto') {
    style.alignContent = 'stretch';
  }
}

function layout(element) {
  if (!element.computedStyle) {
    return;
  }
  // 预处理
  let elementStyle = getStyle(element)

  if (String(elementStyle.display).indexOf('flex') === -1) {
    return;
  }

  // 过滤text类型的子元素
  let items = element.children.filter(e => e.type === 'element');

  // 支持 flex order 排序
  items.sort((a, b) => (a.order || 0) - (b.order || 0));

  let style = element.style;

  ['width', 'height'].forEach(size => {
    if (elementStyle[size] === 'auto' || elementStyle[size] === '') {
      elementStyle[size] = null;
    }
  })

  settDefaultValue(style)
  
  // main 是指主轴，cross是指侧轴
  // mainSign 排版的方向从左往右为+，反之-
  // mainBase 排版时的起点，从左往右排起点为0，从右往左排起点为width
  let mainSize, mainStart, mainEnd, mainSign, mainBase, 
      crossSize, crossStart, crossEnd, crossSign, crossBase;

  if (style.flexDirection === 'row') {
    mainSize = 'width';
    mainStart = 'left';
    mainEnd = 'right';
    mainSign = +1;
    mainBase = 0;

    crossSize = 'height';
    crossStart = 'top';
    crossEnd = 'bottom';
  }

  if (style.flexDirection === 'row-reverse') {
    mainSize = 'width';
    mainStart = 'right';
    mainEnd = 'left';
    mainSign = -1;
    mainBase = style.width;

    crossSize = 'height';
    crossStart = 'top';
    crossEnd = 'bottom';
  }

  if (style.flexDirection === 'column') {
    mainSize = 'heght';
    mainStart = 'top';
    mainEnd = 'bottom';
    mainSign = +1;
    mainBase = 0;

    crossSize = 'width';
    crossStart = 'left';
    crossEnd = 'right';
  }

  if (style.flexDirection === 'column-reverse') {
    mainSize = 'heght';
    mainStart = 'bottom';
    mainEnd = 'top';
    mainSign = -1;
    mainBase = style.height;

    crossSize = 'width';
    crossStart = 'left';
    crossEnd = 'right';
  }

  if (style.flexWrap === 'wrap-reverse') {
    // 侧轴方向反转
    let tmp = crossStart;
    crossStart = crossEnd;
    crossEnd = tmp;
    crossSign = -1;
  } else {
    crossBase = 0;
    crossSign = 1;
  }

  // 判断主轴是否有设置值，没有则由子元素撑开 ？？ 实际上父元素会流状态自适应宽度，如果主轴的mainSize是height才撑开
  // 使用了inline-flex例子的话才是自动撑开
  let isAutoMainSize = false;
  if (!elementStyle[mainSize]) {
    elementStyle[mainSize] = items.reduce((size, item) => {
      return size + item.style[mainSize]
    }, 0)
    isAutoMainSize = true;
  }

  let flexLine = [];
  let flexLines = [flexLine];

  // 主轴的剩余空间
  let mainSpace = elementStyle[mainSize];
  // 先用于储存line的侧轴size
  let crossSpace = 0;

  // 处理分行逻辑
  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    const itemStyle = getStyle(item);

    if (!itemStyle[mainSize]) {
      itemStyle[mainSize] = 0;
    }

    // 如果子元素是flex，那么肯定可以插入此行中
    if (itemStyle.flex) {
      flexLine.push(item);
    } else if (style.flexWrap === 'nowrap' && isAutoMainSize) {
      // 主轴不可分行
      mainSpace -= item[mainSize];
      // 对比获取最大的侧轴size
      if (item[crossSize] != undefined) {
        crossSpace = Math.max(crossSpace, item[crossSize])
      }
      flexLine.push(item);
    } else {
      // 如果子元素主轴size大于父元素，则等于父元素size
      if (itemStyle[mainSize] > style[mainSize]) {
        itemStyle[mainSize] = style[mainSize]
      }

      // 如果主轴剩余空间不能再放子元素
      if (mainSpace < itemStyle[mainSize]) {
        flexLine.mainSpace = mainSpace;
        flexLine.crossSpace = crossSpace
        flexLine = [item];
        flexLines.push(flexLine);
        // 新行重置
        mainSpace = style[mainSize];
        crossSpace = 0;
      } else {
        flexLine.push(item);
      }

      // 对比获取最大的侧轴size
      if (itemStyle[crossSize] != undefined) {
        crossSpace = Math.max(crossSpace, itemStyle[crossSize])
      }
      // 主轴剩余空间减去子元素主轴size
      mainSpace -= itemStyle[mainSize];
    }
  }
  // 最后一行
  flexLine.mainSpace = mainSpace;

  // 处理侧轴的剩余空间
  if (style.flexWrap === 'nowrap' || isAutoMainSize) {
    // 设置成父元素的高度
    flexLine.crossSpace = style[crossSize] !== undefined ? style[crossSize] : crossSpace;
  } else {
    flexLine.crossSpace = crossSpace;
  }

  if (mainSpace < 0) {
    // 处理单行溢出
    // 主轴总size * 缩放值 = 主轴原始size
    // ∴ (主轴size + 溢出空间) * 缩放值 = 主轴原始size
    // ∴ 缩放值 = 主轴原始size / (主轴size + 溢出空间)
    const scale = style[mainSize] / (style[mainSize] + Math.abs(mainSpace));
    const currentMain = mainBase;
    // 计算位置和尺寸
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      const itemStyle = getStyle(item);
      //! 有问题的感觉，为何可以收缩到0
      if (itemStyle.flex) {
        itemStyle[mainSize] = 0;
      }

      itemStyle[mainSize] = itemStyle[mainSize] * scale;

      // 计算start和end的位置,下一个start是前一个end，所以修改currentMain为上一个的end
      itemStyle[mainStart] = currentMain;
      itemStyle[mainEnd] = itemStyle[mainStart] + mainSign * itemStyle[mainSize];
      currentMain = itemStyle[mainEnd];
    }
  } else {
    // 非单行，循环每一行
    flexLines.forEach(line => {
      // 获取每一个line的剩余空间
      const currentLineMainSpace = line.mainSpace;
      // 获取flex: 1的总值，react native写法
      const flexTotal = line.reduce((total, item) => {
        const lineItemStyle = getStyle(item);
        if (lineItemStyle.flex != void 0) {
          total += lineItemStyle.flex
        }
      }, 0);

      if (flexTotal > 0) {
        let currentMain = mainBase;
        for (let i = 0; i < line.length; i++) {
          const item = line[i];
          const itemStyle = getStyle(item);
          if (itemStyle.flex) {
            // growing扩展剩余空间
            //! itemStyle[mainSize] = (currentLineMainSpace / flexTotal) * itemStyle.flex
            itemStyle[mainSize] += (currentLineMainSpace / flexTotal) * itemStyle.flex
          }
          itemStyle[mainStart] = currentMain;
          itemStyle[mainEnd] = itemStyle[mainStart] + mainSign * itemStyle[mainSize];
          currentMain = itemStyle[mainEnd];
        }
      } else {
        // 没有flexTotal,处理justifyContent
        let currentMain = null;
        let step = null;
        if (style.justifyContent === 'flex-start') {
          currentMain = mainBase;
          step = 0;
        }
        if (style.justifyContent === 'flex-end') {
          currentMain = currentLineMainSpace * mainSign + mainBase;
          step = 0;
        }
        if (style.justifyContent === 'center') {
          currentMain = currentLineMainSpace / 2 * mainSign + mainBase;
          step = 0;
        }
        if (style.justifyContent === 'space-between') {
          currentMain = mainBase;
          step = currentLineMainSpace / (line.length - 1) * mainSign
        }
        if (style.justifyContent === 'space-around') {
          step = currentLineMainSpace / line.length * mainSign
          currentMain = step / 2 + mainBase;
        }
        for (let i = 0; i < line.length; i++) {
          const item = line[i];
          const itemStyle = getStyle(item);
          itemStyle[mainStart] = currentMain;
          itemStyle[mainEnd] = itemStyle[mainStart] + mainSign * itemStyle[mainSize];
          currentMain = itemStyle[mainEnd] + step;
        }
      }
    })
  }

  crossSpace = null;
  // 没有设置侧轴的size，则撑开
  if (elementStyle[crossSize] == void 0) {
    crossSpace = 0;
    elementStyle[crossSize] = flexLines.reduce((total, item) => total + item.crossSpace, 0)
  } else {
    // 计算侧轴剩余空间
    crossSpace = flexLines.reduce((total, item) => total - item.crossSpace, style[crossSize]);
  }

  // 侧轴反转
  if (style.flexWrap === 'wrap-reverse') {
    crossBase = style[crossSize];
  } else {
    crossBase = 0;
  }

  let lineSize = style[crossSize] / flexLines.length;

  let step = 0;

  if (style.alignContent === 'flex-start') {
    crossBase += 0; // 其实不写也行
    step = 0;
  }

  if (style.alignContent === 'flex-end') {
    crossBase += mainSign * crossSpace;
    step = 0;
  }

  if (style.alignContent === 'center') {
    crossBase += mainSign * crossSpace / 2;
    step = 0
  }

  if (style.alignContent === 'space-between') {
    step = crossSpace / (flexLines.length - 1);
    crossBase += 0
  }

  if (style.alignContent === 'space-around') {
    step = crossSpace / flexLines.length;
    crossBase += mainSize * step / 2;
  }

  if (style.alignContent === 'stretch') {
    crossBase += 0;
    step = 0;
  }

  // 处理align items
  for (let i = 0; i < flexLines.length; i++) {
    const items = flexLines[i];

    // 当前line的侧轴size
    let lineCrossSize = style.alignContent === 'stretch' 
      // stretch时将剩余的空间分配给没个lineItem的crossSpace
      ? items.crossSpace + crossSpace / flexLines.length
      : items.crossSpace;

    for (let j = 0; j < items.length; j++) {
      const item = items[j];
      const itemStyle = getStyle(item);

      const align = itemStyle.alignSelf || style.alignItems;

      if (itemStyle[crossSize] == void 0) {
        itemStyle[crossSize] = align === 'stretch' ? lineCrossSize : 0;
      }

      if (align === 'flex-start') {
        itemStyle[crossStart] = crossBase;
        itemStyle[crossEnd] = itemStyle[crossStart] + crossSign * itemStyle[crossSize];
      }

      if (align === 'flex-end') {
        itemStyle[crossEnd] = crossBase + crossSign * lineCrossSize;
        itemStyle[crossStart] = itemStyle[crossEnd] - crossSign * itemStyle[crossSize];
      }

      if (align === 'center') {
        itemStyle[crossStart] = crossBase + crossSign * (lineCrossSize - itemStyle[crossSize]) / 2;
        itemStyle[crossEnd] = itemStyle[crossStart] + crossSign * itemStyle[crossSize]
      }

      if (align === 'stretch') {
        itemStyle[crossStart] = crossBase;
        itemStyle[crossEnd] = crossBase + crossSign * (( itemStyle[crossSize] != void 0 ? itemStyle[crossSize] : lineCrossSize ))
        itemStyle[crossSize] = crossSign * (itemStyle[crossEnd] - itemStyle[crossStart])
      }
    }
    crossBase += crossSign * (lineCrossSize + step);
  }
}

module.exports = layout