import Transform from './spaceInvaders/Transform.js';

const pt = new Transform(100,100)

const app = {
    rootElementId: "root",
    initialState: {
        class: {
            player: 'playerAlive',
            alien: 'alien'
        },
        src: {
            alien1: '/assets/InvaderA1.svg',
            alien2: '/assets/InvaderB1.svg'
        },
        loops: {
            alien: false,
        },
        game: {
            tickTime: 1,
            loops: [
                {
                    method: (state) => {
                        state.src.alien1 = state.loops.alien ? '/assets/InvaderA1.svg' : '/assets/InvaderA2.svg';
                        state.src.alien2 = state.loops.alien ? '/assets/InvaderB1.svg' : '/assets/InvaderB2.svg';
                        state.loops.alien = !state.loops.alien;
                        return state;
                    },
                    time: 300,
                },
            ],
            lastUpdate: null,
            delta: 0,
        },
        isPlayerAlive: true,
        playerClass: 'player',
        playerTransform: new Transform(0,0,0,pt),
        playerStyle: {
            top: 0,
            left: 0,
        },
    },
    handlers: {
        onKeyDown: (state, event) => {
            switch (event.keyCode){
                case 37: //Izquierda
                    state.keyLeft = true;
                    break;
                case 39: //Derecha
                    state.keyRight = true;
                    break;
                case 38: //Arriba
                    state.keyShoot = true;
                    break;
                default:
                    break;
            }
        },
        onKeyUp: (state, event) => {
            switch (event.keyCode){
                case 37: //Izquierda
                    state.keyLeft = false;
                    break;
                case 39: //Derecha
                    state.keyRight = false;
                    break;
                case 38: //Arriba
                    state.keyShoot = false;
                    break;
                default:
                    break;
            }
        }
    },
    methods: {
        gameInit: (state) => {
            state.delta.alien = 0;
            state.keyLeft = false;
            state.keyRight = false;
            state.keyShoot = false;
            console.log(this)
        },
        gameLoop: (state) => {
            state = app.methods.runCustomLoop(state, app.initialState.game.loops);
            state = app.methods.playerLoop(state);
            return state;
        },
        playerLoop(state){
            if(state.keyLeft){
                state.playerTransform.moveSpeed(-200, 0, state.delta.val)
            }
            if(state.keyRight){
                state.playerTransform.moveSpeed(200 , 0, state.delta.val)
            }

            if(state.keyShoot){

            }
            state.playerStyle.left = state.playerTransform.x;
            state.playerStyle.top = state.playerTransform.y;

            return state;
        },

        runCustomLoop: (state, loops) => {
            loops.forEach(l => {
                l.delta = (l.delta?? 0) + state.delta.val;
                if (l.delta > l.time) {
                    let _state;
                    if ((_state = l.method(state)) !== undefined) {
                        state = _state;
                    }
                    l.delta = 0;
                }
            });
            return state;
        },
    }
}
window.createApp(app)