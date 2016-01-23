var GameScene = (function () {
  var FRAGMENT_EXPIRATION = 75;

  function GameScene() {
    Scene.call(this);

    this.scheduler = new Scheduler();
    this.add(this.scheduler);
    this.add(new Background());

    this.dashboard = new Dashboard(this);
    this.dashboard.setLives(3);

    this.add(new Player());
    for (var i = 0; i < 2; ++i) this.add(new LargeAsteroid());
    for (var i = 0; i < 2; ++i) this.add(new MediumAsteroid());
    for (var i = 0; i < 2; ++i) this.add(new SmallAsteroid());

    createButtons.call(this);
  }; GameScene.prototype = Object.create(Scene.prototype);

  GameScene.prototype.onAsteroidHit = function (asteroid, object) {
    if (!asteroid.hasTag("asteroid")) return;
    this.dashboard.addScore(asteroid.getScore());
    asteroid
      .spawnAsteroids()
      .forEach(this.add, this);
    asteroid.expire();
    if (object.hasTag("player") && !object.getExpired()) {
      killPlayer.call(this, object);
    }
    object.expire();
  }

  GameScene.prototype.getNext = function() { return new GameScene(); };

  function killPlayer(player) {
    addFragments.call(this, 60, player.getCenter(), player.getVelocity());
    this.scheduler.schedule(FRAGMENT_EXPIRATION, function () {
      this.add(new Player());
    }, this);

    this.dashboard.decrementLife();
    if (this.dashboard.getLives() == 0) {
      this.scheduler.schedule(FRAGMENT_EXPIRATION, this.expire, this);
    }
  };

  function addFragments(count, position, velocity) {
    while(--count > 0) {
      var exp = 1 + Quick.random(
        FRAGMENT_EXPIRATION - 20,
        FRAGMENT_EXPIRATION
      );
      this.add(new Fragment(exp, position, velocity));
    }
  }

  function createButtons() {
    var btSize = Quick.getWidth() / 3;

    var right = new Button("green");
    right.onPush = function () { console.log("Right is down!"); };
    right.setSize(btSize, 100);
    right.setRight(Quick.getWidth());
    right.setBottom(Quick.getHeight());
    this.add(right);

    var left = new Button("green");
    left.onPush = function () { console.log("Left is down!"); };
    left.setSize(btSize, 100);
    left.setBottom(Quick.getHeight());
    this.add(left);

    var thrust = new Button("red");
    thrust.onPush = function () { console.log("vooosh"); }
    thrust.setLeft(left.getRight() + 2);
    thrust.setSize(btSize, 100);
    thrust.setBottom(Quick.getHeight());
    this.add(thrust);

    var fire = new Button();
    fire.onPush = function () { console.log("fire!"); };
    fire.setSize(Quick.getWidth(), left.getTop());
    this.add(fire);
  }

  return GameScene;
})();
