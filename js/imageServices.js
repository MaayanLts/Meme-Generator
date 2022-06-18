'use strict'

var gImgs = [
    { id: 1, url: 'img/1.jpg', keywords: ['trump', 'funny'] },
    { id: 2, url: 'img/2.jpg', keywords: ['puppy', 'sweet'] },
    { id: 3, url: 'img/3.jpg', keywords: ['puppy', 'baby'] },
    { id: 4, url: 'img/4.jpg', keywords: ['cat', 'sleepy'] },
    { id: 5, url: 'img/5.jpg', keywords: ['baby', 'angry', 'sweet'] },
    { id: 6, url: 'img/6.jpg', keywords: [''] },
    { id: 7, url: 'img/7.jpg', keywords: ['baby', 'funny'] },
    { id: 8, url: 'img/8.jpg', keywords: [''] },
    { id: 9, url: 'img/9.jpg', keywords: ['laughing', 'child', 'baby'] },
    { id: 10, url: 'img/10.jpg', keywords: ['laughing', 'obama'] },
    { id: 11, url: 'img/11.jpg', keywords: [''] },
    { id: 12, url: 'img/12.jpg', keywords: ['you'] },
    { id: 13, url: 'img/13.jpg', keywords: ['you', 'listen'] },
    { id: 14, url: 'img/14.jpg', keywords: [''] },
    { id: 15, url: 'img/15.jpg', keywords: [''] },
    { id: 16, url: 'img/16.jpg', keywords: [''] },
    { id: 17, url: 'img/17.jpg', keywords: ['putin'] },
    { id: 18, url: 'img/18.jpg', keywords: [''] }
];

function getImage(imgId){
    return gImgs.find(img => img.id === imgId)
}

