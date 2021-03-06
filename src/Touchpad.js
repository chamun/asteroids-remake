var Touchpad = (function () {
  var BUTTONS_HEIGHT = 100;

  var buttons = [];

  return {
    createButtons: function (scene, topOffset) {
      var btSize = Quick.getWidth() / 3;
      var player = function () {
        return scene.getPlayer.call(scene);
      }

      var fullscreen = new FullscreenButton();
      fullscreen.setSize(40, 40);
      fullscreen.setRight(Quick.getWidth());
      fullscreen.setTop(topOffset + 5);
      scene.add(fullscreen, 0);
      buttons.push(fullscreen);

      var mute = new MuteButton();
      mute.setLeft(0);
      mute.setTop(topOffset + 5);
      scene.add(mute, 0);
      buttons.push(mute);

      var right = new Button("right", "right-pressed");
      right.onDown = function () { player().rotateRight(); };
      right.setSize(btSize, BUTTONS_HEIGHT);
      right.setRight(Quick.getWidth());
      right.setBottom(Quick.getHeight());
      scene.add(right, 2);
      buttons.push(right);

      var left = new Button("left", "left-pressed");
      left.onDown = function () { player().rotateLeft(); };
      left.setSize(btSize, BUTTONS_HEIGHT);
      left.setBottom(Quick.getHeight());
      scene.add(left, 2);
      buttons.push(left);

      var thrust = new Button('thrust', 'thrust-pressed');
      thrust.onDown = function () { player().thrust(); }
      thrust.setLeft(left.getRight() + 2);
      thrust.setSize(btSize, BUTTONS_HEIGHT);
      thrust.setBottom(Quick.getHeight());
      scene.add(thrust, 2);
      buttons.push(thrust);

      var fire = new Button();
      fire.onPush = function () { player().shoot(); };
      fire.setSize(Quick.getWidth(), left.getTop());
      scene.add(fire, 2);
      buttons.push(fire);
    },
    clearEventListeners: function () {
      buttons.forEach(function (button) {
        button.clearEventListeners();
      })
    },
    BUTTONS_HEIGHT: BUTTONS_HEIGHT
  }
})();
