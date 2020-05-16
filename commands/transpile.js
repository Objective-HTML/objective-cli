const Objective = require('../src/html'),
      PATH      = require('path'),
      CHOKIDAR  = require('chokidar'),
      FS        = require('fs'),
      Error     = require('../error'),
      CHALK     = require('chalk'),
      CLIUI     = require('cliui')(),
      BOXEN     = require('boxen')

module.exports = {
    name: 'transpile',
    desc: 'Transpile Objective HTML code to Javascript code.',
    args: '[file]',
    write: file => {
        const OBJ  = new Objective()
        OBJ.transpile(file)
        
        CLIUI.div({text: ''})
        CLIUI.div({
            text: BOXEN(CHALK.hex('#e32f12')('OBJECTIVE'), {padding: {left: 10, right: 10}, borderColor: '#e32f12'})
        })
        CLIUI.div({text: ''})
        CLIUI.div({
            text: CHALK.grey('FILE TRANSPILED')
        })
        CLIUI.div({text: ''})
        console.log('\n' + BOXEN(CLIUI.toString(), {padding: {left: 6, right: 7}, align: 'center'}) + '\n')
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
                        this.write(file)
                    })
                } else {
                    this.write(file)
                }
            } else {

                return new Error('The file you specified does not exist!')

            }
        })

    }
}