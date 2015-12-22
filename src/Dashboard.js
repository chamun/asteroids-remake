var Dashboard = (function () {
  var LIVES_SIZE = 20;
  var LIVES_GAP = 10;
  var LIVES_Y = 5;

  function Dashboard(scene) {
    this.scene = scene;
    this.points = 0;
    this.lives = 0;
  };

  Dashboard.prototype.setLives = function(lives) {
    this.lives = makeLives(lives);
    this.lives.forEach(this.scene.add, this.scene);
  };

  function makeLives(n) {
    var lives = []
    while(n-- > 0) {
      var life = new GameObject();
      life.setSize(LIVES_SIZE);
      life.setColor("red");
      life.setX(nextX(lives));
      life.setY(LIVES_Y);
      lives.push(life);
    }
    return lives
  }

  function nextX(lives) {
    var last = lives[lives.length - 1];
    var offset = last ? last.getRight() : 0;
    return offset + LIVES_GAP;
  }

  return Dashboard;
})();
