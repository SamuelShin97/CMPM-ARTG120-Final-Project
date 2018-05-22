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
}

LeftProjectile.prototype = Object.create(Phaser.Sprite.prototype);
LeftProjectile.prototype.constructor = LeftProjectile;

LeftProjectile.prototype.update = function()
{

}