import fs from 'fs'
import path from 'path'

function concatFiles(dest, cb, ...srcFile) {
  fs.mkdirSync(dest, { recursive: true });

  var result = '';
  for (var i = 0; i < srcFile.length; i++) {
    var basename = path.basename(srcFile[i]);
    result += basename;
  }
  
  var resultData = '';
  for (var i = 0; i < srcFile.length; i++) {
    resultData += fs.readFileSync(srcFile[i], {encoding: 'utf-8'}) + '\n';
  }

  fs.writeFile(dest + path.delimiter + result, resultData, err => {
    if (err) {
      console.log(err);
    }
  });
}

concatFiles('./dest', () => console.log('hi'), './test1.txt', './test2.txt')