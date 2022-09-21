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