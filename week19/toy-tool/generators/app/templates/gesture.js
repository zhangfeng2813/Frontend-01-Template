/**
 *
 *
 * 鼠标事件 mousedown mouseover mouseup
 */

var os = (function () {
  var ua = navigator.userAgent,
    isWindowsPhone = /(?:Windows Phone)/.test(ua),
    isSymbian = /(?:SymbianOS)/.test(ua) || isWindowsPhone,
    isAndroid = /(?:Android)/.test(ua),
    isFireFox = /(?:Firefox)/.test(ua),
    isChrome = /(?:Chrome|CriOS)/.test(ua),
    isTablet = /(?:iPad|PlayBook)/.test(ua) || (isAndroid && !/(?:Mobile)/.test(ua)) || (isFireFox && /(?:Tablet)/.test(ua)),
    isPhone = /(?:iPhone)/.test(ua) && !isTablet,
    isPc = !isPhone && !isAndroid && !isSymbian;
  return {
    isTablet: isTablet,
    isPhone: isPhone,
    isAndroid: isAndroid,
    isPc: isPc,
  };
})();

export function enableGesture(element) {
  const contexts = Object.create(null);

  const MOUSE_SYMBOL = Symbol('mouse');
  element.addEventListener('mousedown', event => {
    if (!os.isPc) return;

    contexts[MOUSE_SYMBOL] = Object.create(null);
    start(event, contexts[MOUSE_SYMBOL]);
    const mousemove = event => {
      move(event, contexts[MOUSE_SYMBOL]);
    };

    const mouseend = event => {
      end(event, contexts[MOUSE_SYMBOL]);
      document.removeEventListener('mousemove', mousemove);
      document.removeEventListener('mouseup', mouseend);
    };

    document.addEventListener('mousemove', mousemove);
    document.addEventListener('mouseup', mouseend);
  });

  // touch是锁定元素的，在哪里start，move和up也是在那里
  element.addEventListener('touchstart', event => {
    // 考虑多指
    for (let touch of event.changedTouches) {
      contexts[touch.identifier] = Object.create(null);
      start(touch, contexts[touch.identifier]);
    }
  });

  element.addEventListener('touchmove', event => {
    // 考虑多指
    for (let touch of event.changedTouches) {
      move(touch, contexts[touch.identifier]);
    }
  });
  element.addEventListener('touchend', event => {
    // 考虑多指
    for (let touch of event.changedTouches) {
      end(touch, contexts[touch.identifier]);
      delete contexts[touch.identifier];
    }
  });
  // 要么触发cancel要么触发end，突然屏幕弹窗会cancel
  element.addEventListener('touchcancel', event => {
    // 考虑多指
    for (let touch of event.changedTouches) {
      cancel(touch);
      contexts[touch.identifier];
    }
  });

  // tap： start和end中的时间短

  // pan panstart panmove panend

  // flick

  // press： start超过0.5s到pressstart pressstart pressend

  /**
   * point是Touch或者MouseEvent这两个对象，都包括clientX、clientY
   * @param {Touch|MouseEvent} point
   * @param {Context} context 用于区分多点的上下文
   */
  let start = (point, context) => {
    let e = new CustomEvent('start');
    Object.assign(e, {
      startX: context.startX,
      startY: context.startX,
      clientX: point.clientX,
      clientY: point.clientY,
    });
    element.dispatchEvent(e);

    context.startX = point.clientX;
    context.startY = point.clientY;
    context.moves = [];

    context.isTap = true;
    context.isPan = false;
    context.isPress = false;

    // 触发press方法
    context.timeoutHandle = setTimeout(() => {
      if (context.isPan) {
        return;
      }
      context.isTap = false;
      context.isPan = false;
      context.isPress = true;
      element.dispatchEvent(new CustomEvent('pressstart', {}));
    }, 500);
  };

  let move = (point, context) => {
    let dx = point.clientX - context.startX;
    let dy = point.clientY - context.startY;

    if (dx ** 2 + dy ** 2 > 100 && !context.isPan) {
      if (context.isPress) {
        element.dispatchEvent(new CustomEvent('presscencal', {}));
      }
      context.isTap = false;
      context.isPan = true;
      context.isPress = false;
      let e = new CustomEvent('panstart');
      Object.assign(e, {
        startX: context.startX,
        startY: context.startX,
        clientX: point.clientX,
        clientY: point.clientY,
      });
      element.dispatchEvent(e);
    }

    if (context.isPan) {
      context.moves.push({ dx, dy, t: Date.now() });
      context.moves = context.moves.filter(record => Date.now() - record.t < 300);
      let e = new CustomEvent('pan');
      Object.assign(e, {
        startX: context.startX,
        startY: context.startY,
        clientX: point.clientX,
        clientY: point.clientY,
      });
      element.dispatchEvent(e);
    }
  };

  let end = (point, context) => {
    if (context.isPan) {
      let dx = point.clientX - context.startX;
      let dy = point.clientY - context.startY;
      const firstMove = context.moves[0];

      let speed = Math.sqrt((firstMove.dx - dx) ** 2 + (firstMove.dy - dy) ** 2) / (Date.now() - firstMove.t);
      let isFlick = speed > 2.5;

      if (isFlick) {
        let e = new CustomEvent('flick');
        Object.assign(e, {
          startX: context.startX,
          startY: context.startY,
          clientX: point.clientX,
          clientY: point.clientY,
          speed,
          isFlick,
        });
        element.dispatchEvent(e);
      }

      let e = new CustomEvent('panend');
      Object.assign(e, {
        startX: context.startX,
        startY: context.startY,
        clientX: point.clientX,
        clientY: point.clientY,
        speed,
        isFlick,
      });
      element.dispatchEvent(e);
    }

    if (context.isTap) {
      element.dispatchEvent(new CustomEvent('tap', {}));
    }

    if (context.isPress) {
      element.dispatchEvent(new CustomEvent('pressend', {}));
    }

    clearInterval(context.timeoutHandle);
  };

  let cancel = (point, context) => {
    element.dispatchEvent(new CustomEvent('cancel', {}));
    clearInterval(context.timeoutHandle);
  };
}
