import fs, { mkdir, promises as fsPromises } from 'fs'
import { dirname } from 'path'
import superagent from 'superagent'
import { urlToFilename, getPageLinks } from '../../chap04/example/utils.js'
import { promisify } from 'util'

export function spider(url, nesting) {
  const filename = urlToFilename(url);
  return fsPromises.readFile(filename, 'utf-8')
            .catch((err) => {
              if (err.code !== 'ENOENT') {
                throw err
              }
              return download(url, filename)
            })  
            .then(content => spiderLinks(url, content, nesting))
}

function spiderLinks(currentUrl, body, nesting) {
  let promise = Promise.resolve()
  if (nesting === 0) {
    return promise
  }

  const links = getPageLinks(currentUrl, body)
  for (const link of links) {
    promise = promise.then(() => spider(link, nesting - 1))
  }

  return promise
}

function download(url, filename) {
  console.log(`Downloading ${url} into ${filename}`)
  let content;
  return superagent.get(url)
      .then((res) => {
        content = res.text
        return mkdir(dirname(filename), {recursive: true}, err => {
          if (err) {
            throw new Error('error is occured');
          }
        })        
      })
      .then(() => fsPromises.writeFile(filename, content))
      .then(() => {
        console.log(`Downloaded and saved: ${url}`)
        return content;
      })

  // superagent.get(url).end((err, res) => {
  //   if (err) {
  //     cb(err)
  //   } else {
  //     saveFile(filename, res, cb)
  //   }
  // })
}

function saveFile(filename, res, cb) {
  fs.mkdirSync(path.dirname(filename), { recursive: true })
  fs.writeFile(filename, res.text, err => {
    if (err) {
      cb(err)
    } else {
      cb(null, filename, true)
    }
  })
}
