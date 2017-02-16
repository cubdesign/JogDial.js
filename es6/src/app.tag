<app>
    <div class="jumbotron">
        <h1>JogDial.js</h1>

        <div id="dials">
            <div class="dial">
                <div id="jog_dial_one"></div>
                <div id="jog_dial_one_meter">
                    <div></div>
                </div>
            </div>
            <div class="dial">
                <div id="jog_dial_two"></div>
                <p id="jog_dial_two_meter">Debug mode. Infinite loop</p>
            </div>
        </div>
        <h3 class="inline">Examples</h3>
        <div class="btn-group btn-group-sm">
            <button type="button" class="btn btn-default active">1</button>
            <button type="button" class="btn btn-default">2</button>
        </div>

    </div>

    <script>

      import JogDial from './jogDial'
      import $ from 'jquery'
        $(() => {
          // Example 1
          const jogDial_1 = new JogDial(
            document.getElementById('jog_dial_one'),
            {
              wheelSize: '200px',
              knobSize: '70px',
              minDegree: 0,
              maxDegree: 360,
              degreeStartAt: 0
            }
          );
          jogDial_1.on('mousemove', (evt) => {
            $('#jog_dial_one_meter div').css('width', `${Math.round((evt.target.rotation / 360) * 100)}%`);
          });

          // Example 2
          const jogDial_2 = new JogDial(
            document.getElementById('jog_dial_two'),
            {
              debug: true,
              wheelSize: '260px',
              knobSize: '100px',
              degreeStartAt: 0
            }
          );

          jogDial_2.on('mousemove', (evt) => {
            $('#jog_dial_two_meter').text(`Rotation:${Math.round(evt.target.rotation)} / Degree: ${Math.round(evt.target.degree)}`);
          });

          $('.dial:nth-child(2)').css('opacity', 0);


          //Example swap buttons
          $('.btn-group').children().on('click', function() {
            const btn = this;
            $(this).parent().children().each(function(i) {
              if (btn == this) {
                $(this).addClass('active');

                $('.dial').each(function(j) {
                  if (i == j) {
                    $(this).removeClass('hidden').css('opacity', 1);
                  } else {
                    $(this).addClass('hidden').css('opacity', 0);
                  }
                })
              } else {
                $(this).removeClass('active');
              }
            })
          });
        });


    </script>

    <style>

    </style>
</app>