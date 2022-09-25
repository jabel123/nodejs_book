let promise = new Promise(function(resolve, reject) {
  setTimeout(() => resolve(1), 1000);
});

promise.then(function(result) {
  setTimeout(() => {console.log(result);}, 1000);
   // 1
  return result * 2;
}).then(function(result) {
  setTimeout(() => {console.log(result);}, 1000);
   // 1
  return result * 2;
}).then(function(result) {
  setTimeout(() => {}, 1000);
  console.log(result); // 1
  return result * 2;
});