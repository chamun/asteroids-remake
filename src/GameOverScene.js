var GameOverScene = (function () {
  function GameOverScene(asteroids) {
    Scene.call(this);

    this.add(new Background(), 0);
    asteroids.forEach(this.add, this);

    var gameOver = new GameObject();
    gameOver.setImageId("game-over");
    gameOver.setCenter(Quick.getCenter());
    this.add(gameOver, 2);
  }; GameOverScene.prototype = Object.create(Scene.prototype);

  return GameOverScene;
})();
