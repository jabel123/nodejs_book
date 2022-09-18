import fs, { link } from 'fs'
import path from 'path'
import superagent from 'superagent'
import mkdirp from 'mkdirp'
import { urlToFilename, getPageLinks } from './utils.js'
import { request } from 'http'

export function spider(url, nesting, cb) {
  const filename = urlToFilename(url);
  fs.readFile(filename, 'utf-8', (err, fileContent) => {
    if (err) {
      if (err.code !== 'ENOENT') {
        return cb(err);
      }

      return download(url, filename, (err, requestContent) => {
        if (err) {
          return cb(err) 
        }

        spiderLinks(url, requestContent, nesting, cb)
      })
    }

    spiderLinks(url, fileContent, nesting, cb)
  })
}

function spiderLinks(currentUrl, body, nesting, cb) {
  if (nesting === 0) {
    return process.nextTick(cb)
  }

  const links = getPageLinks(currentUrl, body)
  if (links.length === 0) {
    return process.nextTick(cb);
  }

  let completed = 0;
  let hasErrors = false

  function done(err) {
    if (err) {
      hasErrors = true
      return cb(err)
    }
    if (++completed === links.length && !hasErrors) {
      return cb()
    }
  }

  links.forEach(link => spider(link, nesting - 1, done));
}

function download(url, filename, cb) {
  console.log(`Downloading ${url} into ${filename}`)
  superagent.get(url).end((err, res) => {
    if (err) {
      cb(err)
    } else {
      saveFile(filename, res, cb)
    }
  })
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
