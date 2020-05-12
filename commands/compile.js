const Objective = require('../src/html'),
      FS        = require('fs'),
      PATH      = require('path')

module.exports = {
    name: 'compile',
    desc: 'Compile command',
    exec: function (args, dir, options) {
        const file    = args[args.indexOf(this.name) + 1]
        let   dir_obj = ''
        FS.stat(PATH.resolve(PATH.join(dir, file)), (error, stats) => {
            if (error) throw error
            dir_obj = PATH.join(dir, file)
            if (stats.isFile()) dir_obj = PATH.dirname(dir_obj)
            const OBJ = new Objective(dir_obj)
            const transpile = function () {
                OBJ.transpile().then(content => {
                    for (const i of content) {  
                        FS.writeFile(PATH.resolve(i[0].replace('.html', '.js')), i[1], error => {
                            if (error) throw error
                            console.log(i[0].slice(dir.length, i[0].length).replace(/\\/g, '/t'))
                        })
                    }
                })
            }
            if (options.filter(x => x.includes('watch')).length > 0) {
                FS.watch(dir_obj, (event, filename) => {
                    if (filename.endsWith('.html')) {
                        transpile()
                    }
                })
            } else {
                transpile()
            }
        })
    }
}