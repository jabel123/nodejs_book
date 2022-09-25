function delay(millisecond) {
  return new Promise((reslove, reject) => {
    setTimeout(() => {
      reslove(new Date())
    }, millisecond)
  })
}

console.log(`Dealuying... ${new Date().getSeconds()}`)
delay(1000)
  .then(newDate => {
    console.log(`done... ${newDate.getSeconds()}`)
  })

function promisify(callbackBasedApi) {
  return function promisified(...args) {
    return new Promise((resolve, reject) => {
      const newArgs = [
        ...args,
        function(err, result) {
          if (err) {
            return reject(err)
          }
  
          resolve(result)
        }
      ]
    })
  }
}

let f = promisify(function(a, b, c) {
  console.log(a,b,c)
});

f(1, 2)
