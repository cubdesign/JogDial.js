<wheel class={debug: debug }>
    <style type='scss'>

        wheel{
            display: block;
            position:absolute;
            left : 0;
            top : 0;
            &.debug{
                background : #0F0 ;
                opacity : .4;
                filter : 'progid:DXImageTransform.Microsoft.Alpha(Opacity=40)';

            // Fancy CSS3 for debug

            -webkit-border-radius  : 50%;
                border-radius : 50%;
            }
        }



    </style>
    <script>

      import DomEvent from './events/domevent'

      riot.observable(this.root);

      this.debug = Boolean(opts.debug);

      this.on("mount", function(){
        this.root.addEventListener(DomEvent.MOUSE_DOWN, this.mouse_down);
        this.root.addEventListener(DomEvent.MOUSE_MOVE, this.mouse_move);
        this.root.addEventListener(DomEvent.MOUSE_UP, this.mouse_up);
        this.root.addEventListener(DomEvent.MOUSE_OUT, this.mouse_out);
      })

      this.on("unmount", function(){
        this.root.removeListener(DomEvent.MOUSE_DOWN, this.mouse_down);
        this.root.removeListener(DomEvent.MOUSE_MOVE, this.mouse_move);
        this.root.removeListener(DomEvent.MOUSE_UP, this.mouse_up);
        this.root.removeListener(DomEvent.MOUSE_OUT, this.mouse_out);
      })

      this.mouse_down = (e) => {
        this.trigger(DomEvent.MOUSE_DOWN, e);
      }
      this.mouse_move = (e) => {
        this.trigger(DomEvent.MOUSE_MOVE, e);
      }
      this.mouse_up = (e) => {
        this.trigger(DomEvent.MOUSE_UP ,e);
      }
      this.mouse_out = (e) => {
        this.trigger(DomEvent.MOUSE_OUT ,e);
      }

      this.setSize = (size) => {
        this.root.style.width = size;
        this.root.style.height = size;
      }
    </script>
</wheel>
