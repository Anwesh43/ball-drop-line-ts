const colors : Array<string> = [
    "#F44336",
    "#3F51B5",
    "#FF9800",
    "#009688",
    "#4CAF50"
]
const parts : number = 2 
const scaleSpeed : number = 0.02 / parts 
const radiusFactor : number = 10
const strokeFactor : number = 90 
const backColor : string = "#BDBDBD"
const delay : number = 20
const w : number = window.innerWidth 
const h : number = window.innerHeight 
 

class ScaleUtil {

    static sinify(scale : number) : number {
        return Math.sin(scale * Math.PI)
    }

    static maxScale(scale : number, i : number, n : number) : number {
        return Math.max(0, scale - i / n)
    }

    static divideScale(scale : number, i : number, n : number) : number {
        return Math.min(1 / n, ScaleUtil.maxScale(scale, i, n)) * n 
    }
}

class DrawingUtil {

    static drawCircle(context : CanvasRenderingContext2D, x : number, y : number, r : number) {
        context.beginPath()
        context.arc(x, y, r, 0, 2 * Math.PI)
        context.fill()
    }

    static drawLine(context : CanvasRenderingContext2D, x1 : number, y1 : number, x2 : number, y2 : number) {
        context.beginPath()
        context.moveTo(x1, y1)
        context.lineTo(x2, y2)
        context.stroke()
    }

    static drawBallDropLine(context : CanvasRenderingContext2D, x : number, y : number, scale : number) {
        const sf : number = ScaleUtil.sinify(scale)
        const sf1 : number = ScaleUtil.divideScale(sf, 0, parts)
        const sf2 : number = ScaleUtil.divideScale(sf, 1, parts)
        const r : number = Math.min(w, h) / radiusFactor 
        context.save()
        context.translate(x, 0)
        DrawingUtil.drawLine(context, 0, 0, 0, y * sf2)
        DrawingUtil.drawCircle(context, 0, r + (y - r) * sf2, r * sf1)
        context.restore()
    }

    static drawBDLNode(context : CanvasRenderingContext2D, x : number, y : number, i : number, scale : number) {
        const color = colors[i % colors.length]
        context.fillStyle = color 
        context.strokeStyle = color 
        context.lineCap = 'round'
        context.lineWidth = Math.min(w, h) / strokeFactor 
        DrawingUtil.drawBallDropLine(context, x, y, scale)
    }
}

class Animator {

    animated : boolean = false 
    interval : number 

    start(cb : Function) {
        if (!this.animated) {
            this.animated = true 
            this.interval = setInterval(cb, delay)
        }
    }

    stop() {
        if (this.animated) {
            this.animated = false 
            clearInterval(this.interval)
        }
    }
}