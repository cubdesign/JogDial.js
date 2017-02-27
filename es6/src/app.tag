<app>
    <h1>JogDial.js</h1>

    <div id="dials">
        <div class="dial">
            <jogdial
                id="jog_dial_one"
                ref="jog_dial_one"
                onmousemove = {mousemove}
            ></jogdial>
            <div id="jog_dial_one_meter">
                <div></div>
            </div>
        </div>
    </div>
    <style>
        app {

            display: block;

            text-align: center;
            padding: 15px 5px 25px;
            background: #eee;
        }
        .inline {
            display: inline-block;
        }

        #dials {
            height: 320px;
            overflow: hidden;
        }

        .dial {
            display: block;
            position: relative;
            height: 320px;
        }

        .dial.hidden {
            display: none;
        }

        #jog_dial_one {
            position: relative;
            width: 260px;
            height: 260px;
            margin: 20px auto;
            background: url('../assets/img/base_one_bg.png?1392325180');
            background-repeat: no-repeat;
        }

        #jog_dial_one_knob {
            background: url('../assets/img/base_one_knob.png?1392325228');
        }

        #jog_dial_one_meter {
            width: 200px;
            height: 10px;
            margin: 20px auto 30px;
            background: #999;
            overflow: hidden;
            -webkit-border-radius: 5px;
            -moz-border-radius: 5px;
            -ms-border-radius: 5px;
            -o-border-radius: 5px;
            border-radius: 5px;
        }
        #jog_dial_one_meter div {
            position: relative;
            width: 0;
            height: 100%;
            background: #80e93a;
        }


    </style>
    <script>
      import './jogdial.tag'
      import $ from 'jquery'

      this.on('mount', function() {
      });

      mousemove(evt){
        $('#jog_dial_one_meter div').css('width', `${Math.round((evt.target.rotation / 360) * 100)}%`);
      }

      riot.mount('jogdial', {
        wheelSize: '200px',
        knobSize: '70px',
        minDegree: 0,
        maxDegree: 360,
        degreeStartAt: 0
      });

    </script>
</app>