import { conscirc, randint } from "./engine.js";

const canvas = document.getElementById("canvas")
let ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const stars = Array.from({ length: 120 }, () => ({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    r: Math.random() * 1.5 + 0.3,
    op: Math.random() * 0.5 + 0.1,
    speed: Math.random() * 0.3 + 0.05
}))

let paddle = {
    x: canvas.width / 2 - 100,
    y: canvas.height - 40,
    width: 100,
    height: 10,
    colour: "#00ff00"
}

function velocityfactor() {
    return {
        dx: randint(-4, 4, 0),
        dy: randint(0, 4, 0)
    }
}

let velocity = velocityfactor()

let ball = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    radius: 15,
    dx: velocity.dx,
    dy: velocity.dy,
    colour: "#329ea5"
}

let keys = {}
const paddle_speed = 6

window.addEventListener("keydown", (e) => { keys[e.key] = true; })
window.addEventListener("keyup", (e) => { keys[e.key] = false; })

let bricks = []

const metalColors = [
    { base: "#c0392b", mid: "#e74c3c", shine: "#ff9999" },
    { base: "#1a6b1a", mid: "#27ae60", shine: "#aaffaa" },
    { base: "#154f8a", mid: "#2980b9", shine: "#99ccff" },
    { base: "#7d3c98", mid: "#9b59b6", shine: "#ddaaff" },
    { base: "#b7770d", mid: "#f39c12", shine: "#ffe599" },
    { base: "#0e7c7c", mid: "#16a085", shine: "#aaffee" },
    { base: "#884ea0", mid: "#8e44ad", shine: "#cc99ff" },
]

const height = 7
const width = 20
const bw = canvas.width / width
const bh = (canvas.height / 2 - 2 * ball.radius) / height

for (let i = 0; i < height; i++) {
    for (let j = 0; j < width; j++) {
        const metal = metalColors[randint(0, metalColors.length - 1, 99)]
        bricks.push({
            x: bw * j,
            y: bh * i,
            width: bw,
            height: bh,
            metal,
            broken: false,
        })
    }
}

function drawBrick(brick) {
    const { x, y, width, height, metal } = brick

    ctx.save()
    ctx.translate(x, y)

    const grad = ctx.createLinearGradient(0, 0, 0, height)
    grad.addColorStop(0,    metal.shine)
    grad.addColorStop(0.15, metal.mid)
    grad.addColorStop(0.5,  metal.base)
    grad.addColorStop(0.85, metal.mid)
    grad.addColorStop(1,    metal.base)
    ctx.fillStyle = grad
    ctx.fillRect(1, 1, width - 2, height - 2)

    const shineGrad = ctx.createLinearGradient(0, 0, 0, height * 0.4)
    shineGrad.addColorStop(0, "rgba(255,255,255,0.35)")
    shineGrad.addColorStop(1, "rgba(255,255,255,0)")
    ctx.fillStyle = shineGrad
    ctx.fillRect(2, 2, width - 4, height * 0.4)

    ctx.strokeStyle = metal.shine
    ctx.lineWidth = 0.5
    ctx.globalAlpha = 0.4
    ctx.strokeRect(1, 1, width - 2, height - 2)
    ctx.globalAlpha = 1

    ctx.strokeStyle = "rgba(0,0,0,0.6)"
    ctx.lineWidth = 1
    ctx.strokeRect(0.5, 0.5, width - 1, height - 1)

    ctx.strokeStyle = "rgba(255,255,255,0.5)"
    ctx.lineWidth = 1
    ctx.beginPath(); ctx.moveTo(1, 1); ctx.lineTo(width - 1, 1); ctx.stroke()
    ctx.beginPath(); ctx.moveTo(1, 1); ctx.lineTo(1, height - 1); ctx.stroke()

    ctx.strokeStyle = "rgba(0,0,0,0.5)"
    ctx.beginPath(); ctx.moveTo(width - 1, 1); ctx.lineTo(width - 1, height - 1); ctx.stroke()
    ctx.beginPath(); ctx.moveTo(1, height - 1); ctx.lineTo(width - 1, height - 1); ctx.stroke()

    ctx.restore()
}

function update() {
    keys["A"] || keys["a"] ? paddle.x -= paddle_speed : null;
    keys["D"] || keys["d"] ? paddle.x += paddle_speed : null;
    keys["ArrowLeft"] ? paddle.x -= paddle_speed : null;
    keys["ArrowRight"] ? paddle.x += paddle_speed : null;

    paddle.x < 0 ? paddle.x = 0 : null
    paddle.x > canvas.width - paddle.width ? paddle.x = canvas.width - paddle.width : null

    ball.x += ball.dx
    ball.y += ball.dy

    if (
        ball.x + ball.radius >= paddle.x &&
        ball.x - ball.radius <= paddle.x + paddle.width &&
        ball.y + ball.radius >= paddle.y &&
        ball.y - ball.radius <= paddle.y + paddle.height
    ) {
        ball.dy *= -1
        ball.y = paddle.y - ball.radius
    }

    if (ball.x - ball.radius < 0) ball.dx *= -1
    if (ball.x + ball.radius > canvas.width) ball.dx *= -1

    if (ball.y - ball.radius < 0) {
        ball.y = ball.radius
        ball.dy *= -1
    }

    for (let brick of bricks) {
        if (!brick.broken) {
            if (
                ball.x + ball.radius > brick.x &&
                ball.x - ball.radius < brick.x + brick.width &&
                ball.y + ball.radius > brick.y &&
                ball.y - ball.radius < brick.y + brick.height
            ) {
                const prevY = ball.y - ball.dy
                if (prevY + ball.radius <= brick.y || prevY - ball.radius >= brick.y + brick.height) {
                    ball.dy *= -1
                } else {
                    ball.dx *= -1
                }
                brick.broken = true
                break
            }
        }
    }
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.fillStyle = "#000000"
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    for (let s of stars) {
        s.y += s.speed
        if (s.y > canvas.height) { s.y = 0; s.x = Math.random() * canvas.width }
        ctx.globalAlpha = s.op
        ctx.fillStyle = "#ffffff"
        ctx.beginPath()
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2)
        ctx.fill()
    }
    ctx.globalAlpha = 1

    for (let brick of bricks) {
        if (!brick.broken) drawBrick(brick)
    }

    ctx.shadowColor = "#00ff00"
    ctx.shadowBlur = 12
    ctx.fillStyle = "#00ff00"
    ctx.fillRect(paddle.x, paddle.y, paddle.width, paddle.height)
    ctx.shadowBlur = 0

    ctx.shadowColor = "#329ea5"
    ctx.shadowBlur = 16
    conscirc(ball.x, ball.y, ball.radius, ball.colour)
    ctx.shadowBlur = 0
}

function gameLoop() {
    update()
    draw()
    requestAnimationFrame(gameLoop)
}
gameLoop()