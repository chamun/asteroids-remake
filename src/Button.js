var Button = (function () {
  function Button(color) {
    GameObject.call(this);
    this.color = color;
  }; Button.prototype = Object.create(GameObject.prototype);

  Button.prototype.update = function() {
    if (is.call(this, "Down")) { this.onDown(); }
    if (is.call(this, "Push")) { this.onPush(); }
  };

  Button.prototype.onPush = function() { };
  Button.prototype.onDown = function() { };

  function is(state) {
    var pointer = Quick.getPointer();
    if (!pointer["get" + state]()) return false;

    var pointerPosition = pointer.getPosition();
    return isPointInside.call(this, pointerPosition);
  };

  function isPointInside(point) {
    return point.getX() >= this.getLeft() &&
           point.getX() <= this.getRight() &&
           point.getY() <= this.getBottom() &&
           point.getY() >= this.getTop();
  }

  return Button;
})();
