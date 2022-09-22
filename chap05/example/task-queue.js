export class TaskQueue {
  constructor (concurrency) {
    this.concurrency = concurrency
    this.running = 0
    this.queue = []
  }

  runTask (task) {
    return new Promise((resolve, reject) => {
      this.queue.push(() => {
        return task().then(resolve, reject)
      })
      process.nextTick(this.next.bind(this))
    })
  }

  next () {
    while (this.running < this.concurrency && this.queue.length) {
      const task = this.queue.shift()
      task().finally(() => {
        this.running--
        this.next()
      })
      this.running++
    }
  }
}

export class TaskQueuePC {
  constructor(concurrency) {
    this.taskQueue = []
    this.consumerQueue = []

    // 소비자를 생성
    for (let i = 0; i < concurrency; i++) {
      this.consumer()
    }
  }

  async consumer() {
    while (true) {
      try {
        const task = await this.geNextTask()
        await task()
      } catch (err) {
        console.error(err)
      }
    }
  }

  async getNextTask() {
    return new Promise((resolve) => {
      if (this.taskQueue.length !== 0) {
        return resolve(this.taskQueue.shift())
      }

      this.consumerQueue.push(resolve)
    })
  }

  runTask(task) {
    return new Promise((resolve, reject) => {
      const taskWrapper = () => {
        const taskPromise = task()
        taskPromise.then(resolve, reject)
        return taskPromise
      }

      if (this.consumerQueue.length !== 0) {
        const consumer = this.consumerQueue.shift()
        consumer(taskWrapper)
      } else {
        this.taskQueue.push(taskWrapper)
      }
    })
  }
}