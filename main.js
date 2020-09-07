const randOppo = document.querySelector(".content-random-play");
const timed = document.querySelector(".player-timed");
const unTimed = document.querySelector(".player-untimed");
const hint = document.querySelector('.hint');
let countdownEl = document.querySelector('.timer');
document.querySelector(".showcase-aphabets").addEventListener("click", letterExist)
document.querySelector('.hint').addEventListener('click', getHint)
document.addEventListener("DOMContentLoaded", onStart);
let clickDisabled = true;
let randWord;
let arr = [];
const startingMinutes = 1;
let time = startingMinutes * 90;
let count = 0;
let stopTimer;
let flag;
let userInput = [];

let dict = [
    "ALGORITHMS",
    "BACKGROUND",
    "DISCOURAGE",
    "HARVEST",
    "IMPORT",
    "LUNCHTIME",
    "PALINDROME",
    "PLAYING",
    "PROFITABLE",
    "DESKTOP",
    "THUMBNAILS",
];

// Load all event listeners
loadEventListeners();

// Load all event listeners
function loadEventListeners() {
    //Play against Random Opponent
    randOppo.addEventListener("click", randOpponentGame);

    //Play Timed Game
    timed.addEventListener("click", timedGame);

    //Play Untimed Game
    unTimed.addEventListener("click", unTimedGame);
}

async function onStart() {
    
    let arr1 = [];
    let xhr = new XMLHttpRequest();

    xhr.open('GET', 'http://localhost:3000/words', false);
    
    try {
      xhr.send();
      if (xhr.status != 200) {
        alert(`Error ${xhr.status}: ${xhr.statusText}`);
      } else {
        arr1 = JSON.parse(xhr.response)
      }
    } catch(err) { // instead of onerror
      alert("Request failed");
    }
    for(let i = 0 ;i<arr1.length;i++){
        dict[i] = arr1[i].word;
    }

    randWord = generateRandomWord();
    console.log(randWord,"randWord Welcome");

}

function randOpponentGame() {
    randOpponentGameStyle();
}

function randOpponentGameStyle() {
    document.querySelector(".player-timed").style = "pointer-events: none";
    document.querySelector(".player-untimed").style = "pointer-events: none";
    if (clickDisabled) {
        let divEle = document.createElement("h1");
        clickDisabled = false;
        divEle.className = "alert-random-play";
        divEle.appendChild(document.createTextNode("We're Working on this Feature!!! Mean While PLAY Single Player Timed & Untimed Game"));
        document.querySelector(".random-play-status").appendChild(divEle);
        setTimeout(() => {
            document.querySelector(".alert-random-play").style.display = "none";
            window.location.reload(true);
        }, 3000);
    }
}

function helper() {
    helperStyle();
    userInput = [...Array(randWord.length)]
    createLetterInput(randWord);
}

function helperStyle() {
    document.querySelector("main").style.display = "none";
    document.querySelector(".section-container").style.display = "block";
    document.querySelector(".hint-timer").style.display = "block";
}

function timedGame() {
    flag = true;
    helper();
    stopTimer = setInterval(startCounter, 1000);
}

function unTimedGame() {
    flag = false;
    helper();
}

function startCounter() {
    const minutes = Math.floor(time / 60);
    let seconds = time % 60;
    if (minutes == 0 && seconds == 1) {
        clearTimeout(stopTimer);
        countdownEl.style.display = "none";
        let text = `Timeout Word is ${randWord} Press "Enter" To Play Again..?`;
        let displayText = document.createTextNode(text)
        document.querySelector(".play-again-text").appendChild(displayText);
        document.addEventListener("keypress", (e) => {
            window.location.reload(true);
        });
        disableClick();
    }
    countdownEl.innerHTML = `${minutes}: ${seconds}`;
    time--;
}

function disableClick() {
    document.querySelector('.hint').style = "pointer-events: none";
    document.querySelector(".showcase-aphabets").style = "pointer-events: none";
    document.querySelector(".timer").style.display = "none";
    
}

function generateRandomWord() {
    let num = Math.floor(Math.random() * Math.floor(50));
    return dict[num];
}

function createLetterInput(word) {
    for (let i = 0; i < word.length; i++) {
        let spanEle = document.createElement('span');
        spanEle.className = "showcase-line-spanEle";
        document.querySelector(".showcase-line").appendChild(spanEle);
    }
}
let testarr = [];

//Checks If the Letter Exists
function letterExist(e) {


        if(testarr.includes(e.target.textContent)){
            return;
        }
        else{
        testarr.push(e.target.textContent);    
        console.log(e.target.textContent,"testing2") 
        arr = document.querySelectorAll(".showcase-line-spanEle");
        arr = Array.from(arr);
        randomWord = randWord.toUpperCase();
        
        for (let i = 0; i < arr.length; i++) {
            console.log(i, "inside i");
            console.log(arr,"inside letterexist",randWord,"e",e.target.textContent,randomWord[i]);
            if (e.target.textContent == randomWord[i]) {
                count = count + 1;
                console.log(count, "inside main")
                arr[i].textContent = `${randomWord[i]}`;
                userInput[i] = `${randomWord[i]}`;
    
                // colorCorrectAlphabets(e);
                updateCount(count);
                if (count === randWord.length) {
                    if (flag) {
                        setTimeout(() => {
                            clearTimeout(stopTimer);
                            countdownEl.style.display = "none";
                            let text = `The Word is ${randomWord} Well Done!!! \n Press Any Key To Play Again..?`;
                            let displayText = document.createTextNode(text)
                            document.querySelector(".play-again-text").appendChild(displayText);
                            document.addEventListener("keypress", (e) => {
                                window.location.reload(true);
                            });
                        }, 100)
                    } else {
                        setTimeout(() => {
                            successDisplay();
                        }, 100)
                    }
                }
                
            } else {
                // colorWrongAlphabets(e)
            }
        };
        }       
}



function colorCorrectAlphabets(e) {
    console.log("inside correct")
    console.log(e.target);
    e.target.style = "pointer-events: none"
    e.target.style.background = "white";
    e.target.style.color = "#2ecc71";
    e.target.style.border = "1px solid #2ecc71";
}

function colorWrongAlphabets(e) {
    console.log("inside incorrect")
    console.log(e.target);
    e.target.style = "pointer-events: none"
    e.target.style.background = "white";
    e.target.style.color = "red";
    e.target.style.border = "1px solid red";
}

let lifeLeft = 2;
function getHint(e) {
    console.log(count, "inside sub");
    console.log(randWord, "inside sub");
    console.log(arr, "inside sub");
    console.log(lifeLeft, "left lives count");
    if (arr.length == 0) {
        // alert("Start With Vowels!!!");
        document.querySelector(".hint-container").style.display = 'block';
        document.querySelector(".hint-life").textContent = `Start With VOWELS`;
        setTimeout(()=>{
            document.querySelector(".hint-container").style.display = 'none';    
        },2000);
        
    } else {
        if(lifeLeft >= 0){
            document.querySelector(".hint-container").style.display = 'block';
            document.querySelector(".hint-life").textContent = `${lifeLeft} Live Left`;
            console.log(lifeLeft, "left lives count inside if");
            count = count + 1;
            updateCount(count);
            for (let i = 0; i < randomWord.length; i++) {
                if (arr[i].textContent === "") {
                    arr[i].textContent = randomWord[i];
    
                    if (count == randomWord.length) {
                        successDisplay();
                    }
                    break;
                }
            }
            lifeLeft = lifeLeft - 1;            
        }

    }
}

function updateCount(count) {
    console.log(count, "inside count func");

}

function successDisplay() {
    let text = `The Word is ${randomWord} Well Done!!! \n Press "Enter" To Play Again..?`;
    let displayText = document.createTextNode(text)
    document.querySelector(".play-again-text").appendChild(displayText);
    document.addEventListener("keypress", (e) => {
        window.location.reload(true);
    });
    disableClick();
}
