var MuteButton = (function () {
  function MuteButton() {
    Button.call(this, "sound", "sound-pressed");

    this.on = false;
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

  return MuteButton;
})();
