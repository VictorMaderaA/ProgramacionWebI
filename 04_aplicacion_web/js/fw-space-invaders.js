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

            state._game = new Game();
            let game = document.getElementById('game');

            state._game.createGameEntity();
            var el = document.createElement('div');
            el.setAttribute('fw-attr:style', '_game.gameEntity._style')
            game.append(el)

            state._game.setupAliens();
            var el = document.createElement('div');
            el.setAttribute('fw-attr:style', '_game.aliensEntity._style')
            game.append(el)


            for (const aliensKey in state._game.aliens) {
                let el = document.createElement('img');
                el.setAttribute('fw-attr:style', '_game.aliens.'+aliensKey+'._style')
                el.setAttribute('fw-attr:src', '_game.aliens.'+aliensKey+'._src')
                game.append(el)
            }
            return state
        },
        gameLoop: (state) => {
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