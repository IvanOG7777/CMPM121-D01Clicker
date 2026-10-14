// Vite turns this import into a production-safe URL. Keep it as a file so
// even this tiny example demonstrates a separately deployed asset.
// @deno-types="./asset-url.d.ts"

//load images
import charmander_image from "./assets/charmander.png";
import charmeleon_image from "./assets/charmeleon.png";
import charizard_image from "./assets/charizard.png";

//grab HTML divs
const statsDiv = document.querySelector<HTMLElement>("#stats")!;
const upgradeDiv = document.querySelector<HTMLElement>("#upgrades")!;

const heading = createTextElement("ClickerMon", "h1");

//stats
let coins = 0;
let coinsPerClick = 1;
let growth = 0;

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
charmeleon.style.top = "250px";

charmeleon.style.visibility = "hidden";

//charizard
const charizard = document.createElement("img");
charizard.src = charizard_image;
charizard.width = 250;
charizard.height = 250;

charizard.style.position = "absolute";
charizard.style.left = "0px";
charizard.style.top = "450px";

charizard.style.visibility = "hidden";

const pokeballImage = document.createElement("img");
pokeballImage.src = "https://www.serebii.net/itemdex/sprites/sv/pokeball.png";
pokeballImage.width = 96;
pokeballImage.height = 96;
pokeballImage.addEventListener("click", () => {
  coins += coinsPerClick;
  update();
});
pokeballImage.addEventListener("mousedown", () => {
  pokeballImage.style = "filter: brightness(0.5)";
});
pokeballImage.addEventListener("mouseover", () => {
  pokeballImage.style = "filter: brightness(0.9)";
});
pokeballImage.addEventListener("mouseup", () => {
  pokeballImage.style = "filter: brightness(0.9)";
});
pokeballImage.addEventListener("mouseleave", () => {
  pokeballImage.style = "filter: brightness(1)";
});

const message = createTextElement("Click the PokeBall to get coins!");
const coinsText = createTextElement(`Coins: ${coins}`);
const growthText = createTextElement(`Growth: ${growth} coins/sec`);
const coinsPerClickText = createTextElement(
  `Clicks: ${coinsPerClick} coins/click`,
);

//Constructor for Counter Displays
class CounterDisplay {
  name: string;
  count: number;
  element: HTMLParagraphElement;

  constructor(
    name: string,
    count: number,
    position: string,
    left: string,
    top: string,
    fontSize: string,
    visiblity: string,
  ) {
    this.name = name;
    this.count = count;

    this.element = document.createElement("p");
    this.element.style.position = position;
    this.element.style.left = left;
    this.element.style.top = top;
    this.element.style.fontSize = fontSize;
    this.element.style.visibility = visiblity;

    document.body.appendChild(this.element);
  }
}

//create list holding the pokemon counters
const counter_displays = [
  {
    name: "Charmander",
    count: 0,
    position: "absolute",
    left: "240px",
    top: "100px",
    fontSize: "75px",
    visibility: "hidden",
  },
  {
    name: "Charmeleon",
    count: 0,
    position: "absolute",
    left: "240px",
    top: "300px",
    fontSize: "75px",
    visibility: "hidden",
  },
  {
    name: "Charizard",
    count: 0,
    position: "absolute",
    left: "240px",
    top: "500px",
    fontSize: "75px",
    visibility: "hidden",
  },
];

//create counter displays
const pokemon_counters = counter_displays.map(
  (counter) =>
    new CounterDisplay(
      counter.name,
      counter.count,
      counter.position,
      counter.left,
      counter.top,
      counter.fontSize,
      counter.visibility,
    ),
);

const upgrades = [
  {
    name: "Recruit Charmander",
    cost: 10,
    costIncreaseFactor: 1.25,
    description: "Adds one coin per sec to idle growth",
    effect: () => {
      pokemon_counters[0].count++; //increase the charmander counter
      charmander.style.visibility = "visible"; //make the charmander visible on screen
      pokemon_counters[0].element.style.visibility = "visible"; //make the charmander counter visible on the screen
      growth++;
      update();
    },
  },
  {
    name: "Recruit Charmeleon",
    cost: 50,
    costIncreaseFactor: 1.25,
    description: "Adds two coints per sec to idle growth",
    effect: () => {
      pokemon_counters[1].count++;
      charmeleon.style.visibility = "visible"; //make the charmeleon visible on screen
      pokemon_counters[1].element.style.visibility = "visible"; //make the charmeleon counter visible on the screen
      growth += 2;
      update();
    },
  },
  {
    name: "Recruit Charizard",
    cost: 500,
    costIncreaseFactor: 1.5,
    description: "Adds 5 coints per sec to idle growth",
    effect: () => {
      pokemon_counters[2].count++;
      charizard.style.visibility = "visible";
      pokemon_counters[2].element.style.visibility = "visible";
      growth += 5;
      update();
    },
  },
  {
    name: "Upgrade PokeBall",
    cost: 100,
    costIncreaseFactor: 1.5,
    description: "Add one coin per player click",
    effect: () => {
      coinsPerClick++;
      update();
    },
  },
];

statsDiv.append(
  heading,
  pokeballImage,
  message,
  coinsText,
  growthText,
  coinsPerClickText,
  charmander,
  charmeleon,
  charizard,
);

const upgradesHeading = createTextElement("Upgrades", "h2");
upgradeDiv.append(upgradesHeading);

//create list object list to hold buttons
const upgradeButtons: HTMLButtonElement[] = [];
upgrades.forEach((upgrade) => {
  const button = createUpgradeButton(upgrade);

  upgradeButtons.push(button); //add the button to array

  const description = createTextElement(upgrade.description);
  const line = document.createElement("hr");
  line.style = "border: none; border-top: 2px solid black; width: 75%";
  upgradeDiv.append(line, button, description);
});

//Adds coins every second
setInterval(() => {
  coins += growth;
  update();
}, 1000);

//updates the textContent of all stats AND button color/affordability
function update() {
  //update text
  coinsText.textContent = `Coins: ${coins}`;
  growthText.textContent = `Growth: ${growth} coins/sec`;
  coinsPerClickText.textContent = `Clicks: ${coinsPerClick} coins/click`;
  pokemon_counters[0].element.textContent = `+${pokemon_counters[0].count}`;
  pokemon_counters[1].element.textContent = `+${pokemon_counters[1].count}`;
  pokemon_counters[2].element.textContent = `+${pokemon_counters[2].count}`;

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

//DESCRIPTION:  returns an HTMLElement that holds texts containing the passed string
//PARAMS:       text - text that will be displayed
//              elementType - the type of HTML text element (h1,h2,...,p), defaults as p
//RETURNS:      element - HTMLElement with 'text' as it's textContent
function createTextElement(text: string, elementType = "p") {
  const element = document.createElement(elementType);
  element.textContent = text;
  return element;
}
