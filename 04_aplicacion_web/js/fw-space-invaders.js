import Game from "./spaceInvaders/Game.js";
const app = {
    rootElementId: "root",
    initialState: {
        game: {
            tickTime: 10,
            // loops: [
            //     {
            //         method: (state) => {
            //             state.src.alien1 = state.loops.alien ? '/assets/InvaderA1.svg' : '/assets/InvaderA2.svg';
            //             state.src.alien2 = state.loops.alien ? '/assets/InvaderB1.svg' : '/assets/InvaderB2.svg';
            //             state.loops.alien = !state.loops.alien;
            //             return state;
            //         },
            //         time: 300,
            //     },
            // ],
            lastUpdate: null,
            delta: 0,
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
                case 32: //Space
                        if(state._game.playing){
                            //Shoot
                        }else{
                            state._game.playing = true
                        }

                    break;
                case 82: //R
                    if(state._game.playing){
                        state._game.initGameDom();
                    }
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
        },
        clickAlien(state, event){
            state._game.destroyAlien(event.target.id.split("_")[1]);
        }
    },
    methods: {
        gameInit: (state) => {
            state.delta.alien = 0;
            state.keyLeft = false;
            state.keyRight = false;
            state.keyShoot = false;

            state._game = new Game();
            state._game.initGameDom();
            return state
        },
        gameLoop: (state) => {
            if(!state._game.playing){
                return;
            }
            // state = app.methods.runCustomLoop(state, app.initialState.game.loops);
            state = app.methods.playerLoop(state);
            state._game.update(state.delta.val)
            let ent = state._game.entities;
            for (const key in state._game.entities) {
                ent[key].update();
            }
            return state;
        },
        playerLoop(state){
            if(state.keyLeft){
                console.log(1)
                state._game.aliensEntity.moveSpeed(-100,0,state.delta.val)
            }
            if(state.keyRight){
                console.log(2)
                state._game.aliensEntity.moveSpeed(100,0,state.delta.val)
            }

            if(state.keyShoot){

            }

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