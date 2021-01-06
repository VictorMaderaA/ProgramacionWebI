import Entity from "./Entity.js";


export default class Game {

    entities = [];
    playing = false;

    config = {
        sep_aliens: 0.1,
        game: {
            x: 0,
            y: 0,
            h: 600,
            w: 800,
            s: 1,
            style: {
                position: 'absolute',
                borderStyle: 'solid'
            }
        },
        alien: {
            x: 0,
            y: 0,
            h: 45,
            w: 45,
            s: 1,
            style: {
                position: 'absolute',
                // borderStyle: 'solid'
            }
        },
    }

    gameEntity = null;
    aliensEntity = null;
    aliens = [];


    initGameDom(gameEl) {
        gameEl.innerHTML = "";

        this.createGameEntity();
        var el = document.createElement('div');
        el.setAttribute('fw-attr:style', '_game.gameEntity._style')
        gameEl.append(el)

        this.setupAliens();
        var el = document.createElement('div');
        el.setAttribute('fw-attr:style', '_game.aliensEntity._style')
            el.style.width
        gameEl.append(el)


        for (const aliensKey in this.aliens) {
            let el = document.createElement('img');
            el.setAttribute('fw-attr:style', '_game.aliens.'+aliensKey+'._style')
            el.setAttribute('fw-attr:src', '_game.aliens.'+aliensKey+'._src')
            gameEl.append(el)
        }
    }



    createGameEntity() {
        let c = this.config.game;
        this.gameEntity = new Entity(c.x, c.y, c.h, c.w, c.s, c.style);
        this.entities.push(this.gameEntity);
        this.aliensEntity = new Entity(0, 0, 0, 0, 1, {}, this.gameEntity);
        this.entities.push(this.aliensEntity);
        return this.gameEntity;
    }

    createAlienEntity() {
        let c = this.config.alien;
        let alien = new Entity(c.x, c.y, c.h, c.w, c.s, c.style, this.aliensEntity);
        this.aliens.push(alien);
        this.entities.push(alien);
        return alien;
    }

    setupAliens() {
        let y = 0;
        for (let x = 0; x < 11; x++) {
            let alienEnt = this.createAlienEntity();
            alienEnt.x = (x * alienEnt.w) + (x * this.config.sep_aliens * alienEnt.w)
            alienEnt.y = (y * alienEnt.h) + (y * this.config.sep_aliens * alienEnt.h)
            alienEnt.srcLoop = [
                '/assets/invaderA1.svg',
                '/assets/invaderA2.svg',
            ]
            alienEnt._srcLoopTime = 250
        }

        y=1;
        for (let x = 0; x < 11; x++) {
            let alienEnt = this.createAlienEntity();
            alienEnt.x = (x * alienEnt.w) + (x * this.config.sep_aliens * alienEnt.w)
            alienEnt.y = (y * alienEnt.h) + (y * this.config.sep_aliens * alienEnt.h)
            alienEnt.srcLoop = [
                '/assets/invaderB1.svg',
                '/assets/invaderB2.svg',
            ]
            alienEnt._srcLoopTime = 250
        }
        y=2;
        for (let x = 0; x < 11; x++) {
            let alienEnt = this.createAlienEntity();
            alienEnt.x = (x * alienEnt.w) + (x * this.config.sep_aliens * alienEnt.w)
            alienEnt.y = (y * alienEnt.h) + (y * this.config.sep_aliens * alienEnt.h)
            alienEnt.srcLoop = [
                '/assets/invaderB1.svg',
                '/assets/invaderB2.svg',
            ]
            alienEnt._srcLoopTime = 250
        }
        y=3;
        for (let x = 0; x < 11; x++) {
            let alienEnt = this.createAlienEntity();
            alienEnt.x = (x * alienEnt.w) + (x * this.config.sep_aliens * alienEnt.w)
            alienEnt.y = (y * alienEnt.h) + (y * this.config.sep_aliens * alienEnt.h)
            alienEnt.srcLoop = [
                '/assets/invaderA1.svg',
                '/assets/invaderA2.svg',
            ]
            alienEnt._srcLoopTime = 250
        }
        return this.aliens;
    }

    alienDirection = true;
    alienSpeed = 50;

    update(delta) {
        if(!this.playing){
            return;
        }

        let alienColide = false
        for (const aliensKey in this.aliens) {
            let alien = this.aliens[aliensKey];
            alien.updateSrc(delta);
            if (!this.alienDirection && (alien.x - 10 * this.gameEntity.s) < this.gameEntity.x) {
                alienColide = true
            } else if (this.alienDirection && (alien.x + 10 * this.gameEntity.s + alien.w) > this.gameEntity.w + this.gameEntity.x) {
                alienColide = true
            }
        }
        if (alienColide) {
            this.alienDirection = !this.alienDirection;
            this.aliensEntity.addY(this.aliens[0].h/4);
        }
        let speed = this.alienSpeed * this.aliensEntity.s * (this.alienDirection ? 1 : -1)
        this.aliensEntity.moveSpeed(speed, 0, delta)

    }


}