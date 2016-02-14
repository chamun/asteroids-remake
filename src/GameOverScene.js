var GameOverScene = (function () {
  function GameOverScene(asteroids) {
    Scene.call(this);

    this.add(new Background());
    asteroids.forEach(this.add, this);

    this.setExpiration(secondsToTicks(30));

    var gameOver = new GameObject();
    gameOver.setImageId("game-over");
    gameOver.setCenter(Quick.getCenter());
    gameOver.setLayerIndex(2);
    this.add(gameOver);

    if (isMobile()) {
      this.button = new Button();
      this.button.setSize(Quick.getWidth(), Quick.getHeight());
      this.button.onPush = function () { this.expire() }.bind(this);
      this.add(this.button);
    }
  }; GameOverScene.prototype = Object.create(Scene.prototype);

  GameOverScene.prototype.update = function() {
    if(Quick.getController().keyPush(CommandEnum.A)) {
      this.expire();
    }
  };

  GameOverScene.prototype.getNext = function() {
    if (isMobile()) {
      this.button.clearEventListeners();
    }
    return new WelcomeScene();
  };

  GameOverScene.prototype.expire = function() {
    if (this.getTick() > secondsToTicks(1)) {
      Scene.prototype.expire.call(this);
    }
  };

  function secondsToTicks(seconds) { return seconds * 30; }

  return GameOverScene;
})();
