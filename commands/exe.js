const Objective = require('../src/html'),
      PATH      = require('path'),
      CHOKIDAR  = require('chokidar'),
      FS        = require('fs'),
      Error     = require('../error'),
      CHALK     = require('chalk'),
      CLIUI     = require('cliui')(),
      BOXEN     = require('boxen'),
      pkg  = require('pkg')

module.exports = {
    name: 'exe',
    desc: 'compile Objective HTML code to EXE file.',
    args: '<file>',
    write: (file, exact_file) => {
        const OBJ   = new Objective()
        const files = OBJ.transpile(file)
        pkg.exec([exact_file.replace('.html', '.js'), '--out-path', PATH.join(PATH.dirname(exact_file), 'build')])
    },
    exec: function (args, options, dir) {
        const file = PATH.resolve(PATH.join(args[args.indexOf(this.name) + 1]))
        console.log(file)
        FS.exists(file, exist => {
            if (exist) {
                if (options.filter(x => x.includes('watch')).length > 0) {
                    CHOKIDAR.watch(file, {
                        ignored: /(.*)\.js/
                    }).on('change', () => {
                        this.write(file, args[args.indexOf(this.name) + 1])
                    })
                } else {
                    this.write(file, args[args.indexOf(this.name) + 1])
                }
            } else {

                return new Error('The file you specified does not exist!')

            }
        })

    }
}