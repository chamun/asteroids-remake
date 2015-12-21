var Scheduler = (function () {
  function Scheduler() {
    GameObject.call(this);
    this.scheduler = []
  }; Scheduler.prototype = Object.create(GameObject.prototype);

  Scheduler.prototype.update = function() {
    this.scheduler
      .filter(function (job) {
        return job.time == this.getScene().getTick()
      }, this)
      .forEach(function (job) {
        job.callback.call(job.thisArg)
      }, this);

    this.scheduler = this.scheduler.filter(function (job) {
      return job.time > this.getScene().getTick()
    }, this);
  };

  Scheduler.prototype.schedule = function(time, callback, thisArg) {
    this.scheduler.push({
      time: this.getScene().getTick() + time,
      callback: callback,
      thisArg: thisArg
    });
  };

  return Scheduler;
})();
