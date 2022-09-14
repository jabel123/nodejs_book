import { EventEmitter } from 'events'

// 연습문제 3.2, 3.3, 3.4
function fn(milliSecond, callback) {
  var emitter = new EventEmitter();

  process.nextTick(() => emitter.emit("tick", 'tick2'))
  recursion(milliSecond, emitter, 1, callback);

  return emitter;
}

function recursion(number, emitter, ticks, callback) {
  if (number < 0) {
    if (Date.now() % 5 == 0) {
      var error = new Error('error is occured');
      return callback(error, ticks);
    } else {
      return callback(error, ticks);
    }
  }
  

  setTimeout(() => {
    emitter.emit('tick', 'tick');
    return recursion(number - 50, emitter, ticks + 1, callback)
  }, 50)
}


fn(1000, (err, count) => {
  if (err) {
    console.error(err);
  }
  console.log(count)
})
  .on('tick', (tick) => console.log(tick));