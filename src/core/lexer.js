/*//////////////////////////////
         OBJECTIVE HTML
             Lexer
//////////////////////////////*/

module.exports = class Lexer {

    constructor (content = '') {

        this.posX    = 0
        this.status  = 'NONE'
        this.content = content
        this.index   = 0

    }

    lexer () {

        if (this.content.length < 1) throw new Error('File content cannot be empty!')

        const inline_code = this.content.split(/\r?\n/g)
                                        .map(x => x.trim())
                                        .filter(x => x !== '')
                                        .join('')
        const code_status = new Map()

        for (const i in inline_code) {
            if (this.status === 'BLOCK_VARIABLE_END') this.status = 'NONE'
            if (this.status === 'BLOCK_END') this.status = 'BLOCK_VALUE'
            if (this.status === 'BLOCK_START') this.status = 'BLOCK_CONTENT'
            if ((this.status !== 'BLOCK_CONTENT' || this.status !==  'BLOCK_START') && inline_code[i] === '<') this.status = 'BLOCK_START'
            if (this.status === 'BLOCK_CONTENT' && inline_code[i] === '>') this.status = 'BLOCK_END'
            if (this.status === 'BLOCK_VALUE' && inline_code[i] !== '{') this.status = 'BLOCK_TEXT'
            if ((this.status === 'BLOCK_VALUE' && this.status !== 'BLOCK_TEXT') && inline_code[i] === '{') this.status = 'BLOCK_VARIABLE'
            if (this.status === 'BLOCK_VARIABLE' && inline_code[i] === '}' ) this.status = 'BLOCK_VARIABLE_END'
            code_status.set(inline_code[i] + ' | ' + i, this.status)
        }

        return code_status

    }

}