var Background = (function () {
  function Background() {
    GameObject.call(this);
    this.setSize(Quick.getWidth(), Quick.getHeight());
    this.setColor("Black");
  }; Background.prototype = Object.create(GameObject.prototype);

  return Background;
})();
