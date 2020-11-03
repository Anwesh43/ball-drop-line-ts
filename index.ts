import { timeStamp } from "console"

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

class Stage {

    canvas : HTMLCanvasElement = document.createElement('canvas')
    context : CanvasRenderingContext2D 

    initCanvas() {
        this.canvas.width = w 
        this.canvas.height = h 
        document.body.appendChild(this.canvas)
        this.context = this.canvas.getContext('2d')
    }

    render() {
        this.context.fillStyle = backColor 
        this.context.fillRect(0, 0, w, h)
    }

    handleTap() {
        this.canvas.onmousedown = () => {

        }
    }

    static init() {
        const stage : Stage = new Stage()
        stage.initCanvas()
        stage.render()
        stage.handleTap()
    }
}

class State {

    scale : number = 0 
    dir : number = 0 
    prevScale : number = 0 

    update(cb : Function) {
        this.scale += scaleSpeed * this.dir 
        if (Math.abs(this.scale - this.prevScale) > 1) {
            this.scale = this.prevScale + this.dir 
            this.dir = 0 
            this.prevScale = this.scale 
            cb()  
        }
    }

    startUpdating(cb : Function) {
        if (this.dir == 0) {
            this.dir = 1 - 2 * this.prevScale 
            cb()
        }
    }
}

class BDLNode {

    state : State 

    constructor(private i : number, private x: number, private y : number) {
        this.state = new State()
    }

    draw(context : CanvasRenderingContext2D) {
        DrawingUtil.drawBDLNode(context, this.i, this.x, this.y, this.state.scale)
    }

    update(cb : Function) {
        this.state.update(cb)
    }

    startUpdating(cb : Function) {
        this.state.startUpdating(cb)
    }
}

class BallDropLine {

    bdls : Array<BDLNode> = []
    i : number = 0 
    draw(context : CanvasRenderingContext2D) {
        this.bdls.forEach(bdl => {
            bdl.draw(context)
        })
    }

    startUpdating(x : number, y : number, cb  : Function) {
        const bdlNode = new BDLNode(this.i, x, y)
        this.bdls.push(bdlNode)
        if (this.bdls.length == 1) {
            bdlNode.startUpdating(() => {
                cb()
            })
        }
        this.i++
    }

    update(cb : Function) {
        this.bdls.forEach(bdl => {
            bdl.update(() => {
                this.bdls.splice(0, 1)
                if (this.bdls.length == 0) {
                    cb()
                }
            })
        })
    }
}