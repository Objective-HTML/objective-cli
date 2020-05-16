/*//////////////////////////////
         OBJECTIVE HTML
              Main
//////////////////////////////*/

const Transpiler = require('./core/transpiler'),
      Parser     = require('./core/parser'),
      FS         = require('fs'),
      PATH       = require('path')

const files = []

module.exports = class Objective {
     
     transpile () {
          function readFile (file) {
               const content = FS.readFileSync(PATH.resolve(PATH.join(__dirname, file)), 'UTF-8')
               files.push(file)
               for (const item of new Parser(content).parse()) {
                    if (item.type === 'START' && item.block === 'import') {
                         for (const param of item.params) {
                              if (param.name === 'src') {
                                   readFile(PATH.dirname(file) + '/' + param.value + '.html')
                              }
                         }
                    }
               }
          }
          
          readFile('tests/html/math.html')
          
          for (const file of new Transpiler(files.reverse()).transpile()) FS.writeFileSync(path.resolve(path.join(file[0].replace('.html', '.js'))), file[1])

     }

}

new Objective().transpile()