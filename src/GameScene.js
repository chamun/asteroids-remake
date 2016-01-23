var GameScene = (function () {
  var FRAGMENT_EXPIRATION = 75;

  function GameScene() {
    Scene.call(this);

    this.scheduler = new Scheduler();
    this.add(this.scheduler);
    this.add(new Background());

    this.dashboard = new Dashboard(this);
    this.dashboard.setLives(3);

    newPlayer.call(this);

    for (var i = 0; i < 2; ++i) {
      [
        new LargeAsteroid(),
         new MediumAsteroid(),
         new SmallAsteroid()
      ].forEach(function(asteroid) {
        asteroid.setBoundary(boundary());
        this.add(asteroid);
      }, this);
    }

    Touchpad.createButtons(this);
  }; GameScene.prototype = Object.create(Scene.prototype);

  GameScene.prototype.onAsteroidHit = function (asteroid, object) {
    if (!asteroid.hasTag("asteroid")) return;
    this.dashboard.addScore(asteroid.getScore());
    asteroid
      .spawnAsteroids()
      .forEach(function(asteroid) {
        asteroid.setBoundary(boundary());
        this.add(asteroid);
      }, this);
    asteroid.expire();
    if (object.hasTag("player") && !object.getExpired()) {
      killPlayer.call(this, object);
    }
    object.expire();
  }

  GameScene.prototype.getNext = function() { return new GameScene(); };

  GameScene.prototype.getPlayer = function() { return this.player; };

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
    return new Rect(0, 0,
      Quick.getWidth(),
      Quick.getHeight() - Touchpad.BUTTONS_HEIGHT
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

  return GameScene;
})();
