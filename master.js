let cells = [],
    dirty = false,
    CELL = 20,
    cutoff = 0.6,
    n = 0,
    int = 250,
    interval = null,
    started = false,
    BG = "#dff",
    SIZE,
    WIDTH,
    HEIGHT;

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
ctx.fillStyle = "lightblue";
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
                c.live = !c.live;
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
        for (c of cells) {
            c.live = false;
            c.draw();
        }
        started = false;
        dirty = false;
        clearInterval(interval);
        ctx.save();
        ctx.fillStyle = BG;
        ctx.fillRect(0, 0, WIDTH, HEIGHT);
        ctx.restore();
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
        c.draw();

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
