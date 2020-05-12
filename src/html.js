/*//////////////////////////////
         OBJECTIVE HTML
              Main
//////////////////////////////*/

const Transpiler = require('./core/transpiler')
const File       = require('./core/file')
const FS         = require('fs')
const PATH       = require('path')

module.exports = class Objective {

     constructor (input) {

          this.input = input

     }
 
     transpile () {
          return new Promise ((resolve, reject) => {
               let file = this.input
               FS.stat(this.input, (error, status) => {
                    if (error) throw error
                    if (status.isFile()) file = PATH.dirname(this.input)
                    const code = new Map()
                    new File(file).filewalker((error, files) => {
                         if (error) throw error
                         for (const i of files) {
                              if (i.endsWith('.html')) {
                                   FS.readFile(i, 'UTF-8', (error, content) => {
                                        if (error) throw error
                                        code.set(i, new Transpiler(content).transpile())
                                        if (code.size === files.length) resolve(code)
                                   })
                              } else FS.unlink(i, () => {files.splice(files[files.indexOf(i)], 1)})
                         }
                    })
               })

          })

     }

}
