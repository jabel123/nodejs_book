async function playingWithDelays() {
  console.log('Delaying...', new Date())

  const dateAfterOneSecond = await delay(1000)
  console.log(dateAfterOneSecond)

  const dateAfterThreeSecond = await delay(3000)
  console.log(dateAfterThreeSecond)
  return 'done'
}

function delay(second) {
  setTimeout(() => console.log(second, '가 지낫습니다'), second)
  return second
}

playingWithDelays()
  .then(result => {
    console.log(`After 4 seconds: ${result}`)
  })