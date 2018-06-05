//RightProjectile is the projectile that gets shot in the right direction by either player or monsters
function RightProjectile (game, key, frame, xpos, ypos, scale, element)
{
	Phaser.Sprite.call(this, game, xpos, ypos, key, frame);

	this.anchor.set(0.5);
	this.scale.x = scale;
	this.scale.y = scale;
	this.element = element; //what element is this projectile
	game.physics.enable(this);
	game.physics.arcade.enable(this);
	this.enableBody = true;
	this.body.velocity.x = 400; //speed at which the projectile moves
	
	this.outOfBoundsKill = true; //kill once reaches out of bounds

	this.animations.add('wRotate', Phaser.Animation.generateFrameNames('wp', 1, 3), 25, true);
	//this.animations.add('wRotate', ['atlas', 'wp1', 'atlas', 'wp3'], 15, true);
	this.animations.add('eRotate', Phaser.Animation.generateFrameNames('ep', 1, 3), 25, true);
	//this.animations.add('eRotate', ['atlas', 'ep1', 'atlas', 'ep3'], 15, true);
	this.animations.add('fRotate', Phaser.Animation.generateFrameNames('fp', 1, 3), 25, true);
	this.animations.add('aRotate', Phaser.Animation.generateFrameNames('ap', 1, 3), 25, true);
}

RightProjectile.prototype = Object.create(Phaser.Sprite.prototype);
RightProjectile.prototype.constructor = RightProjectile;

RightProjectile.prototype.update = function()
{
	if (this.element == 'water')
	{
		this.animations.play('wRotate');
	}
	else if (this.element == 'earth')
	{
		this.animations.play('eRotate');
	}
	else if (this.element == 'fire')
	{
		this.animations.play('fRotate');
	}
	else if (this.element == 'air')
	{
		this.animations.play('aRotate');
	}
}