var AboutScene = (function () {
  function AboutScene() {
    Scene.call(this);

    this.add(new Background());

    var title = new GameObject();
    title.setImageId("title");
    title.setTop(150);
    title.setCenterX(Quick.getCenterX());
    this.add(title);

    var about = new GameObject();
    about.setImageId("about-text");
    about.setTop(title.getBottom() + 50);
    about.setCenterX(Quick.getCenterX());
    this.add(about);

    var back = new GameObject();
    back.setImageId("back");
    back.setBottom(Quick.getBottom() - 20);
    back.setRight(Quick.getRight() - 20);
    this.add(back);

    var selector = new GameObject();
    selector.setImageId("selector");
    selector.setCenterY(back.getCenterY());
    selector.setRight(back.getLeft() - 20);
    this.add(selector);
  }; AboutScene.prototype = Object.create(Scene.prototype);

  AboutScene.prototype.update = function() {
    if(Quick.getController().keyPush(CommandEnum.A)) {
      this.expire();
    }
  };

  AboutScene.prototype.getNext = function() {
    return new WelcomeScene();
  };

  return AboutScene;
})();
