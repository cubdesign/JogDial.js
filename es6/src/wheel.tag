<wheel>
    <style>
        wheel{
            display: block;
            position:absolute;
        }
    </style>
    <script>

      import DomEvent from './events/domevent'

      riot.observable(this.root);

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

      mouse_down(e){
        this.trigger(DomEvent.MOUSE_DOWN, e);
      }
      mouse_move(e){
        this.trigger(DomEvent.MOUSE_MOVE, e);
      }
      mouse_up(e){
        this.trigger(DomEvent.MOUSE_UP ,e);
      }
      mouse_out(e){
        this.trigger(DomEvent.MOUSE_OUT ,e);
      }

      setSize(size)
      {
        this.root.style.width = size;
        this.root.style.height = size;
      }
    </script>
</wheel>
