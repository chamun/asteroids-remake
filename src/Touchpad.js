var Touchpad = (function () {
  return {
    createButtons: function (scene) {
      var btSize = Quick.getWidth() / 3;
      var player = function () {
        return scene.getPlayer.call(scene);
      }

      var right = new Button("green");
      right.onDown = function () { player().rotateRight(); };
      right.setSize(btSize, 100);
      right.setRight(Quick.getWidth());
      right.setBottom(Quick.getHeight());
      scene.add(right);

      var left = new Button("green");
      left.onDown = function () { player().rotateLeft(); };
      left.setSize(btSize, 100);
      left.setBottom(Quick.getHeight());
      scene.add(left);

      var thrust = new Button("red");
      thrust.onDown = function () { player().thrust(); }
      thrust.setLeft(left.getRight() + 2);
      thrust.setSize(btSize, 100);
      thrust.setBottom(Quick.getHeight());
      scene.add(thrust);

      var fire = new Button();
      fire.onPush = function () { player().shoot(); };
      fire.setSize(Quick.getWidth(), left.getTop());
      scene.add(fire);
    }
  }
})();
