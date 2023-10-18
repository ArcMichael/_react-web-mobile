/*
 * @Author: leo.si
 * @Date: 2019-08-01 11:39:19
 * @Last Modified by: murphy.meng
 * @Last Modified time: 2021-07-21 16:10:27
 * @function window.requestAnimationFrame
 * The window.requestAnimationFrame() method tells the browser that you wish to perform an animation and requests that the browser call a specified function to update an animation before the next repaint. The method takes a callback as an argument to be invoked before the repaint.
 * @params fn ==> function
 * @params id ==> Number
 * 一个定时器的写法案例
 *  let animationFrame = new AnimationFrame()
    let a = 0;
    let id  = animationFrame.callRequestAnimationFrame(function fn(){
      if(a==5){
        animationFrame.callCancelAnimationFrame(id)
      }else{
        id = animationFrame.callRequestAnimationFrame(fn)
      }
      console.log('a------',a)
      a++;
    })
*/

class AnimationFrame {
  callRequestAnimationFrame(fn = function () {}) {
    return this.redefinitionRequestAnimationFrame(fn);
  }

  callCancelAnimationFrame(id) {
    return this.redefinitionCancelAnimationFrame(id);
  }

  redefinitionRequestAnimationFrame(fn) {
    if (window.requestAnimationFrame) {
      return window.requestAnimationFrame(fn);
    }
    if (window.webkitRequestAnimationFrame) {
      return window.webkitRequestAnimationFrame(fn);
    }
    if (window.mozRequestAnimationFrame) {
      return window.mozRequestAnimationFrame(fn);
    }
    return function (fn) {
      window.setTimeout(fn, 1e3 / 60, new Date().getTime())();
    };
  }

  redefinitionCancelAnimationFrame(id) {
    if (window.cancelAnimationFrame) {
      return window.cancelAnimationFrame(id);
    }
    if (window.webkitCancelAnimationFrame) {
      return window.webkitCancelAnimationFrame(id);
    }
    if (window.mozCancelAnimationFrame) {
      return window.mozCancelAnimationFrame(id);
    }
    return (function (id) {
      clearTimeout(id);
    })();
  }

  redefinitionSetInterval() {
    const that = this;
    return {
      intervalTimer: null,
      setInterval(cb, interval) {
        const now = Date.now;
        let stime = now();
        let etime = stime;
        const loop = () => {
          this.intervalTimer = that.redefinitionRequestAnimationFrame(loop);
          etime = now();
          if (etime - stime >= interval) {
            stime = now();
            etime = stime;
            cb();
          }
        };
        this.intervalTimer = that.redefinitionRequestAnimationFrame(loop);
        return this.intervalTimer;
      },
    };
  }

  redefinitionSetTimeout() {
    const that = this;
    return {
      timeoutTimer: null,
      setTimeout(cb, interval) {
        const now = Date.now;
        const stime = now();
        let etime = stime;
        const loop = () => {
          this.timeoutTimer = that.redefinitionRequestAnimationFrame(loop);
          etime = now();
          if (etime - stime >= interval) {
            cb();
            that.redefinitionCancelAnimationFrame(this.timeoutTimer);
          }
        };
        this.timeoutTimer = that.redefinitionRequestAnimationFrame(loop);
        return this.timeoutTimer;
      },
    };
  }
}

export default AnimationFrame;
