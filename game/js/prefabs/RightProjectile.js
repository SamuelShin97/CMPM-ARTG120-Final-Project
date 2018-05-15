function RightProjectile (game, key, frame, xpos, ypos, scale)
{
	Phaser.Sprite.call(this, game, xpos, ypos, key, frame);

	this.anchor.set(0.5);
	this.scale.x = scale;
	this.scale.y = scale;
	game.physics.enable(this);
	game.physics.arcade.enable(this);
	this.enableBody = true;
	this.body.velocity.x = 400;
	this.outOfBoundsKill = true;
}

RightProjectile.prototype = Object.create(Phaser.Sprite.prototype);
RightProjectile.prototype.constructor = RightProjectile;

RightProjectile.prototype.update = function()
{

}