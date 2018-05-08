function Monster (game, key, frame, scale)
{
	Phaser.Sprite.call(this, game, 500, 500, key, frame);
	this.anchor.set(0.5);
	this.scale.x = scale;
	this.scale.y = scale;

	game.physics.enable(this);
	this.body.collideWorldBounds = true;
}

Monster.prototype = Object.create(Phaser.Sprite.prototype);
Monster.prototype.constructor = Monster;