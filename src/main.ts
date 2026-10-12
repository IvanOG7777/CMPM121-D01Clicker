// Vite turns this import into a production-safe URL. Keep it as a file so
// even this tiny example demonstrates a separately deployed asset.
// @deno-types="./asset-url.d.ts"

const app = document.querySelector<HTMLElement>("#app")!;

const heading = document.createElement("h1");
heading.textContent = "ClickerMon";

let counter = 0;
const coinsPerClick = 1;

const image = document.createElement("img");
image.src = "https://www.serebii.net/itemdex/sprites/sv/pokeball.png";
image.width = 96;
image.height = 96;
image.addEventListener("click", () => {
  counter += coinsPerClick;
  update();
});
image.addEventListener("mousedown", () => {
  image.style = "filter: brightness(0.5)";
});
image.addEventListener("mouseover", () => {
  image.style = "filter: brightness(0.75)";
});
image.addEventListener("mouseup", () => {
  image.style = "filter: brightness(1)";
});

const message = document.createElement("p");
message.textContent = "Click the PokeBall to get coins!";

const counterText = document.createElement("p");
counterText.textContent = `Coins: ${counter}`;

let growth = 0;
const growthText = document.createElement("p");
growthText.textContent = `Growth: ${growth} coins/sec`;

const upgrades = [
  {
    name: "Growth +1",
    cost: 50,
    description: "Adds one coin per sec to idle growth",
    effect: () => {
      growth++;
      update();
    },
  },
  {
    name: "Growth +2",
    cost: 500,
    description: "Adds two coins per sec to idle growth",
    effect: () => {
      growth += 2;
      update();
    },
  },
];

app.append(
  heading,
  image,
  message,
  counterText,
  growthText,
);

upgrades.forEach((upgrade) => {
  const button = createUpgradeButton(upgrade);
  const description = document.createElement("p");
  description.textContent = upgrade.description;
  const line = document.createElement("hr");
  line.style = "border: none; border-top: 2px solid black; width: 75%";
  app.append(line, button, description);
});

setInterval(() => {
  counter += growth;
  update();
}, 1000);

function update() {
  counterText.textContent = `Coins: ${counter}`;
  growthText.textContent = `Growth: ${growth} coins/sec`;
}

function createUpgradeButton(upgrade: {
  name: string;
  cost: number;
  effect: () => void;
}) {
  const upgradeButton = document.createElement("button");
  upgradeButton.textContent = `${upgrade.name} | Cost: ${upgrade.cost}`;
  upgradeButton.addEventListener("click", () => {
    upgrade.effect(); //execute effect
    upgrade.cost = Math.ceil(upgrade.cost * 1.25); //increase cost
    upgradeButton.textContent = `${upgrade.name} | Cost: ${upgrade.cost}`; //update Text
  });

  return upgradeButton;
}
