const Objective = require('../src/html'),
      PATH      = require('path'),
      CHOKIDAR  = require('chokidar'),
      FS        = require('fs'),
      Error     = require('../error')

module.exports = {
    name: 'transpile',
    desc: 'Transpile Objective HTML code to Javascript code.',
    args: '[file]',
    write: file => {
        const OBJ  = new Objective(file)
        OBJ.transpile().then(content => {
            for (const i of content) {
                FS.writeFile(PATH.resolve(i[0].replace('.html', '.js')), i[1], error => {
                    if (error) throw error
                })
            }      
        })
    },
    exec: function (args, options, dir) {
        const file = PATH.resolve(PATH.join(dir, args[args.indexOf(this.name) + 1]))

        FS.exists(file, exist => {
            if (exist) {
                if (options.filter(x => x.includes('watch')).length > 0) {
                    CHOKIDAR.watch(PATH.dirname(file), {
                        ignored: /(.*)\.js/
                    }).on('change', () => {
                        this.write(file)
                    })
                } else {
                    this.write(file)
                }
            } else {

                new Error('The file you specified does not exist!')

            }
        })

    }
}