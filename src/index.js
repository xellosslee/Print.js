import './sass/index.scss'
import print from './js/init'
import Json from './js/json'

const printJS = print.init
printJS.jsonToHTML = Json.jsonToHTML

if (typeof window !== 'undefined') {
  window.printJS = printJS
}

export default printJS
