import JogDial from './jogDial'

$(document).ready(function() {

  // Example 1
  var dialOne = JogDial(document.getElementById('jog_dial_one'),
    { wheelSize: '200px', knobSize: '70px', minDegree: 0, maxDegree: 360, degreeStartAt: 0 })
    .on('mousemove', function(evt) {
      $('#jog_dial_one_meter div').css('width', Math.round((evt.target.rotation / 360) * 100) + '%')
    });

  // Example 2
  var dialTwo = JogDial(document.getElementById('jog_dial_two'),
    { debug: true, wheelSize: '260px', knobSize: '100px', degreeStartAt: 0 })
    .on('mousemove', function(evt) {
      $('#jog_dial_two_meter').text('Rotation:' + Math.round(evt.target.rotation) + ' / Degree: ' + Math.round(evt.target.degree));
    });

  $('.dial:nth-child(2)').css('opacity', 0);

  //Example swap buttons
  $('.btn-group').children().on('click', function() {
    var btn = this;
    $(this).parent().children().each(function(i) {
      if (btn == this) {
        $(this).addClass('active');

        $('.dial').each(function(j) {
          if (i == j) {
            $(this).removeClass('hidden').css('opacity', 1);
          }
          else {
            $(this).addClass('hidden').css('opacity', 0);
          }
        })
      }
      else {
        $(this).removeClass('active');
      }
    })
  });
});