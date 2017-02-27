/*
* JogDial.js - v 1.0
*
* Copyright (c) 2014 Sean Oh (ohsiwon@gmail.com)
* Licensed under the MIT license
*/
<jogdial>
  <knob ref="knob"></knob>
  <wheel ref="wheel"></wheel>
  <style>
    jogdial{
      display: block;
    }

  </style>
  <script>
    import './knob.tag';
    import './wheel.tag';
    import DomEvent from './events/domevent'
    import CustomEvent from './events/customevent'

    const ToRad = Math.PI / 180;
    const ToDeg = 180 / Math.PI;

    const MobileRegEx = '/Mobile|iP(hone|od|ad)|Android|BlackBerry|IEMobile|Kindle|NetFront|Silk-Accelerated|(hpw|web)OS|Fennec|Minimo|Opera M(obi|ini)|Blazer|Dolfin|Dolphin|Skyfire|Zune/';
    const MobileEvent = ('ontouchstart' in window) && window.navigator.userAgent.match(MobileRegEx);

    this.on('mount', function() {
      this.init();
    });

    init(){
      const {knob, wheel} = this.refs;
      const root = this.root;

      //    return new JogDial.Instance(element, options || {});

      // Predefined options
      const Defaults = {
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
      const DegInfo = {
        rotation: 0,
        quadrant: 1
      };

      this.opt = Object.assign(Defaults, this.opts);
      this.info = {
        now : Object.assign({}, DegInfo),
        old : Object.assign({}, DegInfo),
        snapshot : {
          now : Object.assign({}, DegInfo),
          old : Object.assign({}, DegInfo),
          direction : null,
        }
      };


      const opt = this.opt;



      //Set position property as relative if it's not predefined in Stylesheet
      if (this.getComputedStyle(root, 'position') === 'static') {
        root.style.position = 'relative';
      }

      knob.setSize(opt.knobSize);
      wheel.setSize(opt.wheelSize);

      //Set radius value
      const KRad = knob.root.clientWidth / 2;
      const WRad = wheel.root.clientWidth / 2;

      //Set knob properties
      knob.root.setAttribute('id', `${this.opts.id}_knob`);
      knob.root.style.margin = `${-KRad}px 0 0 ${-KRad}px`;
      knob.root.style.zIndex = opt.zIndex;

      //Set wheel properties
      wheel.root.setAttribute('id', `${this.opts.id}_wheel`);

      const WMargnLT = (root.clientWidth - wheel.root.clientWidth) / 2;
      const WMargnTP = (root.clientHeight - wheel.root.clientHeight) / 2;

      wheel.root.style.left = 0;
      wheel.root.style.top = 0;
      wheel.root.style.margin = `${WMargnTP}px 0 0 ${WMargnLT}px`;
      wheel.root.style.zIndex = opt.zIndex;

      //set radius and center point value
      this.radius = WRad - KRad;
      this.center = { x: WRad + WMargnLT, y: WRad + WMargnTP };


      //Set debug mode
      if (opt.debug) {
        knob.root.style.backgroundColor = '#00F';
        wheel.root.style.backgroundColor = '#0F0';
        knob.root.style.opacity = .4;
        wheel.root.style.opacity = .4;
        knob.root.style.filter = 'progid:DXImageTransform.Microsoft.Alpha(Opacity=40)';
        wheel.root.style.filter = 'progid:DXImageTransform.Microsoft.Alpha(Opacity=40)';

        //Fancy CSS3 for debug
        knob.root.style.webkitBorderRadius = "50%";
        wheel.root.style.webkitBorderRadius = "50%";
        knob.root.style.borderRadius = "50%";
        wheel.root.style.borderRadius = "50%";
      }

      this.pressed = false;

      wheel.on(DomEvent.MOUSE_DOWN, this.mouseDownEvent.bind(this));
      wheel.on(DomEvent.MOUSE_MOVE, this.mouseDragEvent.bind(this));
      wheel.on(DomEvent.MOUSE_UP, this.mouseUpEvent.bind(this));
      wheel.on(DomEvent.MOUSE_OUT, this.mouseUpEvent.bind(this));

      // Set angle
      this.angleTo(this, this.convertClockToUnit(this.opt.degreeStartAt));

    }

    this.on('angle', function() {
      this.angleTo(this, data);
    });

    angle(data) {
      this.angleTo(this, this.convertClockToUnit(data));
    }
    mouseDownEvent(e){
      const {knob, wheel} = this.refs;
      console.log("mouseDownEvent");
      switch (this.opt.touchMode) {
        case 'knob':
        default:
          this.pressed = this.checkBoxCollision({
            x1: knob.root.offsetLeft - wheel.root.offsetLeft,
            y1: knob.root.offsetTop - wheel.root.offsetTop,
            x2: knob.root.offsetLeft - wheel.root.offsetLeft + knob.root.clientWidth,
            y2: knob.root.offsetTop - wheel.root.offsetTop + knob.root.clientHeight
          }, this.getCoordinates(e));
          break;
        case 'wheel':
          this.pressed = true;
          this.mouseDragEvent(e);
          break;
      }

      //Trigger down event
      if (this.pressed) {
        knob.trigger(CustomEvent.MOUSE_DOWN, e);
      }
    }



    // mouseDragEvent (MOUSE_MOVE)
    mouseDragEvent(e) {
      const {knob, wheel} = this.refs;
      const info = this.info;

      console.log("mouseDragEvent");
      if (this.pressed) {
        // Prevent default event
        (e.preventDefault) ? e.preventDefault() : e.returnValue = false;

        // var info = self.info, opt = self.opt,
        const offset = this.getCoordinates(e);
        const _x = offset.x - this.center.x + wheel.root.offsetLeft;
        const _y = offset.y - this.center.y + wheel.root.offsetTop;
        let radian = Math.atan2(_y, _x) * ToDeg;
        const quadrant = this.getQuadrant(_x, _y);
        let degree = this.convertUnitToClock(radian);
        let rotation;

        //Calculate the current rotation value based on pointer offset
        info.now.rotation = this.getRotation(self, (quadrant == undefined) ? info.old.quadrant : quadrant, degree);

        rotation = info.now.rotation;//Math.ceil(info.now.rotation);



        if (this.opt.maxDegree != null && this.opt.maxDegree <= rotation) {
          if (info.snapshot.direction == null) {
            info.snapshot.direction = 'right';
            info.snapshot.now = Object.assign({}, info.now);
            info.snapshot.old = Object.assign({}, info.old);
          }
          rotation = this.opt.maxDegree;
          radian = this.convertClockToUnit(rotation);
          degree = this.convertUnitToClock(radian);
        }
        else if (this.opt.minDegree != null && this.opt.minDegree >= rotation) {
          if (info.snapshot.direction == null) {
            info.snapshot.direction = 'left';
            info.snapshot.now = Object.assign({}, info.now);
            info.snapshot.old = Object.assign({}, info.old);
          }
          rotation = this.opt.minDegree;
          radian = this.convertClockToUnit(rotation);
          degree = this.convertUnitToClock(radian);
        }
        else if (info.snapshot.direction != null) {
          info.snapshot.direction = null;
        }

        // Update JogDial data information
        Object.assign(knob, {
          rotation,
          degree
        });

        // update angle
        this.angleTo(this, radian);
      }
    }

    // mouseDragEvent (MOUSE_UP, MOUSE_OUT)
    mouseUpEvent() {
      console.log("mouseUpEvent");
      const {knob, wheel} = this.refs;
      const info = this.info;
      if (this.pressed) {
        this.pressed = false;
        if (info.snapshot.direction != null) {
          info.now = Object.assign({}, info.snapshot.now);
          info.old = Object.assign({}, info.snapshot.old);
          info.snapshot.direction = null;
        }

        // Trigger up event
        knob.trigger(CustomEvent.MOUSE_UP);
      }
    }

    /*
     * Function
     * @param  {HTMLElement}    self
     * @param  {String}         radian
     */
    angleTo(self, radian) {
      const {knob, wheel} = this.refs;
      const root = this.root;

      radian *= ToRad;

      const _x = Math.cos(radian) * this.radius + this.center.x;
      const _y = Math.sin(radian) * this.radius + self.center.y;

      knob.root.style.left = `${_x}px`;
      knob.root.style.top = `${_y}px`;

      if (knob.rotation == undefined) {
        // Update JogDial data information
        Object.assign(knob, {
          rotation: this.opt.degreeStartAt,
          degree: this.convertUnitToClock(radian)
        });
      }

      knob.trigger(CustomEvent.MOUSE_MOVE);
    }

    //Return css styling
    getComputedStyle (el, prop) {
      return window.getComputedStyle(el).getPropertyValue(prop);
    }

    //Calculating x and y coordinates
    getCoordinates (e) {
      const target = e.target || e.srcElement;
      const rect = target.getBoundingClientRect();
      const _x = ((MobileEvent) ? e.targetTouches[0].clientX : e.clientX) - rect.left;
      const _y = ((MobileEvent) ? e.targetTouches[0].clientY : e.clientY) - rect.top;
      return { x: _x, y: _y };
    }

    // Return the current quadrant.
    // Note: JogDial's Cartesian plane is flipped, hence it's returning reversed value.
    getQuadrant(x, y){
      if (x > 0 && y > 0) return 4;
      else if (x < 0 && y > 0) return 3;
      else if (x < 0 && y < 0) return 2;
      else if (x >= 0 && y < 0) return 1;
    }

    // Returne the sum of rotation value
    getRotation(self, quadrant, newDegree){
      const info = this.info;
      let delta = 0;
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
    }

    //Checking collision
    checkBoxCollision (bound, point) {
      return bound.x1 < point.x
        && bound.x2 > point.x
        && bound.y1 < point.y
        && bound.y2 > point.y;
    }


    convertClockToUnit (n) {
      return n % 360 - 90;
    }

    convertUnitToClock (n) {
      return (n >= -180 && n < -90 ) ? 450 + n : 90 + n;
    }

  </script>
</jogdial>