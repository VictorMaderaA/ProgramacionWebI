export default class Engine {

    delta = 0;

    _lastTick = 0;


    startTick(){
        this._lastTick = Date.now();
    }

    tick(){
        this.delta = calcDelta()
    }

    calcDelta = () => {
        const now = Date.now();
        initialState.delta.val = now - initialState.delta.lastUpdate;
        initialState.delta.lastUpdate = now;
    }

}
