<knob class={debug: debug}>
    <style type="scss">
        knob {
            display: block;
            position: absolute;
            cursor: move;
        }

        knob.debug{
             background : #00F !important;
             opacity : .4;
             filter : 'progid:DXImageTransform.Microsoft.Alpha(Opacity=40)';

             /*  Fancy CSS3 for debug */

             -webkit-border-radius  : 50%;
             border-radius : 50%;
         }

    </style>
    <script>
      this.debug = Boolean(opts.debug);

      console.log(10);
      console.log(opts);

      this.on("mount", function() {

        console.log(20);
        console.log(opts);

        this.root.style.zIndex = opts.zindex;
      });
      this.setSize = (size) => {
        this.root.style.width = size;
        this.root.style.height = size;
      }
    </script>
</knob>
