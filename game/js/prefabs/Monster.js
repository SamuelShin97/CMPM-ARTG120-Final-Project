function Monster (game, key, frame, xpos, ypos, scale, element)
{
	Phaser.Sprite.call(this, game, xpos, ypos, key, frame);
	this.anchor.set(0.5);
	this.scale.x = scale;
	this.scale.y = scale;
	this.health = 10;
	this.element = element;

	game.physics.enable(this);
	game.physics.arcade.enable(this);
	this.body.collideWorldBounds = true;
	this.body.immovable = true;
}

Monster.prototype = Object.create(Phaser.Sprite.prototype);
Monster.prototype.constructor = Monster;

Monster.prototype.update = function()
{
	if (this.health > 0 && this.health < 3)
	{
		console.log('in damaged state');
	}
	else if (this.health <= 0)
	{
		console.log('killed monster');
		this.kill();
	}
}
