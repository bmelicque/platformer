// "FROM TOP" means A comes from the top of B, etc.
export const DIRECTIONS = {
	FROM_TOP: 1,
	FROM_RIGHT: 2,
	FROM_BELOW: 3,
	FROM_LEFT: 4,
};

export const COLLISIONS = {
	HORIZONTAL_STOP: "h_stop",
	VERTICAL_STOP: "v_stop",
	LANDING: "landing",
	PLAYER_DAMAGE: "player_dmg",
}

export default function detectCollision(player, element, delta) {
	const playerRects = getRects(player, delta);
	const elementRects = getRects(element, delta);

	if (
		playerRects.nextBottom < elementRects.nextTop ||
		playerRects.nextLeft > elementRects.nextRight ||
		playerRects.nextTop > elementRects.nextBottom ||
		playerRects.nextRight < elementRects.nextLeft
	)
		return;

	let vertical;
	let horizontal;

	if (playerRects.bottom <= elementRects.top)
		vertical = elementRects.nextTop - playerRects.nextBottom;
	if (playerRects.top >= elementRects.bottom)
		vertical = elementRects.nextBottom - playerRects.nextTop;
	if (playerRects.left >= elementRects.right)
		horizontal = elementRects.nextRight - playerRects.nextLeft;
	if (playerRects.right <= elementRects.left)
		horizontal = elementRects.nextLeft - playerRects.nextRight;

	if (!horizontal && !vertical) return;

	if (horizontal === undefined)
		return vertical > 0 ? DIRECTIONS.FROM_BELOW : DIRECTIONS.FROM_TOP;
	if (vertical === undefined)
		return horizontal > 0 ? DIRECTIONS.FROM_RIGHT : DIRECTIONS.FROM_LEFT;

	const tan = vertical / horizontal;

	if (horizontal > 0 && vertical > 0)
		return tan > playerRects.direction
			? DIRECTIONS.FROM_BELOW
			: DIRECTIONS.FROM_RIGHT;
	if (horizontal > 0 && vertical < 0)
		return tan > playerRects.direction
			? DIRECTIONS.FROM_TOP
			: DIRECTIONS.FROM_RIGHT;
	if (horizontal < 0 && vertical > 0)
		return tan > playerRects.direction
			? DIRECTIONS.FROM_BELOW
			: DIRECTIONS.FROM_LEFT;
	if (horizontal < 0 && vertical < 0)
		return tan > playerRects.direction
			? DIRECTIONS.FROM_TOP
			: DIRECTIONS.FROM_LEFT;

	return;
}

function getRects(element, delta) {
	const top = element.position.y;
	const bottom = element.position.y + element.height;
	const left = element.position.x;
	const right = element.position.x + element.width;
	const deltaX = element.speed?.x * delta || 0;
	const deltaY = element.speed?.y * delta || 0;
	const nextTop = top + deltaY;
	const nextBottom = bottom + deltaY;
	const nextLeft = left + deltaX;
	const nextRight = right + deltaX;
	const direction = element.speed?.y / element.speed?.x;

	return {
		top,
		bottom,
		left,
		right,
		nextTop,
		nextBottom,
		nextLeft,
		nextRight,
		direction,
	};
}
