export default class Entity {
    get srcLoopTime() {
        return this._srcLoopTime;
    }

    set srcLoopTime(value) {
        this._srcLoopTime = value;
    }
    get src() {
        return this._src;
    }

    set src(value) {
        this._src = value;
    }

    _parent = null;

    _x = 0;
    _y = 0;

    _h = 0;
    _w = 0;
    _s = 0;

    _style = {};

    _src = '';


    _srcLoop = [];
    _srcLoopTime = 1000;


    set x(value) {
        this._x = value;
    }

    set y(value) {
        this._y = value;
    }

    set h(value) {
        this._h = value;
    }

    set w(value) {
        this._w = value;
    }

    set s(value) {
        this._s = value;
    }

    set style(value) {
        this._style = value;
    }

    set parent(value) {
        this._parent = value;
    }

    get srcLoop() {
        return this._srcLoop;
    }

    set srcLoop(value) {
        this.src = value[0];
        this._srcLoop = value;
    }


    get x() {
        let global = 0;
        if(this._parent !== null){
            global = this._parent.x;
        }
        let local = this._x;
        return global + local;
    }

    get y() {
        let global = 0;
        if(this._parent !== null){
            global = this._parent.y;
        }
        let local = this._y;
        return global + local;
    }

    get h() {
        return this._h * this.s;
    }

    get w() {
        return this._w * this.s;
    }

    get s() {
        let global = 1;
        if(this._parent !== null){
            global = this._parent.s;
        }
        return global * this._s;
    }

    get style() {
        return this._style;
    }

    get parent() {
        return this._parent;
    }

    constructor(x = 0, y = 0, h = 1, w = 1, s = 1, style = {}, parent = null) {
        this._x = x;
        this._y = y;
        this._h = h;
        this._w = w;
        this._s = s;
        this._style = Object.assign(this._style, style);
        this._parent = parent;
        this.update();
    }

    addX(x){
        this._x += x;
        return this.x;
    }

    addY(y){
        this._y += y;
        return this.y;
    }

    moveSpeed(x,y, delta){
        x = x * delta/1000
        y = y * delta/1000
        this.addX(x);
        this.addY(y);
    }

    update(){
        this._style.top = this.y;
        this._style.left = this.x;
        this._style.width = this.w;
        this._style.height = this.h;
    }

    _delta
    _srcLoopI = 0;
    updateSrc(delta){
        if(this.srcLoop.length <= 0){
            return;
        }
        this._delta = (this._delta?? 0) + delta;
        if (this._delta > this.srcLoopTime) {
            if(this._srcLoopI >= this.srcLoop.length){
                this._srcLoopI = 0;
            }
            this.src = this._srcLoop[this._srcLoopI];
            this._srcLoopI++;
            this._delta = 0;
        }
    }


}