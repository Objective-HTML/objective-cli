/*//////////////////////////////
         OBJECTIVE HTML
              File
//////////////////////////////*/

const GLOB = require('glob')

module.exports = class File {

    constructor (dir) {
        this.dir = dir
    }

    filewalker () {
        return new Promise ((resolve, reject) => {
            GLOB(this.dir + '/**/*.html', (error, files) => {
                if (error) reject(error)
                resolve(files)
            })
        })
    }

}
