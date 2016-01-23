var Button = (function () {
  function Button(color) {
    GameObject.call(this);
    this.color = color;
  }; Button.prototype = Object.create(GameObject.prototype);

  Button.prototype.update = function() {
    if (isPressed.call(this)) { this.onPush(); }
  };

  Button.prototype.onPush = function() { };

  function isPressed() {
    var pointer = Quick.getPointer();
    if (!pointer.getDown()) return false;

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
