class Entity {

    _height = 1;
    _width = 1;
    _transform = new Transform(0, 0, 0);
    _scale = 1;

    get scale(): number {
        return this._scale;
    }

    set scale(value: number) {
        this._scale = value;
    }

    get height(): number {
        return this._scale * this._height;
    }

    set height(value: number) {
        this._height = value;
    }

    get width(): number {
        return this._scale * this._width;
    }

    set width(value: number) {
        this._width = value;
    }

    get transform(): Transform {
        return this._transform;
    }


    constructor(height: number, width: number, transform: Transform, scale: number) {
        this._height = height;
        this._width = width;
        this._transform = transform;
        this._scale = scale;
    }

// constructor(height, width, transform, active = true) {
    //
    // }
    //
    // update = (delta) => {
    //
    // }


}