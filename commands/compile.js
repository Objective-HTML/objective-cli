const Objective = require('../src/html'),
      FS        = require('fs'),
      PATH      = require('path'),
      CHOKIDAR  = require('chokidar'),
      COLORS    = require('colors')

module.exports = {
    name: 'compile',
    desc: 'Compile command',
    exec: function (args, dir, options) {

        const file    = args[args.indexOf(this.name) + 1]
        let   dir_obj = ''

        FS.stat(PATH.resolve(PATH.join(dir, file)), (error, stats) => {

            if (error) return console.log(`❌  •  ${COLORS.red('An error occured! (' +  error.message+').')}`)
            dir_obj = PATH.join(dir, file)

            if (stats.isFile()) {
                dir_obj = PATH.dirname(dir_obj)
                const OBJ = new Objective(dir_obj)
                const compile = function () {
                    OBJ.transpile().then(content => {
                        for (const i of content) {
                            FS.writeFile(PATH.resolve(i[0].replace('.html', '.js')), i[1], error => {
                                if (error) return console.log(`❌  •  ${COLORS.red('An error occured! (' +  error.message+').')}`)
                            })
                            
                        }
                    }).then(() => {
                        FS.readFile(PATH.resolve(PATH.join(dir, file.replace('.html', '.js'))), 'UTF-8', (error, content) => {
                            if (error) return console.log(`❌  •  ${COLORS.red('An error occured! (' +  error.message+').')}`)
                            console.log(`✅  •  ${COLORS.gray('Execution of')} ${file}${COLORS.gray(':')}\n`)
                            eval(content)
                            console.log(`\n⏸   •  ${COLORS.gray('Code executed.')}`)
                        })
                    })
                }

                if (options.filter(x => x.includes('watch')).length > 0) {
                    CHOKIDAR.watch(dir_obj, {ignored: /(.*).js/}).on('change', () => {
                        compile()
                    })
                } else {
                    compile()
                }
            } else {
                return console.log(`❌  •  ${COLORS.red('An error occured! (Input must be a file).')}`)
            }
            
        })
    }
}