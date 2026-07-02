const questions = [
{
question: "What do you value most?",
answers: [
{text:"Honor", house:"stark"},
{text:"Wealth", house:"lannister"},
{text:"Power", house:"targaryen"},
{text:"Influence", house:"tyrell"}
]
},
{
question: "Choose a castle",
answers: [
{text:"Winterfell", house:"stark"},
{text:"Casterly Rock", house:"lannister"},
{text:"Dragonstone", house:"targaryen"},
{text:"Highgarden", house:"tyrell"}
]
},
{
question: "How would you lead?",
answers: [
{text:"By example", house:"stark"},
{text:"With strategy", house:"lannister"},
{text:"With vision", house:"targaryen"},
{text:"With diplomacy", house:"tyrell"}
]
},
{
question: "Choose an animal",
answers: [
{text:"Wolf", house:"stark"},
{text:"Lion", house:"lannister"},
{text:"Dragon", house:"targaryen"},
{text:"Rose Finch", house:"tyrell"}
]
},
{
question: "Your friends describe you as...",
answers: [
{text:"Loyal", house:"stark"},
{text:"Clever", house:"lannister"},
{text:"Fearless", house:"targaryen"},
{text:"Charming", house:"tyrell"}
]
},
{
question: "Choose a companion",
answers: [
{text:"Direwolf", house:"stark"},
{text:"Advisor", house:"lannister"},
{text:"Dragon", house:"targaryen"},
{text:"Noble Ally", house:"tyrell"}
]
},
{
question: "Pick a color",
answers: [
{text:"Grey", house:"stark"},
{text:"Gold", house:"lannister"},
{text:"Red", house:"targaryen"},
{text:"Green", house:"tyrell"}
]
},
{
question: "What motivates you?",
answers: [
{text:"Duty", house:"stark"},
{text:"Success", house:"lannister"},
{text:"Destiny", house:"targaryen"},
{text:"Influence", house:"tyrell"}
]
},
{
question: "Choose a home",
answers: [
{text:"Winterfell", house:"stark"},
{text:"Casterly Rock", house:"lannister"},
{text:"Dragonstone", house:"targaryen"},
{text:"Highgarden", house:"tyrell"}
]
},
{
question: "Greatest strength?",
answers: [
{text:"Loyalty", house:"stark"},
{text:"Intelligence", house:"lannister"},
{text:"Courage", house:"targaryen"},
{text:"Charm", house:"tyrell"}
]
},
{
question: "How do you handle enemies?",
answers: [
{text:"Face them", house:"stark"},
{text:"Outsmart them", house:"lannister"},
{text:"Overpower them", house:"targaryen"},
{text:"Gather allies", house:"tyrell"}
]
},
{
question: "Choose a weapon",
answers: [
{text:"Sword", house:"stark"},
{text:"Crossbow", house:"lannister"},
{text:"Dragonfire", house:"targaryen"},
{text:"Spear", house:"tyrell"}
]
},
{
question: "Favorite season?",
answers: [
{text:"Winter", house:"stark"},
{text:"Summer", house:"lannister"},
{text:"Spring", house:"targaryen"},
{text:"Autumn", house:"tyrell"}
]
},
{
question: "Most admired quality?",
answers: [
{text:"Honor", house:"stark"},
{text:"Ambition", house:"lannister"},
{text:"Leadership", house:"targaryen"},
{text:"Diplomacy", house:"tyrell"}
]
},
{
question: "Choose a feast",
answers: [
{text:"Northern Stew", house:"stark"},
{text:"Royal Banquet", house:"lannister"},
{text:"Exotic Dishes", house:"targaryen"},
{text:"Garden Feast", house:"tyrell"}
]
},
{
question: "People call you...",
answers: [
{text:"Reliable", house:"stark"},
{text:"Clever", house:"lannister"},
{text:"Fearless", house:"targaryen"},
{text:"Charming", house:"tyrell"}
]
},
{
question: "Choose a banner",
answers: [
{text:"Wolf", house:"stark"},
{text:"Lion", house:"lannister"},
{text:"Dragon", house:"targaryen"},
{text:"Rose", house:"tyrell"}
]
},
{
question: "What would you fight for?",
answers: [
{text:"Family", house:"stark"},
{text:"Legacy", house:"lannister"},
{text:"The Throne", house:"targaryen"},
{text:"Prosperity", house:"tyrell"}
]
},
{
question: "Choose a ruler",
answers: [
{text:"Ned Stark", house:"stark"},
{text:"Tywin Lannister", house:"lannister"},
{text:"Daenerys", house:"targaryen"},
{text:"Olenna Tyrell", house:"tyrell"}
]
},
{
question: "What is your destiny?",
answers: [
{text:"Protect the North", house:"stark"},
{text:"Build a Legacy", house:"lannister"},
{text:"Rule Westeros", house:"targaryen"},
{text:"Guide the Realm", house:"tyrell"}
]
}
];

let currentQuestion = 0;

const scores = {
stark:0,
lannister:0,
targaryen:0,
tyrell:0
};

const questionEl = document.getElementById("question");
const answersEl = document.getElementById("answers");
const counterEl = document.getElementById("question-counter");
const progressBar = document.getElementById("progress-bar");
const resultEl = document.getElementById("result");

function showQuestion(){

const q = questions[currentQuestion];

counterEl.textContent =
`Question ${currentQuestion + 1} of ${questions.length}`;

progressBar.style.width =
`${((currentQuestion + 1) / questions.length) * 100}%`;

questionEl.textContent = q.question;

answersEl.innerHTML = "";

q.answers.forEach(answer => {

const btn = document.createElement("button");

btn.textContent = answer.text;

btn.onclick = () => {

scores[answer.house]++;
currentQuestion++;

if(currentQuestion < questions.length){
showQuestion();
}else{
showResult();
}

};

answersEl.appendChild(btn);

});

}

function showResult(){

document.getElementById("quiz").style.display = "none";

let winner = "stark";

for(const house in scores){

if(scores[house] > scores[winner]){
winner = house;
}

}

const houseNames = {
stark:"House Stark 🐺",
lannister:"House Lannister 🦁",
targaryen:"House Targaryen 🐉",
tyrell:"House Tyrell 🌹"
};

resultEl.innerHTML = `
<h2>${houseNames[winner]}</h2>
<p>Your answers match this great house of Westeros.</p>

<button id="retakeBtn">⚔️ Retake Quiz</button>
`;

const card = document.getElementById(winner);

if(card){
card.classList.add("highlight");
card.scrollIntoView({
behavior:"smooth"
});
}

document.getElementById("retakeBtn").onclick = retakeQuiz;

}

function retakeQuiz(){

currentQuestion = 0;

for(const house in scores){
scores[house] = 0;
}

document.querySelectorAll(".house").forEach(card=>{
card.classList.remove("highlight");
});

resultEl.innerHTML = "";

document.getElementById("quiz").style.display = "block";

showQuestion();

document.getElementById("quiz").scrollIntoView({
behavior:"smooth"
});

}

showQuestion();