"use strict";

$(document).ready(function() {

  yepnope({
    test: window.mobile,
    yep : ['js/mobile.js', 'js/libs/color-picker-touch.js'],
    nope: ['js/libs/color-picker.js']
  })

  $(window).resize(sizeAndPos);

  function save() {
    var f = c.getImageData(0, 0, width(), height());
    switch(save.background) {
      case 'white': {
        c.fillStyle = 'white';
        c.globalCompositeOperation = 'destination-over';
        c.fillRect(0, 0, width(), height());
        c.fillStyle = settings.color;
        c.globalCompositeOperation = settings.composite;
        break;
      }
      case 'current color': {
        c.fillStyle = settings.bg;
        c.globalCompositeOperation = 'destination-over';
        c.fillRect(0, 0, width(), height());
        c.globalCompositeOperation = settings.composite;
        break;
      }
    }

    var data = $c[0].toDataURL();

    if( save.type == 'sketchy project' ) {
    var list = JSON.parse(localStorage.getItem('projects'));
    var index;
    if( list && list.some(function(a, i) { if( a.name == save['file name'] ) {index = i; return true} return false }) ) {
      if( confirm('A sketch with this name already exists. Do you want to overwrite ' + save['file name'] + '?') ) {
        console.log(index);
        list[index] = {
          name: save['file name'],
          data: data,
          points: window.points,
          settings: settings
        }
        localStorage.setItem('projects', JSON.stringify(list));
      }
    }
    else
      list ? list.push({
          name: save['file name'],
          data: data,
          points: window.points,
          settings: settings
        }) : list = [{
          name: save['file name'],
          data: data,
          points: window.points,
          settings: settings
        }];
      localStorage.setItem('projects', JSON.stringify(list)); 
    } else {
      $('<a href="' + data + '" download="' + save['file name'] + '.png"></a>').click();
      //window.open(data, '_blank').focus();
    }

    c.putImageData(f, 0, 0);
  }

  function load() {
    var file = JSON.parse(localStorage.getItem('projects')).filter(function(a) { return a.name == load.file })[0];
    var img = document.createElement('img');
    img.src = file.data;
    img.onload = function() {
      c.clearRect(0, 0, width(), height());
      c.drawImage(img, 0, 0);
      window.points = file.points;
      window.points.history = [{ data: c.createImageData($c.width(), $c.height()), points: []}, { data: c.getImageData(0, 0, width(), height()), points: file.points}];
      $c.first().css('background', file.settings.bg);
      window.settings.bg = file.settings.bg;  
    }
  }
  window.load = load;
  window.save = save;

  // Unity WebApp
  alert(typeof external.getUnityObject);
  if(external.getUnityObject) {
    window.Unity = external.getUnityObject(1.0);

    function unityReady() {
      console.log('Ready');
      Unity.Notification.showNotification('Salam', 'Chetori!');
    }
    Unity.init({
      name: 'Sketchy',
      iconUrl: 'file:///home/mahdi/Documents/Workshop/Sketchy/build/web/img/icons/icon60.png',
      onInit: unityReady
    })

  }
})
