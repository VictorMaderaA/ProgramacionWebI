export default class Transform {

    _x = 0;
    _y = 0;
    _r = 0;
    _parentTransform;


    get parentTransform() {
        return this._parentTransform;
    }

    set parentTransform(value) {
        this._parentTransform = value;
    }

    get x() {
        let v = 0;
        if(this.parentTransform){
            v = this.parentTransform.x;
        }
        // console.log(this._x, v)
        return this._x + v;
    }

    set x(value) {
        this._x = value;
    }

    get y() {
        let v = 0;
        if(this.parentTransform){
            v = this.parentTransform.y;
        }
        return this._y + v;
    }

    set y(value) {
        this._y = value;
    }

    get r() {
        return this._r;
    }

    set r(value) {
        this._r = value;
    }


    constructor(x = 0, y = 0, r = 0, parentTransform = null) {
        this._x = x;
        this._y = y;
        this._r = r;
        this._parentTransform = parentTransform
    }

    transform(x, y, r){
        this.transformX(x)
        this.transformY(y)
        this.transformR(r)
    }

    transformPosition(x, y){
        this.transformX(x)
        this.transformY(y)
    }

    transformX(v){
        this._x = v;
        return this.x;
    }

    transformY(v){
        this._y = v;
        return this.y;
    }

    transformR(v){
        this._r = v;
        return this._r;
    }

    addX(x){
        this._x += x;
        return this.x;
    }

    addY(y){
        this._y += y;
        return this.y;
    }

    addR(r){
        this._r += r;
        return this._r;
    }

    moveSpeed(x,y, delta){
        x *= delta/1000
        y *= delta/1000
        this.addX(x);
        this.addY(y);
    }

}