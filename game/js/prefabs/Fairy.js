//prefab for Fairy objects
function Fairy (game, key, frame, xpos, ypos, scale, element, player)
{
	Phaser.Sprite.call(this, game, xpos, ypos, key, frame);
	var type = element; //what kind of element is this fairy
	
	this.anchor.set(0.5);
	this.scale.x = scale;
	this.scale.y = scale;

	game.physics.enable(this);
	this.body.collideWorldBounds = true;
}

Fairy.prototype = Object.create(Phaser.Sprite.prototype);
Fairy.prototype.constructor = Fairy;

Fairy.prototype.update = function()
{

}