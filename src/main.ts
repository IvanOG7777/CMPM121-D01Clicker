// Vite turns this import into a production-safe URL. Keep it as a file so
// even this tiny example demonstrates a separately deployed asset.
// @deno-types="./asset-url.d.ts"

//load images
import charmander_image from "./assets/charmander.png";
import charmeleon_image from "./assets/charmeleon.png";
import charizard_image from "./assets/charizard.png";

const app = document.querySelector<HTMLElement>("#app")!;

const heading = document.createElement("h1");
heading.textContent = "ClickerMon";

let coins = 0;
let coinsPerClick = 1;

//upgrade counters
let charmander_count = 0;

//create pokemon sprites
//charmander
const charmander = document.createElement("img");
charmander.src = charmander_image;
charmander.width = 130;
charmander.height = 130;

charmander.style.position = "absolute";
charmander.style.left = "80px";
charmander.style.top = "80px";

charmander.style.visibility = "hidden";

//charmeleon
const charmeleon = document.createElement("img");
charmeleon.src = charmeleon_image;
charmeleon.width = 180;
charmeleon.height = 180;

charmeleon.style.position = "absolute";
charmeleon.style.left = "50px";
charmeleon.style.top = "40px";

charmeleon.style.visibility = "hidden";

//charizard
const charizard = document.createElement("img");
charizard.src = charizard_image;
charizard.width = 250;
charizard.height = 250;

charizard.style.position = "absolute";
charizard.style.left = "0px";
charizard.style.top = "0px";

charizard.style.visibility = "hidden";

const image = document.createElement("img");
image.src = "https://www.serebii.net/itemdex/sprites/sv/pokeball.png";
image.width = 96;
image.height = 96;
image.addEventListener("click", () => {
  coins += coinsPerClick;
  update();
});
image.addEventListener("mousedown", () => {
  image.style = "filter: brightness(0.5)";
});
image.addEventListener("mouseover", () => {
  image.style = "filter: brightness(0.9)";
});
image.addEventListener("mouseup", () => {
  image.style = "filter: brightness(0.9)";
});
image.addEventListener("mouseleave", () => {
  image.style = "filter: brightness(1)";
});

const message = document.createElement("p");
message.textContent = "Click the PokeBall to get coins!";

const coinsText = document.createElement("p");
coinsText.textContent = `Coins: ${coins}`;

let growth = 0;
const growthText = document.createElement("p");
growthText.textContent = `Growth: ${growth} coins/sec`;

//pokemon counter displays
//charmander counter
const charmander_count_text = document.createElement("p");
charmander_count_text.style.position = "absolute";
charmander_count_text.style.left = "210px";
charmander_count_text.style.top = "25px";
charmander_count_text.style.fontSize = "75px";
charmander_count_text.style.visibility = "hidden";

const upgrades = [
  {
    name: "Recruit Charmander",
    cost: 10,
    costIncreaseFactor: 1.25,
    description: "Adds one coin per sec to idle growth",
    effect: () => {
      charmander_count++; //increase the charmander counter
      charmander.style.visibility = "visible"; //make the charmander visible on screen
      charmander_count_text.style.visibility = "visible"; //make the charmander counter visible on the screen
      growth++;
      update();
    },
  },
  {
    name: "Recruit [new pokemon]",
    cost: 500,
    costIncreaseFactor: 1.25,
    description: "Adds two coints per sec to idle growth",
    effect: () => {
      growth += 2;
      update();
    },
  },
  {
    name: "Upgrade PokeBall",
    cost: 1000,
    costIncreaseFactor: 1.5,
    description: "Add one coin per player click",
    effect: () => {
      coinsPerClick++;
      update();
    },
  },
];

app.append(
  heading,
  image,
  message,
  coinsText,
  growthText,
  charmander,
  charmeleon,
  charizard,
  charmander_count_text,
);

//create list object list to hold buttons
const upgradeButtons: HTMLButtonElement[] = [];
upgrades.forEach((upgrade) => {
  const button = createUpgradeButton(upgrade);

  upgradeButtons.push(button); //add the button to array

  const description = document.createElement("p");
  description.textContent = upgrade.description;
  const line = document.createElement("hr");
  line.style = "border: none; border-top: 2px solid black; width: 75%";
  app.append(line, button, description);
});

//Adds coins every second
setInterval(() => {
  coins += growth;
  update();
}, 1000);

function update() {
  //update text
  coinsText.textContent = `Coins: ${coins}`;
  growthText.textContent = `Growth: ${growth} coins/sec`;
  charmander_count_text.textContent = `+${charmander_count}`;

  //iterate through each upgrade value and turn upgrade green if the user can afford the upgrade
  upgrades.forEach((upgrade, index) => {
    const upgradebutton = upgradeButtons[index];
    const affordable = coins >= upgrade.cost;
    //change button color
    upgradebutton.classList.toggle(
      "upgrade-purchasable",
      affordable,
    );
  });
}

function createUpgradeButton(upgrade: {
  name: string;
  cost: number;
  costIncreaseFactor: number;
  effect: () => void;
}) {
  const upgradeButton = document.createElement("button");
  upgradeButton.textContent = `${upgrade.name} | Cost: ${upgrade.cost}`;
  upgradeButton.addEventListener("click", () => {
    if (coins >= upgrade.cost) {
      coins -= upgrade.cost; //subtrack upgrade from users coins
      upgrade.effect(); //execute effect
      upgrade.cost = Math.ceil(upgrade.cost * upgrade.costIncreaseFactor); //increase cost
      upgradeButton.textContent = `${upgrade.name} | Cost: ${upgrade.cost}`; //update Text
    }
  });

  return upgradeButton;
}
