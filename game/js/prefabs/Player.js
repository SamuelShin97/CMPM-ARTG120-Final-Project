//prefab for player object
function Player (game, key, frame, xpos, ypos, scale)
{
	Phaser.Sprite.call(this, game, xpos, ypos, key, frame);
	//haselement is an array of boolean variables where each one indicates whether or not the player has an elemental power or not
	//index 0 = water, index 1 = earth, index 2 = fire, index 3 = air
	this.hasElement = [false, false, false, false];
	//equippedElement is the same idea as hasElement but only one of the variables can be true at a time since you can only have 
	//one element equipped at a time
	this.equippedElement = [false, false, false, false];
	this.noneEquipped = true; //noneEquipped is set to true by default
	this.currentIndex = 0; //currentIndex is used for iteration and tracking with the hasElement array, default is 0
	this.facingRight = true; //default facingRight is true meaning the player starts out by facing the Right
	this.facingLeft = false; //facingLeft is default set to false
	this.health = 20; //player health is 20
	this.notCollectedYet = true; //this is used for if the player has collected a fairy or not yet
	this.fairyCount = 0; //how many fairies the player has
	this.actionTimeStamp = 0;
	this.anchor.set(0.5);

	//this.anchor.set(0.5);
	this.scale.x = scale;
	this.scale.y = scale;

	game.physics.enable(this);
	game.physics.arcade.enable(this);

	this.body.gravity.y = 675; //gravity value on player (how fast player falls)
	this.body.bounce.y = 0.2;
	this.body.collideWorldBounds = true; //this might need to change for state switching so player can walk off screen

	playOnce = false;
	//this.body.setSize(120, 270, 18, 50);

	this.bullets = game.add.group(); //add a bullets group and initialize it with the four elemental projectiles off screen somewhere
	this.bullets.create(100000, 100000, 'atlas', 'wp1');
	this.bullets.create(100000, 100000, 'atlas', 'ep1');
	this.bullets.create(100000, 100000, 'atlas', 'fp1');
	this.bullets.create(100000, 100000, 'atlas', 'ap1');
	this.bullets.enableBody = true;

	this.animations.add('moveRight', Phaser.Animation.generateFrameNames('playerr', 0, 7), 30, true); 
	this.animations.add('moveLeft', Phaser.Animation.generateFrameNames('playerl', 0, 7), 30, true); 


	//these are the fairires that follow you
	wFairy = new Fairy(game, 'atlas', 'w0', 10000, 10000, 0.1, 'water', this);
	game.add.existing(wFairy);
	wFairy.body.gravity.y = 800;
	wFairy.body.setSize(300, 1300, 120, 100);

	eFairy = new Fairy(game, 'atlas', 'e0', 10000, 10000, 0.1, 'earth', this);
	game.add.existing(eFairy);
	eFairy.body.gravity.y = 700;
	eFairy.body.setSize(300, 1300, 120, 100);

	fFairy = new Fairy(game, 'atlas', 'f0', 10000, 10000, 0.1, 'fire', this);
	game.add.existing(fFairy);
	fFairy.body.gravity.y = 600;
	fFairy.body.setSize(300, 1300, 120, 100);

	aFairy = new Fairy(game, 'atlas', 'a0', 10000, 10000, 0.1, 'air', this);
	game.add.existing(aFairy);
	aFairy.body.gravity.y = 500;
	aFairy.body.setSize(300, 1300, 120, 100);

}

Player.prototype = Object.create(Phaser.Sprite.prototype);
Player.prototype.constructor = Player;

Player.prototype.update = function() //player's update function
{
	equipped = false; //sets a var equipped to false frame by frame to show we haven't found an element to equip yet
	this.body.velocity.x = 0; //resets player's velocity to stopping if player isn't holding movement keys

	if (unlock == true)
	{
		this.body.collideWorldBounds = false;
	}

	if (jump == true) //if jump is true (from main.js)
	{
		this.body.velocity.y = -525; //set y velocity of player to -400 (may need to change for less floatiness)
		
		wFairy.body.velocity.y = -700;
		eFairy.body.velocity.y = -640;
		fFairy.body.velocity.y = -580;
		aFairy.body.velocity.y = -520;
	}

	if (wFairy.body.position.y - this.body.position.y > -20)
	{
		wFairy.body.position.y = this.body.position.y - 20;
	}
	if (eFairy.body.position.y - this.body.position.y > -20)
	{
		eFairy.body.position.y = this.body.position.y - 20;
	}
	if (fFairy.body.position.y - this.body.position.y > -20)
	{
		fFairy.body.position.y = this.body.position.y - 20;
	}
	if (aFairy.body.position.y - this.body.position.y > -20)
	{
		aFairy.body.position.y = this.body.position.y - 20;
	}

	if (right == true) //if right is true (from main.js)
	{
		this.facingRight = true; //facingRight is set to true and facingLeft set to false
		this.facingLeft = false;
		this.body.velocity.x = 150; //set x velocity to 150
		this.animations.play('moveRight');
	}
	else if (left == true) //vice versa for left 
	{
		this.facingRight = false;
		this.facingLeft = true;
		this.body.velocity.x = -150;
		this.animations.play('moveLeft');
	}
	else
	{
		this.animations.stop();
		this.frameName = ('atlas', 'playerr0');
	}

	//this next if chunk is for fairy/element switching.
	//if switchNext (from main.js meaning that player pushed E key, and this isn't the first time equipping an element)
	if (switchNext == true && this.noneEquipped == false) 
	{
		originalIndex = this.currentIndex; //save the original index of where you are in the hasElement array 
		if (this.currentIndex != 3) //if the current index is not at the end of the array
		{
			for (i = this.currentIndex; i < 3; i++) //iterate up to the second to last index of the hasElement array
			{
				if (this.hasElement[i + 1] == true) //if the next position in the array has the element
				{
					this.currentIndex = i + 1; //set the current index to the next one
					this.equippedElement[originalIndex] = false; //turn off the element that was previously equipped
					//turn on the element that is to be equipped which will be the next found element that the player has in order
					this.equippedElement[this.currentIndex] = true;  
					equipped = true; //set equipped to true indicating we found an element to equip
					switchFairySound.play();
					break; //since we found an element to 
				}
			}
			if (originalIndex > 0 && equipped == false) //if the original index is greater than 0 and still haven't found something to equip
			{
				this.currentIndex = 0; //set the current index back to the beginning of the array
				for (i = this.currentIndex; i < originalIndex; i++) //iterate from the beginning of the hasElements array up to where we started looking
				{
					if (this.hasElement[this.currentIndex] == true) //if hasElement at the current index is true, then we found an element to equip
					{
						this.currentIndex = i; //set the current index to i (where we found the element)
						this.equippedElement[originalIndex] = false; //set the previously equipped element to false
						this.equippedElement[this.currentIndex] = true; //set the new element to be equipped to true
						switchFairySound.play();
						break; //break out of the loop since we found an element to equip
					}
				}
			}
		}
		else //if you are at the end of the array
		{
			this.currentIndex = 0; //then set the currentIndex back to the beginning and start searching for one to switch to
			if (this.hasElement[this.currentIndex] == true) //if you find it at position 0, meaning you have water then switch to water
			{
				this.equippedElement[originalIndex] = false;
				this.equippedElement[this.currentIndex] = true;
				switchFairySound.play();
			}
			else //if not then iterate from 0 to 2 which will check positions 1 through 3 and find an element like above to equip
			{
				for (i = this.currentIndex; i < 3; i++)
				{
					if (this.hasElement[i + 1] == true)
					{
						this.currentIndex = i + 1;
						this.equippedElement[originalIndex] = false;
						this.equippedElement[this.currentIndex] = true;
						switchFairySound.play();
						break;
					}
				}
			}
		}
	}

	if (this.equippedElement[0] == true)
	{
		wFairy.setSelect = true;
		eFairy.setSelect = false;
		fFairy.setSelect = false;
		aFairy.setSelect = false;
	}
	else if (this.equippedElement[1] == true)
	{
		eFairy.setSelect = true;
		wFairy.setSelect = false;
		fFairy.setSelect = false;
		aFairy.setSelect = false;
	}
	else if (this.equippedElement[2] == true)
	{
		fFairy.setSelect = true;
		wFairy.setSelect = false;
		eFairy.setSelect = false;
		aFairy.setSelect = false;
	}
	else if (this.equippedElement[3] == true)
	{
		aFairy.setSelect = true;
		wFairy.setSelect = false;
		eFairy.setSelect = false;
		fFairy.setSelect = false;
	}

	//this if chunk is for player attacking
	if (attack == true && this.equippedElement[0] == true) //if attack is true from main.js and the equipped element is water
	{
		if (this.facingRight == true) //if player is facing to the right
		{
			//add a water bullet to the bullets group that shoots to the right
			var waterBullet = this.bullets.add(new RightProjectile(game, 'atlas', 'wp1', this.body.position.x + 50, this.body.position.y, 0.15, 'water'));
		}
		else if (this.facingLeft == true) //if player is facing to the left 
		{
			//add a water bullet to the bullets group that shoots to the left
			var waterBullet = this.bullets.add(new LeftProjectile(game, 'atlas', 'wp1', this.body.position.x + 50, this.body.position.y, 0.15, 'water'));
		}
		waterProjSound.play();
	}
	else if (attack == true && this.equippedElement[1] == true) //same logic for earth
	{
		if (this.facingRight == true)
		{
			var earthBullet = this.bullets.add(new RightProjectile(game, 'atlas', 'ep1', this.body.position.x + 50, this.body.position.y, 0.15, 'earth'));
		}
		else if (this.facingLeft == true)
		{
			var earthBullet = this.bullets.add(new LeftProjectile(game, 'atlas', 'ep1', this.body.position.x + 50, this.body.position.y, 0.15, 'earth'));
		}
		earthProjSound.play();
	}
	else if (attack == true && this.equippedElement[2] == true) //same logic for fire
	{
		if (this.facingRight == true)
		{
			var fireBullet = this.bullets.add(new RightProjectile(game, 'atlas', 'fp1', this.body.position.x + 50, this.body.position.y, 0.15, 'fire'));
		}
		else if (this.facingLeft == true)
		{
			var fireBullet = this.bullets.add(new LeftProjectile(game, 'atlas', 'fp1', this.body.position.x + 50, this.body.position.y, 0.15, 'fire'));
		}
		fireProjSound.play();
	}
	else if (attack == true && this.equippedElement[3] == true) //same logic for air
	{
		if (this.facingRight == true)
		{
			var airBullet = this.bullets.add(new RightProjectile(game, 'atlas', 'ap1', this.body.position.x + 50, this.body.position.y, 0.15, 'air'));
		}
		else if (this.facingLeft == true)
		{
			var airBullet = this.bullets.add(new LeftProjectile(game, 'atlas', 'ap1', this.body.position.x + 50, this.body. position.y, 0.15, 'air'));
		}
		windProjSound.play();
	}

	//if collided with water fairy is true, and this is your first time getting an element
	if (addWater == true && this.noneEquipped == true)
	{
		this.hasElement[0] = true; //add it to the list of elements that you have
		this.equippedElement[0] = true; //automatically equip it since it's your first element
		this.noneEquipped = false; //set the noneEquipped variable to false so that you know from here on out that you've collected your first fairy
	}
	else if (addWater == true) //if it's not your first time getting a fairy but you still collected the water fairy regardless
	{
		this.hasElement[0] = true; //simply add it to the list of elements that you have
	}

	if (addEarth == true && this.noneEquipped == true) //same logic for earth
	{
		this.hasElement[1] = true;
		this.equippedElement[1] = true;
		this.noneEquipped = false;
	}
	else if (addEarth == true)
	{
		this.hasElement[1] = true;
	}

	if (addFire == true && this.noneEquipped == true) //same logic for fire
	{
		this.hasElement[2] = true;
		this.equippedElement[2] = true;
		this.noneEquipped = false;
	}
	else if (addFire == true)
	{
		this.hasElement[2] = true;
	}

	if (addAir == true && this.noneEquipped == true) //same logic for air
	{
		this.hasElement[3] = true;
		this.equippedElement[3] = true;
		this.noneEquipped = false;
	}
	else if (addAir == true)
	{
		this.hasElement[3] = true;
	}
	
	if (this.health <= 0) //if the player health reaches 0 or below
	{
		if (this.equippedElement[0] == true) //if you have water equipped
		{
			loseWaterFairy = true;
			this.health = 20;
		}
		else if (this.equippedElement[1] == true) //same if you have earth equipped
		{
			loseEarthFairy = true;
			this.health = 20;
		}
		else if (this.equippedElement[2] == true) //same if you have fire equipped
		{
			loseFireFairy = true;
			this.health = 20;
		}
		else if (this.equippedElement[3] == true) //same if you have air equipped
		{
			loseAirFairy = true;
			this.health = 20;
		}
		else //if you happen to have no element equipped when you reach 0 or less health
		{
			//then it will get rid of the first element it sees starting from water 
			if (this.hasElement[0] == true ) //if you have a water elemental then you lose this one
			{
				loseWaterFairy = true;
				this.health = 20;
			}
			else if (this.hasElement[1] == true) //if you have a earth elemental, but not a water, then you lose this one
			{
				loseEarthFairy = true;
				this.health = 20;
			}
			else if (this.hasElement[2] == true) //if you have a fire elemental, but not a water or earth, then you lose this one
			{
				loseFireFairy = true;
				this.health = 20;
			}
			else if (this.hasElement[3] == true) //if you have an air elemental, but none of above, then you lose this one
			{
				loseAirFairy = true;
				this.health = 20;
			}
		}
	}
	if (this.hasElement[0] == true)
	{
		wFairy.body.collideWorldBounds = true;
		if (this.facingRight == true)
		{
			wFairy.body.position.x = this.body.position.x - 50;
		}
		else if (this.facingLeft == true)
		{
			wFairy.body.position.x = this.body.position.x + 50;
		}
	}

	if (this.hasElement[1] == true && this.fairyCount == 1)
	{
		eFairy.body.collideWorldBounds = true;
		if (this.facingRight == true)
		{
			eFairy.body.position.x = this.body.position.x - 50;
		}
		else if (this.facingLeft == true)
		{
			eFairy.body.position.x = this.body.position.x + 50;
		}
	}
	else if (this.hasElement[1] == true && this.fairyCount > 1 && this.hasElement[0] == false)
	{
		eFairy.body.collideWorldBounds = true;
		if (this.facingRight == true)
		{
			eFairy.body.position.x = this.body.position.x - 50;
		}
		else if (this.facingLeft == true)
		{
			eFairy.body.position.x = this.body.position.x + 50;
		}
	}
	else if (this.hasElement[1] == true && this.fairyCount > 1)
	{
		eFairy.body.collideWorldBounds = true;
		if (this.facingRight == true)
		{
			eFairy.body.position.x = this.body.position.x - 100;
		}
		else if (this.facingLeft == true)
		{
			eFairy.body.position.x = this.body.position.x + 100;
		}
	}

	if (this.hasElement[2] == true && this.fairyCount == 1)
	{
		fFairy.body.collideWorldBounds = true;
		if (this.facingRight == true)
		{
			fFairy.body.position.x = this.body.position.x - 50;
		}
		else if (this.facingLeft == true)
		{
			fFairy.body.position.x = this.body.position.x + 50;
		}
	}
	else if (this.hasElement[2] == true && this.fairyCount == 2 && this.hasElement[3] == true)
	{
		fFairy.body.collideWorldBounds = true;
		if (this.facingRight == true)
		{
			fFairy.body.position.x = this.body.position.x - 50;
		}
		else if (this.facingLeft == true)
		{
			fFairy.body.position.x = this.body.position.x + 50;
		}
	}
	else if (this.hasElement[2] == true && this.fairyCount == 2)
	{
		fFairy.body.collideWorldBounds = true;
		if (this.facingRight == true)
		{
			fFairy.body.position.x = this.body.position.x - 100;
		}
		else if (this.facingLeft == true)
		{
			fFairy.body.position.x = this.body.position.x + 100;
		}
	}
	else if (this.hasElement[2] == true && this.fairyCount == 3 && this.hasElement[3] == true)
	{
		fFairy.body.collideWorldBounds = true;
		if (this.facingRight == true)
		{
			fFairy.body.position.x = this.body.position.x - 100;
		}
		else if (this.facingLeft == true)
		{
			fFairy.body.position.x = this.body.position.x + 100;
		}
	}
	else if (this.hasElement[2] == true && this.fairyCount > 2)
	{
		fFairy.body.collideWorldBounds = true;
		if (this.facingRight == true)
		{
			fFairy.body.position.x = this.body.position.x - 150;
		}
		else if (this.facingLeft == true)
		{
			fFairy.body.position.x = this.body.position.x + 150;
		}
	}

	if (this.hasElement[3] == true && this.fairyCount == 1)
	{
		aFairy.body.collideWorldBounds = true;
		if (this.facingRight == true)
		{
			aFairy.body.position.x = this.body.position.x - 50;
		}
		else if (this.facingLeft == true)
		{
			aFairy.body.position.x = this.body.position.x + 50;
		}
	}
	else if (this.hasElement[3] == true && this.fairyCount == 2)
	{
		aFairy.body.collideWorldBounds = true;
		if (this.facingRight == true)
		{
			aFairy.body.position.x = this.body.position.x - 100;
		}
		else if (this.facingLeft == true)
		{
			aFairy.body.position.x = this.body.position.x + 100;
		}
	}
	else if (this.hasElement[3] == true && this.fairyCount == 3)
	{
		aFairy.body.collideWorldBounds = true;
		if (this.facingRight == true)
		{
			aFairy.body.position.x = this.body.position.x - 150;
		}
		else if (this.facingLeft == true)
		{
			aFairy.body.position.x = this.body.position.x + 150;
		}
	}
	else if (this.hasElement[3] == true && this.fairyCount == 4)
	{
		aFairy.body.collideWorldBounds = true;
		if (this.facingRight == true)
		{
			aFairy.body.position.x = this.body.position.x - 200;
		}
		else if (this.facingLeft == true)
		{
			aFairy.body.position.x = this.body.position.x + 200;
		}
	}

	if (loseWaterFairy == true)
	{
		wFairy.body.velocity.y = -100;
		wFairy.body.collideWorldBounds = false;
		if (playOnce == false)
		{
			loseFairySound.play();
			playOnce = true;
		}
		
	}
	if (loseEarthFairy == true)
	{
		eFairy.body.velocity.y = -100;
		eFairy.body.collideWorldBounds = false;
		if (playOnce == false)
		{
			loseFairySound.play();
			playOnce = true;
		}
	}
	if (loseFireFairy == true)
	{
		fFairy.body.velocity.y = -100;
		fFairy.body.collideWorldBounds = false;
		if (playOnce == false)
		{
			loseFairySound.play();
			playOnce = true;
		}
	}
	if (loseAirFairy == true)
	{
		aFairy.body.velocity.y = -100;
		aFairy.body.collideWorldBounds = false;
		if (playOnce == false)
		{
			loseFairySound.play();
			playOnce = true;
		}
	}

	if (wFairy.body.position.y < -30 && loseWaterFairy == true)
	{
		wFairy.body.velocity.y = 0;
		wFairy.body.position.x = 100000;
		wFairy.body.position.y = 100000;
		this.equippedElement[0] = false; //unequip the water fairy
		this.hasElement[0] = false; //set having the water fairy to false
		this.fairyCount -= 1; //decrement fairy count
		loseWaterFairy = false;
		playOnce = false;
	}
	if (eFairy.body.position.y < -30 && loseEarthFairy == true)
	{
		eFairy.body.velocity.y = 0;
		eFairy.body.position.x = 100000;
		eFairy.body.position.y = 100000;
		this.equippedElement[1] = false; //unequip the water fairy
		this.hasElement[1] = false; //set having the water fairy to false
		this.fairyCount -= 1; //decrement fairy count
		loseEarthFairy = false;
		playOnce = false;
	}
	if (fFairy.body.position.y < -30 && loseFireFairy == true)
	{
		fFairy.body.velocity.y = 0;
		fFairy.body.position.x = 100000;
		fFairy.body.position.y = 100000;
		this.equippedElement[2] = false; //unequip the water fairy
		this.hasElement[2] = false; //set having the water fairy to false
		this.fairyCount -= 1; //decrement fairy count
		loseFireFairy = false;
		playOnce = false;
	}
	if (aFairy.body.position.y < -30 && loseAirFairy == true)
	{
		aFairy.body.velocity.y = 0;
		aFairy.body.position.x = 100000;
		aFairy.body.position.y = 100000;
		this.equippedElement[3] = false; //unequip the water fairy
		this.hasElement[3] = false; //set having the water fairy to false
		this.fairyCount -= 1; //decrement fairy count
		loseAirFairy = false;
		playOnce = false;
	}


	//lose condition one, if you haven't collected a fairy yet, and your health depletes less than equal to 0 then you lose
	if (this.notCollectedYet == true && this.health <= 0)
	{
		this.kill();
		game.state.start('EndGame');
	}

	//lose condition two, if your fairy count drops to 0 and you have collected fairies before, then you lose
	if (this.fairyCount == 0 && this.notCollectedYet == false)
	{
		this.kill();
		game.state.start('EndGame');
	}

}

Player.prototype.render = function()
{
	game.debug.body(wFairy);
}