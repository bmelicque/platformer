import { playerElementInnerHTML } from "../../assets/playerElement.js";
import { COLLISIONS } from "../../collision.js";

const INTIAL_POSITION = {
	x: 20,
	y: 30,
};
const PLAYER_WIDTH = 3;
const PLAYER_HEIGHT = 4.4;
const JUMP_HEIGHT = 20; // normalized game length unit
const JUMP_DURATION = 1; // seconds
export const MOVEMENT_SPEED = 45;
export const JUMP_SPEED = (4 * JUMP_HEIGHT) / JUMP_DURATION;
export const GRAVITY = (8 * JUMP_HEIGHT) / JUMP_DURATION ** 2;

export default class Player {
	#element;
	#position = {};
	#speed = {};
	#width = PLAYER_WIDTH;
	#height = PLAYER_HEIGHT;
	#isAirborne = true;
	#inventory = [];

	constructor() {
		this.init();
	}

	get position() {
		return this.#position;
	}

	get speed() {
		return this.#speed;
	}

	get height() {
		return this.#height;
	}

	get width() {
		return this.#width;
	}

	get inventory() {
		return this.#inventory;
	}

	addItemToInventory(item) {
		this.#inventory.push(item);
	}

	init() {
		this.#position = { ...INTIAL_POSITION };
		this.#speed = {
			x: 0,
			y: 0,
		};

		this.#drawElement();
	}

	reset() {
		this.erase();
		this.init();
	}

	erase() {
		this.#element.remove();
	}

	#drawElement() {
		this.#element = document.createElement("div");
		this.#element.classList.add("player");
		this.#element.innerHTML = playerElementInnerHTML;
		this.#element.style.transform = `translate(${this.#position.x}em, ${
			this.#position.y
		}em)`;
		this.#element.style.width = `${this.#width}em`;
		this.#element.style.height = `${this.#height}em`;
		document.querySelector("[data-level]").appendChild(this.#element);
	}

	handleInputs(inputs) {
		if (inputs.jump && !this.#isAirborne) {
			this.#isAirborne = true;
			this.#speed.y = -JUMP_SPEED;
		}

		if (inputs.right && !inputs.left) this.#speed.x = MOVEMENT_SPEED;
		else if (inputs.left && !inputs.right) this.#speed.x = -MOVEMENT_SPEED;
		else this.#speed.x = 0;
	}

	handleGravity() {
		const {
			_Clock: { delta },
		} = window;

		this.#speed.y += GRAVITY * delta;
	}

	handleLevelCollisions(platforms) {
		this.#isAirborne = true;
		platforms.forEach((platform) => {
			const collisionResult = platform.handleCollision(this);
			if (collisionResult === COLLISIONS.LANDING) {
				this.#position.y = platform.position.y - this.#height;
				this.#speed.y = 0;
				this.#isAirborne = false;
			}
			if (collisionResult === COLLISIONS.HORIZONTAL_STOP) {
				if (this.#position.x <= platform.position.x)
					this.#position.x = platform.position.x - this.#width;
				else this.#position.x = platform.position.x + platform.width;
				this.#speed.x = 0;
			}
			if (collisionResult === COLLISIONS.VERTICAL_STOP) {
				this.#position.y = platform.position.y + platform.height;
				this.#speed.y = 0;
			}
		});
	}

	updatePosition() {
		const {
			_Clock: { delta },
		} = window;

		this.#position.x += this.#speed.x * delta;
		if (this.#position.x <= 0) this.#position.x = 0;
		this.#position.y += this.#speed.y * delta;
	}

	updateSprite() {
		this.#element.style.transform = `translate(${this.#position.x}em, ${
			this.#position.y
		}em)`;

		this.#handleAnimations();
	}

	#handleAnimations() {
		if (this.#speed.x && !this.#isAirborne)
			this.#element.classList.add("player--running");
		else this.#element.classList.remove("player--running");

		if (this.#speed.x > 0)
			this.#element.classList.remove("player--facing-backwards");
		else if (this.#speed.x < 0)
			this.#element.classList.add("player--facing-backwards");

		if (this.#isAirborne) this.#element.classList.add("player--airborne");
		else this.#element.classList.remove("player--airborne");
	}
}
