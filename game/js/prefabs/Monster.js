function Monster (game, key, frame, xpos, ypos, scale, element, player)
{
	Phaser.Sprite.call(this, game, xpos, ypos, key, frame);
	this.anchor.set(0.5);
	this.scale.x = scale;
	this.scale.y = scale;
	this.health = 10;
	this.element = element;
	this.facing_right = false;
	this.facing_left = false;
	this.attack = false;

	game.physics.enable(this);
	game.physics.arcade.enable(this);
	this.body.collideWorldBounds = true;
	this.body.immovable = true;

	this.bullets = game.add.group();
	this.bullets.create(100000, 100000, 'atlas', 'wproj');
	this.bullets.create(100000, 100000, 'atlas', 'eproj');
	this.bullets.create(100000, 100000, 'atlas', 'fproj');
	this.bullets.create(100000, 100000, 'atlas', 'aproj');
	this.bullets.enableBody = true;

	game.time.events.loop(Phaser.Timer.SECOND * game.rnd.realInRange(1.8, 3.0), doAttack, this);
	function setAttack()
	{
		this.attack = true;
	}

	function doAttack()
	{
		if (this.element == 'water')
		{
			if (this.facingRight == true)
			{
				var waterBullet = this.bullets.add(new RightProjectile(game, 'atlas', 'wproj', this.body.position.x + 50, this.body.position.y, 1, 'water'));
			}
			else if (this.facingLeft == true)
			{
				var waterBullet = this.bullets.add(new LeftProjectile(game, 'atlas', 'wproj', this.body.position.x + 50, this.body.position.y, 1, 'water'));
			}
		}
		else if (this.element == 'earth')
		{
			if (this.facingRight == true)
			{
				var earthBullet = this.bullets.add(new RightProjectile(game, 'atlas', 'eproj', this.body.position.x + 50, this.body.position.y, 1, 'earth'));
			}
			else if (this.facingLeft == true)
			{
				var earthBullet = this.bullets.add(new LeftProjectile(game, 'atlas', 'eproj', this.body.position.x + 50, this.body.position.y, 1, 'earth'));
			}
		}
		else if (this.element == 'fire')
		{
			if (this.facingRight == true)
			{
				var fireBullet = this.bullets.add(new RightProjectile(game, 'atlas', 'fproj', this.body.position.x + 50, this.body.position.y, 1, 'fire'));
			}
			else if (this.facingLeft == true)
			{
				var fireBullet = this.bullets.add(new LeftProjectile(game, 'atlas', 'fproj', this.body.position.x + 50, this.body.position.y, 1, 'fire'));
			}
		}
		else if (this.element == 'air')
		{
			if (this.facingRight == true)
			{
				var airBullet = this.bullets.add(new RightProjectile(game, 'atlas', 'aproj', this.body.position.x + 50, this.body.position.y, 1, 'air'));
			}
			else if (this.facingLeft == true)
			{
				var airBullet = this.bullets.add(new LeftProjectile(game, 'atlas', 'aproj', this.body.position.x + 50, this.body. position.y, 1, 'air'));
			}
		}
	}
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
		this.kill();
		game.time.events.stop();
	}

	if (this.body.position.x - player.body.position.x > 0)
	{
		this.facingLeft = true;
		this.facingRight = false;
	}
	else if (this.body.position.x - player.body.position.x < 0)
	{
		this.facingLeft = false;
		this.facingRight = true;
	}

	if (this.facingLeft == true)
	{
		this.body.velocity.x = -60;
	}
	else if (this.facingRight == true)
	{
		this.body.velocity.x = 60;
	}
}
