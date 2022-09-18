import fs from 'fs'
import path from 'path';

function listNestedFiles(dir, cb) {
  fs.readdir(dir, {withFileTypes: true,}, (err, files) => {
    files.forEach((value, idx, arr) => {
      if (value.isDirectory()) {
        let mypath = path.resolve(dir + '/' + value.name)
        console.log(mypath);
        listNestedFiles(dir + '/' + value.name, cb)
      }
    })
  })
};

listNestedFiles('..', () => console.log('hi'));