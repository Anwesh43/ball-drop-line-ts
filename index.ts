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
