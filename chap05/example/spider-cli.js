import { spider } from './spider.js'

const url = process.argv[2]
const nesting = Number.parseInt(process.argv[3], 10) || 1

console.log(url, nesting);

spider(url, nesting, 3)
  .then(() => console.log('Download completed'))
  .catch(err => console.error(err))