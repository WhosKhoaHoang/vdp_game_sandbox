import {vdp, input, color, vec2, mat3} from "../lib/vdp-lib";
import {clamp, getMapBlock, setMapBlock, TextLayer} from './utils';

//NOTE: vdp is a game engine that Florian (workshop speaker) built

function collidesAtPosition(left, top) {
	return getMapBlock("level1", Math.floor(left/16), Math.floor(top/16)) === 38;
}


export function *main() {
	const textLayer = new TextLayer();
	const mario = {
		left: 0,
		top: 0,
		width: 16,
		height: 16,
		get right() { return this.left + this.width; },
		get bottom() { return this.top + this.height; },
		horizontalVelocity: 0,
		verticalVelocity: 0,
		flipH: false,
	}
	vdp.configBackdropColor("#59f");

	while (true) {
		//const color = Math.sin(loop);   // Can use sin to pulsate color

		vdp.drawBackgroundTilemap("level1");
		vdp.drawObject(vdp.sprite("mario").tile(6),
									 mario.left, mario.top,
									 { flipH: mario.flipH });

		// verticalVelocity will help us simulate gravity
		mario.verticalVelocity += 0.1;
		mario.top += mario.verticalVelocity;

		// ===== Collision Detection ===== //
		// Technically, this only check's Mario's left side. You
		// should ultimately check for his right side as well or
		// you'll get weird clipping issues.
		while (collidesAtPosition(mario.left, mario.bottom) ||
	         collidesAtPosition(mario.right, mario.bottom)) {
			mario.top -= 1;
			mario.verticalVelocity = 0;
		}
		while (collidesAtPosition(mario.left, mario.top) ||
					 collidesAtPosition(mario.right, mario.top)) {
			mario.top += 1;
			mario.verticalVelocity = 0;
		}

		while (collidesAtPosition(mario.left, mario.top) ||
					 collidesAtPosition(mario.left, mario.bottom)) {
			mario.left += 1;
			mario.verticalVelocity = 0;
		}
		while (collidesAtPosition(mario.right, mario.top) ||
					 collidesAtPosition(mario.right, mario.bottom)) {
			mario.left -= 1;
			mario.verticalVelocity = 0;
		}

		mario.left += mario.horizontalVelocity;

		// ===== Movement ===== //
		if (input.hasToggledDown(input.Key.Up)) {
			mario.verticalVelocity = -5;
		}
		if (input.isDown(input.Key.Left)) {
			mario.horizontalVelocity = -1;
			mario.flipH = true;
		}
		else if (input.isDown(input.Key.Right)) {
			mario.horizontalVelocity = 1;
			mario.flipH = false;
		}
		else {
			mario.horizontalVelocity = 0;
		}

		textLayer.drawText(0, 29, `x: ${mario.left.toFixed(1)}, `+
													    `y: ${mario.top.toFixed(1)}, `+
															`vy: ${mario.verticalVelocity.toFixed(2)}`);
		textLayer.draw();

		yield;
	}
}
