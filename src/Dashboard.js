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

    var fullscreen = new FullscreenButton();
    fullscreen.setSize(50, 50);
    fullscreen.setColor("green");
    fullscreen.setRight(Quick.getRight());
    fullscreen.setTop(this.scoreDisplay.getBottom());
    this.scene.add(fullscreen);
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

  Dashboard.prototype.getLives = function() { return this.lives.length; };

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
