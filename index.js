// goal: create a well documented api with core modules 
// will serve watermelon (node-canvas)
// can also be a simple template for generating random images :)

const http = require("http")
const canvas = require("canvas")
const seedrandom = require("seedrandom")
const palettes = require("nice-color-palettes")

// configure sketch
const radius = 150;
const margin = 15;

// create canvas
const watermelon = canvas.createCanvas(500, 500)
const ctx = watermelon.getContext("2d")

// create http server
http.createServer((req, res) => {
    // get seed or use a random number
    const params = new URLSearchParams(req.url.split("?").pop())
    const seed = parseInt(params.get("seed")) || Math.random()

    const generator = seedrandom(seed);

    // create canvas
    const { width, height } = watermelon

    ctx.save()

    // reset canvas
    ctx.clearRect(0, 0, width, height)

    // draw background
    const bg = palettes[Math.floor(generator() * palettes.length)][0]
    ctx.fillStyle = bg
    ctx.fillRect(0, 0, width, height)

    // go to position
    ctx.translate(width / 2, height / 2)
    ctx.rotate(Math.PI / 4)

    // draw watermelon shell
    ctx.fillStyle = "#fcf3d7"
    ctx.strokeStyle = "#378462"
    ctx.lineCap = "round"
    ctx.lineWidth = margin
    ctx.beginPath()
    ctx.arc(0, 0, radius, 0, Math.PI)
    ctx.fill()
    ctx.stroke()

    // draw watermelon meat (ok idk what else to call it)
    const meatMargin = radius - margin
    ctx.fillStyle = "#e43035"
    ctx.lineWidth = 0
    ctx.beginPath()
    ctx.arc(0, 0, meatMargin, 0, Math.PI)
    ctx.fill()

    // draw random seeds
    for (let i = 0; i < 10; i++) {
        const r = generator() * (radius - 6 - margin * 2) + 10
        const angle = -generator() * (Math.PI * 2 - Math.PI) + Math.PI

        ctx.save()

        ctx.translate(Math.cos(angle) * r, Math.sin(angle) * r)
        ctx.rotate(generator() * Math.PI * 2)

        ctx.fillStyle = "#000"
        ctx.beginPath()
        ctx.ellipse(0, 0,
            4, 6,
            0,
            0, Math.PI * 2)
        ctx.fill()

        ctx.restore()
    }

    ctx.restore()

    res.setHeader("Content-Type", "image/png")
    watermelon.createPNGStream().pipe(res)
}).listen(5500)