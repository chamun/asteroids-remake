var WelcomeScene = (function () {
  var OPTIONS = 2;

  function WelcomeScene() {
    Scene.call(this);

    this.add(new Background());

    var title = new GameObject();
    title.setImageId("title");
    title.setTop(150);
    title.setCenterX(Quick.getCenterX());
    this.add(title);

    var play = new GameObject();
    play.setImageId("play");
    play.setCenterX(Quick.getCenterX());
    play.setTop(title.getBottom() + 150);
    this.add(play);

    var about = new GameObject();
    about.setImageId("about");
    about.setCenterX(Quick.getCenterX());
    about.setTop(play.getBottom() + 30);
    this.add(about);

    this.options = [play, about];
    this.selectorIndex = 0;

    this.selector = new GameObject();
    this.selector.setImageId("selector");
    this.selector.setCenterY(play.getCenterY());
    this.selector.setRight(play.getLeft() - 20);
    this.add(this.selector);
  }; WelcomeScene.prototype = Object.create(Scene.prototype);

  WelcomeScene.prototype.update = function() {
    if(Quick.getController().keyPush(CommandEnum.DOWN)) {
      selectorUp.call(this);
    }
    if(Quick.getController().keyPush(CommandEnum.UP)) {
      selectorDown.call(this);
    }
  };

  function selectorUp() {
    this.selectorIndex = (this.selectorIndex + 1) % OPTIONS;
    placeSelector.call(this);
  }

  function selectorDown() {
    this.selectorIndex -= 1;
    if (this.selectorIndex < 0) {
      this.selectorIndex = OPTIONS - 1;
    }
    placeSelector.call(this);
  }

  function placeSelector() {
    var option = this.options[this.selectorIndex];
    this.selector.setCenterY(option.getCenterY());
    this.selector.setRight(option.getLeft() - 20);
  }

  return WelcomeScene;
})();
