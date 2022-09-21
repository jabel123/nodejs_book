import fs, { mkdir, promises as fsPromises } from 'fs'
import { dirname } from 'path'
import superagent from 'superagent'
import { urlToFilename, getPageLinks } from '../../chap04/example/utils.js'
import { promisify } from 'util'
import { TaskQueue } from './task-queue.js'

export function spider(url, nesting, concurrency) {
  const queue = new TaskQueue(concurrency)
  return spiderTask(url, nesting, queue)
}

function spiderLinks(currentUrl, body, nesting) {
  let promise = Promise.resolve()
  if (nesting === 0) {
    return promise
  }

  const links = getPageLinks(currentUrl, body)
  const promises = links.map(link => spider(link, nesting - 1))
  console.log(promises)

  return Promise.all(promises)
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
}

const spidering = new Set()
function spiderTask(url, nesting, queue) {
  if (spidering.has(url)) {
    console.log('end', spidering)
    return Promise.resolve()
  }
  spidering.add(url)

  const filename = urlToFilename(url)

  return queue.runTask(() => {
    return fsPromises
            .readFile(filename, 'utf-8')
            .catch(err => {
                console.log('error info', err)
                if (err.code !== 'ENOENT') {
                  throw err
                }
                // 파일이 없다면 다운로드합니다.
                return download(url, filename)
              })
            })
            .then(content => {
              console.log('spider link')
              spiderLinks(url, content, nesting, queue)
            })
}