function Monster (game, key, frame, xpos, ypos, scale)
{
	Phaser.Sprite.call(this, game, xpos, ypos, key, frame);
	this.anchor.set(0.5);
	this.scale.x = scale;
	this.scale.y = scale;

	game.physics.enable(this);
	this.body.collideWorldBounds = true;
}

Monster.prototype = Object.create(Phaser.Sprite.prototype);
Monster.prototype.constructor = Monster;