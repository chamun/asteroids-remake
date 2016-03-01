var MobileOptions = (function () {

  function MobileOptions(scene) {
    var fullscreen = new FullscreenButton();
    fullscreen.setSize(40, 40);
    fullscreen.setRight(Quick.getWidth());
    scene.add(fullscreen);

    var mute = new MuteButton();
    scene.add(mute);

    var play = new Button("play-button", "play-button-pressed");
    play.setSize(120, 100);
    play.setTop(400);
    play.setCenterX(Quick.getCenterX());
    play.onDown = newButtonAction.call(this, "play", scene);
    scene.add(play);

    this.buttons = [play, fullscreen, mute];
  };

  MobileOptions.prototype.getOption = function() {
    return this.option;
  };

  MobileOptions.prototype.cleanUp = function() {
    this.buttons.forEach(function (button) {
      button.clearEventListeners();
    })
  };

  function newButtonAction(option, scene) {
    return function () {
      this.option = option;
      scene.expire();
    }.bind(this);
  }

  return MobileOptions;
})();
