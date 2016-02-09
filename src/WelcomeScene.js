var WelcomeScene = (function () {
  function WelcomeScene() {
    Scene.call(this);

    this.add(new Background());

    var title = new GameObject();
    title.setImageId("title");
    title.setTop(150);
    title.setCenterX(Quick.getCenterX());
    this.add(title);

    this.options = new DesktopOptions(this);

  }; WelcomeScene.prototype = Object.create(Scene.prototype);

  WelcomeScene.prototype.update = function() {
    if(Quick.getController().keyPush(CommandEnum.DOWN)) {
      this.options.next();
    }
    if(Quick.getController().keyPush(CommandEnum.UP)) {
      this.options.previous();
    }
  };

  return WelcomeScene;
})();
