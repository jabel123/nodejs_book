
import { EventEmitter } from 'events'
import { readFile } from 'fs'
import { nextTick } from 'process'

// 연습문제 3.1
class FindRegex extends EventEmitter {
  constructor(regex) {
    super()
    this.regex = regex
    this.files = []
  }

  addFile(file) {
    console.log('addfile', file);
    this.files.push(file)
    return this
  }

  find() {  
    nextTick(() => this.emit("start", this.files))
    
    for (const file of this.files) {
      readFile(file, 'utf-8', (err, content) => {
        if (err) {
          return this.emit('error', err);
        }

        this.emit('fileread', file)

        const match = content.match(this.regex)
        if (match) {
          match.forEach(elem => this.emit('found', file, elem))
        }
      })
    }
    console.log("start");
    
    return this
  }
}

const findRegexInstance = new FindRegex(/name/)
findRegexInstance
  .addFile('fileA.txt')
  .addFile('fileB.json')  
  .on('found', (file, match) => console.log(`Matched ${match} in file ${file}`))
  .on('error', err => console.error(`Error emitted ${err.message}`))
  .on('start', () => console.log('start'))
  .addFile('fileC.txt')  
  .find();