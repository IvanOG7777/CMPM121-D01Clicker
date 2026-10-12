// Vite turns this import into a production-safe URL. Keep it as a file so
// even this tiny example demonstrates a separately deployed asset.
// @deno-types="./asset-url.d.ts"

const app = document.querySelector<HTMLElement>("#app")!;

const heading = document.createElement("h1");
heading.textContent = "ClickerMon";

let coins = 0;
let coinsPerClick = 1;

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

const upgrades = [
  {
    name: "Growth +1",
    cost: 10,
    costIncreaseFactor: 1.25,
    description: "Adds one coin per sec to idle growth",
    effect: () => {
      growth++;
      update();
    },
  },
  {
    name: "Growth +2",
    cost: 500,
    costIncreaseFactor: 1.25,
    description: "Adds two coins per sec to idle growth",
    effect: () => {
      growth += 2;
      update();
    },
  },
  {
    name: "Click +1",
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
  coinsText.textContent = `Coins: ${coins}`;
  growthText.textContent = `Growth: ${growth} coins/sec`;

  //iterate through each upgrade value and turn upgrade green if the user can afford the upgrade
  upgrades.forEach((upgrade, index) => {
    const upgradebutton = upgradeButtons[index];
    const affordable = coins >= upgrade.cost;

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
