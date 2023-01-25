export default class Timer {
  constructor(time) {
    this.base = new Date(time ?? Date.now());
  }
  reset(time) {
    return (this.base = new Date(time ?? Date.now()));
  }
  timing(time) {
    this.time = new Date(time ?? Date.now());
    const isCountdown = this.time < this.base,
      ms = isCountdown ? this.base - this.time : this.time - this.base,
      sec = ms / 1000,
      min = sec / 60,
      hour = min / 60,
      day = hour / 24;
    return {
      days: Math.floor(day),
      hours: Math.floor(hour % 24),
      minutes: Math.floor(min % 60),
      seconds: Math.floor(sec % 60),
      milliseconds: ms % 1000,
      isCountdown,
    };
  }
}
