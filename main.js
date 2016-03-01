"use strict";

var CommandEnum = com.dgsprb.quick.CommandEnum;
var BaseTransition = com.dgsprb.quick.BaseTransition;
var GameObject = com.dgsprb.quick.GameObject;
var Point = com.dgsprb.quick.Point;
var Quick = com.dgsprb.quick.Quick;
var Rect = com.dgsprb.quick.Rect;
var Scene = com.dgsprb.quick.Scene;
var Text = com.dgsprb.quick.Text;

var CanvasCenter = function () {
  return new Point(Quick.getWidth() / 2, Quick.getHeight() / 2);
}

function random(min, max) {
  return Math.random() * (max - min) + min;
}

function isMobile() {
  return /Mobi/.test(navigator.userAgent);
}

function main() {
  Quick.setName("Asteroids Remake");
  Quick.setAutoScale(true);
  Quick.setKeepAspect(true);
  Quick.setNumberOfLayers(3);
  Quick.init(function () { return new WelcomeScene() });
}


var Polygon = (function () {
  function Polygon(points) {
    GameObject.call(this);
    this.setSolid(false);
    this.setColor("White");
    this.points = points;
    setDimensions.call(this);
  }; Polygon.prototype = Object.create(GameObject.prototype);

  Polygon.prototype.render = function(context) {
    var center = this.getCenter();
    var fun = 'moveTo';

    context.strokeStyle = this.getColor();
    if (this.fillColor !== undefined) {
      context.fillStyle = this.fillColor;
    }
    context.beginPath();
    this.points
      .concat([this.points[0]])
      .map(function (point) { return Vector.add(point, center); })
      .forEach(function (point, index) {
        context[fun](point.getX(), point.getY());
        fun = 'lineTo';
      });
    if (this.fillColor !== undefined) {
      context.fill();
    }
    context.stroke();
  };

  Polygon.prototype.rotate = function(angle) {
    this.points.forEach(function (point) { point.rotate(angle); });
    setDimensions.call(this);
  };

  function setDimensions() {
    var boundingBox = getBoundingBox.call(this);
    var center = this.getCenter();
    this.setSize(
      boundingBox.maxx - boundingBox.minx,
      boundingBox.maxy - boundingBox.miny
    );
    this.setCenter(center);
  }

  function getBoundingBox() {
    return this.points.reduce(function (rect, point) {
      return {
        minx: Math.min(point.getX(), rect.minx),
        miny: Math.min(point.getY(), rect.miny),
        maxx: Math.max(point.getX(), rect.maxx),
        maxy: Math.max(point.getY(), rect.maxy)
      };
    }, {
      minx: Infinity,
      miny: Infinity,
      maxx: -Infinity,
      maxy: -Infinity
    });
  }

  return Polygon;
})();

var Vector = (function () {
  function Vector(x, y) {
    Point.call(this);

    this.setX(x);
    this.setY(y);
    this.limit = Infinity;
  }; Vector.prototype = Object.create(Point.prototype);

  Vector.prototype.rotate = function(angle) {
    var sin = Math.sin(toRad(angle));
    var cos = Math.cos(toRad(angle));
    return this.set(
      this.getX() * cos - this.getY() * sin,
      this.getX() * sin + this.getY() * cos
    );
  };

  Vector.prototype.add = function(p) {
    return this.set(
      this.getX() + p.getX(),
      this.getY() + p.getY()
    );
  };

  Vector.prototype.scale = function(a) {
    return this.set(
     this.getX() * a,
     this.getY() * a
   );
  };

  Vector.prototype.set = function(x, y) {
    this.setX(x);
    this.setY(y);
    if (this.hasReachedLimit()) {
      var mag = this.magnitude()
      this.setX(this.getX() / mag * this.limit);
      this.setY(this.getY() / mag * this.limit);
    }
    return this;
  };

  Vector.prototype.magnitude = function() {
    return Math.sqrt(magSquared.call(this));
  };

  Vector.prototype.setLimit = function(limit) {
    this.limit = limit;
    return this.set(
      this.getX(),
      this.getY()
    );
  };

  Vector.prototype.hasReachedLimit = function () {
    return magSquared.call(this) >= this.limit * this.limit;
  }

  Vector.scale = function(v, a) {
    var nv = new Vector(v.getX(), v.getY());
    return nv.scale(a);
  };

  Vector.unit = function(v) {
    var mag = v.magnitude();
    return new Vector(
      v.getX() / mag,
      v.getY() / mag
    );
  };

  Vector.add = function (p, q) {
    var nv = new Vector(p.getX(), p.getY());
    return nv.add(q);
  };

  function magSquared() {
    return this.getX() * this.getX() +
      this.getY() * this.getY();
  }

  function toRad(angle) { return angle * (Math.PI / 180); }

  return Vector;
})();

var Asteroid = (function () {
  function Asteroid(points) {
    Polygon.call(this, points);

    this.setSolid(true);
    this.setColor("Green");
    this.addTag("asteroid");
    this.setBoundary(Quick.getBoundary());

    this.setPosition(randomPoint());
  }; Asteroid.prototype = Object.create(Polygon.prototype);

  Asteroid.prototype.offBoundary = function() { BoundFixer.fix(this) };

  Asteroid.prototype.spawnAsteroids = function() {
    return this.nextAsteroids().map(function (asteroid) {
      asteroid.setCenter(this.getCenter());
      return asteroid;
    }, this);
  };

  function randomPoint() {
    var x = Quick.random(Quick.getWidth());
    var y = Quick.random(Quick.getHeight());
    return new Point(x, y);
  }

  return Asteroid;
})();

var SmallAsteroid = (function () {
  function SmallAsteroid() {
    Asteroid.call(this, [
      new Vector(-8, 8),
      new Vector(-4, 12),
      new Vector(4, 12),
      new Vector(8, 8),
      new Vector(8, 4),
      new Vector(0, -4),
      new Vector(-8, 0)
    ]);
  }; SmallAsteroid.prototype = Object.create(Asteroid.prototype);

  SmallAsteroid.prototype.nextAsteroids = function() { return []; };

  SmallAsteroid.prototype.getExplosionSoundId = function() {
    return "bangSmall";
  };

  SmallAsteroid.prototype.getScore = function() { return 30 };

  return SmallAsteroid;
})();

var MediumAsteroid = (function () {
  function MediumAsteroid() {
    Asteroid.call(this, [
      new Vector(12, 12),
      new Vector(30, -6),
      new Vector(-6, -18),
      new Vector(-12, -12),
      new Vector(-3.6, 3.6)
    ]);
  }; MediumAsteroid.prototype = Object.create(Asteroid.prototype);

  MediumAsteroid.prototype.nextAsteroids = function() {
    return [
      new SmallAsteroid(),
      new SmallAsteroid(),
      new SmallAsteroid()
    ];
  };

  MediumAsteroid.prototype.getExplosionSoundId = function() {
    return "bangMedium";
  };

  MediumAsteroid.prototype.getScore = function() { return 20 };

  return MediumAsteroid;
})();

var LargeAsteroid = (function () {
  function LargeAsteroid() {
    Asteroid.call(this, [
      new Vector( -10, -30),
      new Vector( -30, -20),
      new Vector( -40, 0),
      new Vector( -30, 20),
      new Vector( -20, 30),
      new Vector( 10, 20),
      new Vector( 20, 10),
      new Vector( 10, -20)
    ]);
  }; LargeAsteroid.prototype = Object.create(Asteroid.prototype);

  LargeAsteroid.prototype.nextAsteroids = function() {
    return [
      new MediumAsteroid(),
      new MediumAsteroid()
    ];
  };

  LargeAsteroid.prototype.getExplosionSoundId = function() {
    return "bangLarge";
  };

  LargeAsteroid.prototype.getScore = function() { return 10 };

  return LargeAsteroid;
})();

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

var AsteroidsFactory = (function () {

  function AsteroidsFactory(level) {
    this.level = level;
  };

  function speedMultiplier() {
    this.speedMultiplier = this.speedMultiplier || this.level / 8 + 1;
    return this.speedMultiplier;
  }

  function randomSpeed() {
    return random(-0.5, 0.5) * speedMultiplier.call(this);
  }

  function extraAstroids() {
    var extraAstroids = []
    var quantity = Math.floor(this.level / 5);
    for (var i = 0; i < quantity; ++i) {
      extraAstroids.push(new LargeAsteroid());
    }
    return extraAstroids;
  }

  function defaultAsteroids() {
    return [
      new LargeAsteroid(),
      new LargeAsteroid(),
      new MediumAsteroid(),
      new MediumAsteroid(),
      new SmallAsteroid(),
      new SmallAsteroid()
    ];
  }

  AsteroidsFactory.prototype.setSpeed = function(asteroid) {
    asteroid.setSpeedX(randomSpeed.call(this));
    asteroid.setSpeedY(randomSpeed.call(this));
    return asteroid;
  };

  AsteroidsFactory.prototype.getAsteroids = function() {
    return defaultAsteroids()
      .concat(extraAstroids.call(this))
      .map(this.setSpeed, this);
  };

  return AsteroidsFactory;
})();

var Background = (function () {
  function Background() {
    GameObject.call(this);
    this.setSize(Quick.getWidth(), Quick.getHeight());
    this.setColor("Black");
  }; Background.prototype = Object.create(GameObject.prototype);

  return Background;
})();

var BoundFixer = (function () {

  var isOffBoundary = function(object, axis) {
    var p = object["get" + axis]();
    var bounds = object.boundary;
    var max = bounds["get" + getDimension(axis)]();
    return p < 0 || p > max;
  };

  var placeInBounds = function(object, axis) {
    var p = object["get" + axis]();
    var bounds = object.boundary;
    var dAxis = Math.sign(-p) * bounds["get" + getDimension(axis)]();
    object["set" + axis](p + dAxis);
  };

  var getDimension = function(axis) {
    return (axis == "X") ? "Width" : "Height";
  }

  return {
    fix: function(object) {
      if (isOffBoundary(object, "X")) { placeInBounds(object, "X"); }
      if (isOffBoundary(object, "Y")) { placeInBounds(object, "Y"); }
    }
  };
})();

var Button = (function () {
  function Button(image, imagePressed) {
    GameObject.call(this);

    this.image = image;
    this.imagePressed = imagePressed;
    resetState.call(this);

    addEventListener("touchstart", this);
    addEventListener("touchend", this);
  }; Button.prototype = Object.create(GameObject.prototype);

  Button.prototype.update = function() {
    if (this.pressed) { this.onDown(); }
    if (this.pressed && !this.pressedLastUpdate) {
      this.pressedLastUpdate = true;
      this.onPush();
    }

    if (this.pressed) {
      this.setImageId(this.imagePressed);
    } else {
      this.setImageId(this.image);
    }
  };

  Button.prototype.handleEvent = function(event) {
    if (event.type == 'touchstart') this.touchstart(event);
    if (event.type == 'touchend') this.touchend(event);
  };

  Button.prototype.touchstart = function(event) {
    var ct = event["changedTouches"][0];
    if (!isPointInside.call(this, ct.pageX, ct.pageY)) return;
    event.stopImmediatePropagation();
    this.identifier = ct.identifier;
    this.pressed = true;
  };

  Button.prototype.touchend = function(event) {
    var touch = getTouchById(event, this.identifier)
    if (touch != null) { resetState.call(this); }
    return touch != null;
  };

  Button.prototype.onPush = function() { };
  Button.prototype.onDown = function() { };

  Button.prototype.setImageId = function(imageId) {
    if (imageId != undefined) {
      GameObject.prototype.setImageId.call(this, imageId);
    }
  };

  Button.prototype.clearEventListeners = function() {
    removeEventListener("touchstart", this);
    removeEventListener("touchend", this);
  };

  function isPointInside(x, y) {
    var point = mapToQuick(x, y);
    return point.getX() >= this.getLeft() &&
           point.getX() <= this.getRight() &&
           point.getY() <= this.getBottom() &&
           point.getY() >= this.getTop();
  }

  function mapToQuick(x, y) {
    var realX = x - Quick.getOffsetLeft();
    var realY = y - Quick.getOffsetTop();
    return new Point(
      Math.floor(realX * Quick.getWidth() / Quick.getRealWidth()),
      Math.floor(realY * Quick.getHeight() / Quick.getRealHeight())
    );
  }

  function getTouchById(event, id) {
    for (var i = 0; i < event.changedTouches.length; ++i) {
      var touch = event.changedTouches.item(i);
      if (touch.identifier == id) return touch;
    }
    return null;
  }

  function resetState() {
    this.pressed = false;
    this.pressedLastUpdate = false;
    this.identifier = null;
  }

  return Button;
})();

var Dashboard = (function () {
  var LIVES_SIZE = 20;
  var LIVES_GAP = 10;
  var LIVES_Y = 5;
  var SCORE_LENGTH = 6;

  function Dashboard(scene) {
    this.scene = scene;
    this.score = 0;
    this.lives = [];

    this.scoreDisplay = new Text();
    this.scene.add(this.scoreDisplay, 2);
    this.addScore(0);
  };

  Dashboard.prototype.setLives = function(lives) {
    this.lives = makeLives(lives);
    this.lives.forEach(function (life) {
      this.scene.add(life, 2);
    }, this);
  };

  Dashboard.prototype.decrementLife = function() {
    if (this.lives.length == 0) throw("No more lives to decrement!");
    var life = this.lives.pop().expire();
  };

  Dashboard.prototype.addScore = function(score) {
    this.score += score;
    this.scoreDisplay.setString(zeroFill(this.score.toString()));
    this.scoreDisplay.setRight(Quick.getWidth());
  };

  Dashboard.prototype.getScore = function() {
    return this.score;
  };

  Dashboard.prototype.getLives = function() { return this.lives.length; };

  Dashboard.prototype.getBottom = function() {
    return this.scoreDisplay.getBottom();
  };

  function makeLives(n) {
    var lives = [];
    while(n-- > 0) {
      var life = new Polygon(Player.POINT_LIST());
      life.setColor(Player.COLOR);
      life.setX(nextX(lives));
      life.setY(LIVES_Y);
      life.rotate(45);
      lives.push(life);
    }
    return lives
  }

  function nextX(lives) {
    var last = lives[lives.length - 1];
    var offset = last ? last.getRight() : 0;
    return offset + LIVES_GAP;
  }

  function zeroFill(number) {
    var ret = [];
    var zCount = SCORE_LENGTH - number.length;
    while (zCount-- > 0) { ret.push(0) };
    ret.push(number);
    return ret.join("");
  }

  return Dashboard;
})();

var DesktopOptions = (function () {
  var OPTIONS = 2;

  function DesktopOptions(scene) {
    GameObject.call(this);
    var play = new GameObject();
    play.setImageId("play");
    play.setCenterX(Quick.getCenterX());
    play.setTop(400);
    scene.add(play);

    var about = new GameObject();
    about.setImageId("about");
    about.setCenterX(Quick.getCenterX());
    about.setTop(play.getBottom() + 30);
    scene.add(about);

    this.options = [
      { button: play, name: "play"},
      { button: about, name: "about"}
    ];
    this.selectorIndex = 0;

    this.selector = new GameObject();
    this.selector.setImageId("selector");
    this.selector.setCenterY(play.getCenterY());
    this.selector.setRight(play.getLeft() - 20);
    scene.add(this.selector);
  } DesktopOptions.prototype = Object.create(GameObject.prototype);

  DesktopOptions.prototype.update = function() {
    if(Quick.getController().keyPush(CommandEnum.DOWN)) {
      selectorUp.call(this);
    }
    if(Quick.getController().keyPush(CommandEnum.UP)) {
      selectorDown.call(this);
    }
    if(Quick.getController().keyPush(CommandEnum.A)) {
      this.getScene().expire();
    }
  };

  DesktopOptions.prototype.getOption = function() {
    return this.options[this.selectorIndex].name;
  };

  DesktopOptions.prototype.cleanUp = function() { };

  function selectorUp() {
    this.selectorIndex = (this.selectorIndex + 1) % OPTIONS;
    placeSelector.call(this);
  }

  function selectorDown() {
    this.selectorIndex -= 1;
    if (this.selectorIndex < 0) {
      this.selectorIndex = OPTIONS - 1;
    }
    placeSelector.call(this);
  }

  function placeSelector() {
    var option = this.options[this.selectorIndex].button;
    this.selector.setCenterY(option.getCenterY());
    this.selector.setRight(option.getLeft() - 20);
  }

  return DesktopOptions;
})();

var Fragment = (function () {
  function Fragment(expiration, position, velocity) {
    GameObject.call(this);
    this.setSize(2, 2);
    this.setColor(Player.COLOR);
    this.setPosition(position);
    this.setSpeedX(velocity.getX() + random(-0.5, 0.5) * 3);
    this.setSpeedY(velocity.getY() + random(-0.5, 0.5) * 3);
    this.setExpiration(expiration);
    this.setBoundary(Quick.getBoundary());
  }; Fragment.prototype = Object.create(GameObject.prototype);

  Fragment.prototype.offBoundary = function() { BoundFixer.fix(this) };

  return Fragment;
})();

var FullscreenButton = (function () {
  function FullscreenButton() {
    Button.call(this, 'fullscreen', 'fullscreen-pressed');

    this.fullscreen = false;
  }; FullscreenButton.prototype = Object.create(Button.prototype);

  FullscreenButton.prototype.touchend = function(event) {
    if (!Button.prototype.touchend.call(this, event)) return;

    if (this.fullscreen) {
      closeFullscreen();
    } else {
      openFullscreen()
    }

    this.fullscreen = !this.fullscreen;
  };

  function openFullscreen() {
    var elem = document.getElementById("canvas");
    if (elem.requestFullscreen) {
      elem.requestFullscreen();
    } else if (elem.msRequestFullscreen) {
      elem.msRequestFullscreen();
    } else if (elem.mozRequestFullScreen) {
      elem.mozRequestFullScreen();
    } else if (elem.webkitRequestFullscreen) {
      elem.webkitRequestFullscreen();
    }
  }

  function closeFullscreen() {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.msExitFullscreen) {
      document.msExitFullscreen();
    } else if (document.mozCancelFullScreen) {
      document.mozCancelFullScreen();
    } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen();
    }
  }

  return FullscreenButton;
})();

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
    if (shouldExpire.call(this)) {
      var expiration = this.player.getExpired() ? FRAGMENT_EXPIRATION : 5;
      this.scheduler.schedule(expiration, this.expire, this);
    }
  }

  function shouldExpire() {
    return this.asteroids == 0 || this.dashboard.getLives() == 0;
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

var MobileOptions = (function () {

  function MobileOptions(scene) {
    var fullscreen = new FullscreenButton();
    fullscreen.setSize(40, 40);
    fullscreen.setRight(Quick.getWidth());
    scene.add(fullscreen);

    var mute = new MuteButton();
    scene.add(mute);

    var play = new Button("play-button", "play-button-pressed");
    play.setSize(120, 100);
    play.setTop(400);
    play.setCenterX(Quick.getCenterX());
    play.onDown = newButtonAction.call(this, "play", scene);
    scene.add(play);

    this.buttons = [play, fullscreen, mute];
  };

  MobileOptions.prototype.getOption = function() {
    return this.option;
  };

  MobileOptions.prototype.cleanUp = function() {
    this.buttons.forEach(function (button) {
      button.clearEventListeners();
    })
  };

  function newButtonAction(option, scene) {
    return function () {
      this.option = option;
      scene.expire();
    }.bind(this);
  }

  return MobileOptions;
})();

var MuteButton = (function () {
  var SIZE = 40;

  function MuteButton() {
    Button.call(this, "sound", "sound-pressed");

    this.on = Sound.isMute();
    syncImage.call(this);
    this.setSize(SIZE, SIZE);
  }; MuteButton.prototype = Object.create(Button.prototype);

  MuteButton.prototype.onPush = function() {
    this.on = !this.on;
    syncImage.call(this);
    Sound.toggleSound();
  };

  MuteButton.prototype.setImageId = function(imageId) {
    Button.prototype.setImageId.call(this, imageId);
    this.setSize(SIZE, SIZE);
  };

  function syncImage() {
    if(this.on) {
      this.image = "no-sound";
      this.imagePressed = "no-sound-pressed";
    } else {
      this.image = "sound";
      this.imagePressed = "sound-pressed";
    }
  }

  return MuteButton;
})();

var Player = (function () {
  var MAX_SPEED = 3;

  Player.POINT_LIST = function () {
    return [
      new Vector(0, -10),
      new Vector(10, 10),
      new Vector(-10, 10)
    ]
  };

  Player.COLOR = "white";

  function Player() {
    Polygon.call(this, Player.POINT_LIST());
    this.setSolid(true);
    this.setColor(Player.COLOR);
    this.fillColor = "#000";
    this.addTag("player");
    this.setBoundary(Quick.getBoundary());
    this.heading = new Vector(0, -0.1);
    this.velocity = (new Vector(0, 0)).setLimit(MAX_SPEED);
    this.gracePeriod = 100;

    this.setCenter(CanvasCenter());
  }; Player.prototype = Object.create(Polygon.prototype);

  Player.prototype.update = function() {
    this.updateOrientation();
    this.updateVelocity();
    this.gracePeriod--;
    if (this.canShoot()) { this.shoot(); }
  };

  Player.prototype.offBoundary = function() { BoundFixer.fix(this) };

  Player.prototype.onCollision = function(asteroid) {
    if (!isGracePeriodOver.call(this)) return;
    this.getScene().onAsteroidHit(asteroid, this);
  };

  Player.prototype.updateVelocity = function() {
    this.setSpeedX(this.velocity.getX());
    this.setSpeedY(this.velocity.getY());
  };

  Player.prototype.updateOrientation = function() {
    if (Quick.getController().keyDown(CommandEnum.LEFT)) { this.rotateLeft(); }
    if (Quick.getController().keyDown(CommandEnum.RIGHT)) { this.rotateRight(); }
    if (Quick.getController().keyDown(CommandEnum.UP)) { this.thrust(); }
  };

  Player.prototype.rotateLeft = function() {
    this.heading.rotate(-5);
    this.rotate(-5);
  };

  Player.prototype.rotateRight = function() {
    this.heading.rotate(5);
    this.rotate(5);
  };

  Player.prototype.thrust = function() {
    if (this.getExpired()) return;
    Sound.play("thrustSound");
    this.velocity.add(this.heading);
    addThrustFragments.call(this, 10);
  };

  Player.prototype.canShoot = function() {
    return Quick.getController().keyPush(CommandEnum.A);
  };

  Player.prototype.shoot = function() {
    if (this.getExpired()) return;
    Sound.play("fire");
    this.getScene().add(new Shot(
      this.getCenter(),
      this.heading,
      this.velocity
    ), 0);
  };

  Player.prototype.getVelocity = function() { return this.velocity; };

  Player.prototype.render = function(context) {
    if (!isGracePeriodOver.call(this)) {
      context.lineWidth = 3;
      context.strokeStyle = '#d0d027';
      context.beginPath();
      context.arc(this.getCenterX(), this.getCenterY() + 2, 20, 0, 2 * Math.PI);
      context.stroke();
    }

    Polygon.prototype.render.call(this, context);
  };

  function isGracePeriodOver() {
    return shouldBlink.call(this) || this.gracePeriod <= 0;
  }

  function shouldBlink() {
    return this.gracePeriod <= 40 && this.getTick() % 4 == 0;
  }

  function addThrustFragments(number) {
    var colors = ["red", "orange", "yellow"];
    var velocity = Vector.scale(this.heading, -60);
    var position = Vector.add(this.getCenter(), velocity);
    for (var i = 0; i < number; ++i) {
      var fragment = new Fragment(2, position, velocity)
      fragment.setColor(colors[Quick.random(2)]);
      this.scene.add(fragment, 0);
    }
  }

  return Player;
})();

var Shot = (function () {
  var SPEED = 5;

  function Shot(position, direction, initialVelocity) {
    GameObject.call(this);
    this.setColor("White");
    this.setSize(1, 1);
    this.setSolid(true);
    this.setPosition(position);
    this.setBoundary(Quick.getBoundary());
    this.setExpiration(50);

    setVelocity.call(this, direction, initialVelocity);
  }; Shot.prototype = Object.create(GameObject.prototype);

  Shot.prototype.offBoundary = function() { BoundFixer.fix(this) };

  Shot.prototype.onCollision = function(asteroid) {
    this.getScene().onAsteroidHit(asteroid, this);
  };

  function setVelocity(direction, initialVelocity) {
    var unitDirection = Vector.unit(direction);
    this.setSpeedX(SPEED * unitDirection.getX() + initialVelocity.getX());
    this.setSpeedY(SPEED * unitDirection.getY() + initialVelocity.getY());
  }

  return Shot;
})();

var Sound = (function () {
  var mute = false;

  return {
    toggleSound: function () {
      mute = !mute;
    },
    play: function (id) {
      if (!mute) {
        Quick.play(id);
      }
    },
    isMute: function () {
      return mute;
    }
  };
})();

var Scheduler = (function () {
  function Scheduler() {
    GameObject.call(this);
    this.scheduler = []
  }; Scheduler.prototype = Object.create(GameObject.prototype);

  Scheduler.prototype.update = function() {
    this.scheduler
      .filter(function (job) {
        return job.time == this.getScene().getTick()
      }, this)
      .forEach(function (job) {
        job.callback.call(job.thisArg)
      }, this);

    this.scheduler = this.scheduler.filter(function (job) {
      return job.time > this.getScene().getTick()
    }, this);
  };

  Scheduler.prototype.schedule = function(time, callback, thisArg) {
    this.scheduler.push({
      time: this.getScene().getTick() + time,
      callback: callback,
      thisArg: thisArg
    });
  };

  return Scheduler;
})();

var Touchpad = (function () {
  var BUTTONS_HEIGHT = 100;

  var buttons = [];

  return {
    createButtons: function (scene, topOffset) {
      var btSize = Quick.getWidth() / 3;
      var player = function () {
        return scene.getPlayer.call(scene);
      }

      var fullscreen = new FullscreenButton();
      fullscreen.setSize(40, 40);
      fullscreen.setRight(Quick.getWidth());
      fullscreen.setTop(topOffset + 5);
      scene.add(fullscreen, 0);
      buttons.push(fullscreen);

      var mute = new MuteButton();
      mute.setLeft(0);
      mute.setTop(topOffset + 5);
      scene.add(mute, 0);
      buttons.push(mute);

      var right = new Button("right", "right-pressed");
      right.onDown = function () { player().rotateRight(); };
      right.setSize(btSize, BUTTONS_HEIGHT);
      right.setRight(Quick.getWidth());
      right.setBottom(Quick.getHeight());
      scene.add(right, 2);
      buttons.push(right);

      var left = new Button("left", "left-pressed");
      left.onDown = function () { player().rotateLeft(); };
      left.setSize(btSize, BUTTONS_HEIGHT);
      left.setBottom(Quick.getHeight());
      scene.add(left, 2);
      buttons.push(left);

      var thrust = new Button('thrust', 'thrust-pressed');
      thrust.onDown = function () { player().thrust(); }
      thrust.setLeft(left.getRight() + 2);
      thrust.setSize(btSize, BUTTONS_HEIGHT);
      thrust.setBottom(Quick.getHeight());
      scene.add(thrust, 2);
      buttons.push(thrust);

      var fire = new Button();
      fire.onPush = function () { player().shoot(); };
      fire.setSize(Quick.getWidth(), left.getTop());
      scene.add(fire, 2);
      buttons.push(fire);
    },
    clearEventListeners: function () {
      buttons.forEach(function (button) {
        button.clearEventListeners();
      })
    },
    BUTTONS_HEIGHT: BUTTONS_HEIGHT
  }
})();

var WelcomeScene = (function () {
  function WelcomeScene() {
    Scene.call(this);

    this.add(new Background());

    var title = new GameObject();
    title.setImageId("title");
    title.setTop(150);
    title.setCenterX(Quick.getCenterX());
    this.add(title);

    if (isMobile()) {
      this.options = new MobileOptions(this);
    } else {
      this.options = new DesktopOptions(this);
      this.add(this.options);
    }
  }; WelcomeScene.prototype = Object.create(Scene.prototype);

  WelcomeScene.prototype.getNext = function() {
    this.options.cleanUp();
    var option = this.options.getOption();
    if (option == "play") {
      return new GameScene();
    }
    if (option == "about") {
      return new AboutScene();
    }
    return new WelcomeScene();
  };

  return WelcomeScene;
})();
main();