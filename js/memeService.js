'use strict'

var gMemes = []
var gCurrMeme = _creteNewMeme()
var MEMES = 'MEMES'

function loadMemesFromStorage(){
    const memes = loadFromStorage(MEMES)
    if(memes)
        gMemes = memes
}

function saveMemesToStorage(){
    saveToStorage(MEMES, gMemes)
}

function addEmptyLineToMemeEditor(){
    gCurrMeme.lines.push(_createNewLine())
    gCurrMeme.selectedLineIdx = gCurrMeme.lines.length - 1
}

function _creteNewMeme(){
    return {
        id: 0,
        selectedImgId: 0,
        url: '',
        selectedLineIdx: 0,
        lines: [
            _createNewLine()
        ]
    }
}

function _createNewLine(){
    return{
        text: '',
        fontSize: 30,
        align: 'center',
        color: 'black',
        strokeStyle: 'black',
        //fontFamily: 'Montserrat',
        y: 50
    }
}

function clearCurrentMemeData(){
    gCurrMeme = null 
    gCurrMeme = _creteNewMeme()
}

function getMemeIndex(memeId){
    const index = gMemes.findIndex(meme => meme.id === memeId)
    return index
}

function getMeme(memeId) {
    return gMemes.find(meme => meme.id === memeId)
}

function createMemeId(){
    return getMemeId()
}
