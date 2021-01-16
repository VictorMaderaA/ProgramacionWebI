import Game from "./spaceInvaders/Game.js";
const app = {
    rootElementId: "root",
    initialState: {
        PRODUCTION: true,
        game: {
            tickTime: 1,
            lastUpdate: null,
            delta: 0,
        },
    },
    handlers: {
        onKeyDown: (state, event) => {
            // console.log(event.keyCode)
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
                            state.keyShoot = true;
                        }else if(!state._game.gameOver){
                            state._game.playing = true
                        }

                    break;
                case 82: //R
                    if(state._game.playing || state._game.gameover){
                        state._game.initGameDom();
                    }
                    break;

                case 49: //R
                    console.log("Scale 0.5");
                    state._game.config.game.s = 0.5
                    state._game.initGameDom()
                    break;
                case 50: //R
                    console.log("Scale 1");
                    state._game.config.game.s = 1
                    state._game.initGameDom()
                    break;
                case 51: //R
                    console.log("Scale 2");
                    state._game.config.game.s = 2
                    state._game.initGameDom()
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
                case 32: //Space
                    state.keyShoot = false;
                    break;
                default:
                    break;
            }
        },
        clickAlien(state, event){
            state._game.alienShoot(state._game.aliens[event.target.id.split("_")[1]]);
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
                state._game.movePlayer(state.delta.val, -1)
            }
            if(state.keyRight){
                state._game.movePlayer(state.delta.val, 1)
            }

            if(state.keyShoot){
                state._game.playerShoot();
            }

            return state;
        },
    }
}
window.createApp(app)