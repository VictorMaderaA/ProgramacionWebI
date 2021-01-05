class Game {

    private = {
        alien:{
            height: 50,
            width: 50,
            scale: 1,
        }
    }


    GameObjects = [

    ];


    init(){
        let asset = new Asset(
            '/assets/InvaderA1.svg',
            true,
            {1: '/assets/InvaderA1.svg',2: '/assets/InvaderA2.svg'},
            [1,2],
            250
        )
        let transform = new Transform(this.private)
        for(let i = 0; i < 10; i++){
            let go = new Entity(this.private.alien.height, this.private.alien.width, transform, this.private.alien.scale)
            transform = Object.assign(Object.create(Object.getPrototypeOf(transform)), transform)
        }
    }


}