'use strict'
var gCanvas
var gCtx
var gDrawTextRect 

function onLoad() {
    loadMemesFromStorage()
    renderImagesGallery()
    memeContainer().style.display = 'none'
    aboutSection().style.display = 'none'

    addEventListeners()

    gCanvas = document.querySelector(".meme-container-canvas")
    gCtx = gCanvas.getContext('2d')
}

function toggleMenu(elBtn) {
    document.body.classList.toggle('menu-open');
    document.body.classList.contains('menu-open') ? elBtn.innerText = 'X' : elBtn.innerText = '☰';
}

function renderImagesGallery() {
    let gridHtml = ''
    const keyWord = document.querySelector('.search-input').value
    let imgs = gImgs

    if(keyWord){
        imgs = imgs.filter(img => img.keywords.includes(keyWord))
    }

    imgs.forEach(img => gridHtml += `<img class='gallery' src="./img/${img.id}.jpg" alt="" onclick='onImageClick(${img.id})'>`)

    imagesGalleryContainer().innerHTML = gridHtml
}

function renderMemesGallery() {
    const memeGallery = memesGalleryContainer()
    let gridHtml = ''

    gMemes.forEach(meme => gridHtml += `<div class='meme-gallery-item'><canvas data-meme-id = '${meme.id}' onclick="onMemeClick('${meme.id}')"></canvas></div>`)

    memeGallery.innerHTML = gridHtml
    memeGallery.querySelectorAll('.meme-gallery-item canvas').forEach(elmCanvas => drawMemeInGallery(elmCanvas))
}

function drawMemeInGallery(elmCanvas){
    const ctx = elmCanvas.getContext('2d') 
    const meme = getMeme(elmCanvas.dataset.memeId)
    gDrawTextRect = false
    drawItemOnCanvas(elmCanvas, ctx,  meme)
}

function addEventListeners() { 
    //Main menu items click
    document.querySelector('.menu.image-gallery').addEventListener('click', onGoToImageGallery)
    document.querySelector('.menu.meme-gallery').addEventListener('click', onGoToMemeGallery)
    document.querySelector('.menu.about').addEventListener('click', onGoToAbout)

    document.querySelector('.search-input').addEventListener('input', filterImagesByKeyWords)
    //Prevent default on all editor buttons
    document.querySelectorAll(".meme-edit").forEach(el =>
        el.addEventListener('contextmenu', e => e.preventDefault())
    );

    memeTextEditor().addEventListener('input', updateTextValue)
    document.querySelector('.meme-edit.up').addEventListener('click', goToPreviousTextLine)
    document.querySelector('.meme-edit.down').addEventListener('click', goToNextTextLine)
    document.querySelector('.meme-edit.upDown').addEventListener('mousedown', moveTextUpDown)
    document.querySelector('.meme-edit.add').addEventListener('click', addNewTextArea)
    document.querySelector('.meme-edit.trash').addEventListener('click', deleteTextArea)
    document.querySelector('.meme-edit.font-increase').addEventListener('click', increaseTextFont)
    document.querySelector('.meme-edit.font-decrease').addEventListener('click', decreaseTextFont)
    document.querySelector('.meme-edit.align-to-left').addEventListener('click', alignTextToLeft)
    document.querySelector('.meme-edit.align-to-center').addEventListener('click', alignTextToCenter)
    document.querySelector('.meme-edit.align-to-right').addEventListener('click', alignTextToRight)
    //document.querySelector('.meme-edit.impact').addEventListener('click', impact)
    document.querySelector('.meme-edit.text-stroke').addEventListener('click', openStrokeColorEditor)
    strokeColorEditor().addEventListener('input', changeStrokeColor)
    document.querySelector('.meme-edit.paint').addEventListener('click', openTextColorEditor)
    textColorEditor().addEventListener('input', changeTextColor)
    document.querySelector('.meme-edit.btn-action.save').addEventListener('click', saveMeme)
    document.querySelector('.meme-edit.btn-action.delete').addEventListener('click', deleteMeme)
}

function filterImagesByKeyWords(){
    autoFill
    renderImagesGallery() 
}

function onGoToAbout() {
    clearCurrentMemeData()
    synchronizeMemeAndEditorText()

    imagesGalleryContainer().style.display = 'none'
    memesGalleryContainer().style.display = 'none'
    memeContainer().style.display = 'none'
    aboutSection().style.display = ''
    searchContainer().style.display = 'none'

    setMenuActiveItem(this)
}

function onGoToImageGallery() {
    clearCurrentMemeData()
    synchronizeMemeAndEditorText()

    imagesGalleryContainer().style.display = ''
    memesGalleryContainer().style.display = 'none'
    memeContainer().style.display = 'none'
    aboutSection().style.display = 'none'
    searchContainer().style.display = ''

    setMenuActiveItem(this)
}

function onGoToMemeGallery() {
    clearCurrentMemeData()
    synchronizeMemeAndEditorText()

    renderMemesGallery()

    imagesGalleryContainer().style.display = 'none'
    memesGalleryContainer().style.display = ''
    memeContainer().style.display = 'none'
    aboutSection().style.display = 'none'
    searchContainer().style.display = 'none'

    setMenuActiveItem(this)
}

function onMemeClick(memeId) {
    gCurrMeme = Object.assign({}, getMeme(memeId))

    displayRelevantElements()

    openEditor()

    synchronizeMemeAndEditorText()
    memeTextEditor().focus()
}

function onImageClick(imgId) {
    const img = getImage(imgId)
    gCurrMeme.selectedImgId = img.id
    gCurrMeme.url = img.url

    displayRelevantElements()

    openEditor()

    synchronizeMemeAndEditorText()
    memeTextEditor().focus()
}

function displayRelevantElements(){
    imagesGalleryContainer().style.display = 'none'
    memesGalleryContainer().style.display = 'none'
    memeContainer().style.display = 'flex'
    searchContainer().style.display = 'none'
    setMenuActiveItem()
}

function openEditor() {
    const canvasContainer = document.querySelector('.meme-container-canvas-container')
    gCanvas.width = canvasContainer.clientWidth
    gCanvas.height = canvasContainer.clientHeight
 
    gDrawTextRect = true
    drawItemOnCanvas()
}

function drawItemOnCanvas(canvas = gCanvas, ctx = gCtx, meme = gCurrMeme) {
    var canvasImg = new Image()
    canvasImg.src = meme.url
    
    canvasImg.onload = () => {
        ctx.beginPath()
        ctx.drawImage(canvasImg, 0, 0, canvas.width, canvas.height)
        updateTextAreaOnCanvas(canvas, ctx, meme)
    }
}

function updateTextAreaOnCanvas(canvas, ctx, meme) {
    meme.lines.forEach(line => drawText(canvas, ctx, line))
}

function drawText(canvas, ctx, currentLine) {
    const x = canvasCenterOnX(canvas)
    const y = currentLine.y
    const text = currentLine.text ? currentLine.text : ''
    
    ctx.lineWidth = 1;
    ctx.textAlign = currentLine.align
    ctx.strokeStyle = currentLine.strokeStyle
    ctx.fillStyle = currentLine.color
    ctx.font = currentLine.fontSize + 'px Arial Narrow' 
    ctx.beginPath()
    ctx.fillText(text, x, y);
    ctx.strokeText(text, x, y);

    if(gDrawTextRect)
        setTextBorder(canvas, ctx, y, currentLine.fontSize)
}

function setTextBorder(canvas, ctx, y, fontSize) {
    ctx.beginPath();

    const rectX = 50
    const rectY = (y - fontSize) 
    const rectHeight = fontSize + 12
    const rectWidth = canvas.width - 100
    ctx.lineWidth = 1;
    ctx.rect(rectX, rectY, rectWidth, rectHeight)
    ctx.strokeStyle = 'black';
    ctx.stroke();
}

function canvasCenterOnX(canvas) {
    const x = Math.floor(canvas.width / 2)
    return x
}

function canvasCenterOnY(canvas) {
    const y = Math.floor(canvas.height / 2)
    return y
}

function setMenuActiveItem(elm) {
    let menuItems = document.querySelectorAll('.menu a')
    menuItems.forEach(item => item.classList.remove("active"))

    if (elm) {
        const elmRef = elm.querySelector('a')
        if (elmRef) {
            elmRef.classList.add("active")
        }
    }
}

function updateTextValue() {
    gCurrMeme.lines[gCurrMeme.selectedLineIdx].text = this.value
    drawItemOnCanvas()
}

function goToPreviousTextLine() {
    if (gCurrMeme.selectedLineIdx === 0) {
        gCurrMeme.selectedLineIdx = gCurrMeme.lines.length - 1
    }
    else {
        gCurrMeme.selectedLineIdx -= 1
    }

    synchronizeMemeAndEditorText()
}

function goToNextTextLine() {
    if (gCurrMeme.lines.length === gCurrMeme.selectedLineIdx + 1) {
        gCurrMeme.selectedLineIdx = 0
    } else {
        gCurrMeme.selectedLineIdx += 1
    }

    synchronizeMemeAndEditorText()
}

function synchronizeMemeAndEditorText() {
    const editor = memeTextEditor()
    const line = gCurrMeme.lines[gCurrMeme.selectedLineIdx]
    editor.value = line.text
}

function moveTextUpDown(ev) {
    if (ev.which == 3) {
        gCurrMeme.lines[gCurrMeme.selectedLineIdx].y -= 5 //Move up
    } else {
        gCurrMeme.lines[gCurrMeme.selectedLineIdx].y += 5 //Move down
    }

    drawItemOnCanvas()
}

function addNewTextArea() {
    addEmptyLineToMemeEditor()

    const selectedLine = gCurrMeme.lines[gCurrMeme.selectedLineIdx]
    if (gCurrMeme.lines.length == 2) {
        //Add second text to the buttom
        selectedLine.y = gCanvas.height - 20
    } else {
        //Add all other texts to the middle
        selectedLine.y = canvasCenterOnY(gCanvas)
    }

    const editor = memeTextEditor()
    editor.value = ''
    editor.focus()

    drawItemOnCanvas()
}

function deleteTextArea() {
    const indx = gCurrMeme.selectedLineIdx
    //delete line from lines array
    gCurrMeme.lines.splice(indx, 1)

    if (gCurrMeme.lines.length === 0) {
        addEmptyLineToMemeEditor()
        gCurrMeme.selectedLineIdx = 0
    }

    goToPreviousTextLine()
    synchronizeMemeAndEditorText()
    drawItemOnCanvas()
}

function increaseTextFont() {
    gCurrMeme.lines[gCurrMeme.selectedLineIdx].fontSize += 1
    drawItemOnCanvas()
}

function decreaseTextFont() {
    gCurrMeme.lines[gCurrMeme.selectedLineIdx].fontSize -= 1
    drawItemOnCanvas()
}

function alignTextToLeft() {
    gCurrMeme.lines[gCurrMeme.selectedLineIdx].align = 'right'
    drawItemOnCanvas()
}

function alignTextToCenter() {
    gCurrMeme.lines[gCurrMeme.selectedLineIdx].align = 'center'
    drawItemOnCanvas()
}

function alignTextToRight() {
    gCurrMeme.lines[gCurrMeme.selectedLineIdx].align = 'left'
    drawItemOnCanvas()
}

function impact() {
    
}

function changeTextColor() {
    gCurrMeme.lines[gCurrMeme.selectedLineIdx].color = this.value
    drawItemOnCanvas()
}

function changeStrokeColor(){
    gCurrMeme.lines[gCurrMeme.selectedLineIdx].strokeStyle = this.value
    drawItemOnCanvas()
}

function openTextColorEditor() {
    textColorEditor().click() 
}

function openStrokeColorEditor() {
    strokeColorEditor().click() 
}

function saveMeme() {
    const memeIndex = getMemeIndex(gCurrMeme.id)
    if(memeIndex > -1){
        //Update existing 
        gMemes[memeIndex] = gCurrMeme
    }else{
        //Add new meme
        gCurrMeme.id = createMemeId()
        gMemes.push(gCurrMeme)
    }

    saveMemesToStorage()
    clearCurrentMemeData()
    onGoToMemeGallery()
}

function deleteMeme(){
    const memeIndex = getMemeIndex(gCurrMeme.id)
    if(memeIndex > -1){
        gMemes.splice(memeIndex, 1)
    }

    saveMemesToStorage()
    clearCurrentMemeData()
    onGoToMemeGallery()
}

function imagesGalleryContainer() {
    return document.querySelector('.gallery-container.images')
}

function memesGalleryContainer() {
    return document.querySelector('.gallery-container.memes')
}

function aboutSection(){
    return document.querySelector('about')
}

function searchContainer() {
    return document.querySelector('.search-container')
}

function memeContainer() {
    return document.querySelector('.meme-container')
}

function memeTextEditor() {
    return document.querySelector('.meme-edit.text-editor')
}

function memeText() {
    return document.querySelector(".memeText")
}

function textColorEditor() {
    return document.querySelector('.meme-edit.text-color')
}

function strokeColorEditor() {
    return document.querySelector('.meme-edit.stroke-color')
}