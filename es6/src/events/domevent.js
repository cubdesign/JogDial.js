const PointerEvent = (window.navigator.pointerEnabled || window.navigator.msPointerEnabled) ? true : false;

const MobileRegEx = '/Mobile|iP(hone|od|ad)|Android|BlackBerry|IEMobile|Kindle|NetFront|Silk-Accelerated|(hpw|web)OS|Fennec|Minimo|Opera M(obi|ini)|Blazer|Dolfin|Dolphin|Skyfire|Zune/';
const MobileEvent = ('ontouchstart' in window) && window.navigator.userAgent.match(MobileRegEx);

// Predefined DOM events
const DomEvent = {
  MOUSE_DOWN: 'mousedown',
  MOUSE_MOVE: 'mousemove',
  MOUSE_OUT: 'mouseout',
  MOUSE_UP: 'mouseup'
};


//Detect event support type and override values
if (PointerEvent) { // Windows 8 touchscreen
  Object.assign(DomEvent, {
    MOUSE_DOWN: 'pointerdown MSPointerDown',
    MOUSE_MOVE: 'pointermove MSPointerMove',
    MOUSE_OUT: 'pointerout MSPointerOut',
    MOUSE_UP: 'pointerup pointercancel MSPointerUp MSPointerCancel'
  });
} else if (MobileEvent) { // Mobile standard
  Object.assign(DomEvent, {
    MOUSE_DOWN: 'touchstart',
    MOUSE_MOVE: 'touchmove',
    MOUSE_OUT: 'touchleave',
    MOUSE_UP: 'touchend'
  });
}

export default DomEvent
