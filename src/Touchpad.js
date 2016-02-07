var Touchpad = (function () {
  var BUTTONS_HEIGHT = 100;

  return {
    createButtons: function (scene, topOffset) {
      var btSize = Quick.getWidth() / 3;
      var player = function () {
        return scene.getPlayer.call(scene);
      }

      var right = new Button("right", "right-pressed");
      right.onDown = function () { player().rotateRight(); };
      right.setSize(btSize, BUTTONS_HEIGHT);
      right.setRight(Quick.getWidth());
      right.setBottom(Quick.getHeight());
      scene.add(right, 2);

      var left = new Button("left", "left-pressed");
      left.onDown = function () { player().rotateLeft(); };
      left.setSize(btSize, BUTTONS_HEIGHT);
      left.setBottom(Quick.getHeight());
      scene.add(left, 2);

      var thrust = new Button('empty', 'empty-pressed');
      thrust.onDown = function () { player().thrust(); }
      thrust.setLeft(left.getRight() + 2);
      thrust.setSize(btSize, BUTTONS_HEIGHT);
      thrust.setBottom(Quick.getHeight());
      scene.add(thrust, 2);

      var fire = new Button();
      fire.onPush = function () { player().shoot(); };
      fire.setSize(Quick.getWidth(), left.getTop());
      scene.add(fire, 2);

      var fullscreen = new FullscreenButton();
      fullscreen.setSize(50, 50);
      fullscreen.setColor("green");
      fullscreen.setRight(Quick.getRight());
      fullscreen.setTop(topOffset);
      scene.add(fullscreen, 0);
    },
    BUTTONS_HEIGHT: BUTTONS_HEIGHT
  }
})();
