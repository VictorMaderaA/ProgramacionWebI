class Asset {

    _src;
    _defSrc = '/assets/def_error.svg'
    _loop = false;
    _sources = {

    };
    _sourcesLoop = [

    ];
    _loopTime = 1000;

    private = {
        loop_i: 0,
        delta: 0
    }

    get loop(): boolean {
        return this._loop;
    }

    set loop(value: boolean) {
        this._loop = value;
    }

    get defSrc(): string {
        return this._defSrc;
    }

    set defSrc(value: string) {
        this._defSrc = value;
    }

    get src(): string {
        return this._src;
    }

    set src(value: string) {
        this._src = value;
    }

    get sources(): {} {
        return this._sources;
    }

    set sources(value: {}) {
        this._sources = value;
    }

    get sourcesLoop(): [] {
        return this._sourcesLoop;
    }

    set sourcesLoop(value: Array) {
        this._sourcesLoop = value;
    }

    get loopTime(): number {
        return this._loopTime;
    }

    set loopTime(value: number) {
        this._loopTime = value;
    }


    constructor(defSrc: string, loop: boolean = false, sources: {} = {}, sourcesLoop: [] = [], loopTime: number = 0) {
        this._defSrc = defSrc;
        this._loop = loop;
        this._sources = sources;
        this._sourcesLoop = sourcesLoop;
        this._loopTime = loopTime;
    }

    updateLoopDelta(delta){

    }
}