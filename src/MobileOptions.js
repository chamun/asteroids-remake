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
    play.setRight(Quick.getCenterX() - 20);
    play.onDown = newButtonAction.call(this, "play", scene);
    scene.add(play);

    var about = new Button("about-button", "about-button-pressed");
    about.setSize(120, 100);
    about.setTop(400);
    about.setLeft(Quick.getCenterX() + 20);
    about.onDown = newButtonAction.call(this, "about", scene);
    scene.add(about);

    this.buttons = [play, about, fullscreen, mute];
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
