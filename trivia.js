const game = document.getElementById("game");
const scoreDisplay = document.getElementById("score");
let score = 0;
const genres = [
  {
    name: "Film",
    id: 11,
  },
  {
    name: "Books",
    id: 10,
  },
  {
    name: "Music",
    id: 12,
  },
  {
    name: "Video Games",
    id: 15,
  },
];
const levels = ["easy", "medium", "hard"];
function addGenre(genre) {
  const column = document.createElement("div");
  column.classList.add("genre-column");
  column.innerHTML = genre.name;
  game.append(column);

  levels.forEach(level => {
    const card = document.createElement("div");
    column.append(card);
    card.classList.add("card");

    if (level === "easy") {
      card.innerHTML = 100;
    }
    if (level === "medium") {
      card.innerHTML = 200;
    }
    if (level === "hard") {
      card.innerHTML = 300;
    }
    fetch(
      `https://opentdb.com/api.php?amount=1&category=${genre.id}&difficulty=${level}&type=boolean`
    )
      .then(res => res.json())
      .then(data => {
        card.setAttribute("data-question", data.results[0].question);
        card.setAttribute("data-answer", data.results[0].correct_answer);
        card.setAttribute("data-value", card.innerHTML);
      })
      .then(done => {
        card.addEventListener("click", flipCard);
      })
      .catch(err => {
        console.log(err);
      });
  });
}
genres.forEach(genre => {
  addGenre(genre);
});

function flipCard() {
  console.log("clicked");
  const textDisplay = document.createElement("div");
  const trueButton = document.createElement("button");
  const falseButton = document.createElement("button");
  trueButton.innerHTML = "True";
  falseButton.innerHTML = "False";
  trueButton.addEventListener("click", getResult);
  falseButton.addEventListener("click", getResult);
  textDisplay.innerHTML = this.getAttribute("data-question");
  this.append(textDisplay, trueButton, falseButton);
  const allCards = Array.from(document.querySelectorAll(".card"));
  console.log(allCards);
  allCards.forEach(card => card.removeEventListener("click", flipCard));
}

function getResult() {
  const allCards = Array.from(document.querySelectorAll(".card"));
  allCards.forEach(card => {
    card.addEventListener("click", flipCard);
  });
  const cardButton = this.parentElement;
  if (cardButton.getAttribute("data-answer") === this.innerHTML) {
    score = score + parseInt(cardButton.getAttribute("data-value"));
    scoreDisplay.innerHTML = score;
    cardButton.classList.add("correct-answer");
    setTimeout(() => {
      while (cardButton.firstChild) {
        cardButton.removeChild(cardButton.lastChild);
      }
      cardButton.innerHTML = cardButton.getAttribute("data-value");
    }, 100);
  } else {
    cardButton.classList.add("wrong-answer");
    setTimeout(() => {
      while (cardButton.firstChild) {
        cardButton.removeChild(cardButton.lastChild);
      }
      cardButton.innerHTML = 0;
    });
  }
  cardButton.removeEventListener("click", flipCard);
}
