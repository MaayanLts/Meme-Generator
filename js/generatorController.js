'use strict'
var gCanvas
var gCtx
var gItemForEdit

function onLoad() {
    renderImagesGallery()
    memeContainer().style.display = 'none'

    gCanvas = canvas()
    gCtx = gCanvas.getContext('2d')

    addEventListeners()
}

function renderImagesGallery() {
    let gridHtml = ''
    gImgs.forEach(img => gridHtml += `<img class='gallery' src="./img/${img.id}.jpg" alt="" onclick='onImageClick(${img.id})'>`)

    imagesGalleryContainer().innerHTML = gridHtml
}

function renderMemesGallery() {
    const memeGallery = memesGalleryContainer()
    let gridHtml = ''

    gMemes.forEach(meme => gridHtml += `<div><canvas lass='gallery'  data-meme-id = '${meme.id}' onclick="onMemeClick('${meme.id}')"></canvas></div>`)

    memeGallery.innerHTML = gridHtml
    memeGallery.querySelectorAll('canvas').forEach(elmCanvas => drawMemeInGallery(elmCanvas))
}

function drawMemeInGallery(elmCanvas){
    const ctx = elmCanvas.getContext('2d') 
    const meme = getMeme(elmCanvas.dataset.memeId)
    drawItemOnCanvas(ctx, meme)
}

function addEventListeners() {
    //Main menu items click
    document.querySelector('.menu.image-gallery').addEventListener('click', onGoToImageGallery)
    document.querySelector('.menu.meme-gallery').addEventListener('click', onGoToMemeGallery)
    document.querySelector('.menu.about').addEventListener('click', onGoToAbout)

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
    document.querySelector('.meme-edit.impact').addEventListener('click', impact)
    document.querySelector('.meme-edit.text-stroke').addEventListener('click', changeTextFontFamily)
    document.querySelector('.meme-edit.paint').addEventListener('click', openTextColorEditor)
    colorEditor().addEventListener('input', changeTextColor)
    document.querySelector('.meme-edit.btn-save').addEventListener('click', saveMeme)
}

function onGoToAbout() {
    clearCurrentMemeData()
    synchronizeMemeAndEditorText()

    imagesGalleryContainer().style.display = 'none'
    memesGalleryContainer().style.display = 'none'
    memeContainer().style.display = 'none'

    setMenuActiveItem(this)
}

function onGoToImageGallery() {
    clearCurrentMemeData()
    synchronizeMemeAndEditorText()

    imagesGalleryContainer().style.display = ''
    memesGalleryContainer().style.display = 'none'
    memeContainer().style.display = 'none'

    setMenuActiveItem(this)
}

function onGoToMemeGallery() {
    clearCurrentMemeData()
    synchronizeMemeAndEditorText()

    renderMemesGallery()

    imagesGalleryContainer().style.display = 'none'
    memesGalleryContainer().style.display = ''
    memeContainer().style.display = 'none'

    setMenuActiveItem(this)
}

function onMemeClick(memeId) {
    gCurrMeme = Object.assign({}, getMeme(memeId))
    openEditor()
    synchronizeMemeAndEditorText()
    memeTextEditor().focus()
}

function onImageClick(imgId) {
    const img = getImage(imgId)
    gCurrMeme.selectedImgId = img.id
    gCurrMeme.url = img.url

    openEditor()
}

function openEditor() {
    gCanvas = document.querySelector('canvas')
   // gCtx = gCanvas.getContext('2d') 
    gCtx.clearRect(0, 0, gCanvas.width, gCanvas.height);
    
    drawItemOnCanvas()

    //Display relevant elements
    imagesGalleryContainer().style.display = 'none'
    memesGalleryContainer().style.display = 'none'
    memeContainer().style.display = 'flex'
    searchContainer().style.display = 'none'

    setMenuActiveItem()
}

function drawItemOnCanvas(ctx = gCtx, meme = gCurrMeme) {
    var canvasImg = new Image()
    canvasImg.src = meme.url
    
    canvasImg.onload = () => {
        ctx.drawImage(canvasImg, 0, 0, gCanvas.width, gCanvas.height)
        updateTextAreaOnCanvas(ctx, meme)
    }
}

function updateTextAreaOnCanvas(ctx, meme) {
    //const currentLine = meme.lines[meme.selectedLineIdx]
    meme.lines.forEach(line => drawText(ctx, line))
}

function drawText(ctx, currentLine) {
    const x = canvasCenterOnX()
    const y = currentLine.y
    const text = currentLine.text ? currentLine.text : ''
    ctx.lineWidth = 1;
    ctx.textAlign = currentLine.align
    ctx.strokeStyle = currentLine.color
    ctx.fillStyle = currentLine.color
    ctx.font = currentLine.fontSize + 'px ' + currentLine.fontFamily
    ctx.strokeText(text, x, y);

    //setTextBorder(currentLine)
}

function setTextBorder(currentLine) {
    const x = canvas().getBoundingClientRect().top + 20;
    const y = canvas().getBoundingClientRect().left + 20;

    gCtx.beginPath();
    gCtx.rect(x, y, 150, 150);
    gCtx.fillStyle = 'orange';
    gCtx.fillRect(x, y, 150, 150);
    gCtx.strokeStyle = 'black';
    gCtx.stroke();
}

function canvasCenterOnX() {
    const x = Math.floor(canvas().width / 2)
    return x
}

function canvasCenterOnY() {
    const y = Math.floor(canvas().height / 2)
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
    editor.style.color = line.color
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
        //Add second line to the buttom
        selectedLine.y = canvas().height - 20
    } else {
        //Add all other lines to the middle
        selectedLine.y = canvasCenterOnY()
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

function changeTextFontFamily(inputId) {

}

function changeTextColor() {
    gCurrMeme.lines[gCurrMeme.selectedLineIdx].color = this.value
    drawItemOnCanvas()
}

function openTextColorEditor() {
    colorEditor().click()
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

    clearCurrentMemeData()
    onGoToMemeGallery()
}

function imagesGalleryContainer() {
    return document.querySelector('.gallery-container.images')
}

function memesGalleryContainer() {
    return document.querySelector('.gallery-container.memes')
}

function searchContainer() {
    return document.querySelector('.search-container')
}

function memeContainer() {
    return document.querySelector('.meme-container')
}

function canvas() {
    return document.querySelector(".meme-container.canvas")
}

function memeTextEditor() {
    return document.querySelector('.meme-edit.text-editor')
}

function memeText() {
    return document.querySelector(".memeText")
}

function colorEditor() {
    return document.querySelector('.meme-edit.color')
}