function Player (game, key, frame, xpos, ypos, scale)
{
	Phaser.Sprite.call(this, game, xpos, ypos, key, frame);
	this.hasElement = [false, false, false, false];
	this.equippedElement = [false, false, false, false];
	this.noneEquipped = true;
	this.currentIndex = 0;
	this.facingRight = true;
	this.facingLeft = false;

	this.anchor.set(0.5);
	this.scale.x = scale;
	this.scale.y = scale;

	game.physics.enable(this);
	game.physics.arcade.enable(this);
	this.body.gravity.y = 400; //gravity value on player (how fast player falls)
	this.body.collideWorldBounds = true;

	this.bullets = game.add.group();
	this.bullets.create(100000, 100000, 'atlas', 'wproj');
	this.bullets.create(100000, 100000, 'atlas', 'eproj');
	this.bullets.create(100000, 100000, 'atlas', 'fproj');
	this.bullets.create(100000, 100000, 'atlas', 'aproj');
	this.bullets.enableBody = true;
}

Player.prototype = Object.create(Phaser.Sprite.prototype);
Player.prototype.constructor = Player;

Player.prototype.update = function()
{
	game.physics.arcade.collide(Monster, this, takeDamage, null, this);
	function takeDamage()
	{
		this.kill();
	}

	equipped = false;
	this.body.velocity.x = 0;
	if (jump == true)
	{
		this.body.velocity.y = -400;
	}
	if (right == true)
	{
		this.facingRight = true;
		this.facingLeft = false;
		this.body.velocity.x = 150;
	}
	else if (left == true)
	{
		this.facingRight = false;
		this.facingLeft = true;
		this.body.velocity.x = -150;
	}

	if (switchNext == true && this.noneEquipped == false)
	{
		console.log('in switch');
		originalIndex = this.currentIndex;
		if (this.currentIndex != 3)
		{
			for (i = this.currentIndex; i < 3; i++)
			{
				if (this.hasElement[i + 1] == true)
				{
					this.currentIndex = i + 1;
					this.equippedElement[originalIndex] = false;
					this.equippedElement[this.currentIndex] = true;
					equipped = true;
					break;
				}
			}
			if (originalIndex > 0 && equipped == false)
			{
				this.currentIndex = 0;
				for (i = this.currentIndex; i < originalIndex; i++)
				{
					if (this.hasElement[this.currentIndex] == true)
					{
						this.currentIndex = i;
						this.equippedElement[originalIndex] = false;
						this.equippedElement[this.currentIndex] = true;
						break;
					}
				}
			}
		}
		else
		{
			this.currentIndex = 0;
			if (this.hasElement[this.currentIndex] == true)
			{
				this.equippedElement[originalIndex] = false;
				this.equippedElement[this.currentIndex] = true;
			}
			else 
			{
				for (i = this.currentIndex; i < 3; i++)
				{
					if (this.hasElement[i + 1] == true)
					{
						this.currentIndex = i + 1;
						this.equippedElement[originalIndex] = false;
						this.equippedElement[this.currentIndex] = true;
						break;
					}
				}
			}
		}
		console.log(this.currentIndex);
	}

	if (attack == true && this.equippedElement[0] == true)
	{
		if (this.facingRight == true)
		{
			//game.add.existing(new RightProjectile(game, 'atlas', 'wproj', this.body.position.x + 50, this.body.position.y, 1));
			var waterBullet = this.bullets.add(new RightProjectile(game, 'atlas', 'wproj', this.body.position.x + 50, this.body.position.y, 1, 'water'));
		}
		else if (this.facingLeft == true)
		{
			//game.add.existing(new LeftProjectile(game, 'atlas', 'wproj', this.body.position.x, this.body.position.y, 'water'));
			var waterBullet = this.bullets.add(new LeftProjectile(game, 'atlas', 'wproj', this.body.position.x + 50, this.body.position.y, 1, 'water'));
		}
	}
	else if (attack == true && this.equippedElement[1] == true)
	{
		if (this.facingRight == true)
		{
			//game.add.existing(new RightProjectile(game, 'atlas', 'eproj', this.body.position.x + 50, this.body.position.y, 'water'));
			var earthBullet = this.bullets.add(new RightProjectile(game, 'atlas', 'eproj', this.body.position.x + 50, this.body.position.y, 1, 'earth'));
		}
		else if (this.facingLeft == true)
		{
			//game.add.existing(new LeftProjectile(game, 'atlas', 'eproj', this.body.position.x, this.body.position.y, 'earth'));
			var earthBullet = this.bullets.add(new LeftProjectile(game, 'atlas', 'eproj', this.body.position.x + 50, this.body.position.y, 1, 'earth'));
		}
	}
	else if (attack == true && this.equippedElement[2] == true)
	{
		if (this.facingRight == true)
		{
			//game.add.existing(new RightProjectile(game, 'atlas', 'fproj', this.body.position.x + 50, this.body.position.y, 'water'));
			var fireBullet = this.bullets.add(new RightProjectile(game, 'atlas', 'fproj', this.body.position.x + 50, this.body.position.y, 1, 'fire'));
		}
		else if (this.facingLeft == true)
		{
			//game.add.existing(new LeftProjectile(game, 'atlas', 'fproj', this.body.position.x, this.body.position.y, 'fire'));
			var fireBullet = this.bullets.add(new LeftProjectile(game, 'atlas', 'fproj', this.body.position.x + 50, this.body.position.y, 1, 'fire'));
		}
	}
	else if (attack == true && this.equippedElement[3] == true)
	{
		if (this.facingRight == true)
		{
			//game.add.existing(new RightProjectile(game, 'atlas', 'aproj', this.body.position.x + 50, this.body.position.y, 'water'));
			var airBullet = this.bullets.add(new RightProjectile(game, 'atlas', 'aproj', this.body.position.x + 50, this.body.position.y, 1, 'air'));
		}
		else if (this.facingLeft == true)
		{
			//game.add.existing(new LeftProjectile(game, 'atlas', 'aproj', this.body.position.x, this.body.position.y, 'air'));
			var airBullet = this.bullets.add(new LeftProjectile(game, 'atlas', 'aproj', this.body.position.x + 50, this.body. position.y, 1, 'air'));
		}
	}

	if (addWater == true && this.noneEquipped == true)
	{
		this.hasElement[0] = true;
		this.equippedElement[0] = true;
		this.noneEquipped = false;
		//console.log('first add');
	}
	else if (addWater == true)
	{
		this.hasElement[0] = true;
		//console.log('not firs add');
	}

	if (addEarth == true && this.noneEquipped == true)
	{
		this.hasElement['water'] = true;
		this.equippedElement[1] = true;
		this.noneEquipped = false;
	}
	else if (addEarth == true)
	{
		this.hasElement[1] = true;
	}

	if (addFire == true && this.noneEquipped == true)
	{
		this.hasElement[2] = true;
		this.equippedElement[2] = true;
		this.noneEquipped = false;
	}
	else if (addFire == true)
	{
		this.hasElement[2] = true;
	}

	if (addAir == true && this.noneEquipped == true)
	{
		this.hasElement[3] = true;
		this.equippedElement[3] = true;
		this.noneEquipped = false;
	}
	else if (addAir == true)
	{
		this.hasElement[3] = true;
	}
	//console.log(this.currentIndex);

}