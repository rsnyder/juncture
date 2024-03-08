class EventBus {
    events: {[key: string]: any};
  
    constructor() {
      this.events = {};
    }
  
    on(imageSelected: string, fn?: any) {
      this.events[imageSelected] = this.events[imageSelected] || [];
      this.events[imageSelected].push(fn);
    }
  
    off(imageSelected: string, fn?: any) {
      if (this.events[imageSelected]) {
        for (let i = 0; i < this.events[imageSelected].length; i++) {
          if (this.events[imageSelected][i] === fn) {
            this.events[imageSelected].splice(i, 1);
            break;
          }
        }
      }
    }
  
    emit(imageSelected: string, data?: any) {
      if (this.events[imageSelected]) {
        this.events[imageSelected].forEach(function (fn: any) {
          fn(data);
        })
      }
    }
  }
  
  export default new EventBus();