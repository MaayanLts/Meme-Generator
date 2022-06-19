'use strict'

var MEMES = 'MEMES'
var memeSentences = [
    'I never eat falafel',
    'DOMS DOMS EVERYWHERE',
    'Stop Using i in for loops',
    'Armed in knowledge',
    'Js error "Unexpected String"',
    'One does not simply write js',
    'I`m a simple man i see vanilla JS, i click like!',
    'JS, HTML,CSS?? Even my momma can do that',
    'May the force be with you',
    'I know JS',
    'JS Where everything is made up and the rules dont matter',
    'Not sure if im good at programming or good at googling',
    'But if we could',
    'JS what is this?',
    'Write hello world , add to cv 7 years experienced'
  ]

var gMemes = []
var gCurrMeme = _creteNewMeme()

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
        text: _getRandomSentence(),
        fontSize: 40,
        align: 'center',
        color: 'white',
        strokeStyle: 'black',
        fontFamily: 'Montserrat',
        y: 50
    }
}

function _getRandomSentence(){
    const index = getRandomRandomIndex(memeSentences.length)
    return memeSentences[index]
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
    return getRandomString()
}
