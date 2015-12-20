"use strict";

var CommandEnum = com.dgsprb.quick.CommandEnum;
var GameObject = com.dgsprb.quick.GameObject;
var Point = com.dgsprb.quick.Point;
var Quick = com.dgsprb.quick.Quick;
var Scene = com.dgsprb.quick.Scene;

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
  Quick.init(function () {
    var scene = new Scene();

    scene.isNotAsteroid = function (gameObject) {
      return !gameObject.hasTag("asteroid");
    }

    scene.add(new Background());
    scene.add(new Player());

    for (var i = 0; i < 2; ++i) scene.add(new LargeAsteroid());
    for (var i = 0; i < 2; ++i) scene.add(new MediumAsteroid());
    for (var i = 0; i < 2; ++i) scene.add(new SmallAsteroid());

    return scene;
  });
}

