'use strict'

var gImgs = [
    { id: 1, url: 'img/1.jpg', keywords: ['trump', 'funny'] },
    { id: 2, url: 'img/2.jpg', keywords: ['puppy', 'sweet'] },
    { id: 3, url: 'img/3.jpg', keywords: ['puppy', 'baby'] },
    { id: 4, url: 'img/4.jpg', keywords: ['puppy', 'sweet'] },
    { id: 5, url: 'img/5.jpg', keywords: ['puppy', 'sweet'] },
    { id: 6, url: 'img/6.jpg', keywords: ['puppy', 'sweet'] },
    { id: 7, url: 'img/7.jpg', keywords: ['puppy', 'sweet'] },
    { id: 8, url: 'img/8.jpg', keywords: ['puppy', 'sweet'] },
    { id: 9, url: 'img/9.jpg', keywords: ['puppy', 'sweet'] },
    { id: 10, url: 'img/10.jpg', keywords: ['puppy', 'sweet'] },
    { id: 11, url: 'img/11.jpg', keywords: ['puppy', 'sweet'] },
    { id: 12, url: 'img/12.jpg', keywords: ['puppy', 'sweet'] },
    { id: 13, url: 'img/13.jpg', keywords: ['puppy', 'sweet'] },
    { id: 14, url: 'img/14.jpg', keywords: ['puppy', 'sweet'] },
    { id: 15, url: 'img/15.jpg', keywords: ['puppy', 'sweet'] },
    { id: 16, url: 'img/16.jpg', keywords: ['puppy', 'sweet'] },
    { id: 17, url: 'img/17.jpg', keywords: ['puppy', 'sweet'] },
    { id: 18, url: 'img/18.jpg', keywords: ['puppy', 'sweet'] }
];

function getImage(imgId){
    return gImgs.find(img => img.id === imgId)
}

