var Touchpad = (function () {
  var BUTTONS_HEIGHT = 100;

  return {
    createButtons: function (scene) {
      var btSize = Quick.getWidth() / 3;
      var player = function () {
        return scene.getPlayer.call(scene);
      }

      var right = new Button("right", "right-pressed");
      right.onDown = function () { player().rotateRight(); };
      right.setSize(btSize, BUTTONS_HEIGHT);
      right.setRight(Quick.getWidth());
      right.setBottom(Quick.getHeight());
      right.setLayerIndex(1);
      scene.add(right);

      var left = new Button("left", "left-pressed");
      left.onDown = function () { player().rotateLeft(); };
      left.setSize(btSize, BUTTONS_HEIGHT);
      left.setBottom(Quick.getHeight());
      left.setLayerIndex(1);
      scene.add(left);

      var thrust = new Button('empty', 'empty-pressed');
      thrust.onDown = function () { player().thrust(); }
      thrust.setLeft(left.getRight() + 2);
      thrust.setSize(btSize, BUTTONS_HEIGHT);
      thrust.setBottom(Quick.getHeight());
      thrust.setLayerIndex(1);
      scene.add(thrust);

      var fire = new Button();
      fire.onPush = function () { player().shoot(); };
      fire.setSize(Quick.getWidth(), left.getTop());
      fire.setLayerIndex(1);
      scene.add(fire);
    },
    BUTTONS_HEIGHT: BUTTONS_HEIGHT
  }
})();
