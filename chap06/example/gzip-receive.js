import { createServer } from 'http'
import { createWriteStream } from 'fs'
import { createGunzip } from 'zlib'
import { basename, join } from 'path'

const server = createServer((req, res) => {
  const filename = basename(req.headers['x-filename'])
  console.log('filename ->', filename)
  const destFilename = join('./received_files', filename)
  console.log(`File request received: ${filename}`)
  console.log('destfilename ->', destFilename)
  req
    .pipe(createGunzip())
    .pipe(createWriteStream(destFilename))
    .on('finish', () => {
      res.writeHead(201, { 'Content-Type': 'text/plain'})
      res.end('OK\n')
      console.log(`File saved: ${destFilename}`)
    })
    .on('error', err => {
      console.error(err.stack)
    })
})

server.listen(3000, () => console.log('Listening on http://localhost:3000'))