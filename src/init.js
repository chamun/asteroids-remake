"use strict";

var CommandEnum = com.dgsprb.quick.CommandEnum;
var GameObject = com.dgsprb.quick.GameObject;
var Point = com.dgsprb.quick.Point;
var Quick = com.dgsprb.quick.Quick;
var Rect = com.dgsprb.quick.Rect;
var Scene = com.dgsprb.quick.Scene;
var Text = com.dgsprb.quick.Text;

var CanvasCenter = function () {
  return new Point(Quick.getWidth() / 2, Quick.getHeight() / 2);
}

function random(min, max) {
  return Math.random() * (max - min) + min;
}

function isMobile() {
  return /Mobi/.test(navigator.userAgent);
}

function toggleFullScreen() {
  var elem = document.getElementById("canvas");
  if (elem.requestFullscreen) {
    elem.requestFullscreen();
  } else if (elem.msRequestFullscreen) {
    elem.msRequestFullscreen();
  } else if (elem.mozRequestFullScreen) {
    elem.mozRequestFullScreen();
  } else if (elem.webkitRequestFullscreen) {
    elem.webkitRequestFullscreen();
  }
}

function main() {
  Quick.setName("Asteroids Remake");
  Quick.setAutoScale(true);
  Quick.setKeepAspect(true);
  Quick.init(function () { return new GameScene() });
  if (isMobile()) {
    document.getElementById("fullscreen")
      .addEventListener("touchend", toggleFullScreen, false);
  } else {
    document.getElementById("fullscreen").style.display = 'none';
  }
}

