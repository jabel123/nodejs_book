function leakingLoop() {
  return delay(1)
    .then(() => {
      console.log(`Tick ${Date.now()}`)
      return leakingLoop()
    })
}

async function delay(time) {
  setTimeout(() => {}, 1000 * time)
}

for (let i = 0; i  < 1e6; i++) {
  leakingLoop()
}