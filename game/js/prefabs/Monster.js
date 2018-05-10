function Monster (game, key, frame, xpos, ypos, scale)
{
	Phaser.Sprite.call(this, game, xpos, ypos, key, frame);
	this.anchor.set(0.5);
	this.scale.x = scale;
	this.scale.y = scale;
	this.health = 10;

	game.physics.enable(this);
	game.physics.arcade.enable(this);
	this.body.collideWorldBounds = true;
}

Monster.prototype = Object.create(Phaser.Sprite.prototype);
Monster.prototype.constructor = Monster;

Monster.prototype.update = function()
{
	//game.physics.arcade.collide(RightProjectile, this, takeDamage, null, this);
	//game.physics.arcade.collide(LeftProjectile, this, takeDamage, null, this);

	function takeDamage()
	{
		//console.log('ouch');
		this.health -= 1;
	}

	if (this.health > 0 && this.health < 3)
	{
		console.log('in damaged state');
	}
	else if (this.health == 0)
	{
		this.kill();
	}
}
