#!/usr/bin/env node
/*//////////////////////////////
         OBJECTIVE HTML
              Main
//////////////////////////////*/

const FS     = require('fs'),
      PATH   = require('path'),
      FIGLET = require('figlet'),
      CHALK  = require('chalk'),
      CLIUI  = require('cliui')(),
      BOXEN  = require('boxen'),
      PCKG   = require('./package.json')

class CLI {

     constructor (process) {

          this.process = process
          this.argv    = process.argv.slice(2)
          this.dir     = process.cwd()
          this.args    = this.argv.filter(x => !x.match(/\-(.*)/g))
          this.options = this.argv.filter(x => x.match(/\-(.*)/g))

     }

     run () {

          if (this.args.length > 0) {

               FS.readdir(PATH.resolve(PATH.join(__dirname, 'commands')), (error, content) => {
                    if (error) throw error
                    for (const i of content) {
                         const app = require(PATH.resolve(PATH.join(__dirname, 'commands', i)))
                         
                         if (this.args.includes(app.name)) {
                              app.exec()
                         }

                    }
               })

          } else {
               
               CLIUI.div(
               {
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
               new Promise ((resolve, reject) => {
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
                    FS.readdir(PATH.resolve(PATH.join(__dirname, 'commands')), (error, content) => {
                         if (error) throw error
                         let counter = 0
                         for (const command of content) {
                              const app = require(PATH.resolve(PATH.join(__dirname, 'commands', command)))
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


}

const Exec = new CLI(process)

Exec.run()