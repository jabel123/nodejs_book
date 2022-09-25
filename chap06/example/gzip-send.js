import { request } from 'http'
import { createGzip } from 'zlib'
import { createReadStream } from 'fs'
import { basename } from 'path'
import { createCipheriv, randomBytes } from 'crypto' // 먼저 crypto 모듈에서 createSipheriv() transform 스트림과 randomBytes() 함수를 임포트합니다.

const filename = process.argv[2]
const serverHost = process.argv[3]
const secret = Buffer.from(process.argv[4], 'hex')
const iv = randomBytes(16)

const httpRequestOptions = {
  hostname: serverHost,
  port: 3000,
  path: '/',
  method: 'PUT',
  headers: {
    'Content-Type': 'application/octet-stream',
    'Content-Encoding': 'gzip',
    'X-Filename': basename(filename),
    'X-Initialization-Vector': iv.toString('hex') // 초기화 벡터를 HTTP 헤더로 서버에 전달합니다.
  }
}

const req = request(httpRequestOptions, (res) => {
  console.log(`Server response: ${res.statusCode}`)
})

createReadStream(filename)
  .pipe(createGzip())
  .pipe(createCipheriv('aes192', secret, iv))
  .pipe(req)  // Gzip 단계 이후 데이터를 암호화합니다.
  .on('finish', () => {
    console.log('File successfully sent')
  })