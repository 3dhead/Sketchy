"use strict";$(document).ready(function(){function a(){switch(a.background){case"white":c.fillStyle="white",c.globalCompositeOperation="destination-over",c.fillRect(0,0,width(),height()),c.fillStyle=settings.color,c.globalCompositeOperation=settings.composite;break;case"current color":c.fillStyle=settings.bg,c.globalCompositeOperation="destination-over",c.fillRect(0,0,width(),height()),c.globalCompositeOperation=settings.composite}var b=$c[0].toDataURL();if("sketchy project"==a.type){var d,e=JSON.parse(localStorage.getItem("projects"));e&&e.some(function(b,c){return b.name==a["file name"]?(d=c,!0):!1})?(console.log(d),e[d]={name:a["file name"],data:b,points:window.points,settings:settings},localStorage.setItem("projects",JSON.stringify(e))):e?e.push({name:a["file name"],data:b,points:window.points}):e=[{name:a["file name"],data:b,points:window.points}],localStorage.setItem("projects",JSON.stringify(e))}else window.open(b,"_blank").focus();c.putImageData(window.points.history[window.points.history.last].data,0,0)}function b(){var a=JSON.parse(localStorage.getItem("projects")).filter(function(a){return a.name==b.file})[0],d=document.createElement("img");d.src=a.data,d.onload=function(){c.clearRect(0,0,width(),height()),c.drawImage(d,0,0),window.points=a.points,window.points.history=[{data:c.createImageData($c.width(),$c.height()),points:[]},{data:c.getImageData(0,0,width(),height()),points:a.points}],$c.first().css("background",a.settings.bg),window.settings.bg=a.settings.bg}}yepnope({test:window.mobile,yep:["js/mobile.js","js/libs/color-picker-touch.js"],nope:["js/libs/color-picker.js"]}),window.load=b,window.save=a});