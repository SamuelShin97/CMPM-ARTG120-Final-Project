function Boss (game, key, frame, xpos, ypos, scale, player)
{
	Phaser.Sprite.call(this, game, xpos, ypos, key, frame);

	this.anchor.set(0.5);
	this.scale.x = scale;
	this.scale.y = scale;
	this.health = 100;
	this.facingLeft = false;
	this.facingRight = false;

	game.physics.enable(this);
	game.physics.arcade.enable(this);
	this.body.collideWorldBounds = true;

	this.bullets = game.add.group(); //gives this monster a bullets group and initializes it with the four different projectiles off screen somewhere
	this.bullets.create(100000, 100000, 'atlas', 'wproj');
	this.bullets.create(100000, 100000, 'atlas', 'eproj');
	this.bullets.create(100000, 100000, 'atlas', 'fproj');
	this.bullets.create(100000, 100000, 'atlas', 'aproj');
	this.bullets.enableBody = true;

	this.body.gravity.y = 675;

	this.attackEvent = game.time.events.loop(Phaser.Timer.SECOND * game.rnd.realInRange(1.0, 2.0), doAttack, this);
	function doAttack()
	{
		var rng = game.rnd.integerInRange(1, 4);

		if (rng == 1)
		{
			if (this.facingRight == true) //if facing to the right
			{
				//add a right projectile of type water to the bullets group
				var waterBullet = this.bullets.add(new RightProjectile(game, 'atlas', 'wproj', this.body.position.x + 50, this.body.position.y, 1, 'water'));
			}
			else if (this.facingLeft == true) //if facing to the left
			{
				//add a left projectile of type water to the bullets group
				var waterBullet = this.bullets.add(new LeftProjectile(game, 'atlas', 'wproj', this.body.position.x + 50, this.body.position.y, 1, 'water'));
			}
		}
		else if (rng == 2)
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
		else if (rng == 3)
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
		else if (rng == 4)
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
	this.animations.add('moveLeft', Phaser.Animation.generateFrameNames('fatherl', 0, 7), 12, true);
	this.animations.add('moveRight', Phaser.Animation.generateFrameNames('fatherr', 0, 7), 12, true);
}

Boss.prototype = Object.create(Phaser.Sprite.prototype);
Boss.prototype.constructor = Boss;

Boss.prototype.update = function()
{
	if (this.body.position.x - player.body.position.x > 0) //if this this's x position minus the player's x position is positive
	{
		this.facingLeft = true; //then you know that the this should be facing to the left and not to the right
		this.facingRight = false;
	}
	else if (this.body.position.x - player.body.position.x < 0) //vice versa
	{
		this.facingLeft = false;
		this.facingRight = true;
	}

	if (this.facingLeft == true)
	{
		this.body.velocity.x = -75;
		this.animations.play('moveLeft');
	}
	else if (this.facingRight == true)
	{
		this.body.velocity.x = 75;
		this.animations.play('moveRight');
	}

	game.physics.arcade.collide(player, finalBoss.bullets, takeDmg, null, this);

	function takeDmg(player, bullet)
	{
		bullet.kill();
		player.health -= 3;
	}

	if (this.body.position.y - player.body.position.y > 50 && this.body.touching.down)
	{
		this.body.velocity.y = -525;
	}

	if (this.health <= 0)
	{
		this.cleared = true;
		this.kill();
		game.time.events.remove(this.attackEvent);
		this.health = 9999;
	}

}