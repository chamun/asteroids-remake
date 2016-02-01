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

    if(!isPointInside.call(this, ct.pageX, ct.pageY)) return;

    this.identifier = ct.identifier;
    this.pressed = true;
  };

  Button.prototype.touchend = function(event) {
    var touch = getTouchById(event, this.identifier)
    if (touch != null) { resetState.call(this); }
  };

  Button.prototype.onPush = function() { };
  Button.prototype.onDown = function() { };

  Button.prototype.setImageId = function(imageId) {
    if (imageId != undefined) {
      GameObject.prototype.setImageId.call(this, imageId);
    }
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
