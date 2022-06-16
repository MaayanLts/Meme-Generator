'use strict'
var gCanvas
var gCtx
var gCurrImage

function onLoad() {
    renderGallery()
    memeContainer().style.display = 'none'

    gCanvas = canvas()
    gCtx = gCanvas.getContext('2d')

    addEventListeners()
}

function addEventListeners() {
    [...document.querySelectorAll(".meme-edit")].forEach( el => 
        el.addEventListener('contextmenu', e => e.preventDefault())
    );

    memeTextEditor().addEventListener('input', drawImageOnCanvas)
    document.querySelector('.meme-edit.upDown').addEventListener('mousedown', moveTextUpDown) 
    //document.querySelector('.meme-edit.add').addEventListener('click', addNewTextArea) 
    //document.querySelector('.meme-edit.trash').addEventListener('click', deleteTextArea) 

    document.querySelector('.meme-edit.font-increase').addEventListener('click', increaseTextFont) 
    document.querySelector('.meme-edit.font-decrease').addEventListener('click', decreaseTextFont) 
    document.querySelector('.meme-edit.align-to-left').addEventListener('click', alignTextToLeft) 
    document.querySelector('.meme-edit.align-to-center').addEventListener('click', alignTextToCenter) 
    document.querySelector('.meme-edit.align-to-right').addEventListener('click', alignTextToRight) 
    //document.querySelector('.meme-edit .impact').addEventListener('click', impact) 
    // document.querySelector('.meme-edit .text-stroke').addEventListener('click', changeTextFontFamily) 
    document.querySelector('.meme-edit.paint').addEventListener('click', openTextColorEditor) 
    colorEditor().addEventListener('input', changeTextColor) 
    // document.querySelector('.meme-edit .btn-share').addEventListener('click', shareMeme) 
}

function preventDefault(){
    ev.preventDefault()
}

function onGoToGallery(elm) {
    galleryContainer().style.display = ''
    memeContainer().style.display = 'none'

    setMenuActiveItem(elm)
}

function onGoToMemeGallery(elm) {
    galleryContainer().style.display = 'none'
    memeContainer().style.display = 'none'

    setMenuActiveItem(elm)
}

function onImageClick(imgId) {
    gCurrImage = getImage(imgId)
    sendImageToMemeEditor()

    galleryContainer().style.display = 'none'
    searchContainer().style.display = 'none'
    memeContainer().style.display = 'flex'

    setMenuActiveItem()
}

function sendImageToMemeEditor(){
    gCurrMeme.selectedImgId = gCurrImage.id
    gCanvas = document.querySelector('canvas')
    gCtx = gCanvas.getContext('2d')

    drawImageOnCanvas()
}

function drawImageOnCanvas(){
    var canvasImg = new Image()
    canvasImg.src = gCurrImage.url
    canvasImg.onload = () => {
        gCtx.drawImage(canvasImg, 0, 0, gCanvas.width, gCanvas.height) 
        updateTextAreaOnCanvas()
    }
}

function updateTextAreaOnCanvas() {
    const text = memeTextEditor().value
    const currentTextStyle = gCurrMeme.lines[gCurrMeme.selectedLineIdx]
    currentTextStyle.text = text
    const x = canvasCenter()
    const y = currentTextStyle.y
    gCtx.lineWidth = 1;
    gCtx.textAlign = currentTextStyle.align
    gCtx.strokeStyle = currentTextStyle.color
    gCtx.fillStyle = currentTextStyle.color
    gCtx.font = currentTextStyle.fontSize + 'px ' + currentTextStyle.fontFamily
    gCtx.strokeText(text, x, y);
}

function canvasCenter(){
    const x = Math.floor(canvas().width / 2)
    return x
}

function setTextAreaOnCanvas() {
    const x = canvas().getBoundingClientRect().top + 20;
    const y = canvas().getBoundingClientRect().left + 20;

    gCtx.beginPath();
    gCtx.rect(x, y, 150, 150);
    gCtx.fillStyle = 'orange';
    gCtx.fillRect(x, y, 150, 150);
    gCtx.strokeStyle = 'black';
    gCtx.stroke();
}

function renderGallery() {
    let gridHtml = ''
    gImgs.forEach(img => gridHtml += `<img class='gallery' src="./img/${img.id}.jpg" alt="" onclick='onImageClick(${img.id})'>`)

    galleryContainer().innerHTML = gridHtml
}

function setMenuActiveItem(elm) {
    let menuItems = document.querySelectorAll('.nav-bar a')
    menuItems.forEach(item => item.classList.remove("active"))

    if (elm) {
        elm.classList.add("active")
    }
}

function moveTextUpDown(ev){
    if(ev.which == 3){
        gCurrMeme.lines[gCurrMeme.selectedLineIdx].y -= 5 //Move up
    }else{
        gCurrMeme.lines[gCurrMeme.selectedLineIdx].y += 5 //Move down
    }

    drawImageOnCanvas()
}

function increaseTextFont() {
    gCurrMeme.lines[gCurrMeme.selectedLineIdx].fontSize += 1
    drawImageOnCanvas()
}

function decreaseTextFont() {
    gCurrMeme.lines[gCurrMeme.selectedLineIdx].fontSize -= 1
    drawImageOnCanvas()
}

function alignTextToLeft() {
    gCurrMeme.lines[gCurrMeme.selectedLineIdx].align = 'right'
    drawImageOnCanvas()
}

function alignTextToCenter() {
    gCurrMeme.lines[gCurrMeme.selectedLineIdx].align = 'center'
    drawImageOnCanvas()
}

function alignTextToRight() {
    gCurrMeme.lines[gCurrMeme.selectedLineIdx].align = 'left'
    drawImageOnCanvas()
}

//document.querySelector('.meme-edit .impact').addEventListener('click', impact) 
function changeTextFontFamily(inputId) {

}

function changeTextColor() {
    gCurrMeme.lines[gCurrMeme.selectedLineIdx].color = this.value
    drawImageOnCanvas()
}

function openTextColorEditor(){
    colorEditor().click()
}

function shareMeme() {

}

function galleryContainer() {
    return document.querySelector('.gallery-container')
}

function searchContainer() {
    return document.querySelector('.search-container')
}

function memeContainer() {
    return document.querySelector('.meme-container')
}

function canvas() {
    return document.querySelector(".meme-container .canvas") //?????
}

function memeTextEditor() {
    return document.querySelector('.meme-edit.text-editor') //??
}

function memeText() {
    return document.querySelector(".memeText")
}

function colorEditor(){
    return document.querySelector('.meme-edit.color')
}