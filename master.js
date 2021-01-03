var WIDTH, HEIGHT;

var canvas = document.getElementById('canvas'),
    ctx = canvas.getContext('2d');

var requestAnimationFrame = window.requestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.msRequestAnimationFrame;

function init() {
    WIDTH = window.innerWidth;
    HEIGHT = window.innerHeight;

    canvas.setAttribute('width', WIDTH);
    canvas.setAttribute('height', HEIGHT);

    ctx.clearRect(0, 0, WIDTH, HEIGHT);
    ctx.beginPath();
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, WIDTH, HEIGHT);
    ctx.closePath();

    ani();
}

function ani() {


    //requestAnimationFrame(ani);
}

init();