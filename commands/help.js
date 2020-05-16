const FS     = require('fs'),
      PATH   = require('path'),
      FIGLET = require('figlet'),
      CHALK  = require('chalk'),
      CLIUI  = require('cliui')(),
      BOXEN  = require('boxen'),
      PCKG   = require('../package.json')

module.exports = {
    name: 'help',
    desc: 'Get Objective CLI help.',
    args: '<command>',
    exec: function (args, options) {
        const command_search = options[0]
        CLIUI.div({
            text: CHALK.hex('#e32f12')(BOXEN(FIGLET.textSync('OBJECTIVE', 'Rectangles'), {padding: {bottom: 1, top: 1, right: 5, left: 5}, align: 'center'})),
            width: 70,
            align: 'center'
        })
        CLIUI.div({text: ''})
        CLIUI.div({
            text: 'Author: ' + PCKG.author,
            align: 'center',
            width: 70
        })
        CLIUI.div({
            text: 'Version: ' + PCKG.version,
            align: 'center',
            width: 70
        })
        CLIUI.div({text: ''})
        CLIUI.div({
            text: 'Commands:',
            padding: [0, 0, 0, 5],
            width: 20
        },
        {
            text: 'Arguments:',
            width: 15
        },
        {
            text: 'Description:',
            width: 35
        })
        CLIUI.div({text: ''})
        new Promise ((resolve, reject) => {
            FS.readdir(PATH.resolve(PATH.join(__dirname, '..', 'commands')), (error, content) => {
                if (error) throw error
                let counter = 0
                for (const command of content) {
                    const app = require(PATH.resolve(PATH.join(__dirname, '..', 'commands', command)))
                    if (command_search) {
                        if (app.name === command_search.replace(/-/g, '')) {
                            CLIUI.div({
                                text: '• ' + CHALK.hex('#dddddd')(app.name),
                                width: 20,
                                align: 'left',
                                padding: [0, 0, 0, 5]
                           },
                           {
                                text: CHALK.greenBright(app.args),
                                width: 15
                           },
                           {
                                text: CHALK.hex('#b5b5b5')(app.desc),
                                width: 35,
                                align: 'left'
                           })
                        }
                    } else {
                        CLIUI.div({
                            text: '• ' + CHALK.hex('#dddddd')(app.name),
                            width: 20,
                            align: 'left',
                            padding: [0, 0, 0, 5]
                       },
                       {
                            text: CHALK.greenBright(app.args),
                            width: 15
                       },
                       {
                            text: CHALK.hex('#b5b5b5')(app.desc),
                            width: 35,
                            align: 'left'
                       })
                    }
                    ++counter
                    if (counter === content.length) resolve()
                }
            })
        }).then(() => {
            CLIUI.div({text: ''})
            console.log(CLIUI.toString())
        })
        
    }
}