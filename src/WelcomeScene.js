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
    this.add(this.options);

  }; WelcomeScene.prototype = Object.create(Scene.prototype);

  WelcomeScene.prototype.getNext = function() {
    var option = this.options.getOption();
    if (option == "play") {
      return new GameScene();
    }
    if (option == "about") {
      console.log("about selected");
    }
    return new WelcomeScene();
  };

  return WelcomeScene;
})();
