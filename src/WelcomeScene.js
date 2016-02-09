var WelcomeScene = (function () {
  function WelcomeScene() {
    Scene.call(this);

    var title = new GameObject();
    title.setImageId("title");
    title.setCenter(Quick.getCenter());
    this.add(title);

    var play = new GameObject();
    play.setImageId("play");
    play.setCenterX(Quick.getCenterX());
    play.setTop(title.getBottom() + 50);
    this.add(play);

    var selector = new GameObject();
    selector.setImageId("selector");
    selector.setCenterY(play.getCenterY());
    selector.setRight(play.getLeft() - 20);
    this.add(selector);
  }; WelcomeScene.prototype = Object.create(Scene.prototype);

  return WelcomeScene;
})();
