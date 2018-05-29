//Monster prefab for monster objects, takes in a player as parameter just to be able to reference the player object
function Monster (game, key, frame, xpos, ypos, scale, element, player)
{
	Phaser.Sprite.call(this, game, xpos, ypos, key, frame);
	this.anchor.set(0.5);
	this.scale.x = scale;
	this.scale.y = scale;
	this.health = 10; //how much health monsters will have
	this.element = element; //what elemental type is this monster
	this.facing_right = false; //variable to check if monster is facing right, initially set to false
	this.facing_left = false; //variable to check if monster is facing left, initially set to false
	this.idol = false;
	this.enableCollision = true;

	game.physics.enable(this);
	game.physics.arcade.enable(this);
	this.body.collideWorldBounds = true;
	this.body.immovable = true;

	this.bullets = game.add.group(); //gives this monster a bullets group and initializes it with the four different projectiles off screen somewhere
	this.bullets.create(100000, 100000, 'atlas', 'wproj');
	this.bullets.create(100000, 100000, 'atlas', 'eproj');
	this.bullets.create(100000, 100000, 'atlas', 'fproj');
	this.bullets.create(100000, 100000, 'atlas', 'aproj');
	this.bullets.enableBody = true;

	this.animations.add('wMoveRight', Phaser.Animation.generateFrameNames('waterr', 1, 4), 12, true); 
	this.animations.add('wMoveLeft', Phaser.Animation.generateFrameNames('waterl', 1, 4), 12, true); 
	this.animations.add('wIdleLeft', ['atlas', 'wateridle', 'atlas', 'waterl2'], 3, true); 
	this.animations.add('wIdleRight', ['atlas', 'wateridle2', 'atlas', 'waterr2'], 3, true); 

	this.animations.add('eIdleLeft', ['atlas', 'earthidle', 'atlas', 'earthl'], 3, true); 
	this.animations.add('eIdleRight', ['atlas', 'earthidle2', 'atlas', 'earthr'], 3, true); 

	this.animations.add('fMoveRight', Phaser.Animation.generateFrameNames('firer', 1, 2), 6, true); 
	this.animations.add('fMoveLeft', Phaser.Animation.generateFrameNames('firel', 1, 2), 6, true); 
	this.animations.add('fIdleLeft', ['atlas', 'fireidle', 'atlas', 'firel2'], 3, true); 
	this.animations.add('fIdleRight', ['atlas', 'fireidle2', 'atlas', 'firer2'], 3, true); 

	this.animations.add('aIdleLeft', ['atlas', 'airidle', 'atlas', 'airl'], 3, true); 
	this.animations.add('aIdleRight', ['atlas', 'airidle2', 'atlas', 'airr'], 3, true); 

	this.attackEvent = game.time.events.loop(Phaser.Timer.SECOND * game.rnd.realInRange(1.8, 3.0), doAttack, this); //every 1.8-3 seconds, calls the doAttack function below

	//determines what projectile to add to the bullets group based on what direction the monster is facing and what element it is.
	function doAttack()
	{
		if (this.element == 'water') //if the monster is water type
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
		//rinse wash repeat for the rest of the else if's
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

Monster.prototype.update = function() //monster's update function
{
	this.body.velocity.x = 0;
	//this will be where the damaged/idol state happens with the monster. Right now it's set between 1 and 2 health.
	if (this.health > 0 && this.health < 3)
	{
		console.log('in damaged state');
		game.time.events.remove(this.attackEvent);
		this.idol = true;
		//this.frameName = ('atlas', 'wateridle');
		if (this.facingLeft == true && this.element == 'water')
		{
			this.animations.play('wIdleLeft');
		}
		else if (this.facingRight == true && this.element == 'water')
		{
			this.animations.play('wIdleRight');
		}
		else if (this.facingLeft == true && this.element == 'earth')
		{
			//this.frameName = ('atlas', 'earthidle');
			this.animations.play('eIdleLeft');
		}
		else if (this.facingRight == true && this.element == 'earth')
		{
			//this.frameName = ('atlas', 'earthidle2');
			this.animations.play('eIdleRight');
		}
		else if (this.facingLeft == true && this.element == 'fire')
		{
			this.animations.play('fIdleLeft');
		}
		else if (this.facingRight == true && this.element == 'fire')
		{
			this.animations.play('fIdleRight');
		}
		else if (this.facingLeft == true && this.element == 'air')
		{
			//this.frameName = ('atlas', 'airidle');
			this.animations.play('aIdleLeft');
		}
		else if (this.facingRight == true && this.element == 'air')
		{
			//this.frameName = ('atlas', 'airidle2');
			this.animations.play('aIdleRight');
		}
	}
	else if (this.health <= 0) //if health reaches 0 or below
	{
		this.kill(); //kill sprite 
		game.time.events.remove(this.attackEvent); //stop spawning projectiles off the timer
		//this is where the player loses fairy for killing, but gets damage buff (dmg buff still needs implementation)
		if (player.equippedElement[0] == true) //if the player has the water fairy equipped
		{	
			player.currentIndex = 0;
			player.equippedElement[0] = false; //unequip the water fairy
			player.hasElement[0] = false; //set having the water fairy to false
			player.fairyCount -= 1; //decrement fairy count
		}
		else if (player.equippedElement[1] == true) //if the player has the earth fairy equipped
		{
			player.currentIndex = 1;
			player.equippedElement[1] = false;
			player.hasElement[1] = false;
			player.fairyCount -= 1;
		}
		else if (player.equippedElement[2] == true) //if the player has the fire fairy equipped
		{
			player.currentIndex = 2;
			player.equippedElement[2] = false;
			player.hasElement[2] = false;
			player.fairyCount -= 1;
		}
		else if (player.equippedElement[3] == true) //if the player has the air fairy equipped
		{
			player.currentIndex = 3;
			player.equippedElement[3] = false;
			player.hasElement[3] = false;
			player.fairyCount -= 1;
		}
		console.log(player.fairyCount);
		console.log(player.equippedElement);
		console.log(player.hasElement);
		this.health = 9999; //set the health to something thats greater than 0 so it will never enter this if chunck again. 
	}

	if (this.body.position.x - player.body.position.x > 0) //if this monster's x position minus the player's x position is positive
	{
		this.facingLeft = true; //then you know that the monster should be facing to the left and not to the right
		this.facingRight = false;
	}
	else if (this.body.position.x - player.body.position.x < 0) //vice versa
	{
		this.facingLeft = false;
		this.facingRight = true;
	}

	if (this.facingLeft == true && this.idol == false) //if the monster is facing left, move to the left at speed -60 units
	{
		this.body.velocity.x = -60;
		if (this.element == 'water')
		{
			this.animations.play('wMoveLeft');
		}
		else if (this.element == 'earth')
		{
			this.frameName = ('atlas', 'earthl');
		}
		else if (this.element == 'fire')
		{
			this.animations.play('fMoveLeft');
		}
		else if (this.element == 'air')
		{
			this.frameName = ('atlas', 'airl');
		}
	}
	else if (this.facingRight == true && this.idol == false) //if the monster is facing right, move to the right at speed 60 units
	{
		this.body.velocity.x = 60;
		if (this.element == 'water')
		{
			this.animations.play('wMoveRight');
		}
		else if (this.element == 'earth')
		{
			this.frameName = ('atlas', 'earthr');
		}
		else if (this.element == 'fire')
		{
			this.animations.play('fMoveRight');
		}
		else if (this.element == 'air')
		{
			this.frameName = ('atlas', 'airr');
		}
	}

	if (this.idol == true && this.health > 2)
	{
		//this.rotation = 0;
		this.facingLeft = true;
		this.body.velocity.x = -60;
		this.body.collideWorldBounds = false;
		this.enableCollision = false;
		this.outOfBoundsKill = true; //kill once reaches out of bounds
	}

	//if the player and monster's bullets collide, then the player takes 3 damage.
	game.physics.arcade.collide(player, this.bullets, takeDmg, null, this); 

	function takeDmg(player, bullet)
	{
		console.log('hit');
		console.log('player health: ', player.health);
		console.log('player fairyCount', player.fairyCount);
		bullet.kill();
		player.health -= 3;
	}
	
}
