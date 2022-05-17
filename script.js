import Player from "./lib/models/player.js";
import Level from "./lib/models/level.js";
import Clock from "./lib/models/clock.js";
import Inputs from "./lib/models/inputs.js";

export const WORLD_WIDTH = 100;
export const WORLD_HEIGHT = 55;

const worldElement = document.querySelector("[data-world]");

setPixelToWorldScale();
window.addEventListener("resize", setPixelToWorldScale);

function setPixelToWorldScale() {
	let worldToPixelScale;
	if (window.innerWidth / window.innerHeight < WORLD_WIDTH / WORLD_HEIGHT)
		worldToPixelScale = window.innerWidth / WORLD_WIDTH;
	else worldToPixelScale = window.innerHeight / WORLD_HEIGHT;

	worldElement.style.setProperty(
		"--world-to-pixel-scale",
		worldToPixelScale + "px"
	);

	worldElement.style.width = `${WORLD_WIDTH * worldToPixelScale}px`;
	worldElement.style.height = `${WORLD_HEIGHT * worldToPixelScale}px`;
}

const inputs = new Inputs();
inputs.addEventListeners();

const level = new Level(1);
const player = new Player();

window._Clock = new Clock();
const clock = window._Clock;

function animate(time) {
	if (!clock.update(time)) return requestAnimationFrame(animate);

	player.handleInputs(inputs);

	player.handleGravity();

	player.handleLevelCollisions(level.platforms);

	level.handleItemCollisions(player);

	level.handleGoal(player);

	player.updatePosition();

	player.updateSprite();

	level.scroll(player);

	requestAnimationFrame(animate);
}

animate();