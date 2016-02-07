var FullscreenButton = (function () {
  function FullscreenButton(image, imagePressed) {
    Button.call(this, image, imagePressed);
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
