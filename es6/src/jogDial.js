/*
 * JogDial.js - v 1.0
 *
 * Copyright (c) 2014 Sean Oh (ohsiwon@gmail.com)
 * Licensed under the MIT license
 */
// Constants
const Doc = window.document;

export default class JogDial {
  /*
   * Constructor
   * JogDial
   * @param  {HTMLElement}    element
   * @param  {Object}         options
   * return  {JogDial.Instance}
   */
  constructor(element, options) {
    //    return new JogDial.Instance(element, options || {});

    // Prevent duplication
    if (element.getAttribute('_jogDial_')) {
      window.alert('Please Check your code:\njogDial can not be initialized twice in a same element.');
      return false;
    }

    // Set global contant values and functions
    this.setConstants();

    // Set this instance
    this.setInstance(element, options);

    // Set stage
    this.setStage();

    // Set events
    this.setEvents();

    // Set angle
    this.angleTo(this, this.utils.convertClockToUnit(this.opt.degreeStartAt));
  }

  /*
   * Set constant values and functions
   */
  setConstants() {
    if (this.Ready) {
      return;
    }

    this.ToRad = Math.PI / 180;
    this.ToDeg = 180 / Math.PI;

    // Detect mouse event type
    this.ModernEvent = (Doc.addEventListener) ? true : false;
    this.MobileRegEx = '/Mobile|iP(hone|od|ad)|Android|BlackBerry|IEMobile|Kindle|NetFront|Silk-Accelerated|(hpw|web)OS|Fennec|Minimo|Opera M(obi|ini)|Blazer|Dolfin|Dolphin|Skyfire|Zune/';
    this.MobileEvent = ('ontouchstart' in window) && window.navigator.userAgent.match(this.MobileRegEx);
    this.PointerEvent = (window.navigator.pointerEnabled || window.navigator.msPointerEnabled) ? true : false;

    // Predefined options
    this.Defaults = {
      debug: false,
      touchMode: 'knob',  // knob | wheel
      knobSize: '30%',
      wheelSize: '100%',
      zIndex: 9999,
      degreeStartAt: 0,
      minDegree: null,  // (null) infinity
      maxDegree: null   // (null) infinity
    };

    // Predefined rotation info
    this.DegInfo = {
      rotation: 0,
      quadrant: 1
    };

    // Predefined DOM events
    this.DomEvent = {
      MOUSE_DOWN: 'mousedown',
      MOUSE_MOVE: 'mousemove',
      MOUSE_OUT: 'mouseout',
      MOUSE_UP: 'mouseup'
    };

    // Predefined custom events
    this.CustomEvent = {
      MOUSE_DOWN: 'mousedown',
      MOUSE_MOVE: 'mousemove',
      MOUSE_UP: 'mouseup'
    };

    // Utilities
    this.utils = {
      extend (target, src) {
        for (const key in src) {
          target[key] = src[key];
        }
        return target;
      },

      //Return css styling
      getComputedStyle (el, prop) {
        if (window.getComputedStyle) { // W3C Standard
          return window.getComputedStyle(el).getPropertyValue(prop);
        }
        else if (el.currentStyle) { // IE7 and 8
          return el.currentStyle[prop];
        }
      },

      //Calculating x and y coordinates
      getCoordinates (e) {
        e = e || window.event;
        const target = e.target || e.srcElement;
        const rect = target.getBoundingClientRect();
        const _x = ((this.MobileEvent) ? e.targetTouches[0].clientX : e.clientX) - rect.left;
        const _y = ((this.MobileEvent) ? e.targetTouches[0].clientY : e.clientY) - rect.top;
        return { x: _x, y: _y };
      },

      // Return the current quadrant.
      // Note: JogDial's Cartesian plane is flipped, hence it's returning reversed value.
      getQuadrant(x, y){
        if (x > 0 && y > 0) return 4;
        else if (x < 0 && y > 0) return 3;
        else if (x < 0 && y < 0) return 2;
        else if (x >= 0 && y < 0) return 1;
      },

      // Returne the sum of rotation value
      getRotation(self, quadrant, newDegree){
        let delta = 0;
        const info = self.info;
        if (quadrant == 1 && info.old.quadrant == 2) { //From 360 to 0
          delta = 360;
        }
        else if (quadrant == 2 && info.old.quadrant == 1) { //From 0 to 360
          delta = -360;
        }
        const rotation = newDegree + delta - info.old.rotation + info.now.rotation;
        info.old.rotation = newDegree; // return 0 ~ 360
        info.old.quadrant = quadrant; // return 1 ~ 4
        return rotation;
      },

      //Checking collision
      checkBoxCollision (bound, point) {
        return bound.x1 < point.x
          && bound.x2 > point.x
          && bound.y1 < point.y
          && bound.y2 > point.y;
      },

      // AddEvent, cross-browser support (IE7+)
      addEvent (el, type, handler, capture) {
        type = type.split(' ');
        for (let i = 0; i < type.length; i++) {
          if (el.addEventListener) {
            el.addEventListener(type[i], handler, capture);
          }
          else if (el.attachEvent) {
            el.attachEvent(`on${type[i]}`, handler);
          }
        }
      },

      // RemoveEvent, cross-browser support (IE7+)
      removeEvent (el, type, handler) {
        type = type.split(' ');
        for (let i = 0; i < type.length; i++) {
          if (el.addEventListener) {
            el.removeEventListener(type[i], handler);
          }
          else if (el.detachEvent) {
            el.detachEvent(`on${type[i]}`, handler);
          }
        }
      },

      // triggerEvent, cross-browser support (IE7+)
      triggerEvent(el, type){
        let evt;
        if (Doc.createEvent) { // W3C Standard
          evt = Doc.createEvent("HTMLEvents");
          evt.initEvent(type, true, true);
          el.dispatchEvent(evt);
        }
      },

      convertClockToUnit (n) {
        return n % 360 - 90;
      },

      convertUnitToClock (n) {
        return (n >= -180 && n < -90 ) ? 450 + n : 90 + n;
      }
    };

    this.Ready = true;
  }


  on(type, listener) {
    this.utils.addEvent(this.knob, type, listener, false);
    return this;
  }

  off(type, listener) {
    this.utils.removeEvent(this.knob, type, listener);
    return this;
  }

  trigger(type, data) {
    switch (type) {
      case 'angle':
        this.angleTo(this, data);
        break;
      default:
        window.alert(`Please Check your code:\njogDial does not have triggering event [${type}]`);
        break;
    }
    return this;
  }

  angle(data) {
    this.angleTo(this, this.utils.convertClockToUnit(data));
  }


  setInstance(el, opt) {
    this.base = el;
    this.base.setAttribute('_JogDial_', true);
    this.opt = this.utils.extend(this.utils.extend({}, this.Defaults), opt);
    this.info = {} || this;
    this.info.now = this.utils.extend({}, this.DegInfo);
    this.info.old = this.utils.extend({}, this.DegInfo);
    this.info.snapshot = this.utils.extend({}, this.info);
    this.info.snapshot.direction = null;
  }

  setStage() {
    /*
     * Create new elements
     * {HTMLElement}  JogDial.Instance.knob
     * {HTMLElement}  JogDial.Instance.wheel
     */
    const item = {};
    const BId = this.base.getAttribute("id");
    const BW = this.base.clientWidth;
    const BH = this.base.clientHeight;
    const opt = this.opt;
    const K = item.knob = document.createElement('div');
    const W = item.wheel = document.createElement('div');
    const KS = K.style;
    const WS = W.style;

    //Set position property as relative if it's not predefined in Stylesheet
    if (this.utils.getComputedStyle(this.base, 'position') === 'static') {
      this.base.style.position = 'relative';
    }

    //Append to base and extend {object} item
    this.base.appendChild(K);
    this.base.appendChild(W);
    this.utils.extend(this, item);

    //Set global position and size
    KS.position = WS.position = 'absolute';
    KS.width = KS.height = opt.knobSize;
    WS.width = WS.height = opt.wheelSize;

    //Set radius value
    const KRad = K.clientWidth / 2;
    const WRad = W.clientWidth / 2;

    //Set knob properties
    K.setAttribute('id', `${BId}_knob`);
    KS.margin = `${-KRad}px 0 0 ${-KRad}px`;
    KS.zIndex = opt.zIndex;

    //Set wheel properties
    W.setAttribute('id', `${BId}_wheel`);

    const WMargnLT = (BW - W.clientWidth) / 2;
    const WMargnTP = (BH - W.clientHeight) / 2;

    WS.left = WS.top = 0;
    WS.margin = `${WMargnTP}px 0 0 ${WMargnLT}px`;
    WS.zIndex = opt.zIndex;

    //set radius and center point value
    this.radius = WRad - KRad;
    this.center = { x: WRad + WMargnLT, y: WRad + WMargnTP };

    //Set debug mode
    if (opt.debug) {
      this.setDebug(this);
    }
  }

  setDebug(self) {
    const KS = self.knob.style;
    const WS = self.wheel.style;
    KS.backgroundColor = '#00F';
    WS.backgroundColor = '#0F0';
    KS.opacity = WS.opacity = .4;
    KS.filter = WS.filter = 'progid:DXImageTransform.Microsoft.Alpha(Opacity=40)';

    //Fancy CSS3 for debug
    KS.webkitBorderRadius = WS.webkitBorderRadius = "50%";
    KS.borderRadius = WS.borderRadius = "50%";
  }

  setEvents() {
    const self = this;
    /*
     * Set events to control elements
     * {HTMLElement}  JogDial.Instance.knob
     * {HTMLElement}  JogDial.Instance.wheel
     */

    //Detect event support type and override values
    if (this.PointerEvent) { // Windows 8 touchscreen
      this.utils.extend(JogDial.DomEvent, {
        MOUSE_DOWN: 'pointerdown MSPointerDown',
        MOUSE_MOVE: 'pointermove MSPointerMove',
        MOUSE_OUT: 'pointerout MSPointerOut',
        MOUSE_UP: 'pointerup pointercancel MSPointerUp MSPointerCancel'
      });
    } else if (this.MobileEvent) { // Mobile standard
      this.utils.extend(this.DomEvent, {
        MOUSE_DOWN: 'touchstart',
        MOUSE_MOVE: 'touchmove',
        MOUSE_OUT: 'touchleave',
        MOUSE_UP: 'touchend'
      });
    }

    const opt = self.opt;
    const info = self.info;
    const K = self.knob;
    const W = self.wheel;
    self.pressed = false;

    // Add events
    this.utils.addEvent(W, this.DomEvent.MOUSE_DOWN, mouseDownEvent, false);
    this.utils.addEvent(W, this.DomEvent.MOUSE_MOVE, mouseDragEvent, false);
    this.utils.addEvent(W, this.DomEvent.MOUSE_UP, mouseUpEvent, false);
    this.utils.addEvent(W, this.DomEvent.MOUSE_OUT, mouseUpEvent, false);

    // mouseDownEvent (MOUSE_DOWN)
    function mouseDownEvent(e) {
      switch (opt.touchMode) {
        case 'knob':
        default:
          self.pressed = self.utils.checkBoxCollision({
            x1: K.offsetLeft - W.offsetLeft,
            y1: K.offsetTop - W.offsetTop,
            x2: K.offsetLeft - W.offsetLeft + K.clientWidth,
            y2: K.offsetTop - W.offsetTop + K.clientHeight
          }, self.utils.getCoordinates(e));
          break;
        case 'wheel':
          self.pressed = true;
          mouseDragEvent(e);
          break;
      }

      //Trigger down event
      if (self.pressed) self.utils.triggerEvent(self.knob, self.CustomEvent.MOUSE_DOWN);
    }

    // mouseDragEvent (MOUSE_MOVE)
    function mouseDragEvent(e) {
      if (self.pressed) {
        // Prevent default event
        (e.preventDefault) ? e.preventDefault() : e.returnValue = false;

        // var info = self.info, opt = self.opt,
        const offset = self.utils.getCoordinates(e);
        const _x = offset.x - self.center.x + W.offsetLeft;
        const _y = offset.y - self.center.y + W.offsetTop;
        let radian = Math.atan2(_y, _x) * self.ToDeg;
        const quadrant = self.utils.getQuadrant(_x, _y);
        let degree = self.utils.convertUnitToClock(radian);
        let rotation;

        //Calculate the current rotation value based on pointer offset
        info.now.rotation = self.utils.getRotation(self, (quadrant == undefined) ? info.old.quadrant : quadrant, degree);
        rotation = info.now.rotation;//Math.ceil(info.now.rotation);

        if (opt.maxDegree != null && opt.maxDegree <= rotation) {
          if (info.snapshot.direction == null) {
            info.snapshot.direction = 'right';
            info.snapshot.now = self.utils.extend({}, info.now);
            info.snapshot.old = self.utils.extend({}, info.old);
          }
          rotation = opt.maxDegree;
          radian = self.utils.convertClockToUnit(rotation);
          degree = self.utils.convertUnitToClock(radian);
        }
        else if (opt.minDegree != null && opt.minDegree >= rotation) {
          if (info.snapshot.direction == null) {
            info.snapshot.direction = 'left';
            info.snapshot.now = self.utils.extend({}, info.now);
            info.snapshot.old = self.utils.extend({}, info.old);
          }
          rotation = opt.minDegree;
          radian = self.utils.convertClockToUnit(rotation);
          degree = self.utils.convertUnitToClock(radian);
        }
        else if (info.snapshot.direction != null) {
          info.snapshot.direction = null;
        }

        // Update JogDial data information
        self.utils.extend(self.knob, {
          rotation,
          degree
        });

        // update angle
        self.angleTo(self, radian);
      }
    }

    // mouseDragEvent (MOUSE_UP, MOUSE_OUT)
    function mouseUpEvent() {
      if (self.pressed) {
        self.pressed = false;
        if (self.info.snapshot.direction != null) {
          self.info.now = self.utils.extend({}, info.snapshot.now);
          self.info.old = self.utils.extend({}, info.snapshot.old);
          self.info.snapshot.direction = null;
        }

        // Trigger up event
        self.utils.triggerEvent(self.knob, self.CustomEvent.MOUSE_UP);
      }
    }
  }

  /*
   * Function
   * @param  {HTMLElement}    self
   * @param  {String}         radian
   */
  angleTo(self, radian) {
    radian *= this.ToRad;

    const _x = Math.cos(radian) * self.radius + self.center.x;
    const _y = Math.sin(radian) * self.radius + self.center.y;

    self.knob.style.left = `${_x}px`;
    self.knob.style.top = `${_y}px`;

    if (self.knob.rotation == undefined) {
      // Update JogDial data information
      this.utils.extend(self.knob, {
        rotation: self.opt.degreeStartAt,
        degree: this.utils.convertUnitToClock(radian)
      });
    }

    // Trigger move event
    this.utils.triggerEvent(self.knob, this.CustomEvent.MOUSE_MOVE);
  }

}