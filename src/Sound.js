var Sound = (function () {
  var mute = false;

  return {
    toggleSound: function () {
      mute = !mute;
    },
    play: function (id) {
      if (!mute) {
        Quick.play(id);
      }
    }
  };
})();
