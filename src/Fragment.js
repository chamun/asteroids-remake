var Fragment = (function () {
  function Fragment(expiration, position, velocity) {
    GameObject.call(this);
    this.setSize(2, 2);
    this.setColor("red");
    this.setPosition(position);
    this.setSpeedX(velocity.getX() + random(-0.5, 0.5) * 3);
    this.setSpeedY(velocity.getY() + random(-0.5, 0.5) * 3);
    this.setExpiration(expiration);
    this.setBoundary(Quick.getBoundary());
  }; Fragment.prototype = Object.create(GameObject.prototype);

  Fragment.prototype.offBoundary = function() { BoundFixer.fix(this) };

  return Fragment;
})();
