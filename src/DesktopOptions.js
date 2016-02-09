var DesktopOptions = (function () {
  var OPTIONS = 2;

  function DesktopOptions(scene) {
    var play = new GameObject();
    play.setImageId("play");
    play.setCenterX(Quick.getCenterX());
    play.setTop(400);
    scene.add(play);

    var about = new GameObject();
    about.setImageId("about");
    about.setCenterX(Quick.getCenterX());
    about.setTop(play.getBottom() + 30);
    scene.add(about);

    this.options = [
      { button: play, name: "play"},
      { button: about, name: "about"}
    ];
    this.selectorIndex = 0;

    this.selector = new GameObject();
    this.selector.setImageId("selector");
    this.selector.setCenterY(play.getCenterY());
    this.selector.setRight(play.getLeft() - 20);
    scene.add(this.selector);
  };

  DesktopOptions.prototype.next = function() {
    selectorUp.call(this);
  };

  DesktopOptions.prototype.previous = function() {
    selectorDown.call(this);
  };

  DesktopOptions.prototype.getOption = function() {
    return this.options[this.selectorIndex].name;
  };

  function selectorUp() {
    this.selectorIndex = (this.selectorIndex + 1) % OPTIONS;
    placeSelector.call(this);
  }

  function selectorDown() {
    this.selectorIndex -= 1;
    if (this.selectorIndex < 0) {
      this.selectorIndex = OPTIONS - 1;
    }
    placeSelector.call(this);
  }

  function placeSelector() {
    var option = this.options[this.selectorIndex].button;
    this.selector.setCenterY(option.getCenterY());
    this.selector.setRight(option.getLeft() - 20);
  }

  return DesktopOptions;
})();
