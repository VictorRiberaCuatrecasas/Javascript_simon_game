let gamePattern = [];
let buttonColours = ["red", "blue", "green", "yellow"];
let userClickedPattern = [];
let level = 0;
let started = false;
let scoreboard = [];
let table1 = document.querySelector("#table1");

// STARTS THE GAME ON CLICK

$("#level-title").click(function() {
  $("#dory").removeClass("dory");
  $("#cheating").removeClass("cheating");
  startOver();
  if (!started) {
    $("#level-title").text("Level " + level);
    nextSequence();
    started = true;
  }
});

// PUSHES COLOR CLICKED INTO USERCLICKEDPATTERN
$(".btnsimon").click(function() {
  let userChosenColour = this.id;
  userClickedPattern.push(userChosenColour);

  playSound(userChosenColour);
  animatePress(userChosenColour);

  checkAnswer(userClickedPattern.length - 1);
});

//MAKES SOUNDS WHEN BUTTONS CLICKED OR SEQUENCE FOLLOWED
function playSound(name) {
  var audio = new Audio("sounds/" + name + ".mp3");
  audio.play();
}

// MAKES CLICKED BUTTONS ANIMATED
function animatePress(currentColor) {
  $("#" + currentColor).addClass("pressed");

  setTimeout(function() {
    $("#" + currentColor).removeClass("pressed");
  }, 300);
}

//CHEKING THE ANSWER
function checkAnswer(currentLevel) {
  if (gamePattern[currentLevel] === userClickedPattern[currentLevel]) {
    if (userClickedPattern.length === gamePattern.length) {
      setTimeout(function() {
        nextSequence();
      }, 1000);
    }
  } else {
    playSound("wrong");
    $("body").addClass("game-over");
    setTimeout(function() {
      $("body").removeClass("game-over");
    }, 200);
    $("#level-title").text("Game over, click on tittle to restart");

    if (level > 29) {
      $("#cheating").addClass("cheating");
    } else if (level > 20) {
      $("#dory").addClass("dory");
    }

    if (level > scoreboard[9].score) {
      $("#top10btn").click();
    }
  }
}

//DEFINES A RANDOM COLOR AND PUSHES IT RANDOMCHOSENCOLOR
function nextSequence() {
  let randomNumber;
  let randomChosenColour;
  userClickedPattern = [];

  level++;
  $("#level-title").text("Level " + level);

  randomNumber = Math.floor(Math.random() * 4);
  randomChosenColour = buttonColours[randomNumber];
  gamePattern.push(randomChosenColour);

  $("#" + randomChosenColour)
    .fadeOut(200)
    .fadeIn(200)
    .fadeOut(200)
    .fadeIn(200);

  playSound(randomChosenColour);
}

//START OVER

function startOver() {
  level = 0;
  gamePattern = [];
  started = false;
}

// SCOREBOARD FIREBASE DATABASE

document.getElementById("send").addEventListener("click", sendMessage);

// SENDS TEXT AND SCORE TO DATABASE
function sendMessage() {
  var text = document.getElementById("text").value;
  var score = level;
  var objectToSend = {
    text,
    score
  };
  firebase
    .database()
    .ref("scores")
    .push(objectToSend);
  console.log(objectToSend);
}

//GETS THE TOP 10 SCORES AND PRINTS THEM
function getMessages() {
  firebase
    .database()
    .ref("scores")
    .on("value", data => {
      for (let key in data.val()) {
        let element = data.val()[key];

        scoreboard.push({ text: element.text, score: element.score });
      }
      scoreboard.sort(function(a, b) {
        return a.score - b.score;
      });
      scoreboard.reverse();
      scoreboard = scoreboard.slice(0, 10);
      tableScore();
    });
}

//PAINTS TABLE
function tableScore() {
  var t = `
            <table>
                <tr>
                    <th>Position</th>
                    <th>Name</th>
                    <th>Score</th>
                </tr>
            <tbody>`;
  for (var i = 0; i < scoreboard.length; i++) {
    let tableROW = `<tr>
                    <td>${[i + 1]}</td>
                    <td>${scoreboard[i].text}</td>
                    <td>${scoreboard[i].score}</td>
                </tr>`;
    t += tableROW;
  }

  table1.innerHTML = t;
}

//CLOSE MODAL

function closeModal() {
  scoreboard = [];
  $("#close").click();
}
