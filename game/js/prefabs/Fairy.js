function Fairy (game, key, frame, xpos, ypos, scale, element)
{
	Phaser.Sprite.call(this, game, xpos, ypos, key, frame);
	String type = element;
	
	this.anchor.set(0.5);
	this.scale.x = scale;
	this.scale.y = scale;

	game.physics.enable(this);
	this.body.collideWorldBounds = true;
}

Fairy.prototype = Object.create(Phaser.Sprite.prototype);
Fairy.prototype.constructor = Fairy;