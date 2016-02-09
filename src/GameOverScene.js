var GameOverScene = (function () {
  function GameOverScene(asteroids) {
    Scene.call(this);

    this.add(new Background(), 0);
    asteroids.forEach(this.add, this);

    this.setExpiration(secondsToTicks(30));

    var gameOver = new GameObject();
    gameOver.setImageId("game-over");
    gameOver.setCenter(Quick.getCenter());
    this.add(gameOver, 2);
  }; GameOverScene.prototype = Object.create(Scene.prototype);

  GameOverScene.prototype.getNext = function() {
    return new GameScene();
  };

  function secondsToTicks(seconds) { return seconds * 30; }

  return GameOverScene;
})();
