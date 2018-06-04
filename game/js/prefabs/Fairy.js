//prefab for Fairy objects
function Fairy (game, key, frame, xpos, ypos, scale, element, platforms)
{
	Phaser.Sprite.call(this, game, xpos, ypos, key, frame);
	this.element = element; //what kind of element is this fairy
	
	this.anchor.set(0.5);
	this.scale.x = scale;
	this.scale.y = scale;
	this.setSelect = false;

	game.physics.enable(this);
	game.physics.arcade.enable(this);
	this.body.collideWorldBounds = false;

	this.animations.add('wGlow', Phaser.Animation.generateFrameNames('w', 0, 5), 5, true);
	this.animations.add('eGlow', Phaser.Animation.generateFrameNames('e', 0, 5), 5, true);
	this.animations.add('fGlow', Phaser.Animation.generateFrameNames('f', 0, 5), 5, true);
	this.animations.add('aGlow', Phaser.Animation.generateFrameNames('a', 0, 5), 5, true);
}

Fairy.prototype = Object.create(Phaser.Sprite.prototype);
Fairy.prototype.constructor = Fairy;

Fairy.prototype.update = function()
{
	if (this.element == 'water' && this.setSelect == false)
	{
		this.animations.play('wGlow');
	}
	else if (this.element == 'earth' && this.setSelect == false)
	{
		this.animations.play('eGlow');
	}
	else if (this.element == 'fire' && this.setSelect == false)
	{
		this.animations.play('fGlow');
	}
	else if (this.element == 'air' && this.setSelect == false)
	{
		this.animations.play('aGlow');
	}

	if (this.element == 'water' && this.setSelect == true)
	{
		this.frameName = ('atlas', 'wselect');
		this.animations.stop();
	}
	else if (this.element == 'earth' && this.setSelect == true)
	{
		this.frameName = ('atlas', 'eselect');
		this.animations.stop();
	}
	else if (this.element == 'fire' && this.setSelect == true)
	{
		this.frameName = ('atlas', 'fselect');
		this.animations.stop();
	}
	else if (this.element == 'air' && this.setSelect == true)
	{
		this.frameName = ('atlas', 'aselect');
		this.animations.stop();
	}

	if (this.frameName == ('atlas', 'wselect') && this.setSelect == false)
	{
		this.frameName = ('atlas', 'w0');
	}

	if (this.frameName == ('atlas', 'eselect') && this.setSelect == false)
	{
		this.frameName = ('atlas', 'e0');
	}

	if (this.frameName == ('atlas', 'fselect') && this.setSelect == false)
	{
		this.frameName = ('atlas', 'f0');
	}

	if (this.frameName == ('atlas', 'aselect') && this.setSelect == false)
	{
		this.frameName = ('atlas', 'a0');
	}
}
