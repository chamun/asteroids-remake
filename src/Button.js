var Button = (function () {
  function Button(image, imagePressed) {
    GameObject.call(this);

    this.image = image;
    this.imagePressed = imagePressed;
  }; Button.prototype = Object.create(GameObject.prototype);

  Button.prototype.update = function() {
    var isUp = true;

    if (is.call(this, "Down")) {
      isUp = false;
      this.onDown();
    }

    if (is.call(this, "Push")) {
      isUp = false;
      this.onPush();
    }

    if (isUp) {
      this.setImageId(this.image);
    } else {
      this.setImageId(this.imagePressed);
    }
  };

  Button.prototype.onPush = function() { };
  Button.prototype.onDown = function() { };

  Button.prototype.setImageId = function(imageId) {
    if (imageId != undefined) {
      GameObject.prototype.setImageId.call(this, imageId);
    }
  };

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
