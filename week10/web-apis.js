window.onload = function () {
  let allApis = {};
  let names = Object.getOwnPropertyNames(window);

  const ignore = ['__REACT_DEVTOOLS_COMPONENT_FILTERS__', '__REACT_DEVTOOLS_APPEND_COMPONENT_STACK__', 'numeric', 'G6'];

  names = filterOut(names, ignore);
  names = names.filter((x) => !x.match(/^on/));
  names = names.filter((x) => !x.match(/^webkit|^WebKit/));

  names = names.filter((x) => {
    try {
      return !(window[x].prototype instanceof Node);
    } catch (e) {
      return true;
    }
  });
  names = names.filter((x) => x !== 'Node');

  function filterOut(names, props) {
    let set = new Set();
    props.forEach((o) => set.add(o));
    return names.filter((e) => !set.has(e));
  }

  function setApis({ name, apis, spec }) {
    names = filterOut(names, apis);
    allApis[name] = {
      apis,
      spec,
    };
  }
  /**
   * ---------------------------------- WHATWG ---------------------------------------
   */
  {
    // https://dom.spec.whatwg.org
    setApis({
      name: 'DOM',
      apis: [
        'Event',
        'CustomEvent',
        'EventTarget',
        'AbortController',
        'AbortSignal',
        'NodeList',
        'HTMLCollection',
        'MutationObserver',
        'MutationRecord',
        'Node',
        'Document',
        'XMLDocument',
        'DOMImplementation',
        'DocumentType',
        'DocumentFragment',
        'ShadowRoot',
        'Element',
        'NamedNodeMap',
        'Attr',
        'CharacterData',
        'Text',
        'CDATASection',
        'ProcessingInstruction',
        'Comment',
        'StaticRange',
        'Range',
        'NodeIterator',
        'TreeWalker',
        'DOMTokenList',
        'addEventListener',
        'removeEventListener',
        'dispatchEvent',
        'NodeFilter',
        'event',
      ],
      spec: 'https://dom.spec.whatwg.org',
    });

    // https://html.spec.whatwg.org
    setApis({
      name: 'html',
      apis: [
        'window',
        'self',
        'document',
        'name',
        'location',
        'history',
        'customElements',
        'locationbar',
        'menubar',
        'personalbar',
        'scrollbars',
        'statusbar',
        'toolbar',
        'status',
        'close',
        'closed',
        'stop',
        'focus',
        'blur',
        'frames',
        'length',
        'top',
        'opener',
        'parent',
        'frameElement',
        'open',
        'navigator',
        'applicationCache',
        'alert',
        'confirm',
        'prompt',
        'print',
        'postMessage',
        'console',

        'origin',
        'btoa',
        'atob',
        'setTimeout',
        'clearTimeout',
        'setInterval',
        'clearInterval',
        'queueMicrotask',
        'createImageBitmap',
        'requestAnimationFrame',
        'cancelAnimationFrame',

        'ApplicationCache',
        'AudioTrack',
        'AudioTrackList',
        'BarProp',
        'BeforeUnloadEvent',
        'BroadcastChannel',
        'CanvasGradient',
        'CanvasPattern',
        'CanvasRenderingContext2D',
        'CloseEvent',
        'CustomElementRegistry',
        'DOMStringList',
        'DOMStringMap',
        'DataTransfer',
        'DataTransferItem',
        'DataTransferItemList',
        'DedicatedWorkerGlobalScope',
        'Document',
        'DragEvent',
        'ErrorEvent',
        'EventSource',
        'External',
        'FormDataEvent',
        'HTMLAllCollection',
        'HashChangeEvent',
        'History',
        'ImageBitmap',
        'ImageBitmapRenderingContext',
        'ImageData',
        'Location',
        'MediaError',
        'MessageChannel',
        'MessageEvent',
        'MessagePort',
        'MimeType',
        'MimeTypeArray',
        'Navigator',
        'OffscreenCanvas',
        'OffscreenCanvasRenderingContext2D',
        'PageTransitionEvent',
        'Path2D',
        'Plugin',
        'PluginArray',
        'PopStateEvent',
        'PromiseRejectionEvent',
        'RadioNodeList',
        'SharedWorker',
        'SharedWorkerGlobalScope',
        'Storage',
        'StorageEvent',
        'TextMetrics',
        'TextTrack',
        'TextTrackCue',
        'TextTrackCueList',
        'TextTrackList',
        'TimeRanges',
        'TrackEvent',
        'ValidityState',
        'VideoTrack',
        'VideoTrackList',
        'WebSocket',
        'Window',
        'Worker',
        'WorkerGlobalScope',
        'WorkerLocation',
        'WorkerNavigator',
        'HTMLOptionsCollection',
        'HTMLFormControlsCollection',
        'sessionStorage',
        'localStorage',
        'SubmitEvent',
      ],
      spec: 'https://html.spec.whatwg.org',
    });

    // https://compat.spec.whatwg.org/#dom-window-orientation
    setApis({ name: 'dom window orientation', apis: ['orientation'], spec: 'https://compat.spec.whatwg.org/#dom-window-orientation' });

    // https://streams.spec.whatwg.org/
    setApis({
      name: 'streams',
      apis: [
        'ReadableStream',
        'ReadableStreamDefaultReader',
        'ReadableStreamBYOBReader',
        'ReadableStreamDefaultController',
        'ReadableByteStreamController',
        'ReadableStreamBYOBRequest',
        'WritableStream',
        'WritableStreamDefaultWriter',
        'WritableStreamDefaultController',
        'TransformStream',
        'TransformStreamDefaultController',
        'ByteLengthQueuingStrategy',
        'CountQueuingStrategy',
      ],
      spec: 'https://streams.spec.whatwg.org/',
    });

    // https://encoding.spec.whatwg.org/
    setApis({
      name: 'encoding',
      apis: ['TextDecoder', 'TextEncoder', 'TextDecoderStream', 'TextEncoderStream'],
      spec: 'https://encoding.spec.whatwg.org/',
    });

    // https://url.spec.whatwg.org
    setApis({ name: 'url', apis: ['URL', 'URLSearchParams'], spec: 'https://url.spec.whatwg.org' });

    // https://xhr.spec.whatwg.org/
    setApis({
      name: 'xhr',
      apis: ['XMLHttpRequestEventTarget', 'XMLHttpRequestUpload', 'XMLHttpRequest', 'FormData', 'ProgressEvent'],
      spec: 'https://xhr.spec.whatwg.org/',
    });

    // https://fetch.spec.whatwg.org
    setApis({ name: 'fetch', apis: ['Headers', 'Request', 'Response', 'fetch'], spec: 'https://fetch.spec.whatwg.org' });

    // https://notifications.spec.whatwg.org/
    setApis({ name: 'notifications', apis: ['Notification'], spec: 'https://notifications.spec.whatwg.org/' });

    // https://storage.spec.whatwg.org
    setApis({ name: 'storage', apis: ['StorageManager'], spec: 'https://storage.spec.whatwg.org' });
  }

  /**
   * ---------------------------------- Khronos ---------------------------------------
   */
  {
    // https://www.khronos.org/registry/webgl/specs/latest/2.0/
    setApis({
      name: 'WebGL',
      apis: [
        'WebGLContextEvent',
        'WebGLObject',
        'WebGLBuffer',
        'WebGLFramebuffer',
        'WebGLProgram',
        'WebGLRenderbuffer',
        'WebGLShader',
        'WebGLTexture',
        'WebGLUniformLocation',
        'WebGLActiveInfo',
        'WebGLShaderPrecisionFormat',
        'WebGLRenderingContext',
        'WebGLQuery',
        'WebGLSampler',
        'WebGLSync',
        'WebGLTransformFeedback',
        'WebGLVertexArrayObject',
        'WebGL2RenderingContextBase',
        'WebGL2RenderingContext',
      ],
      spec: 'https://www.khronos.org/registry/webgl/specs/latest/2.0/',
    });
    // https://www.khronos.org/registry/webgl/specs/latest/2.0-compute/
    setApis({ name: 'WebGL2', apis: ['WebGL2ComputeRenderingContext'], spec: 'https://www.khronos.org/registry/webgl/specs/latest/2.0-compute/' });
  }

  /**
   * ---------------------------------- ECMA ---------------------------------------
   */
  {
    // https://www.ecma-international.org/publications/standards/Ecma-262.htm
    setApis({
      name: 'ECMA 262',
      apis: [
        'Infinity',
        'NaN',
        'undefined',
        'eval',
        'isFinite',
        'isNaN',
        'parseFloat',
        'parseInt',
        'decodeURI',
        'decodeURIComponent',
        'encodeURI',
        'encodeURIComponent',
        'escape',
        'unescape',
        'Array',
        'Date',
        'RegExp',
        'Promise',
        'Proxy',
        'Map',
        'WeakMap',
        'Set',
        'WeakSet',
        'Function',
        'Boolean',
        'String',
        'Number',
        'Symbol',
        'Object',
        'BigInt',
        'Error',
        'EvalError',
        'RangeError',
        'ReferenceError',
        'SyntaxError',
        'TypeError',
        'URIError',
        'ArrayBuffer',
        'SharedArrayBuffer',
        'DataView',
        'Float32Array',
        'Float64Array',
        'Int8Array',
        'Int16Array',
        'Int32Array',
        'Uint8Array',
        'Uint16Array',
        'Uint32Array',
        'Uint8ClampedArray',
        'BigInt64Array',
        'BigUint64Array',
        'Atomics',
        'JSON',
        'Math',
        'Reflect',
      ],
      spec: 'https://www.ecma-international.org/publications/standards/Ecma-262.htm',
    });

    // https://www.ecma-international.org/publications/standards/Ecma-402.htm
    setApis({ name: 'Ecma-402', apis: ['Intl'], spec: 'https://www.ecma-international.org/publications/standards/Ecma-402.htm' });

    // https://tc39.github.io/proposal-global/
    setApis({ name: 'proposal-global', apis: ['globalThis'], spec: 'https://tc39.github.io/proposal-global/' });
  }

  /**
   * ---------------------------------- svgwg ---------------------------------------
   */
  {
    // https://svgwg.org/svg2-draft/types.html
    setApis({
      name: 'svg',
      apis: [
        'SVGElement',
        'SVGBoundingBoxOptions',
        'SVGGraphicsElement',
        'SVGGeometryElement',
        'SVGNumber',
        'SVGLength',
        'SVGAngle',
        'SVGNumberList',
        'SVGLengthList',
        'SVGStringList',
        'SVGAnimatedBoolean',
        'SVGAnimatedEnumeration',
        'SVGAnimatedInteger',
        'SVGAnimatedNumber',
        'SVGAnimatedLength',
        'SVGAnimatedAngle',
        'SVGAnimatedString',
        'SVGAnimatedRect',
        'SVGAnimatedNumberList',
        'SVGAnimatedLengthList',
        'SVGUnitTypes',
      ],
      spec: 'https://svgwg.org/svg2-draft/types.html',
    });

    // https://svgwg.org/svg2-draft/coords.html
    setApis({
      name: 'svg2-draft/coords',
      apis: ['SVGTransform', 'SVGTransformList', 'SVGAnimatedTransformList', 'SVGPreserveAspectRatio', 'SVGAnimatedPreserveAspectRatio'],
      spec: 'https://svgwg.org/svg2-draft/coords.html',
    });

    // https://svgwg.org/svg2-draft/changes.html#types
    // All appearance of SVGMatrix were replaced by DOMMatrix or DOMMatrixReadOnly.
    // All appearance of SVGRect were replaced by DOMRect or DOMRectReadOnly.
    // All appearance of SVGPoint were replaced by DOMPoint or DOMPointReadOnly.
    setApis({ name: 'svg2-draft/changes', apis: ['SVGRect', 'SVGMatrix', 'SVGPoint'], spec: 'https://svgwg.org/svg2-draft/changes.html#types' });

    // https://svgwg.org/svg2-draft/shapes.html
    setApis({
      name: 'svg2-draft/shapes',
      apis: ['SVGRectElement', 'SVGCircleElement', 'SVGEllipseElement', 'SVGLineElement', 'SVGPointList', 'SVGPolylineElement', 'SVGPolygonElement'],
      spec: 'https://svgwg.org/svg2-draft/shapes.html',
    });
  }

  /**
   * ---------------------------------- W3C ---------------------------------------
   */
  {
    // GeoLocation: https://w3c.github.io/geolocation-api
    setApis({
      name: 'GeoLocation',
      apis: ['GeolocationPositionError', 'GeolocationPosition', 'GeolocationCoordinates', 'Geolocation'],
      spec: 'https://w3c.github.io/geolocation-api',
    });
    // https://w3c.github.io/ServiceWorker
    setApis({
      name: 'Service Worker',
      apis: [
        'ServiceWorker',
        'ServiceWorkerRegistration',
        'ServiceWorkerContainer',
        'NavigationPreloadManager',
        'Cache',
        'CacheStorage',
        'caches',
        'PeriodicSyncManager',
      ],
      spec: 'https://w3c.github.io/ServiceWorker',
    });

    // https://github.com/w3c/webappsec-trusted-types
    setApis({ name: 'trustedTypes', apis: ['trustedTypes'], spec: 'ttps://github.com/w3c/webappsec-trusted-types' });

    // https://w3c.github.io/deviceorientation/#devicemotioneventacceleration
    setApis({
      name: 'device orientation',
      apis: ['DeviceMotionEventAcceleration', 'DeviceMotionEventRotationRate'],
      spec: 'https://w3c.github.io/deviceorientation/#devicemotioneventacceleration',
    });
    // https://www.w3.org/TR/webaudio/
    setApis({
      name: 'webaudio',
      apis: [
        'BaseAudioContext',
        'AudioContext',
        'OfflineAudioContext',
        'OfflineAudioCompletionEvent',
        'AudioBuffer',
        'AudioNode',
        'AudioParam',
        'AudioScheduledSourceNode',
        'AnalyserNode',
        'AudioBufferSourceNode',
        'AudioDestinationNode',
        'AudioListener',
        'AudioProcessingEvent',
        'BiquadFilterNode',
        'ChannelMergerNode',
        'ChannelSplitterNode',
        'ConstantSourceNode',
        'ConvolverNode',
        'DelayNode',
        'DynamicsCompressorNode',
        'GainNode',
        'IIRFilterNode',
        'MediaElementAudioSourceNode',
        'MediaStreamAudioDestinationNode',
        'MediaStreamAudioSourceNode',
        'MediaStreamTrackAudioSourceNode',
        'OscillatorNode',
        'PannerNode',
        'PeriodicWave',
        'ScriptProcessorNode',
        'StereoPannerNode',
        'WaveShaperNode',
        'AudioWorklet',
        'AudioWorkletGlobalScope',
        'AudioWorkletNode',
        'AudioParamMap',
        'AudioWorkletProcessor',
      ],
      spec: 'https://www.w3.org/TR/webaudio/',
    });

    // https://www.w3.org/TR/WebCryptoAPI/
    setApis({ name: 'WebCryptoAPI', apis: ['CryptoKey', 'SubtleCrypto', 'Crypto', 'crypto'], spec: 'https://www.w3.org/TR/WebCryptoAPI/' });

    // https://www.w3.org/TR/webrtc/
    setApis({
      name: 'webrtc',
      apis: [
        'RTCDtlsTransport',
        'RTCError',
        'RTCErrorEvent',
        'RTCPeerConnectionIceErrorEvent',
        'RTCSctpTransport',
        'RTCPeerConnection',
        'RTCPeerConnection',
        'RTCSessionDescription',
        'RTCIceCandidate',
        'RTCPeerConnectionIceEvent',
        'RTCPeerConnection',
        'RTCCertificate',
        'RTCPeerConnection',
        'RTCRtpSender',
        'RTCRtpReceiver',
        'RTCRtpTransceiver',
        'RTCIceTransport',
        'RTCTrackEvent',
        'RTCPeerConnection',
        'RTCDataChannel',
        'RTCDataChannelEvent',
        'RTCRtpSender',
        'RTCDTMFSender',
        'RTCDTMFToneChangeEvent',
        'RTCPeerConnection',
        'RTCStatsReport',
      ],
      spec: 'https://www.w3.org/TR/webrtc/',
    });

    // https://www.w3.org/TR/IndexedDB/
    setApis({
      name: 'IndexedDB',
      apis: [
        'IDBRequest',
        'IDBOpenDBRequest',
        'IDBVersionChangeEvent',
        'IDBFactory',
        'IDBDatabase',
        'IDBObjectStore',
        'IDBIndex',
        'IDBKeyRange',
        'IDBCursor',
        'IDBCursorWithValue',
        'IDBTransaction',
        'indexedDB',
        // Not Found
        'IDBObservation',
        // http://wicg.github.io/indexed-db-observers/EXPLAINER.html
        'IDBObserver',
        // https://github.com/WICG/indexed-db-observers/blob/gh-pages/IDBObservers.webidl
        'IDBObserverChanges',
      ],
      spec: 'https://www.w3.org/TR/IndexedDB/',
    });

    // https://www.w3.org/TR/uievents
    setApis({
      name: 'uievents',
      apis: ['UIEvent', 'FocusEvent', 'MouseEvent', 'WheelEvent', 'InputEvent', 'KeyboardEvent', 'CompositionEvent', 'MutationEvent', ''],
      spec: 'https://www.w3.org/TR/uievents',
    });

    // https://www.w3.org/TR/css-transitions-1/
    setApis({ name: 'transitions', apis: ['TransitionEvent'], spec: 'https://www.w3.org/TR/css-transitions-1/' });

    // https://www.w3.org/TR/cssom-1/
    setApis({
      name: 'cssom',
      apis: [
        'MediaList',
        'StyleSheet',
        'CSSStyleSheet',
        'StyleSheetList',
        'CSSRuleList',
        'CSSRule',
        'CSSStyleRule',
        'CSSImportRule',
        'CSSGroupingRule',
        'CSSMediaRule',
        'CSSPageRule',
        'CSSNamespaceRule',
        'CSSStyleDeclaration',
        'CSS',
      ],
      spec: 'https://www.w3.org/TR/cssom-1/',
    });

    // https://www.w3.org/TR/css-typed-om-1/
    setApis({
      name: 'css-typed-om',
      apis: [
        'CSSStyleValue',
        'StylePropertyMapReadOnly',
        'StylePropertyMap',
        'CSSUnparsedValue',
        'CSSVariableReferenceValue',
        'CSSKeywordValue',
        'CSSNumericValue',
        'CSSUnitValue',
        'CSSMathValue',
        'CSSMathSum',
        'CSSMathProduct',
        'CSSMathNegate',
        'CSSMathInvert',
        'CSSMathMin',
        'CSSMathMax',
        'CSSNumericArray',
        'CSSTransformValue',
        'CSSTransformComponent',
        'CSSTranslate',
        'CSSRotate',
        'CSSScale',
        'CSSSkew',
        'CSSSkewX',
        'CSSSkewY',
        'CSSPerspective',
        'CSSMatrixComponent',
        'CSSPositionValue',
        'CSSImageValue',
      ],
      spec: 'https://www.w3.org/TR/css-typed-om-1/',
    });

    // https://www.w3.org/TR/css-fonts-4/
    setApis({ name: 'css-fonts', apis: ['CSSFontFaceRule'], spec: 'https://www.w3.org/TR/css-fonts-4/' });

    // https://www.w3.org/TR/cssom-view-1/
    // https://drafts.csswg.org/cssom-view/
    setApis({
      name: 'cssom-view',
      apis: [
        'MediaQueryList',
        'MediaQueryListEvent',
        'Screen',
        // extensions to the window interface: https://www.w3.org/TR/cssom-view-1/#extensions-to-the-window-interface
        'matchMedia',
        'screen',
        'moveTo',
        'moveBy',
        'resizeTo',
        'resizeBy', // browsing context
        'innerWidth',
        'innerHeight', // viewport
        'scrollX',
        'scrollY',
        'pageXOffset',
        'pageYOffset',
        'scroll',
        'scrollTo',
        'scrollBy', // viewport scrolling
        'screenX',
        'screenY',
        'outerWidth',
        'outerHeight',
        'devicePixelRatio',
        'screenLeft',
        'screenTop', // client
        'getComputedStyle',
      ],
      spec: 'https://www.w3.org/TR/cssom-view-1/',
    });
    // https://drafts.csswg.org/css-font-loading
    setApis({ name: 'css-font-loading', apis: ['FontFaceSetLoadEvent'], spec: 'https://drafts.csswg.org/css-font-loading' });
    // https://drafts.csswg.org/resize-observer-1
    setApis({ name: 'resize-observer', apis: ['ResizeObserver', 'ResizeObserverEntry'], spec: 'https://drafts.csswg.org/resize-observer-1' });

    // https://www.w3.org/TR/requestidlecallback
    setApis({
      name: 'requestidlecallback',
      apis: ['IdleDeadline', 'requestIdleCallback', 'cancelIdleCallback'],
      spec: 'https://www.w3.org/TR/requestidlecallback',
    });

    // https://www.w3.org/TR/geometry-1
    setApis({
      name: 'geometry',
      apis: [
        'DOMPointReadOnly',
        'SVGPoint',
        'DOMPoint',
        'DOMRectReadOnly',
        'SVGRect',
        'DOMRect',
        'DOMRectList',
        'DOMQuad',
        'DOMMatrixReadOnly',
        'SVGMatrix',
        'WebKitCSSMatrix',
        'DOMMatrix',
      ],
      spec: 'https://www.w3.org/TR/geometry-1',
    });

    // 粘贴版：https://w3c.github.io/clipboard-apis/#clipboard-interface
    setApis({ name: 'clipboard', apis: ['ClipboardItem', 'ClipboardEvent'], spec: 'https://w3c.github.io/clipboard-apis/#clipboard-interface' });

    // Feature Policy Api: https://w3c.github.io/webappsec-feature-policy/
    setApis({ name: 'Feature Policy Api', apis: ['FeaturePolicy'], spec: 'https://w3c.github.io/webappsec-feature-policy/' });

    // https://www.w3.org/TR/css3-conditional
    setApis({
      name: 'ss3-conditional',
      apis: ['CSSConditionRule', 'CSSMediaRule', 'CSSSupportsRule'],
      spec: 'ttps://www.w3.org/TR/css3-conditional',
    });

    // https://www.w3.org/TR/css-animations-1
    setApis({
      name: 'css-animations-1',
      apis: ['AnimationEvent', 'CSSKeyframeRule', 'CSSKeyframesRule'],
      spec: 'https://www.w3.org/TR/css-animations-1',
    });

    // https://www.w3.org/TR/web-animations-1
    setApis({
      name: 'web-animations-1',
      apis: ['AnimationTimeline', 'DocumentTimeline', 'Animation', 'AnimationEffect', 'KeyframeEffect', 'AnimationPlaybackEvent'],
      spec: 'https://www.w3.org/TR/web-animations-1',
    });

    // https://www.w3.org/TR/css-device-adapt-1
    setApis({ name: 'css-device-adapt-1', apis: ['CSSViewportRule'], spec: 'https://www.w3.org/TR/css-device-adapt-1' });

    // https://www.w3.org/TR/media-source/
    setApis({
      name: 'media-source',
      apis: ['MediaSource', 'SourceBuffer', 'SourceBufferList', 'TrackDefault', 'TrackDefaultList'],
      spec: 'https://www.w3.org/TR/media-source/',
    });

    // https://www.w3.org/TR/screen-orientation/
    setApis({ name: 'screen-orientation', apis: ['ScreenOrientation'], spec: 'https://www.w3.org/TR/screen-orientation/' });

    // https://www.w3.org/TR/encrypted-media/
    setApis({
      name: 'encrypted-media/',
      apis: ['MediaKeySystemAccess', 'MediaKeys', 'MediaKeySession', 'MediaKeyStatusMap', 'MediaKeyMessageEvent', 'MediaEncryptedEvent'],
      spec: 'https://www.w3.org/TR/encrypted-media/',
    });

    // https://www.w3.org/TR/gamepad/
    setApis({ name: 'gamepad', apis: ['Gamepad', 'GamepadButton', 'GamepadEvent'], spec: 'https://www.w3.org/TR/gamepad/' });

    // https://wiki.mozilla.org/GamepadAPI
    setApis({
      name: 'GamepadAPI',
      apis: ['GamepadButtonEvent', 'GamepadAxisEvent', 'GamepadButtonDown', 'GamepadButtonDown', 'GamepadAxisMove'],
      spec: 'https://wiki.mozilla.org/GamepadAPI',
    });

    // https://www.w3.org/TR/DOM-Level-3-XPath/xpath.html
    // https://wiki.whatwg.org/wiki/DOM_XPath
    setApis({
      name: 'DOM XPath',
      apis: ['XPathEvaluator', 'XPathExpression', 'XPathExpression', 'XPathResult'],
      spec: 'https://wiki.whatwg.org/wiki/DOM_XPath',
    });

    // https://www.w3.org/TR/2007/WD-DOM-Level-3-Events-20071221/events.html
    setApis({
      name: 'WD-DOM-Level-3-Events',
      apis: [
        'CAPTURING_PHASE',
        'AT_TARGET',
        'BUBBLING_PHASE',
        'UNSPECIFIED_EVENT_TYPE_ERR',
        'DISPATCH_REQUEST_ERR',
        'TextEvent',
        'DOM_KEY_LOCATION_STANDARD',
        'DOM_KEY_LOCATION_LEFT',
        'DOM_KEY_LOCATION_RIGHT',
        'DOM_KEY_LOCATION_NUMPAD',
        'MODIFICATION',
        'ADDITION',
        'REMOVAL',
      ],
      spec: 'https://www.w3.org/TR/2007/WD-DOM-Level-3-Events-20071221/events.html',
    });

    // https://www.w3.org/TR/css-font-loading
    setApis({ name: 'css-font-loading', apis: ['FontFace'], spec: 'https://www.w3.org/TR/css-font-loading' });

    // https://www.w3.org/TR/secure-contexts/
    setApis({ name: 'secure-contexts', apis: ['isSecureContext'], spec: 'https://www.w3.org/TR/secure-contexts/' });

    // https://www.w3.org/TR/webxr/
    setApis({
      name: 'webxr',
      apis: [
        'XR',
        'XRSession',
        'XRFrame',
        'XRSpace',
        'XRReferenceSpace',
        'XRStationaryReferenceSpace',
        'XRBoundedReferenceSpace',
        'XRUnboundedReferenceSpace',
        'XRView',
        'XRViewport',
        'XRRigidTransform',
        'XRRay',
        'XRViewerPose',
        'XRInputSource',
        'XRInputPose',
        'XRLayer',
        'XRWebGLLayer',
        'XRPresentationContext',
        'XRSessionEvent',
        'XRInputSourceEvent',
      ],
      spec: 'https://www.w3.org/TR/webxr/',
    });
    // https://immersive-web.github.io/webvr/spec/1.1/
    setApis({
      name: 'webvr',
      apis: ['VRDisplay', 'VRDisplayCapabilities', 'VRPose', 'VRFrameData', 'VREyeParameters', 'VRStageParameters', 'VRDisplayEvent'],
      spec: 'https://immersive-web.github.io/webvr/spec/1.1/',
    });

    // WebXR
    setApis({
      name: 'WebXR',
      apis: [
        'XRDOMOverlayState',
        'XRInputSourceArray',
        'XRInputSourcesChangeEvent',
        'XRPose',
        'XRReferenceSpaceEvent',
        'XRRenderState',
        'XRSystem',
        'XRHitTestResult',
        'XRHitTestSource',
        'XRTransientInputHitTestResult',
        'XRTransientInputHitTestSource',
      ],
      spec: 'https://immersive-web.github.io/webxr/',
    });

    // https://github.com/immersive-web/webxr-reference/blob/master/webxr-device-api/xrstagebounds.md
    setApis({
      name: 'webxr-device-api',
      apis: ['XRStageBounds'],
      spec: 'https://github.com/immersive-web/webxr-reference/blob/master/webxr-device-api/xrstagebounds.md',
    });

    // https://www.w3.org/TR/contacts-manager-api
    setApis({ name: 'contacts-manager-api', apis: ['ContactsManager'], spec: 'https://www.w3.org/TR/contacts-manager-api' });

    // https://www.w3.org/TR/worklets-1
    setApis({ name: 'worklets', apis: ['Worklet'], spec: 'https://www.w3.org/TR/worklets-1' });

    // https://www.w3.org/TR/payment-handler
    setApis({ name: 'payment-handler', apis: ['PaymentManager', 'PaymentInstruments'], spec: 'https://www.w3.org/TR/payment-handler' });

    // https://www.w3.org/TR/permissions/
    setApis({ name: 'permissions', apis: ['PermissionStatus', 'Permissions'], spec: 'https://www.w3.org/TR/permissions/' });

    // https://www.w3.org/TR/push-api/
    setApis({ name: 'push-api/', apis: ['PushManager', 'PushSubscriptionOptions', 'PushSubscription'], spec: 'https://www.w3.org/TR/push-api/' });

    // https://www.w3.org/TR/remote-playback/
    setApis({ name: 'emote-playback/', apis: ['RemotePlayback'], spec: 'https://www.w3.org/TR/remote-playback/' });

    // https://www.w3.org/TR/webdatabase/
    setApis({ name: 'webdatabase', apis: ['openDatabase'], spec: 'https://www.w3.org/TR/webdatabase/' });

    // https://www.w3.org/TR/wake-lock
    setApis({ name: 'wake-lock', apis: ['WakeLock', 'WakeLockRequest'], spec: 'https://www.w3.org/TR/wake-lock' });

    // https://webaudio.github.io/web-midi-api/
    // https://www.w3.org/TR/webmidi/
    setApis({
      name: 'webmidi',
      apis: [
        'MIDIOptions',
        'MIDIInputMap',
        'MIDIOutputMap',
        'MIDIAccess',
        'MIDIPort',
        'MIDIInput',
        'MIDIOutput',
        'MIDIMessageEvent',
        'MIDIMessageEventInit',
        'MIDIConnectionEvent',
        'MIDIConnectionEventInit',
      ],
      spec: ' https://www.w3.org/TR/webmidi/',
    });

    // https://w3c.github.io/mediacapture-image/
    setApis({
      name: 'mediacapture-image',
      apis: ['PhotoCapabilities', 'MediaSettingsRange', 'ImageCapture'],
      spec: 'https://w3c.github.io/mediacapture-image/',
    });

    // https://w3c.github.io/mediacapture-main/
    setApis({
      name: 'mediacapture-main',
      apis: [
        'MediaStream',
        'MediaStreamTrack',
        'MediaStream',
        'MediaStreamTrack',
        'MediaStreamTrack',
        'MediaStreamTrack',
        'MediaStreamTrack',
        'MediaStreamTrack',
        'MediaStreamTrack',
        'MediaStream',
        'MediaStreamTrack',
        'onended',
        'MediaStreamTrack',
        'MediaStreamTrackEvent',
        'MediaStreamTrack',
        'MediaStreamTrack',
        'OverconstrainedError',
        'OverconstrainedError',
        'Navigator',
        'MediaDevices',
        'MediaDevices',
        'MediaDeviceInfo',
        'MediaDeviceInfo',
        'InputDeviceInfo',
        'MediaDeviceInfo',
        'Navigator',
        'MediaDevices',
        'MediaStream',
        'MediaStream',
      ],
      spec: 'https://w3c.github.io/mediacapture-main/',
    });

    // https://w3c.github.io/mediacapture-record/
    setApis({ name: 'mediacapture-record', apis: ['MediaRecorder', 'BlobEvent'], spec: 'https://w3c.github.io/mediacapture-record/' });

    // https://w3c.github.io/gamepad/extensions.html
    setApis({ name: 'gamepad', apis: ['GamepadHapticActuator', 'GamepadPose'], spec: 'https://w3c.github.io/gamepad/extensions.html' });

    // https://w3c.github.io/deviceorientation/
    setApis({ name: 'device orientation', apis: ['DeviceOrientationEvent', 'DeviceMotionEvent'], spec: 'https://w3c.github.io/deviceorientation/' });

    // https://w3c.github.io/mediacapture-fromelement/
    setApis({ name: 'mediacapture-fromelement', apis: ['CanvasCaptureMediaStreamTrack'], spec: 'https://w3c.github.io/mediacapture-fromelement/' });

    // https://w3c.github.io/manifest/
    setApis({ name: 'manifest', apis: ['BeforeInstallPromptEvent'], spec: 'https://w3c.github.io/manifest/' });

    // https://w3c.github.io/DOM-Parsing/
    setApis({ name: 'DOM-Parsing', apis: ['DOMParser', 'XMLSerializer', 'Range'], spec: 'https://w3c.github.io/DOM-Parsing/' });

    // https://w3c.github.io/webvtt/
    setApis({ name: 'webvtt', apis: ['VTTCue', 'VTTRegion'], spec: 'https://w3c.github.io/webvtt/' });

    // https://w3c.github.io/touch-events
    setApis({ name: 'touch-events', apis: ['Touch', 'TouchList', 'TouchEvent'], spec: 'https://w3c.github.io/touch-events' });

    // https://w3c.github.io/longtasks
    setApis({ name: 'longtasks', apis: ['PerformanceLongTaskTiming', 'TaskAttributionTiming'], spec: 'https://w3c.github.io/longtasks' });

    // https://w3c.github.io/selection-api
    setApis({ name: 'selection api', apis: ['Selection', 'getSelection'], spec: 'https://w3c.github.io/selection-api' });

    // https://w3c.github.io/webappsec-csp/
    setApis({ name: 'webappsec', apis: ['SecurityPolicyViolationEvent'], spec: 'https://w3c.github.io/webappsec-csp/' });

    // https://w3c.github.io/reporting
    setApis({ name: 'reporting', apis: ['ReportingObserver'], spec: 'https://w3c.github.io/reporting' });

    // https://w3c.github.io/pointerevents
    setApis({ name: 'pointerevents', apis: ['PointerEvent'], spec: 'https://w3c.github.io/pointerevents' });

    // https://w3c.github.io/navigation-timing
    setApis({
      name: 'avigation-timing',
      apis: ['PerformanceNavigationTiming', 'PerformanceTiming', 'PerformanceNavigation', 'Performance'],
      spec: 'https://w3c.github.io/navigation-timing',
    });

    // https://w3c.github.io/server-timing
    setApis({ name: 'server-timing', apis: ['PerformanceServerTiming', 'PerformanceResourceTiming'], spec: 'https://w3c.github.io/server-timing' });

    // https://w3c.github.io/paint-timing
    setApis({ name: 'paint-timing', apis: ['PerformancePaintTiming'], spec: 'https://w3c.github.io/paint-timing' });

    // https://w3c.github.io/performance-timeline
    setApis({
      name: 'performance-timeline',
      apis: ['PerformanceEntry', 'PerformanceObserver', 'PerformanceObserverEntryList'],
      spec: 'https://w3c.github.io/performance-timeline',
    });

    // https://w3c.github.io/user-timing
    setApis({ name: 'user-timing', apis: ['PerformanceMark', 'PerformanceMeasure'], spec: 'https://w3c.github.io/user-timing' });

    // https://w3c.github.io/IntersectionObserver
    setApis({
      name: 'Intersection Observer',
      apis: ['IntersectionObserver', 'IntersectionObserverEntry'],
      spec: 'https://w3c.github.io/IntersectionObserver',
    });

    // https://w3c.github.io/FileAPI
    setApis({ name: 'File API', apis: ['Blob', 'File', 'FileList', 'FileReader', 'FileReaderSync'], spec: 'https://w3c.github.io/FileAPI' });

    // https://w3c.github.io/clipboard-apis
    setApis({ name: 'clipboard apis', apis: ['ClipboardEvent', 'Clipboard'], spec: 'https://w3c.github.io/clipboard-apis' });

    // https://w3c.github.io/hr-time
    setApis({ name: 'hr-time', apis: ['performance'], spec: 'https://w3c.github.io/hr-time' });

    // https://w3c.github.io/payment-request
    setApis({
      name: 'payment-request',
      apis: ['PaymentRequest', 'PaymentAddress', 'PaymentResponse', 'PaymentMethodChangeEvent', 'PaymentRequestUpdateEvent'],
      spec: 'https://w3c.github.io/payment-request',
    });

    // https://w3c.github.io/webrtc-quic/
    // https://developers.google.com/web/updates/2019/01/rtcquictransport-api
    setApis({
      name: 'webrtc-quic',
      apis: ['RTCQuicTransport', 'RTCQuicStream', 'RTCIceTransport', 'RTCQuicTransport', 'RTCQuicStreamEvent'],
      spec: 'https://w3c.github.io/webrtc-quic/',
    });

    // https://w3c.github.io/webappsec-credential-management/
    setApis({
      name: 'webappsec-credential-management',
      apis: ['Credential', 'CredentialsContainer', 'PasswordCredential', 'FederatedCredential'],
      spec: 'https://w3c.github.io/webappsec-credential-management/',
    });

    // https://w3c.github.io/presentation-api/
    setApis({
      name: 'presentation',
      apis: [
        'Presentation',
        'PresentationRequest',
        'PresentationAvailability',
        'PresentationConnectionAvailableEvent',
        'PresentationConnection',
        'PresentationConnectionCloseEvent',
        'PresentationReceiver',
        'PresentationConnectionList',
      ],
      spec: 'https://w3c.github.io/presentation-api/',
    });

    // https://w3c.github.io/sensors/
    setApis({ name: 'sensors', apis: ['SensorErrorEvent', 'Sensor'], spec: 'https://w3c.github.io/sensors/' });
    // https://w3c.github.io/orientation-sensor
    setApis({
      name: 'orientation-sensor',
      apis: ['OrientationSensor', 'AbsoluteOrientationSensor', 'RelativeOrientationSensor'],
      spec: 'https://w3c.github.io/orientation-sensor',
    });
    // https://w3c.github.io/accelerometer
    setApis({ name: 'accelerometer', apis: ['Accelerometer', 'LinearAccelerationSensor'], spec: 'https://w3c.github.io/accelerometer' });
    // https://w3c.github.io/gyroscope
    setApis({ name: 'gyroscope', apis: ['Gyroscope'], spec: 'https://w3c.github.io/gyroscope' });
    // https://w3c.github.io/ambient-light
    setApis({ name: 'ambient-light', apis: ['AmbientLightSensor'], spec: 'https://w3c.github.io/ambient-light' });
    // https://w3c.github.io/magnetometer
    setApis({ name: 'magnetometer', apis: ['Magnetometer'], spec: 'https://w3c.github.io/magnetometer' });

    // https://w3c.github.io/webauthn
    setApis({
      name: 'webauthn',
      apis: ['PublicKeyCredential', 'AuthenticatorResponse', 'AuthenticatorAttestationResponse', 'AuthenticatorAssertionResponse'],
      spec: 'https://w3c.github.io/webauthn',
    });

    // http://w3c.github.io/nfc/
    setApis({ name: 'nfc', apis: ['NFC'], spec: 'http://w3c.github.io/nfc/' });

    // https://w3c.github.io/speech-api/
    setApis({
      name: 'speech-api',
      apis: ['speechSynthesis', 'SpeechSynthesisUtterance', 'SpeechSynthesisEvent', 'SpeechSynthesisErrorEvent'],
      spec: 'https://w3c.github.io/speech-api/',
    });

    // https://webbluetoothcg.github.io/web-bluetooth/
    setApis({
      name: 'web-bluetooth',
      apis: [
        'Bluetooth',
        'BluetoothUUID',
        'BluetoothDevice',
        'BluetoothRemoteGATTServer',
        'BluetoothRemoteGATTService',
        'BluetoothRemoteGATTCharacteristic',
        'BluetoothCharacteristicProperties',
        'BluetoothRemoteGATTDescriptor',
      ],
      spec: 'https://webbluetoothcg.github.io/web-bluetooth/',
    });

    // https://heycam.github.io/webidl
    setApis({ name: 'webidl', apis: ['DOMException'], spec: 'https://heycam.github.io/webidl' });

    // https://webassembly.github.io/spec/js-api
    setApis({ name: 'webassembly', apis: ['WebAssembly'], spec: 'https://webassembly.github.io/spec/js-api' });
  }

  /**
   * ---------------------------------- WICG ---------------------------------------
   */
  {
    // 压缩：https://github.com/WICG/compression
    setApis({ name: 'compression', apis: ['DecompressionStream', 'CompressionStream'], spec: 'https://github.com/WICG/compression' });
    // 性能相关
    setApis({
      name: 'layout-instability',
      apis: [
        // https://wicg.github.io/layout-instability/#layoutshift
        'LayoutShift',
        // https://wicg.github.io/largest-contentful-paint/#sec-largest-contentful-paint-interface
        'LargestContentfulPaint',
      ],
      spec: 'https://wicg.github.io/layout-instability/#layoutshift',
    });

    // http://wicg.github.io/BackgroundSync/spec/
    setApis({ name: 'BackgroundSync', apis: ['SyncManager'], spec: 'http://wicg.github.io/BackgroundSync/spec/' });

    // http://wicg.github.io/netinfo/
    setApis({ name: 'netinfo', apis: ['NetworkInformation'], spec: 'http://wicg.github.io/netinfo/' });

    // https://wicg.github.io/media-capabilities/
    setApis({ name: 'media-capabilities', apis: ['MediaCapabilities'], spec: 'https://wicg.github.io/media-capabilities/' });

    // https://wicg.github.io/visual-viewport/
    setApis({
      name: 'visual-viewport',
      apis: [
        'VisualViewport',
        // Extensions to the Window interface: https://wicg.github.io/visual-viewport/#extensions-to-the-window-interface
        'visualViewport',
      ],
      spec: 'https://wicg.github.io/visual-viewport/',
    });

    // https://wicg.github.io/InputDeviceCapabilities
    setApis({ name: 'InputDeviceCapabilities', apis: ['InputDeviceCapabilities'], spec: 'https://wicg.github.io/InputDeviceCapabilities' });

    // https://wicg.github.io/element-timing
    setApis({ name: 'element-timing', apis: ['PerformanceElementTiming'], spec: 'https://wicg.github.io/element-timing' });

    // https://wicg.github.io/scroll-animations/
    setApis({ name: 'scroll-animations', apis: ['ScrollTimeline'], spec: 'https://wicg.github.io/scroll-animations/' });

    // https://wicg.github.io/event-timing
    setApis({ name: 'event-timing', apis: ['PerformanceEventTiming'], spec: 'https://wicg.github.io/event-timing' });

    // https://wicg.github.io/background-fetch
    setApis({
      name: 'background-fetch',
      apis: ['BackgroundFetchManager', 'BackgroundFetchRegistration', 'BackgroundFetchRecord'],
      spec: 'https://wicg.github.io/background-fetch',
    });

    // https://wicg.github.io/animation-worklet/
    setApis({ name: 'animation-worklet', apis: ['WorkletAnimation'], spec: 'https://wicg.github.io/animation-worklet/' });

    // https://wicg.github.io/cookie-store/
    setApis({
      name: 'cookie-store',
      apis: ['CookieStore', 'CookieChangeEvent', 'ExtendableCookieChangeEvent', 'cookieStore'],
      spec: 'https://wicg.github.io/cookie-store/',
    });

    // https://wicg.github.io/aom
    setApis({
      name: 'The Accessibility Object Model',
      apis: ['AccessibleNode', 'AccessibleNodeList', 'ComputedAccessibleNode', 'ElementInternals', 'getComputedAccessibleNode'],
      spec: 'https://wicg.github.io/aom',
    });

    // https://wicg.github.io/mediasession
    setApis({ name: 'mediasession', apis: ['MediaSession', 'MediaMetadata'], spec: 'https://wicg.github.io/mediasession' });

    // https://wicg.github.io/media-playback-quality
    setApis({ name: 'media-playback-quality', apis: ['VideoPlaybackQuality'], spec: 'https://wicg.github.io/media-playback-quality' });

    // https://wicg.github.io/picture-in-picture/
    setApis({
      name: 'picture-in-picture',
      apis: ['PictureInPictureWindow', 'EnterPictureInPictureEvent'],
      spec: 'https://wicg.github.io/picture-in-picture/',
    });

    // https://wicg.github.io/shape-detection-api
    setApis({
      name: 'shape-detection-api',
      apis: ['FaceDetector', 'DetectedFace', 'BarcodeDetector', 'DetectedBarcode'],
      spec: 'https://wicg.github.io/shape-detection-api',
    });
    // https://wicg.github.io/shape-detection-api/text.html
    setApis({ name: 'shape-detection-api', apis: ['TextDetector', 'DetectedText'], spec: 'https://wicg.github.io/shape-detection-api/text.html' });

    // https://wicg.github.io/native-file-system/
    setApis({
      name: 'native-file-system',
      apis: ['FileSystemFileHandle', 'FileSystemDirectoryHandle', 'chooseFileSystemEntries'],
      spec: 'https://wicg.github.io/native-file-system/',
    });

    // https://wicg.github.io/keyboard-map
    setApis({ name: 'keyboard-map', apis: ['KeyboardLayoutMap', 'Keyboard'], spec: 'https://wicg.github.io/keyboard-map' });

    // https://wicg.github.io/web-locks/
    setApis({ name: 'web-locks', apis: ['Lock', 'LockManager'], spec: 'https://wicg.github.io/web-locks/' });

    // https://wicg.github.io/webusb/
    setApis({
      name: 'webusb',
      apis: [
        'USB',
        'USBConnectionEvent',
        'USBDevice',
        'USBInTransferResult',
        'USBOutTransferResult',
        'USBIsochronousInTransferPacket',
        'USBIsochronousInTransferResult',
        'USBIsochronousOutTransferPacket',
        'USBIsochronousOutTransferResult',
        'USBConfiguration',
        'USBInterface',
        'USBAlternateInterface',
        'USBEndpoint',
      ],
      spec: 'https://wicg.github.io/webusb/',
    });

    // https://github.com/WICG/trusted-types
    setApis({
      name: 'trusted-types',
      apis: [
        'TrustedHTML',
        'TrustedScript',
        'TrustedScriptURL',
        'TrustedTypePolicy',
        'TrustedTypePolicyFactorys',
        'TrustedTypePolicyFactory',
        'TrustedURL',
        'TrustedTypes',
      ],
      spec: 'https://github.com/WICG/trusted-types',
    });
  }

  // https://github.com/immersive-web/hit-test/
  setApis({ name: 'hit-testing', apis: ['XRHitResult'], spec: 'https://github.com/immersive-web/hit-test/' });

  // https://github.com/dtapuska/useractivation
  setApis({ name: 'User Activation', apis: ['UserActivation'], spec: 'https://github.com/dtapuska/useractivation' });

  // https://developers.google.com/web/updates/2018/12/badging-api
  setApis({ name: 'badging-api', apis: ['ExperimentalBadge'], spec: 'https://developers.google.com/web/updates/2018/12/badging-api' });

  // deprecated in MDN
  setApis({ name: 'deprecated', apis: ['MediaStreamEvent', 'DOMError', 'external', 'captureEvents', 'releaseEvents'], spec: '' });

  // obsolete in MDN
  setApis({ name: 'obsolete', apis: ['BatteryManager', 'defaultStatus', 'defaultstatus'], spec: '' });

  // Non-standard in MDN
  setApis({ name: 'Non-standard', apis: ['find', 'XSLTProcessor'], spec: '' });

  // No spec found
  setApis({
    name: 'No spec found',
    apis: [
      'ScriptedTaskQueue',
      'ScriptedTaskQueueController',
      'TaskQueue',
      'TaskWorkletGlobalScope',
      'TaskWorklet',
      'taskWorklet',
      'Task',
      'WorkerTaskQueue',
      'FragmentDirective',
      'clientInformation',
      'offscreenBuffering',
      'styleMedia',
      'chrome',
      'PerformanceLayoutJank',
      'ActivateInvisibleEvent',
      'PictureInPictureControlEvent',
      'ApplicationCacheErrorEvent',
      'IdleManager',
      'IdleStatus',
      'Serial',
      'SerialPort',
    ],
  });

  console.log('剩余', names);
  console.log('剩余总数' + names.length);
  console.log('all apis', allApis);
  renderVisual(allApis);
};
