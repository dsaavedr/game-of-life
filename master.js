let cells = [],
    dirty = false,
    CELL = 20,
    cutoff = 0.5,
    n = 0,
    int = 100,
    last = -1,
    interval = null,
    started = false,
    BG = "#000",
    SIZE,
    WIDTH,
    HEIGHT;

let sizeSlider, speedSlider;

addChecks();

const canvas = document.getElementById("canvas"),
    ctx = canvas.getContext("2d");

const requestAnimationFrame =
    window.requestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.msRequestAnimationFrame;

WIDTH = window.innerWidth;
HEIGHT = window.innerHeight;

if (WIDTH > HEIGHT) {
    n = Math.floor(HEIGHT / CELL);
    HEIGHT = n * CELL;
    WIDTH = HEIGHT;
} else {
    n = Math.floor(WIDTH / CELL);
    WIDTH = n * CELL;
    HEIGHT = WIDTH;
}

canvas.setAttribute("width", WIDTH);
canvas.setAttribute("height", HEIGHT);

ctx.clearRect(0, 0, WIDTH, HEIGHT);
ctx.beginPath();
ctx.fillStyle = BG;
ctx.fillRect(0, 0, WIDTH, HEIGHT);
ctx.closePath();

ctx.strokeStyle = "#ddd";
ctx.lineWidth = 0.8;
ctx.fillStyle = "#f0f";
// ctx.fillStyle = "darkorchid";
// ctx.fillStyle = "#F0F";
//ctx.fillStyle = "#444";
ctx.font = "10px arial";

// Populate canvas with dead cells

for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
        cells.push(
            new Cell(
                {
                    x: j * CELL,
                    y: i * CELL
                },
                false
            )
        );
        cells[cells.length - 1].draw();
    }
}

let mouseDownID = null;

canvas.addEventListener("mousedown", e => {
    if (!started) {
        dirty = true;

        document.onmousemove = whilemousedown;
    }
});

const whilemousedown = e => {
    if (e.path[0].id == "canvas") {
        let x = floor(e.layerX / CELL) * CELL;
        let y = floor(e.layerY / CELL) * CELL;
        for (let i = 0; i < cells.length; i++) {
            let c = cells[i];
            if (c.pos.x == x && c.pos.y == y) {
                // if (last != i) {
                //     c.live = !c.live;
                // }
                c.live = true;
                last = i;
                break;
            }
        }
        ctx.save();
        ctx.fillStyle = BG;
        ctx.fillRect(0, 0, WIDTH, HEIGHT);
        ctx.restore();
        gun = [];
        for (let i = 0; i < cells.length; i++) {
            cells[i].draw();
        }
    }
};

canvas.addEventListener("mouseup", e => {
    document.onmousemove = null;
});

canvas.addEventListener("click", e => {
    if (!started) {
        dirty = true;
        // Top corner of cell
        let x = floor(e.layerX / CELL) * CELL;
        let y = floor(e.layerY / CELL) * CELL;

        // Set cell to live

        for (let i = 0; i < cells.length; i++) {
            let c = cells[i];
            if (c.pos.x == x && c.pos.y == y) {
                if (last != i) {
                    c.live = !c.live;
                }
                break;
            }
        }

        ctx.save();
        ctx.fillStyle = BG;
        ctx.fillRect(0, 0, WIDTH, HEIGHT);
        ctx.restore();
        gun = [];
        for (let i = 0; i < cells.length; i++) {
            cells[i].draw();
        }
        last = -1;
    }
});

document.getElementById("start").addEventListener("click", e => {
    if (started) {
        if (interval) {
            clearInterval(interval);
            interval = null;
        } else {
            interval = setInterval(ani, int);
        }
    } else {
        started = true;
        init();
        interval = setInterval(ani, int);
    }
});

function init() {
    if (!dirty) {
        for (let i = 0; i < cells.length; i++) {
            if (random() < cutoff) {
                cells[i].live = false;
            } else {
                cells[i].live = true;
            }
        }
    }

    document.getElementById("stop").addEventListener("click", e => {
        started = false;
        dirty = false;
        clearInterval(interval);
        ctx.save();
        ctx.fillStyle = BG;
        ctx.fillRect(0, 0, WIDTH, HEIGHT);
        ctx.restore();
        for (c of cells) {
            c.live = false;
            c.draw();
        }
    });
}

function ani() {
    ctx.save();
    ctx.fillStyle = BG;
    ctx.fillRect(0, 0, WIDTH, HEIGHT);
    ctx.restore();

    for (let i = 0; i < cells.length; i++) {
        let c = cells[i];
        let count = 0;
        c.draw(false);

        let x = c.pos.x / CELL;
        let y = c.pos.y / CELL;

        let t = "";

        // Count live neighbours

        for (let a = -1; a < 2; a++) {
            for (let b = -1; b < 2; b++) {
                let xn = x + b;
                let yn = y + a;

                if (a != 0 || b != 0) {
                    if (xn > -1 && xn < n) {
                        if (yn > -1 && yn < n) {
                            let idx = IX(xn, yn, n);
                            count += cells[idx].live ? 1 : 0;
                            t += idx + ",";
                        }
                    }
                }
            }
        }

        //ctx.strokeText(t, c.pos.x, c.pos.y + 10);
        //ctx.strokeText(i, c.pos.x, c.pos.y + 30);
        //ctx.strokeText(count, c.pos.x, c.pos.y + 50);

        /*
        Any live cell with two or three live neighbours survives.
        Any dead cell with three live neighbours becomes a live cell.
        All other live cells die in the next generation. Similarly, all other dead cells stay dead.
        */
        if (c.live) {
            if (count == 2 || count == 3) {
                c.breathe();
            } else {
                c.die();
            }
        } else {
            if (count == 3) {
                c.breathe();
            } else {
                c.die();
            }
        }
    }

    for (let i = 0; i < cells.length; i++) {
        cells[i].update();
    }
}

function openNav() {
    var inputs = document.getElementById("inputs");
    inputs.style.width = "250px";
    inputs.style.paddingLeft = "25px";
    document.getElementById("openBtn").style.opacity = 0;
}

function closeNav() {
    var inputs = document.getElementById("inputs");
    inputs.style.width = "0";
    inputs.style.paddingLeft = "0";
    document.getElementById("openBtn").style.opacity = 1;
}

function addChecks() {
    sizeSlider = document.getElementById("size");
    sizeSlider.value = CELL;
    speedSlider = document.getElementById("speed");
    speedSlider.value = 1000 - int;

    speedSlider.addEventListener("change", () => {
        int = 1000 - speedSlider.value;
        if (started) {
            log(int);
            clearInterval(interval);
            interval = setInterval(ani, int);
        }
    });

    sizeSlider.addEventListener("change", () => {
        /* if (!started) {
            const { value } = sizeSlider;

            if (value < CELL) {
                
            }
        } */
    });
}
