import fs from 'fs'
import path from 'path'
import superagent from 'superagent'
import mkdirp from 'mkdirp'
import { urlToFilename } from './utils.js'

export function spider(url, cb) {
  const filename = urlToFilename(url);
  fs.access(filename, err => {
    
    if (err && err.code === 'ENOENT') {
      console.log(`Downloading ${url} into ${filename}`);
      superagent.get(url).end((err, res) => {
        console.log('hi')
        if (err) {
          console.log('hi2')
          cb(err)
        } else {
          console.log('hi3')
          console.log(filename);
          console.log(path.dirname(filename).split('/')[1])
          fs.mkdirSync(path.dirname(filename), { recursive: true });
          fs.writeFile(filename, res.text, err => {
            if (err) {
              console.log('hi5')
              cb(err)
            } else {
              cb(null, filename, true)
            }
          })
        }
      })
    } else {
      cb(null, filename, false)
    }
  })
}