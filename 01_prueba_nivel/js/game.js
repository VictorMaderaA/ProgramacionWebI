let cards = [0, 0, 0, 0];
//1 picas
//2 dimantes

function startGame() {

  genRandomCardOrder();

  $("#card-text-1").html(getCardName(cards[0]));
  $("#card-text-2").html(getCardName(cards[1]));
  $("#card-text-3").html(getCardName(cards[2]));
  $("#card-text-4").html(getCardName(cards[3]));

}

function getCardName(number){
  if(number === 1){
    return "As de Picas"
  }else{
    return "As de Diamantes"
  }
}

function genRandomCardOrder() {
  let done = false;
  let i = 0;
  let ct1 = 0;
  let ct2 = 0;
  while (i <= 3 && ct1 <= 2 && ct2 <= 2) {
    console.log(1);
    let type = getRandomCard();
    if (type) {
      cards[i] = 1;
      ct1++;
    } else {
      cards[i] = 2;
      ct2++;
    }

    if (ct1 > 2 || ct2 > 2) {
      ct1 = 0;
      ct2 = 0;
      i = 0;
    } else {
      i++;
    }
  }
  console.log(cards[0], cards[1], cards[2], cards[3]);
}

function getRandomCard() {
  return Math.floor(Math.random() * 2);
}