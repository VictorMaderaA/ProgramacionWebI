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
            s: 2,
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
            srcLoopTime: 300,
            style: {
                position: 'absolute',
                // borderStyle: 'solid'
            }
        },

        player: {
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


    destroyGame() {
        let gameEl = document.getElementById('_space_game');
        if (gameEl) {
            gameEl.remove()
        }
        this.playing = false;
        this.aliens = [];
        this.gameEntity = null;
        this.aliensEntity = null;
        this.alienSpeed = 50;
    }


    initGameDom() {
        console.log('Creating Game')
        this.destroyGame()
        let _ = document.getElementById('game');

        //------------------------------------

        let gameEl = document.createElement('div');
        gameEl.setAttribute('id', '_space_game')
        _.append(gameEl);

        //Game Entity
        this._createGameEntity();
        var el = document.createElement('div');
        el.setAttribute('fw-attr:style', '_game.gameEntity._style')
        gameEl.append(el)

        //Aliens Entity
        this._setupAliens();
        var el = document.createElement('div');
        el.setAttribute('fw-attr:style', '_game.aliensEntity._style')
        gameEl.append(el)

        //Aliens Entities
        for (const aliensKey in this.aliens) {
            let el = document.createElement('img');
            el.setAttribute('fw-attr:style', '_game.aliens.' + aliensKey + '._style')
            el.setAttribute('fw-attr:src', '_game.aliens.' + aliensKey + '._src')
            el.setAttribute('id', 'alien_' + aliensKey)
            el.setAttribute('fw-on:click', 'clickAlien')
            gameEl.append(el)
        }
    }


    _createGameEntity() {
        let c = this.config.game;
        this.gameEntity = new Entity(c.x, c.y, c.h, c.w, c.s, c.style);
        this.entities.push(this.gameEntity);
        this.aliensEntity = new Entity(0, 0, 0, 0, 1, {}, this.gameEntity);
        this.entities.push(this.aliensEntity);
        return this.gameEntity;
    }

    _createAlienEntity(x, y) {
        let c = this.config.alien;
        let alien = new Entity(c.x, c.y, c.h, c.w, c.s, c.style, this.aliensEntity);
        alien.x = (x * alien.w) + (x * this.config.sep_aliens * alien.w)
        alien.y = (y * alien.h) + (y * this.config.sep_aliens * alien.h)
        alien._srcLoopTime = this.config.alien.srcLoopTime;
        this.aliens.push(alien);
        this.entities.push(alien);
        alien.update();
        return alien;
    }

    _setupAliens() {
        let y = 0;
        for (let x = 0; x < 11; x++) {
            let alienEnt = this._createAlienEntity(x, y);
            alienEnt.srcLoop = [
                '/assets/invaderA1.svg',
                '/assets/invaderA2.svg',
            ]
        }

        y = 1;
        for (let x = 0; x < 11; x++) {
            let alienEnt = this._createAlienEntity(x, y);
            alienEnt.srcLoop = [
                '/assets/invaderB1.svg',
                '/assets/invaderB2.svg',
            ]
        }
        y = 2;
        for (let x = 0; x < 11; x++) {
            let alienEnt = this._createAlienEntity(x, y);
            alienEnt.srcLoop = [
                '/assets/invaderB1.svg',
                '/assets/invaderB2.svg',
            ]
        }

        y = 3;
        for (let x = 0; x < 11; x++) {
            let alienEnt = this._createAlienEntity(x, y);
            alienEnt.srcLoop = [
                '/assets/invaderA1.svg',
                '/assets/invaderA2.svg',
            ]
        }

        return this.aliens;
    }

    alienDirection = true;
    alienSpeed = 50;

    update(delta) {
        if (!this.playing) {
            return;
        }
        this._updateAlien(delta);
    }

    _updateAlien(delta) {
        let alienColide = false

        for (const aliensKey in this.aliens) {
            let alien = this.aliens[aliensKey];

            //If dead skip
            if (alien.dead) {
                continue;
            }

            //Update Alien Internal
            alien.updateSrc(delta);

            //Detect Any Alien Colission over Iteration
            if (!this.alienDirection && (alien.x - 10 * this.gameEntity.s) < this.gameEntity.x) {
                alienColide = true
            } else if (this.alienDirection && (alien.x + 10 * this.gameEntity.s + alien.w) > this.gameEntity.w + this.gameEntity.x) {
                alienColide = true
            }
        }

        //Aliens Entity -------------------
        if (alienColide) {
            this.alienDirection = !this.alienDirection;
            this.aliensEntity.addY(this.aliens[0].h / 4);
        }

        //Move Aliens
        let speed = this.alienSpeed * this.aliensEntity.s * (this.alienDirection ? 1 : -1)
        this.aliensEntity.moveSpeed(speed, 0, delta)
    }

    destroyAlien(id) {
        let alien = this.aliens[id];
        alien.dead = true;
        alien.style.display = 'none'
        alien.x = -100;
        alien.y = -100;
        alien.update()
        this.alienSpeed += 5
    }


}