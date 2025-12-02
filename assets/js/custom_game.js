// custom_game.js (atnaujinta versija)
document.addEventListener("DOMContentLoaded", () => {

  const cardSet = [
    "🦊","🐼","🦁","🐸","🐵","🐙",
    "🌵","🍓","🍍","⚽","🚀","🎵"
  ];

  const board = document.getElementById("game-board");
  const startBtn = document.getElementById("start-btn");
  const resetBtn = document.getElementById("reset-btn");
  const movesCountEl = document.getElementById("moves-count");
  const matchesCountEl = document.getElementById("matches-count");
  const winMessageEl = document.getElementById("win-message");
  const difficultyInputs = document.querySelectorAll('input[name="difficulty"]');

  let difficulty = "easy";
  let cols = 4;
  let rows = 3;
  let totalCards = 12;
  let boardData = [];
  let firstCard = null;
  let secondCard = null;
  let lockBoard = false;
  let moves = 0;
  let matches = 0;

  difficultyInputs.forEach(r => r.addEventListener("change", (e) => {
    difficulty = e.target.value;
    configureDifficulty();
    resetGame();
  }));

  function configureDifficulty() {
    if (difficulty === "easy") {
      cols = 4; rows = 3; totalCards = cols * rows;
    } else {
      cols = 6; rows = 4; totalCards = cols * rows;
    }
    board.style.setProperty("--cols", cols);
  }

  function shuffle(array) {
    for (let i = array.length-1; i>0; i--){
      const j = Math.floor(Math.random()*(i+1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  function prepareBoardData() {
    boardData = [];
    const uniqueNeeded = totalCards / 2;
    const source = [];
    for(let i=0;i<uniqueNeeded;i++) source.push(cardSet[i % cardSet.length]);
    const pairs = source.concat(source);
    const shuffled = shuffle(pairs.slice());
    boardData = shuffled.map((val, idx) => ({id: idx, value: val, matched: false}));
  }

  function renderBoard() {
    board.innerHTML = "";
    board.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;

    boardData.forEach(card => {
      const cardEl = document.createElement("div");
      cardEl.className = "card";
      cardEl.dataset.id = card.id;
      cardEl.setAttribute("role","button");
      cardEl.setAttribute("aria-pressed","false");
      cardEl.setAttribute("tabindex","0");

      const inner = document.createElement("div");
      inner.className = "card-inner";

      const back = document.createElement("div");
      back.className = "card-face back";
      back.textContent = "";

      const front = document.createElement("div");
      front.className = "card-face front";
      front.textContent = card.value;

      inner.appendChild(front);
      inner.appendChild(back);
      cardEl.appendChild(inner);

      cardEl.addEventListener("click", () => onCardClick(cardEl));
      cardEl.addEventListener("keydown", (e)=>{
        if(e.key==="Enter" || e.key===" "){
          e.preventDefault();
          onCardClick(cardEl);
        }
      });

      board.appendChild(cardEl);
    });
  }

  function onCardClick(cardEl){
    if(lockBoard) return;
    const id = Number(cardEl.dataset.id);
    const cardObj = boardData.find(c=>c.id===id);
    if(!cardObj || cardObj.matched) return;
    if(firstCard && firstCard.dataset.id === cardEl.dataset.id) return;

    flipCard(cardEl);

    if(!firstCard){
      firstCard = cardEl;
      return;
    } else {
      secondCard = cardEl;
      moves++;
      updateStats();
      checkForMatch();
    }
  }

  function flipCard(cardEl){
    cardEl.classList.add("flipped");
    cardEl.setAttribute("aria-pressed","true");
  }

  function unflipCard(cardEl){
    cardEl.classList.remove("flipped");
    cardEl.setAttribute("aria-pressed","false");
  }

  function checkForMatch(){
    lockBoard = true;
    const id1 = Number(firstCard.dataset.id);
    const id2 = Number(secondCard.dataset.id);
    const card1 = boardData.find(c=>c.id===id1);
    const card2 = boardData.find(c=>c.id===id2);

    if(card1.value === card2.value){
      // Sutampa → paliekame apverstą ir neaktyvią
      card1.matched = true;
      card2.matched = true;
      firstCard.classList.add("matched");
      secondCard.classList.add("matched");

      // Neaktyvuojame click
      firstCard.style.pointerEvents = "none";
      secondCard.style.pointerEvents = "none";

      matches++;
      updateStats();
      firstCard = null;
      secondCard = null;
      lockBoard = false;
      checkWin();
    } else {
      // Nesutampa → apsiverčia po 1s
      setTimeout(()=>{
        unflipCard(firstCard);
        unflipCard(secondCard);
        firstCard=null;
        secondCard=null;
        lockBoard=false;
      },1000);
    }
  }

  function updateStats(){
    movesCountEl.textContent = moves;
    matchesCountEl.textContent = matches;
  }

  function checkWin(){
    if(matches === totalCards/2){
      winMessageEl.classList.add("show");
      winMessageEl.textContent = `Laimėjote! Surasta ${matches} porų per ${moves} ėjimus.`;
    }
  }

  function resetGame(autoStart=false){
    firstCard = null;
    secondCard = null;
    lockBoard = false;
    moves = 0;
    matches = 0;
    updateStats();
    winMessageEl.classList.remove("show");
    prepareBoardData();
    renderBoard();
    document.querySelectorAll(".card").forEach(c => c.classList.remove("flipped","matched"));
    if(autoStart) startGame();
  }

  function startGame(){
    if(!boardData || boardData.length===0) prepareBoardData();
    renderBoard();
    moves=0; matches=0;
    updateStats();
    winMessageEl.classList.remove("show");
    lockBoard=false;
    document.querySelectorAll(".card").forEach(c=>c.classList.remove("flipped","matched"));
  }

  startBtn.addEventListener("click",()=>{
    startBtn.disabled=true;
    resetBtn.disabled=false;
    startGame();
  });

  resetBtn.addEventListener("click",()=>{
    startBtn.disabled=false;
    resetBtn.disabled=false;
    resetGame(true);
  });

  // initial setup
  configureDifficulty();
  prepareBoardData();
  renderBoard();
  updateStats();

});
