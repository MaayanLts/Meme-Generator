
'use strict'

function getRandomString(length = 6) {
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    //const possible = '0123456789'
    var txt = ''
    for (var i = 0; i < length; i++) {
        txt += possible.charAt()
    }

    return txt
}

function getRandomRandomIndex(possibleLength){
    return Math.floor(Math.random() * possibleLength)
}