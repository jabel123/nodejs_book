function delay(milliseconds) {
  return new Promise((resolve, reject) => {
    setInterval(() => {
      resolve(new Date())
    }, milliseconds);
  })
}

delay(1000)
  .then(newDate => {
    console.log(`Delaying... then ${newDate.getSeconds()}s`)
  })


function promisify(callbackBasedApi) {
  return function promisified(...args) {
    return new Promise((resolve, reject) => {
      const newArgs = [
        ...args,
        function (err, result) {
          if (err) {
            return reject(err)
          }

          resolve(result)
        }
      ]
      callbackBasedApi(...newArgs)
    })
  }
}