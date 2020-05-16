const Objective = require('../src/html'),
      PATH      = require('path'),
      CHOKIDAR  = require('chokidar'),
      FS        = require('fs'),
      Error     = require('../error'),
      CHILD     = require('child_process'),
      CHALK     = require('chalk'),
      CLIUI     = require('cliui')(),
      BOXEN     = require('boxen')

module.exports = {
    name: 'exec',
    desc: 'Execute Objective HTML code.',
    args: '<file>',
    write: (dir, file) => {
        const OBJ  = new Objective()
        OBJ.transpile(dir)
        CHILD.exec(`node ${file.replace('.html', '.js')}`, (error, value, stderr) => {
            if (error) return new Error(`An error occured:\n${error.message}`)
            if (stderr) return new Error(`An error occured when executing program`)
            CLIUI.div({text: ''})
            CLIUI.div({
                text: CHALK.hex('#e32f12')(BOXEN('OBJECTIVE', {padding: {bottom: 0, top: 0, right: 10, left: 10}})),
                width: 50
            })
            CLIUI.div({text: ''})
            CLIUI.div({
                text: CHALK.grey('CODE OUTPUT'),
                width: 50
            })
            CLIUI.div({text: ''})
            CLIUI.div({
                text: value.trim()
            })
            CLIUI.div({text: ''})
            console.log('\n' + CHALK.bgHex('#222222')(BOXEN(CLIUI.toString(), {align: 'center', padding: {bottom: 0, top: 0, right: 15, left: 14}, borderColor: '#222222',backgroundColor:'#222222'})) + '\n')
        })
    },
    exec: function (args, options, dir) {
        const file     = args[args.indexOf(this.name) + 1]
        const file_dir = PATH.resolve(PATH.join(dir, file))
        FS.exists(file_dir, exist => {
            if (exist) {
                if (options.filter(x => x.includes('watch')).length > 0) {
                    CHOKIDAR.watch(file, {
                        ignored: /(.*)\.js/
                    }).on('change', () => {
                        this.write(file_dir, file)
                    })
                } else {
                    this.write(file_dir, file)
                }
            } else {

                return new Error('The file you specified does not exist!')

            }
        })

    }
}