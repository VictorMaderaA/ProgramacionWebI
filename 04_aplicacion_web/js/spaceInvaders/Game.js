import Entity from "./Entity.js";
import {
    aabbDetection
} from "./Utils.js";

export default class Game {

    instructions = "Teclas disponibles: Flecha Izquiera, Flecha Derecha, Barra Espacio, 'R', '1', '2', '3'"

    entities = [];
    destructables = [];
    playing = false;


    gameEntity = null;
    playerEntity = null;
    aliensEntity = null;
    aliens = [];

    playerBulletEntity = null;
    alienBulletEntity = null;
    currAlienSpeed = 1;
    playerLives = 3;
    points = 0;
    gameover = false;


    _getPlayerPos = () => {
        let x = (this.gameEntity.w / 2) - (this.config.player.w / 2);
        let y = (this.gameEntity.h - this.config.player.h * this.gameEntity.s)
        return {x, y}
    }

    config = {
        sep_aliens: 0.1,
        game: {
            x: 0,
            y: 0,
            h: 600,
            w: 800,
            s:1,
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
            alienSpeed: 100,
            srcLoopTime: 300,
            style: {
                position: 'absolute',
                // borderStyle: 'solid'
            }
        },

        player: {
            pos: this._getPlayerPos,
            h: 45,
            w: 45,
            s: 1,
            speed: 200,
            style: {
                position: 'absolute',
                borderStyle: 'solid'
            }
        },

        bullet: {
            h: 10,
            w: 5,
            s: 1,
            speedP: 500,
            speedA: 600,
            style: {
                position: 'absolute',
                borderStyle: 'solid'
            }
        },
    }


    destroyGame() {
        let gameEl = document.getElementById('_space_game');
        if (gameEl) {
            gameEl.remove()
        }
        this.playing = false;
        this.aliens = [];
        this.gameEntity = null;
        this.aliensEntity = null;
        this.playerBulletEntity = null
        this.alienBulletEntity = null
        this.currAlienSpeed = this.config.alien.alienSpeed;
        this.playerLives = 3
        this.deadAliens = 0;
        this.destructables = [];
        this.aliveAliens = 100;
        this.points = 0;
        this.gameover = false;
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

        //Player Entity
        this._createPlayerEntity()
        var el = document.createElement('div');
        el.setAttribute('fw-attr:style', '_game.playerEntity._style')
        gameEl.append(el)


        this.pointEntity = new Entity(0, this.gameEntity.y + this.gameEntity.h + 10, 50, this.gameEntity.w / this.gameEntity.s , 1, {
            position: 'absolute'
        }, this.gameEntity);
        this.pointEntity.style['text-align'] = 'center'
        this.pointEntity.style['font-size'] = 30 * this.pointEntity.s + 'px'
        this.entities.push(this.pointEntity);
        var el = document.createElement('div');
        el.setAttribute('fw-attr:style', '_game.pointEntity._style')
        el.setAttribute('fw-content', '_game.currPoints')
        gameEl.append(el)


        this.livesEntity = new Entity(0, this.pointEntity.y + this.pointEntity.h, 50, this.gameEntity.w / this.gameEntity.s, 1, {
            position: 'absolute'
        }, this.gameEntity);
        this.livesEntity.style['text-align'] = 'center'
        this.livesEntity.style['font-size'] = 30 * this.livesEntity.s + 'px'
        this.entities.push(this.livesEntity);
        var el = document.createElement('div');
        el.setAttribute('fw-attr:style', '_game.livesEntity._style')
        el.setAttribute('fw-content', '_game.currLive')
        gameEl.append(el)

        this.info = new Entity(0, this.pointEntity.y + this.pointEntity.h, 50, this.gameEntity.w / this.gameEntity.s, 1, {
            position: 'absolute'
        }, this.gameEntity);
        this.info.style['text-align'] = 'center'
        this.info.style['font-size'] = 30 * this.info.s + 'px'
        this.entities.push(this.info);
        var el = document.createElement('p');
        el.setAttribute('fw-attr:style', '_game.livesEntity._style')
        el.setAttribute('fw-content', '_game.instructions')
        gameEl.append(el)


        this.gameOverEntity = new Entity(0, (this.gameEntity.y + this.gameEntity.h / 3) - 50, this.gameEntity.h/4, this.gameEntity.w / this.gameEntity.s, 1, {
            position: 'absolute'
        }, this.gameEntity);
        this.gameOverEntity.style['color'] = 'red'
        this.gameOverEntity.style['font-size'] = 30 * this.gameOverEntity.s + 'px'
        this.gameOverEntity.style['text-align'] = 'center'
        this.entities.push(this.gameOverEntity);
        var el = document.createElement('div');
        el.setAttribute('fw-attr:style', '_game.gameOverEntity._style')
        gameEl.append(el)


        this.startGameEntity = new Entity(0 , (this.gameEntity.y + this.gameEntity.h / 3) - 50, this.gameEntity.h/4, this.gameEntity.w / this.gameEntity.s, 1, {
            position: 'absolute'
        }, this.gameEntity);
        this.startGameEntity.style['color'] = 'red'
        this.startGameEntity.style['font-size'] = 30 * this.startGameEntity.s + 'px'
        this.startGameEntity.style['text-align'] = 'center'
        var el = document.createElement('div');
        this.entities.push(this.startGameEntity);
        el.setAttribute('fw-attr:style', '_game.startGameEntity._style')
        gameEl.append(el)

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
        alien.type = 'alien';
        this.aliens.push(alien);
        this.entities.push(alien);
        this.destructables.push(alien)
        alien.update();
        return alien;
    }

    _createPlayerEntity() {
        let c = this.config.player;
        this.playerEntity = new Entity(c.pos().x, c.pos().y, c.h, c.w, c.s, c.style, this.gameEntity);
        this.playerEntity.type = 'player';
        this.entities.push(this.playerEntity);
        this.destructables.push(this.playerEntity)
        return this.playerEntity;
    }

    _createPlayerBulletEntity() {
        let c = this.config.bullet;
        this.playerBulletEntity = new Entity(0, 0, c.h, c.w, c.s, c.style, this.gameEntity);
        this.playerBulletEntity.type = 'bullet';
        this.entities.push(this.playerBulletEntity);
        this.destructables.push(this.playerBulletEntity)
        return this.playerBulletEntity;
    }

    _createAlienBulletEntity(alien) {
        let c = this.config.bullet;
        this.alienBulletEntity = new Entity(0, 0, c.h, c.w, c.s, c.style, this.gameEntity);
        this.alienBulletEntity.type = 'bullet';
        this.entities.push(this.alienBulletEntity);
        this.destructables.push(this.alienBulletEntity)
        return this.alienBulletEntity;
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

    update(delta) {
        if (!this.playing) {
            return;
        }

        if (this.playerLives <= 0) {
            this.playing = false;
            this.gameover = true;
            console.log('Player Killed')
        }

        if (this.aliveAliens <= 0) {
            this.playing = false;
            this.gameover = true;
            console.log('Win all aliens killed')
        }

        this._updateAlien(delta);
        this._updateBullets(delta)
    }

    _updateBullets(delta) {
        this._updateAlienBullet(delta)
        this._updatePlayerBullet(delta)
    }

    _updatePlayerBullet(delta) {
        let bulletPlayer = this.playerBulletEntity;
        if (!bulletPlayer) {
            return;
        }
        bulletPlayer.moveSpeed(0, this.config.bullet.speedP * -1, delta)

        this.destructables.forEach(e => {
            if (e === bulletPlayer || e === this.playerEntity) {
                return;
            }
            if (aabbDetection(bulletPlayer, e)) {
                this._removeEntityFromDestructables(bulletPlayer)
                this._removeEntityFromDestructables(e)
                this._destroyPlayerBullet();
                if (e.type === 'alien') {
                    this.points += 100
                    this.destroyAlien(e);
                }
                if (e.type === 'bullet') {
                    this.points += 10
                }
            }
        })

        if (bulletPlayer.y < this.gameEntity.y - (bulletPlayer.h * 1.2)) {
            this._destroyPlayerBullet();
        }
    }

    _updateAlienBullet(delta) {
        let bulletAlien = this.alienBulletEntity;
        if (!bulletAlien) {
            return;
        }
        bulletAlien.moveSpeed(0, this.config.bullet.speedA, delta)

        this.destructables.forEach(e => {
            if (e === bulletAlien || e.type === 'alien') {
                return;
            }
            if (aabbDetection(bulletAlien, e)) {
                this._removeEntityFromDestructables(bulletAlien)
                this._destroyAlienBullet();
                if (e.type === 'player') {
                    console.log('Player Shot')
                    this.playerLives--;
                } else {
                    this._removeEntityFromDestructables(e)
                }
            }
        })

        if (bulletAlien.y > (this.gameEntity.h + this.gameEntity.y)) {
            this._destroyAlienBullet();
        }
    }

    _removeEntityFromDestructables(ent) {
        var index = this.destructables.indexOf(ent);
        if (index !== -1) this.destructables.splice(index, 1);
    }

    _destroyPlayerBullet() {
        this.playerBulletEntity.element.remove();
        this.playerBulletEntity = null;
    }

    _destroyAlienBullet() {
        this.alienBulletEntity.element.remove();
        this.alienBulletEntity = null;
    }

    _updateAlien(delta) {
        let alienColide = false

        let dead = 0;
        let alive = 0;
        let shoot = Math.random() > 0.95 - 0.01 * this.deadAliens

        for (const aliensKey in this.aliens) {
            let alien = this.aliens[aliensKey];

            //If dead skip
            if (alien.dead) {
                dead++;
                continue;
            } else {
                alive++;
            }


            if (shoot && Math.random() > 0.99) {
                this.alienShoot(alien)
            }

            //Update Alien Internal
            alien.updateSrc(delta);

            //Detect Any Alien Border Collision over Iteration
            if (!this.alienDirection && (alien.x - 10 * this.gameEntity.s) < this.gameEntity.x) {
                alienColide = true
            } else if (this.alienDirection && (alien.x + 10 * this.gameEntity.s + alien.w) > this.gameEntity.w + this.gameEntity.x) {
                alienColide = true
            } else if ((alien.y + alien.h) > this.playerEntity.y) {
                this.playing = false
                this.gameover = true
            }
        }

        this.deadAliens = dead;
        this.aliveAliens = alive;

        //Aliens Entity -------------------
        if (alienColide) {
            this.alienDirection = !this.alienDirection;
            this.aliensEntity.addY(this.aliens[0].h / 4);
        }

        //Move Aliens
        let speed = this.currAlienSpeed * this.aliensEntity.s * (this.alienDirection ? 1 : -1)
        this.aliensEntity.moveSpeed(speed, 0, delta)
    }

    destroyAlien(id) {
        let alien;
        if (typeof id === "object") {
            alien = id;
        } else {
            alien = this.aliens[id];
        }
        alien.dead = true;
        alien.style.display = 'none'
        alien.x = -100;
        alien.y = -100;
        alien.update()
        //Aumentar Velociad al destruir alien
        this.currAlienSpeed += 5;
    }

    movePlayer(delta, dir = -1) {
        if (dir < 0 && (this.playerEntity.x - this.playerEntity.w * 0.1) <= this.gameEntity.x) {
            return;
        } else if (dir > 0 && (this.playerEntity.x + this.playerEntity.w * 1.1) >= this.gameEntity.w) {
            return;
        }
        this.playerEntity.moveSpeed(this.config.player.speed * dir, 0, delta)
    }

    playerShoot() {
        //Si ya existe una bala no pude disparar el jugador
        if (this.playerBulletEntity) {
            return;
        }
        let _ = document.getElementById('game');

        let b = this._createPlayerBulletEntity()
        b.owner = this.playerEntity;
        b.x = this.playerEntity.x + (this.playerEntity.w / 2);
        b.y = this.playerEntity.y - (this.config.bullet.h);
        b.update();

        let gameEl = document.getElementById('_space_game');
        var el = document.createElement('div');
        el.setAttribute('fw-attr:style', '_game.playerBulletEntity._style')
        b.element = el;
        gameEl.append(el)
    }

    alienShoot(alien) {
        //Si ya existe una bala no pude disparar el jugador
        if (this.alienBulletEntity) {
            return;
        }
        let _ = document.getElementById('game');

        let b = this._createAlienBulletEntity()
        b.owner = this.alienBulletEntity;
        b.x = alien.x + (alien.w / 2);
        b.y = alien.y + alien.h + (this.config.bullet.h);
        b.update();

        let gameEl = document.getElementById('_space_game');
        var el = document.createElement('div');
        el.setAttribute('fw-attr:style', '_game.alienBulletEntity._style')
        b.element = el;
        gameEl.append(el)
    }

    currPoints = () => {
        return "Puntos: " + "0".repeat(5 - this.points.toString().length) + this.points;
    }

    currLive = () => {
        return "Vidas: " + this.playerLives;
    }

    showGameOver = () => {
        return this.gameover;
    }

    showStartGame = () => {
        return !this.playing && !this.gameover;
    }
}