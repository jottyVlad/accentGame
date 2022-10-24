const startPlayButton = document.getElementById("startPlay");
const viewInstructionsButton = document.getElementById("viewInstructions");
const main = document.getElementsByTagName("main")[0];
const wordDiv = document.getElementsByClassName("word")[0];
const continueButton = document.getElementById("continue");
const timerSpan = document.getElementById("timer-time");
const scoresDiv = document.getElementById("scores");
const scoresSpan = document.getElementById("scores-num");

Array.prototype.random = function () {
    return this[Math.floor((Math.random()*this.length))];
}

let vowels = 'аяуюоеёэиы';
let wordsArray = readTextFile('./files/words.txt').split('\n');
let scores = 0;
let words = 0;

let timeout;

function processLetterClick(e) {
    let btn = e.target;
    let isVowel = (btn.attributes.getNamedItem("isVowel").textContent === "true");

    if(!isVowel)
        return;

    let isRightVowel = btn.attributes.getNamedItem("rightVowel").textContent === "true";
    if (isRightVowel) {
        btn.parentNode.childNodes.forEach(elem => {
            elem.removeEventListener("click", processLetterClick);
            let isRightVowelInside = (elem.attributes.getNamedItem("rightVowel").textContent === "true");


            if(isRightVowelInside)
                elem.style.border = "yellow solid 2px"
            else
                elem.style.border = "green solid 2px";
        })
        scores++;
        words++;
    } else {
        btn.parentNode.childNodes.forEach(elem => {
            elem.removeEventListener("click", processLetterClick);
            let isRightVowelInside = (elem.attributes.getNamedItem("rightVowel").textContent === "true");


            if(isRightVowelInside)
                elem.style.border = "yellow solid 2px"
            else
                elem.style.border = "red solid 2px";
        })
        words++;
    }
}

function prepareWordElement(word) {
    for (let i = 0; i < word.length; i++) {
        let letterButton = document.createElement("button");
        let letter = word[i];
        let isVowel = false;
        let isRightVowel = false;
        if (vowels.includes(letter.toLowerCase())) {
            isVowel = true;
            if(!(vowels.includes(letter))) {
                isRightVowel = true;
            }
        }

        letterButton.textContent = letter.toLowerCase();
        let attrVowel = document.createAttribute('isVowel');
        attrVowel.value = isVowel.toString();
        letterButton.attributes.setNamedItem(attrVowel);

        let attrRightVowel = document.createAttribute('rightVowel');
        attrRightVowel.value = isRightVowel.toString();
        letterButton.attributes.setNamedItem(attrRightVowel);

        wordDiv.appendChild(letterButton);

        letterButton.addEventListener("click", processLetterClick);
    }
}

function readTextFile(file)
{
    let rawFile = new XMLHttpRequest();
    rawFile.open("GET", file, false);
    rawFile.onreadystatechange = function ()
    {
        if(rawFile.responseText) {
            return rawFile.responseText;
        }
        return null;
    }
    rawFile.send(null);
    return rawFile.responseText;
}

let currentWord;

startPlayButton.addEventListener("click", () => {
    viewInstructionsButton.style.display = "none";

    currentWord = wordsArray.random();
    prepareWordElement(currentWord);
    continueButton.style.display = "block";

    timer();
})

continueButton.addEventListener("click", () => {
    if (words > 20) {
        clearTimeout(timeout);
        continueButton.removeEventListener("click", this);
        scoresSpan.textContent = Math.round(scores * 1000 / secs).toString();
        scoresDiv.style.display = "flex";
        return
    }
    let newWord = wordsArray.random();
    while(newWord === currentWord) {
        newWord = wordsArray.random();
    }
    currentWord = newWord;

    while(wordDiv.firstChild) {
        wordDiv.removeChild(wordDiv.firstChild);
    }

    prepareWordElement(currentWord);
})

let secs = 0;

function timer() {
    timeout = setTimeout(add, 1000);
}

function add() {
    secs++;
    timerSpan.textContent = secs.toString()+"s";
    timer();
}