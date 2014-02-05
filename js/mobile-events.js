"use strict";

function save() {
  switch(save.background) {
    case 'white': {
      var cache = {
        fillStyle: c.color,
        composite: c.globalCompositeOperation
      }
      c.fillStyle = 'white';
      c.globalCompositeOperation = 'destination-over';
      c.fillRect(0, 0, width(), height());
      c.fillStyle = cache.fillStyle;
      c.globalCompositeOperation = cache.composite;
      break;
    }
    case 'current color': {
      var cache = {
        fillStyle: c.color,
        composite: c.globalCompositeOperation
      }
      c.fillStyle = settings.strokeStyle;
      c.globalCompositeOperation = 'destination-over';
      c.fillRect(0, 0, width(), height());
      c.fillStyle = cache.fillStyle;
      c.globalCompositeOperation = cache.composite;
      break;
    }
  }
  var data = $c[0].toDataURL(); 
  var file = dataToBlob($c[0].toDataURL());
  var pics = navigator.getDeviceStorage('pictures');
  var r = pics.addNamed(file, save['file name'] + '.png');
  r.onsuccess = function() {
    alert('Your sketch was successfuly saved to pictures/' + this.result.name); 
  }
  r.onerror = function() {
    alert('Something bad happened when we tried to save your file\n Possible problems: \n Duplicate name \n Permission problems')
    console.warn(this.error);
  }
  c.putImageData(window.points.history[window.points.history.length-1].data, 0, 0);
}

  $('.menu').on('tap', function() {
    $('#menu').toggleClass('pulled');
  })
  $('.save').on('tap', function() {
    $('#save').removeClass('hidden');
  })
  $c.last().on('touchstart', function(e) {
    e.preventDefault();
    var xy = relative(e.changedTouches[0].pageX, e.changedTouches[0].pageY);
    startPoint(xy.x, xy.y);
    window.active = true;
  }).on('touchmove', function(e) {
    e.preventDefault();
    if (!window.active || settings.type == 'line') return;
    var xy = relative(e.changedTouches[0].pageX, e.changedTouches[0].pageY);
    drawPoint(xy.x, xy.y);
  }).on('touchend', function(e) {
    e.preventDefault();
    window.active = false;

    if(window.points.history.last < window.points.history.length-1) {
      window.points.history.splice(window.points.history.last+1);
    }

    window.points.history.push({
      data: c.getImageData(0, 0, width(), height()),
      points: window.points.slice(0)
    })
    window.points.history.last = window.points.history.length-1;
  })
  
  // Value Selector
  
  var $single = $('form[data-type="value-selector"].single');

  $single.find('li').on('tap', function(e) {
    e.preventDefault();
    $(this).parent().find('li[aria-selected]').removeAttr('aria-selected');
    $(this).attr('aria-selected', 'true');
    var key = $(this).parents('form').attr('id'),
        value  = $(this).find('label span').html().toLowerCase();
    window.settings[key] = value;

    $('button[id="set' + key + '"] span').html(value[0].toUpperCase() + value.substr(1));
    $('#menu div.options > div').addClass('hidden');
    $('#menu div.options > .general, #menu div.options > .'+value).removeClass('hidden');

    $(this).parents('form').addClass('hidden');
  })

  $single.submit(function(e) {
    e.preventDefault();
    $(this).addClass('hidden');
  })

  // Confirm

  var $confirm = $('form[data-type="value-selector"].confirm');

  $confirm.find('li').on('tap', function(e) {
    $(this).parent().find('li[aria-selected]').removeAttr('aria-selected');
    $(this).attr('aria-selected', 'true');
  })
  $confirm.find('button').last().on('tap', function(e) {
    e.preventDefault();
    var v = $(this).parents('form').attr('id');
    $(this).parents('form').find('h1').each(function(i) {
      if( i > 0 ) {
        var key = $(this).html().toLowerCase();
        var value = $(this).parent().find('ol:nth-of-type('+i+') li[aria-selected] span').html();
        if( key !== 'file name' ) value = key.toLowerCase();
        
        window[v][key] = value;
      }
    })
    $(this).parents('form').addClass('hidden');
    window[v]();
  })
  $confirm.find('button').first().on('tap', function(e) {
    e.preventDefault();
    $(this).parents('form').addClass('hidden');
  })

  // Value Selector Callers
  
  var $btn = $('button[id^="set"]');
  $btn.each(function() {
    var target = /set(.*)/.exec($(this).attr('id'))[1];
    if( target == 'color' ) {
      return $(this).on('tap', function() {
        $('.picker').removeClass('hidden');
      })
    }
    $(this).on('tap', function(e) {
      e.preventDefault();
      $('form[id="' + target + '"]').removeClass('hidden');
    })
  })

  // Seekbar

  var sliderLeft;
  $('div[role="slider"] button').on('touchstart', function() {
    $(this).attr('data-moving','true');
    if( !sliderLeft ) sliderLeft = $('div[role="slider"] button').offset().left;
  }).on('touchmove', function(e) {
      if( $(this).attr('data-moving') ) {
      var x = parseInt(e.changedTouches[0].pageX - sliderLeft - 15);
      var progress = $(this).parent().children().first();
      var max = +progress.attr('max');
      var min = +progress.attr('min');
      if( x <= max && x >= min ) {
        $(this).css('left', x+'%');
        $(this).parent().find('progress').attr('value', x);
        var key = $(this).parents('div[role="slider"]').attr('class');
        settings[key] = x;
        $('#'+ key +' span').html(x);
      }
    }
  }).on('touchend', function() {
    $(this).removeAttr('data-moving');
  })

  // Color Picker
  
  $('#closePicker').on('tap', function() {
    $('.picker').addClass('hidden');
  })

  // Bottom

  $('#clear').on('tap', function() {
    c.clearRect(0, 0, width(), height());
    window.points = [];
    if(window.points.history.last < window.points.history.length-1) {
      window.points.history.splice(window.points.history.last+1);
    }

    window.points.history.push({
      data: c.getImageData(0, 0, width(), height()),
      points: []
    })
    window.points.history.last = window.points.history.length-1;
  })

  $('#undo').on('tap', undo);
  $('#redo').on('tap', redo);

