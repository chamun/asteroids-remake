var MuteButton = (function () {
  var SIZE = 40;

  function MuteButton() {
    Button.call(this, "sound", "sound-pressed");

    this.on = false;
    this.setSize(SIZE, SIZE);
  }; MuteButton.prototype = Object.create(Button.prototype);

  MuteButton.prototype.onPush = function() {
    this.on = !this.on;
    if(this.on) {
      this.image = "no-sound"
      this.imagePressed = "no-sound-pressed"
    } else {
      this.image = "sound"
      this.imagePressed = "sound-pressed"
    }
    Sound.toggleSound();
  };

  MuteButton.prototype.setImageId = function(imageId) {
    GameObject.prototype.setImageId.call(this, imageId);
    this.setSize(SIZE, SIZE);
  };

  return MuteButton;
})();
