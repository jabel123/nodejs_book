import path from 'path'
import { URL } from 'url'
import slug from 'slug'

export function urlToFilename (url) {
  const parsedUrl = new URL(url)

  console.log(parsedUrl);
  const urlPath = parsedUrl.pathname.split('/')  
    .filter(function (component) {
      console.log('fileter', component);
      return component !== ''
    })
    .map(function (component) {
      console.log('map', component);
      return slug(component, { remove: null })
    })
    .join('/');
  
  console.log('filepath: ', urlPath)
  let filename = path.join(parsedUrl.hostname, urlPath)
  if (!path.extname(filename).match(/htm/)) {
    filename += '.html'
  }

  return filename
}