"use strict";

function main() {
  Quick.setKeepAspect(true);
  Quick.setName("Asteroids Remake");
  Quick.init(function () { return new Scene(); });
}
