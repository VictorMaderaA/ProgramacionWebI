//Variables y Funciones globales
var cerox = 383;
var ceroy = 11;
var paredx = 600+cerox;
var paredy = 400+ceroy;
var velocidad = 4;
var puntosj1 = 0;
var puntosj2 = 0;
var p1 = document.getElementById("puntosj1");
var p2 = document.getElementById("puntosj2");

function getX(id){
	var objeto = document.getElementById(id);
	var pos = objeto.style.left;
	var l = pos.length;
	pos = pos.substring(0,l-2);
	pos = parseInt(pos);
	return pos;
}

function getY(id){
	var objeto = document.getElementById(id);
	var pos = objeto.style.top;
	var l = pos.length;
	pos = pos.substring(0,l-2);
	pos = parseInt(pos);
	return pos;
}

function ponerxy(id,x,y){
	var objeto = document.getElementById(id);
	objeto.style.left = x+"px";
	objeto.style.top = y+"px";
}

//Pelota
var xpdir = 1;
var ypdir = 1;
ponerxy("bola", 290+cerox, 190+ceroy);
function Pelota(){
	var posx = getX("bola");
	var posy = getY("bola");
	posx+=xpdir;
	posy+=ypdir;
	if(posx <= cerox){
		xpdir = 1;
		//puntos jugador 2
		puntosj2++;
		p2.innerHTML = puntosj2;
	}
	if(posx >= (paredx-20)){
		xpdir = -1;
		//puntos jugador 1
		puntosj1++;
		p1.innerHTML = puntosj1;
	}
	if(posy <= ceroy){
		ypdir = 1;
	}
	if(posy >= (paredy-20)){
		ypdir = -1;
	}
	ponerxy("bola", posx,posy);
}

//Raqueta
var yj1dir = 0;
var yj2dir = 0;
var x1 = 20+cerox;
var x2 = 560+cerox;
ponerxy("j1", x1, 160);
ponerxy("j2", x2, 160);
function mover(event){
	var c = event.keyCode;
	switch(c){
		case 119 :
			yj1dir = -1;
			break;
		case 115 :
			yj1dir = 1;
			break;
		case 105 :
			yj2dir = -1;
			break;
		case 107 :
			yj2dir = 1;
			break;
	}
}
function parar(event){
	var c = event.keyCode;
	if(c == 87 || c == 83){
		yj1dir = 0;
	}
	if(c == 38 || c == 40){
		yj2dir = 0;
	}
}
function Raqueta(){
	var pos1 = getY("j1");
	pos1+=yj1dir;
	if(pos1 <= ceroy){
		ponerxy("j1", x1, ceroy);
	}
	if(pos1 >= (paredy-80)){
		ponerxy("j1", x1, (paredy-80));
	}
	if(pos1 >= ceroy && pos1 <= (paredy-80)){
		ponerxy("j1", x1, pos1);
	}
	
	var pos2 = getY("j2");
	pos2+=yj2dir;
	if(pos2 <= ceroy){
		ponerxy("j2", x2, ceroy);
	}
	if(pos2 >= (paredy-80)){
		ponerxy("j2", x2, (paredy-80));
	}
	if(pos2 >= ceroy && pos2 <= (paredy-80)){
		ponerxy("j2", x2, pos2);
	}
	
}

//Choques
function choque(){
	if(getX("bola") == (getX("j1")+20)){
		if(getY("bola") >= getY("j1") && getY("bola") <= (getY("j1")+80)){
			xpdir = 1;
		}
	}
	
	if(getX("bola") == (getX("j2")-20)){
		if(getY("bola") >= getY("j2") && getY("bola") <= (getY("j2")+80)){
			xpdir = -1;
		}
	}
}
//Funcion principal del juego
function main(){
	Pelota();
    Raqueta();
	choque();
}
setInterval(main, velocidad);

document.onkeypress = mover;
