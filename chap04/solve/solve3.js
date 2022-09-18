import fs from 'fs'
import path from 'path'

function recursiveFind(dir, keyword, cb) {
  fs.readdir(dir, {withFileTypes: true,}, (err, files) => {
    files.forEach((value, idx, arr) => {
      if (value.isDirectory()) {        
        recursiveFind(dir + '/' + value.name, keyword, cb)
      } else {
        let file = fs.readFileSync(dir + '/' + value.name, {encoding: 'utf-8'});
        if (file.includes(keyword)) {
          let mypath = path.resolve(dir + '/' + value.name)
          console.log(mypath);
        }
      }
    })
  })
};

recursiveFind('..', 'aaa', 'hello');