const CHALK     = require('chalk'),
      CLIUI     = require('cliui')(),
      BOXEN     = require('boxen')
module.exports = class {

    constructor (message = '') {
        CLIUI.div({text: ''})
        CLIUI.div({
            text: CHALK.hex('#e32f12')(BOXEN('OBJECTIVE', {padding: {bottom: 0, top: 0, right: 10, left: 10}}))
        })
        CLIUI.div({text: ''})
        CLIUI.div({
            text: CHALK.gray('ERROR'),
            width: 70
        })
        CLIUI.div({
            text: CHALK.white(message),
            width: 70
        })
        CLIUI.div({text: ''})

        console.log('\n' + CHALK.hex('#ffffff')(BOXEN(CLIUI.toString(), {align: 'center', padding: {left: 5, right: 5}})) + '\n')
    }

}