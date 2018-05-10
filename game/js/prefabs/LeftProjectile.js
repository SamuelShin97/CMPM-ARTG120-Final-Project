function LeftProjectile (game, key, frame, xpos, ypos, scale)
{
	Phaser.Sprite.call(this, game, xpos, ypos, key, frame);

	this.anchor.set(0.5);
	this.scale.x = scale;
	this.scale.y = scale;
	game.physics.enable(this);
	this.body.velocity.x = -400;
	
	this.outOfBoundsKill = true;
}

LeftProjectile.prototype = Object.create(Phaser.Sprite.prototype);
LeftProjectile.prototype.constructor = LeftProjectile;

LeftProjectile.prototype.update = function()
{

}