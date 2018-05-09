function Player (game, key, frame, xpos, ypos, scale)
{
	Phaser.Sprite.call(this, game, xpos, ypos, key, frame);
	var water = false;
	var earth = false;
	var fire = false;
	var air = false;

	this.anchor.set(0.5);
	this.scale.x = scale;
	this.scale.y = scale;

	game.physics.enable(this);
	this.body.gravity.y = 400; //gravity value on player (how fast player falls)
	this.body.collideWorldBounds = true;
}

Player.prototype = Object.create(Phaser.Sprite.prototype);
Player.prototype.constructor = Player;

Ship.prototype.update = function()
{
	this.body.velocity.x = 0;
	if (right == true)
	{
		this.body.velocity.x = 150;
	}
	else if (left == true)
	{
		this.body.velocity.x = -150;
	}
}