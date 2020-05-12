#!/usr/bin/env node
/*//////////////////////////////
         OBJECTIVE HTML
              Main
//////////////////////////////*/

const FS   = require('fs'),
      PATH = require('path')

class CLI {

     constructor (process) {

          this.process = process
          this.argv    = process.argv.slice(2)
          this.dir     = process.cwd()
          this.args    = this.argv.filter(x => !x.match(/\-(.*)/g))
          this.options = this.argv.filter(x => x.match(/\-(.*)/g))
          
          this.cmds    = []

     }

     async register () {

          return new Promise ((resolve, reject) => {
               FS.readdir(PATH.resolve(PATH.join(__dirname, 'commands')), (error, content) => {
                    if (error) return console.log(`❌  •  ${COLORS.red('An error occured! (' + error.message +').')}`)
                    for (const i of content) {
                         const app = require(PATH.resolve(PATH.join(__dirname, 'commands', i)))
                         this.cmds.push({
                              name        : app.name,
                              description : app.desc,
                              exec        : app.exec 
                         })
                         if (this.cmds.length === content.length) resolve(this.cmds)
                    }
               })
          })

     }

     async run () {

          await this.register()

          for (const argument of this.args) {
               for (const command of this.cmds) {
                    if (argument.toLowerCase() === command.name) {
                         command.exec(this.args, this.dir, this.options)
                    }
               }
          }


     }

}

const Exec = new CLI(process)

Exec.run()