const canvas = document.querySelector("canvas")
const ctx = canvas.getContext("2d")

export function consrect(x, y, w, h, colour, fill = true){
    if (fill){
        ctx.fillStyle = colour
        ctx.fillRect(x, y, w, h)
    } else {
        ctx.strokeStyle = colour
        ctx.strokeRect(x, y, w, h)
    }
}

export function conscirc(x, y, r, colour){
    ctx.fillStyle = colour
    ctx.beginPath()
    ctx.arc(x, y, r, 0, Math.PI * 2)
    ctx.fill()
}

export function randint(x,y,ex){
    const options = []

    for (let i = x ; i <= y; i++){
        options.push(i)
    }
    for (let p = 0; p < options.length; p++){
        if (options[p] == ex){
            options.splice(p,1)
            p--
        }
    }
    const randint = Math.floor(Math.random() * (options.length))
    return options[randint]
}