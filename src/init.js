"use strict";

var CommandEnum = com.dgsprb.quick.CommandEnum;
var GameObject = com.dgsprb.quick.GameObject;
var Point = com.dgsprb.quick.Point;
var Quick = com.dgsprb.quick.Quick;
var Scene = com.dgsprb.quick.Scene;
var Text = com.dgsprb.quick.Text;

var CanvasCenter = function () {
  return new Point(Quick.getWidth() / 2, Quick.getHeight() / 2);
}

function random(min, max) {
  return Math.random() * (max - min) + min;
}

function main() {
  Quick.setName("Asteroids Remake");
  Quick.setAutoScale(true);
  Quick.setKeepAspect(true);
  Quick.init(function () { return new GameScene() });
}

