var GameScene = (function () {
  var FRAGMENT_EXPIRATION = 75;

  function GameScene(game) {
    Scene.call(this);

    game = game || {
      level: 0,
      score: 0,
      lives: 3
    };

    this.level = game.level;
    this.scheduler = new Scheduler();
    this.add(this.scheduler);
    this.add(new Background(), 0);

    this.dashboard = new Dashboard(this);
    this.dashboard.setLives(game.lives);
    this.dashboard.addScore(game.score);
    this.asteroids = 0;

    this.asteroidsFactory = new AsteroidsFactory(this.level);
    this.asteroidsFactory.getAsteroids().forEach(addAsteroid, this);

    newPlayer.call(this);

    if (isMobile()) {
      Touchpad.createButtons(this, this.dashboard.getBottom());
    }
  }; GameScene.prototype = Object.create(Scene.prototype);

  GameScene.prototype.onAsteroidHit = function (asteroid, object) {
    if (!asteroid.hasTag("asteroid")) return;
    this.asteroids--;
    this.dashboard.addScore(asteroid.getScore());
    Sound.play(asteroid.getExplosionSoundId());
    asteroid
      .spawnAsteroids()
      .map(this.asteroidsFactory.setSpeed, this.asteroidsFactory)
      .map(addAsteroid, this);
    asteroid.expire();
    if (object.hasTag("player") && !object.getExpired()) {
      killPlayer.call(this, object);
    }
    object.expire();
    if (this.asteroids == 0) {
      this.scheduler.schedule(5, this.expire, this);
    }
  }

  GameScene.prototype.getNext = function() {
    if (isMobile()) { Touchpad.clearEventListeners(); }
    var lives = this.dashboard.getLives();
    if (this.asteroids == 0 && lives > 0) {
      return new GameScene({
        level: this.level + 1,
        score: this.dashboard.getScore(),
        lives: lives
      });
    }
    return new GameOverScene(this.getObjectsWithTag("asteroid"));
  };

  GameScene.prototype.getPlayer = function() { return this.player; };

  GameScene.prototype.add = function(gameObject, layerIndex) {
    if (layerIndex === undefined) {
      layerIndex = 1;
    }
    gameObject.setLayerIndex(layerIndex);
    Scene.prototype.add.call(this, gameObject);
  };

  GameScene.prototype.getTransition = function () {
    if (this.dashboard.getLives() == 0) {
      return null;
    }
    return new BaseTransition();
  }

  function killPlayer(player) {
    addFragments.call(this, 60, player.getCenter(), player.getVelocity());
    this.scheduler.schedule(FRAGMENT_EXPIRATION, newPlayer, this);
    this.dashboard.decrementLife();
    if (this.dashboard.getLives() == 0) {
      this.scheduler.schedule(FRAGMENT_EXPIRATION, this.expire, this);
    }
  };

  function newPlayer() {
    this.player = new Player();
    this.add(this.player);
    this.player.setBoundary(boundary());
  }

  function boundary() {
    var mobileOffset = isMobile() ? Touchpad.BUTTONS_HEIGHT : 0;
    return new Rect(0, 0,
      Quick.getWidth(),
      Quick.getHeight() - mobileOffset
    );
  }

  function addFragments(count, position, velocity) {
    while(--count > 0) {
      var exp = 1 + Quick.random(
        FRAGMENT_EXPIRATION - 20,
        FRAGMENT_EXPIRATION
      );
      this.add(new Fragment(exp, position, velocity));
    }
  }

  function addAsteroid(asteroid) {
    asteroid.setBoundary(boundary());
    this.add(asteroid);
    this.asteroids++;
  }

  return GameScene;
})();
