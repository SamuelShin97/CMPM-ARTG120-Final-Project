//Monster prefab for monster objects, takes in a player as parameter just to be able to reference the player object
function Monster (game, key, frame, xpos, ypos, scale, element, player, boundary)
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
	this.cleared = false;
	this.giveHealth = true;
	this.targetPlayer = false;
	this.freed = false;
	this.down = true;
	this.up = false;
	loseWaterFairy = false;
	loseEarthFairy = false;
	loseFireFairy = false;
	loseAirFairy = false;

	game.physics.enable(this);
	game.physics.arcade.enable(this);
	this.body.collideWorldBounds = true;

	this.bullets = game.add.group(); //gives this monster a bullets group and initializes it with the four different projectiles off screen somewhere
	this.bullets.create(100000, 100000, 'atlas', 'wp1');
	this.bullets.create(100000, 100000, 'atlas', 'ep1');
	this.bullets.create(100000, 100000, 'atlas', 'fp1');
	this.bullets.create(100000, 100000, 'atlas', 'ap1');
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
	this.setYVel = game.time.events.loop(Phaser.Timer.SECOND * game.rnd.realInRange(0.9, 1), switchYVel, this);
	

	//determines what projectile to add to the bullets group based on what direction the monster is facing and what element it is.
	function doAttack()
	{
		if (this.element == 'water') //if the monster is water type
		{
			if (this.facingRight == true) //if facing to the right
			{
				//add a right projectile of type water to the bullets group
				var waterBull = this.bullets.add(new RightProjectile(game, 'atlas', 'wp1', this.body.position.x + 50, this.body.position.y, 0.15, 'water'));
			}
			else if (this.facingLeft == true) //if facing to the left
			{
				//add a left projectile of type water to the bullets group
				var waterBull = this.bullets.add(new LeftProjectile(game, 'atlas', 'wp1', this.body.position.x + 50, this.body.position.y, 0.15, 'water'));
			}
		}
		//rinse wash repeat for the rest of the else if's
		else if (this.element == 'earth')
		{
			if (this.facingRight == true)
			{
				var earthBull = this.bullets.add(new RightProjectile(game, 'atlas', 'ep1', this.body.position.x + 50, this.body.position.y, 0.15, 'earth'));
			}
			else if (this.facingLeft == true)
			{
				var earthBull = this.bullets.add(new LeftProjectile(game, 'atlas', 'ep1', this.body.position.x + 50, this.body.position.y, 0.15, 'earth'));
			}
		}
		else if (this.element == 'fire')
		{
			if (this.facingRight == true)
			{
				var fireBull = this.bullets.add(new RightProjectile(game, 'atlas', 'fp1', this.body.position.x + 50, this.body.position.y, 0.15, 'fire'));
			}
			else if (this.facingLeft == true)
			{
				var fireBull = this.bullets.add(new LeftProjectile(game, 'atlas', 'fp1', this.body.position.x + 50, this.body.position.y, 0.15, 'fire'));
			}
		}
		else if (this.element == 'air')
		{
			if (this.facingRight == true)
			{
				var airBull = this.bullets.add(new RightProjectile(game, 'atlas', 'ap1', this.body.position.x + 50, this.body.position.y, 0.15, 'air'));
			}
			else if (this.facingLeft == true)
			{
				var airBull = this.bullets.add(new LeftProjectile(game, 'atlas', 'ap1', this.body.position.x + 50, this.body. position.y, 0.15, 'air'));
			}
		}
	}

	function switchYVel()
	{
		if (this.down == true)
		{
			this.down = false;
			this.up = true;
		}
		else if (this.up == true)
		{
			this.up = false;
			this.down = true;
		}
	}
}

Monster.prototype = Object.create(Phaser.Sprite.prototype);
Monster.prototype.constructor = Monster;

Monster.prototype.update = function() //monster's update function
{
	this.body.velocity.x = 0;

	if (this.down == true && this.idol == false)
	{
		this.body.velocity.y = 25;
	}
	else if (this.up == true && this.idol == false)
	{
		this.body.velocity.y = -25;
	}

	if (Math.abs(this.body.position.y - player.body.position.y) <= 30)
	{
		this.targetPlayer = true;
	}
	else
	{
		this.targetPlayer = false;
	}

	if (this.targetPlayer == true)
	{
		facePlayer(this, player);
	}
	else if (this.targetPlayer == false && this.idol == false)
	{
		roam(this);
	}

	//this will be where the damaged/idol state happens with the monster. Right now it's set between 1 and 2 health.
	if (this.health > 0 && this.health < 3)
	{
		console.log('in damaged state');
		game.time.events.remove(this.attackEvent);
		this.idol = true;
		//this.down = false;
		//this.up = false;
		this.body.velocity.y = 0;
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
		bad_dmg += 1;
		reg_dmg += 1; 
		super_dmg += 1;
		this.cleared = true;
		this.kill(); //kill sprite 
		game.time.events.remove(this.attackEvent); //stop spawning projectiles off the timer
		//this is where the player loses fairy for killing, but gets damage buff (dmg buff still needs implementation)
		if (player.equippedElement[0] == true) //if the player has the water fairy equipped
		{	
			player.currentIndex = 0;
			loseWaterFairy = true;
		}
		else if (player.equippedElement[1] == true) //if the player has the earth fairy equipped
		{
			player.currentIndex = 1;
			loseEarthFairy = true;
		}
		else if (player.equippedElement[2] == true) //if the player has the fire fairy equipped
		{
			player.currentIndex = 2;
			loseFireFairy = true;
		}
		else if (player.equippedElement[3] == true) //if the player has the air fairy equipped
		{
			player.currentIndex = 3;
			loseAirFairy = true;
		}
		console.log(player.fairyCount);
		console.log(player.equippedElement);
		console.log(player.hasElement);
		this.health = 9999; //set the health to something thats greater than 0 so it will never enter this if chunck again. 
	}

	function facePlayer(monster, player)
	{
		//game.time.events.resume(monster.attackEvent);
		//console.log('calling facePlayer');
		if (monster.body.position.x - player.body.position.x > 0) //if monster monster's x position minus the player's x position is positive
		{
			monster.facingLeft = true; //then you know that the monster should be facing to the left and not to the right
			monster.facingRight = false;
		}
		else if (monster.body.position.x - player.body.position.x < 0) //vice versa
		{
			monster.facingLeft = false;
			monster.facingRight = true;
		}

		if (monster.facingLeft == true && monster.idol == false) //if the monster is facing left, move to the left at speed -60 units
		{
			monster.body.velocity.x = -60;
			if (monster.element == 'water')
			{
				monster.animations.play('wMoveLeft');
			}
			else if (monster.element == 'earth')
			{
				monster.frameName = ('atlas', 'earthl');
			}
			else if (monster.element == 'fire')
			{
				monster.animations.play('fMoveLeft');
			}
			else if (monster.element == 'air')
			{
				monster.frameName = ('atlas', 'airl');
			}
		}
		else if (monster.facingRight == true && monster.idol == false) //if the monster is facing right, move to the right at speed 60 units
		{
			monster.body.velocity.x = 60;
			if (monster.element == 'water')
			{
				monster.animations.play('wMoveRight');
			}
			else if (monster.element == 'earth')
			{
				monster.frameName = ('atlas', 'earthr');
			}
			else if (monster.element == 'fire')
			{
				monster.animations.play('fMoveRight');
			}
			else if (monster.element == 'air')
			{
				monster.frameName = ('atlas', 'airr');
			}
		}
	}

	function roam(monster)
	{
		//game.time.events.pause(monster.attackEvent);
		var rng = game.rnd.integerInRange(0, 75);
		if (rng == 5)
		{
			if (monster.facingLeft == true)
			{
				monster.facingLeft = false;
				monster.facingRight = true;
			}
			else 
			{
				monster.facingRight = false;
				monster.facingLeft = true;
			}
		}
		
		if (monster.facingLeft == true && monster.idol == false) //if the monster is facing left, move to the left at speed -60 units
		{
			monster.body.velocity.x = -60;
			if (monster.element == 'water')
			{
				monster.animations.play('wMoveLeft');
			}
			else if (monster.element == 'earth')
			{
				monster.frameName = ('atlas', 'earthl');
			}
			else if (monster.element == 'fire')
			{
				monster.animations.play('fMoveLeft');
			}
			else if (monster.element == 'air')
			{
				monster.frameName = ('atlas', 'airl');
			}
		}
		else if (monster.facingRight == true && monster.idol == false) //if the monster is facing right, move to the right at speed 60 units
		{
			monster.body.velocity.x = 60;
			if (monster.element == 'water')
			{
				monster.animations.play('wMoveRight');
			}
			else if (monster.element == 'earth')
			{
				monster.frameName = ('atlas', 'earthr');
			}
			else if (monster.element == 'fire')
			{
				monster.animations.play('fMoveRight');
			}
			else if (monster.element == 'air')
			{
				monster.frameName = ('atlas', 'airr');
			}
		}
	}

	if (this.idol == true && this.health > 2)
	{ 
		if (this.giveHealth == true)
		{
			if (player.health > 14)
			{
				player.health = 20;
			}
			else
			{
				player.health += 5;
			}
			this.giveHealth = false;
		}

		this.cleared = true;
		this.body.velocity.x = -150;
		
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

		/*if (this.down == true)
		{
			this.body.velocity.y = 25;
		}
		else if (this.up == true)
		{
			this.body.velocity.y = -25;
		}*/

		this.body.collideWorldBounds = false;
		this.enableCollision = false;
		this.outOfBoundsKill = true; //kill once reaches out of bounds
	}

	//if the player and monster's bullets collide, then the player takes 3 damage.
	game.physics.arcade.collide(player, this.bullets, takeDmg, null, this); 
	game.physics.arcade.collide(this, boundary, destroyBoundary, null, this); 

	function takeDmg(player, bullet)
	{
		console.log('hit');
		console.log('player health: ', player.health);
		console.log('player fairyCount', player.fairyCount);
		bullet.kill();
		playerDmgSound.play();
		player.health -= 3;
	}

	function destroyBoundary(monster, boundary)
	{
		if (monster.cleared == true && monster.freed == false)
		{
			console.log('freed');
			monster.freed = true;
			boundary.kill();
			monster.body.gravity.y = 675;
		}
	}

	if (this.body.position.y > game.world.height - 120)
	{
		this.body.position.y = game.world.height - 120;
	}
	
}
