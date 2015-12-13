"use strict";

var CommandEnum = com.dgsprb.quick.CommandEnum;
var GameObject = com.dgsprb.quick.GameObject;
var Point = com.dgsprb.quick.Point;
var Quick = com.dgsprb.quick.Quick;
var Scene = com.dgsprb.quick.Scene;

var CanvasCenter = function () {
  return new Point(Quick.getWidth() / 2, Quick.getHeight() / 2);
}

function main() {
  Quick.setName("Asteroids Remake");
  Quick.setAutoScale(true);
  Quick.setKeepAspect(true);
    Quick.init(function () {
      var scene = new Scene();

      scene.add(function () {
      var bg = new GameObject();
      bg.setSize(Quick.getWidth(), Quick.getHeight());
      bg.setColor("Black");
      return bg;
    }());

    scene.add(new Player());
    return scene;
  });
}

