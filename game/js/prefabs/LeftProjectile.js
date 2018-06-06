//LeftProjectile is the projectile that gets shot in the left direction by either player or monsters
function LeftProjectile (game, key, frame, xpos, ypos, scale, element)
{
	Phaser.Sprite.call(this, game, xpos, ypos, key, frame);

	this.anchor.set(0.5);
	this.scale.x = scale;
	this.scale.y = scale;
	this.element = element; //what element is this projectile
	game.physics.enable(this);
	game.physics.arcade.enable(this);
	this.enableBody = true;
	this.body.velocity.x = -400; //speed at which the projectile moves
	
	this.outOfBoundsKill = true; //kill once reaches out of bounds

	
	this.animations.add('wRotate', ['atlas', 'wp3', 'atlas', 'wp2', 'atlas', 'wp1'], 25, true);
	this.animations.add('eRotate', ['atlas', 'ep17', 'atlas', 'ep16', 'atlas', 'ep15', 'atlas', 'ep14', 'atlas', 'ep13', 'atlas', 'ep12', 
		'atlas', 'ep11', 'atlas', 'ep10', 'atlas', 'ep9', 'atlas', 'ep8', 'atlas', 'ep7', 'atlas', 'ep6', 
			'atlas', 'ep5', 'atlas', 'ep4', 'atlas', 'ep3', 'atlas', 'ep2', 'atlas', 'ep1'], 70, true);
	this.animations.add('fRotate', ['atlas', 'fp3', 'atlas', 'fp2', 'atlas', 'fp1'], 25, true);
	this.animations.add('aRotate', ['atlas', 'ap3', 'atlas', 'ap2', 'atlas', 'ap1'], 25, true);
}

LeftProjectile.prototype = Object.create(Phaser.Sprite.prototype);
LeftProjectile.prototype.constructor = LeftProjectile;

LeftProjectile.prototype.update = function()
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