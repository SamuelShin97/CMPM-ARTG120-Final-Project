var game = new Phaser.Game(1280, 720, Phaser.Auto);
//1280 720 

var right = false; //variable for if player moving right
var left = false; //variable for if player moving left
var jump = false; //variable for if player can jump

var addWater = false; //var for colliding into water fairy
var addEarth = false; //var for collding into earth fairy
var addFire = false; //var for colliding into fire fairy
var addAir = false; //var for colliding into air fairy

var switchNext = false; //if e is pushed then switch next is true
var switchPrev = false; //not being used rn

var attack = false; //if player is attacking

var levelState; 

var heal = 3; //value for hitting an elemental monster with same type projectile
var bad_dmg  =1; //value for hitting an elemental monster with not very effective type projectile 
var reg_dmg = 3; //value for hitting an elemental monster with neutral type projectile
var super_dmg = 5; //value for hitting an elemental monster with super effective type projectile

var repeat = false; //if player has advanced to a new screen
var state = 0;
var unlock = false;

var player;

//state structure and state switching came from Nathan Altice's code from fourth lecture slide
var menu = function(game){};
menu.prototype = {
	preload: function()
	{
		console.log('menu: preload');
	},

	create: function()
	{
		var startLabel = game.add.text(80, game.world.height - 100, 'Press M to start...', 
			{font: '25px', fill: '#FFFFFF'} );
	},

	update: function()
	{
		//play the game once m is pressed, loading in state 'GamePlay' but we will start with level1 in the actual making of the game
		if (game.input.keyboard.isDown(Phaser.Keyboard.M))
		{
			game.state.start('GamePlay'); 
		}
	}
};

var GamePlay = function(game) {}; //this will change to a different game state in separate js files
GamePlay.prototype = {

	init: function(hasElement, equippedElement, noneEquipped, currentIndex, health, notCollectedYet, fairyCount)
	{
		nextPlayerhasElement = hasElement;
		nextPlayerEquippedElement = equippedElement;
		nextPlayerNoneEquipped = noneEquipped;
		nextPlayerCurrentIndex = currentIndex;
		nextPlayerHealth = health;
		nextPlayerNotCollectedYet = notCollectedYet;
		nextPlayerFairyCount = fairyCount;
	},

	preload: function() 
	{
		game.load.atlas('atlas', 'assets/img/atlas.png', 'assets/img/atlas.JSON');
		game.load.audio('main_music', 'assets/audio/main_music.mp3'); //made by Whitesand on Youtube

		game.state.add('level1', levelState);
	},

	create: function()
	{
		gamePlayMusic = game.add.audio('main_music');
		if (state == 0)
		{
			gamePlayMusic.play('', 0, 1, true); //plays main game music on loop
		}
		
		// enables the Arcade Physics system
    	game.physics.startSystem(Phaser.Physics.ARCADE);
    	//game.stage.backgroundColor = "#228b22";

    	forest = game.add.tileSprite(0, 0, game.world.width, game.world.height, 'atlas', 'forest');

    	// Create platforms group
   		platforms = game.add.group();
    	platforms.enableBody = true; // Enable physics for any object that is created in this group

		ground = game.add.tileSprite(0, game.world.height - 30, game.world.width, 64, 'atlas', 'ground');
    	game.physics.arcade.enable(ground); // Enable physics for the ground
    	ground.body.immovable = true; // Make the ground immovable (so the player can jump on it)
    	platforms.add(ground);

    	monsters = game.add.group(); //make monsters a game group
		monsters.enableBody = true;

    	if (repeat == false)
    	{
			player = new Player(game, 'atlas', 'playerr0', 100, game.world.height - 160, 0.2) //add in a player object by calling Player prefab constructor
			game.add.existing(player); //add in to world
			var waterMonster = monsters.add(new Monster(game, 'atlas', 'waterl1', 800, game.world.height - 100, 0.13, 'water', player));

			//var earthMonster = monsters.add(new Monster(game, 'atlas', 'earthl', 800, game.world.height - 100, 0.13, 'earth', player));

			//var fireMonster = monsters.add(new Monster(game, 'atlas', 'firel1', 800, game.world.height - 100, 0.13, 'fire', player));

			//var airMonster = monsters.add(new Monster(game, 'atlas', 'airl', 800, game.world.height - 100, 0.13, 'air', player));
			//add in all four fairies for testing
			waterFairy = new Fairy(game, 'atlas', 'wfairy', 300, game.world.height - 250, 1, 'water'); 
			game.add.existing(waterFairy);
 	  
			earthFairy = new Fairy(game, 'atlas', 'efairy', 400, game.world.height - 250, 1, 'earth');
			game.add.existing(earthFairy);
		
			fireFairy = new Fairy(game, 'atlas', 'ffairy', 500, game.world.height - 250, 1, 'fire');
			game.add.existing(fireFairy);
		
			airFairy = new Fairy(game, 'atlas', 'afairy', 600, game.world.height - 250, 1, 'air');
			game.add.existing(airFairy);
		}
		else 
		{
			//console.log(nextPlayerhasElement);
			//console.log(nextPlayerHealth);
			player = new Player(game, 'atlas', 'playerr0', 100, game.world.height - 160, 0.2)
			game.add.existing(player);
			player.hasElement = nextPlayerhasElement;
			player.equippedElement = nextPlayerEquippedElement;
			player.noneEquipped = nextPlayerNoneEquipped;
			player.currentIndex = nextPlayerCurrentIndex;
			player.health = nextPlayerHealth;
			player.notCollectedYet = nextPlayerNotCollectedYet;
			player.fairyCount = nextPlayerFairyCount;
			//console.log(player.hasElement);
			console.log(player); 

			if (state == 1)
			{
				var fireMonster = monsters.add(new Monster(game, 'atlas', 'firel1', 800, game.world.height - 100, 0.13, 'fire', player));
			}

			else if (state == 2)
			{
				//(xpos, ypos, width, height, key, frame)
				ledge = game.add.tileSprite(700, 450, 400, 100, 'atlas', 'ground');
				game.physics.arcade.enable(ledge);
				ledge.body.immovable = true;
				platforms.add(ledge);
				ledge.body.setSize(ledge.body.width, ledge.body.height / 2 - 15, 0, 62);

				var earthMonster = monsters.add(new Monster(game, 'atlas', 'earthl', 775, 450, 0.13, 'earth', player));
				var airMonster = monsters.add(new Monster(game, 'atlas', 'airl', 800, game.world.height - 100, 0.13, 'air', player));
			} 

			else if (state == 3)
			{
				//(xpos, ypos, width, height, key, frame)
				var ledge = game.add.tileSprite(200, 475, 300, 100, 'atlas', 'ground');
				game.physics.arcade.enable(ledge);
				ledge.body.immovable = true;
				platforms.add(ledge);
				ledge.body.setSize(ledge.body.width, ledge.body.height / 2 - 15, 0, 62);

				var ledge = game.add.tileSprite(650, 350, 400, 100, 'atlas', 'ground');
				game.physics.arcade.enable(ledge);
				ledge.body.immovable = true;
				platforms.add(ledge);
				ledge.body.setSize(ledge.body.width, ledge.body.height / 2 - 15, 0, 62);

				var waterMonster = monsters.add(new Monster(game, 'atlas', 'waterl1', 300, 475, 0.13, 'water', player));
				var fireMonster = monsters.add(new Monster(game, 'atlas', 'firel1', 800, 350, 0.13, 'fire', player));

				waterFairy = new Fairy(game, 'atlas', 'wfairy', 1000, game.world.height - 100, 1, 'water'); 
				game.add.existing(waterFairy);
			}

			else if (state == 4)
			{
				//(xpos, ypos, width, height, key, frame)
				var ledge = game.add.tileSprite(850, 475, 375, 100, 'atlas', 'ground');
				game.physics.arcade.enable(ledge);
				ledge.body.immovable = true;
				platforms.add(ledge);
				ledge.body.setSize(ledge.body.width, ledge.body.height / 2 - 15, 0, 62);

				//(xpos, ypos, width, height, key, frame)
				var ledge = game.add.tileSprite(220, 325, 500, 100, 'atlas', 'ground');
				game.physics.arcade.enable(ledge);
				ledge.body.immovable = true;
				platforms.add(ledge);
				ledge.body.setSize(ledge.body.width, ledge.body.height / 2 - 15, 0, 62);

				var earthMonster = monsters.add(new Monster(game, 'atlas', 'earthl', 900, 475, 0.13, 'earth', player));
				var fireMonster = monsters.add(new Monster(game, 'atlas', 'firel1', 300, 325, 0.13, 'fire', player));
			}

			else if (state == 5)
			{
				//(xpos, ypos, width, height, key, frame)
				var ledge = game.add.tileSprite(150, 475, 350, 100, 'atlas', 'ground');
				game.physics.arcade.enable(ledge);
				ledge.body.immovable = true;
				platforms.add(ledge);
				ledge.body.setSize(ledge.body.width, ledge.body.height / 2 - 15, 0, 62);

				var ledge = game.add.tileSprite(600, 325, 475, 100, 'atlas', 'ground');
				game.physics.arcade.enable(ledge);
				ledge.body.immovable = true;
				platforms.add(ledge);
				ledge.body.setSize(ledge.body.width, ledge.body.height / 2 - 15, 0, 62);

				var ledge = game.add.tileSprite(50, 200, 375, 100, 'atlas', 'ground');
				game.physics.arcade.enable(ledge);
				ledge.body.immovable = true;
				platforms.add(ledge);
				ledge.body.setSize(ledge.body.width, ledge.body.height / 2 - 15, 0, 62);

				var waterMonster = monsters.add(new Monster(game, 'atlas', 'waterl1', 700, 325, 0.13, 'water', player));
				var airMonster = monsters.add(new Monster(game, 'atlas', 'airl', 100, 200, 0.13, 'air', player));

				airFairy = new Fairy(game, 'atlas', 'afairy', 800, game.world.height - 75, 1, 'air');
				game.add.existing(airFairy);
			}

			else if (state == 6)
			{
				//(xpos, ypos, width, height, key, frame)
				var ledge = game.add.tileSprite(675, 475, 450, 100, 'atlas', 'ground');
				game.physics.arcade.enable(ledge);
				ledge.body.immovable = true;
				platforms.add(ledge);
				ledge.body.setSize(ledge.body.width, ledge.body.height / 2 - 15, 0, 62);

				var ledge = game.add.tileSprite(50, 325, 475, 100, 'atlas', 'ground');
				game.physics.arcade.enable(ledge);
				ledge.body.immovable = true;
				platforms.add(ledge);
				ledge.body.setSize(ledge.body.width, ledge.body.height / 2 - 15, 0, 62);

				var ledge = game.add.tileSprite(720, 225, 375, 100, 'atlas', 'ground');
				game.physics.arcade.enable(ledge);
				ledge.body.immovable = true;
				platforms.add(ledge);
				ledge.body.setSize(ledge.body.width, ledge.body.height / 2 - 15, 0, 62);

				var airMonster = monsters.add(new Monster(game, 'atlas', 'airl', 750, 225, 0.13, 'air', player));
				var earthMonster = monsters.add(new Monster(game, 'atlas', 'earthl', 100, 325, 0.13, 'earth', player));
				var fireMonster = monsters.add(new Monster(game, 'atlas', 'firel1', 725, 475, 0.13, 'fire', player));

			}

			else if (state == 7)
			{
				var ledge = game.add.tileSprite(50, 450, 300, 100, 'atlas', 'ground');
				game.physics.arcade.enable(ledge);
				ledge.body.immovable = true;
				platforms.add(ledge);
				ledge.body.setSize(ledge.body.width, ledge.body.height / 2 - 15, 0, 62);

				var ledge = game.add.tileSprite(900, 450, 300, 100, 'atlas', 'ground');
				game.physics.arcade.enable(ledge);
				ledge.body.immovable = true;
				platforms.add(ledge);
				ledge.body.setSize(ledge.body.width, ledge.body.height / 2 - 15, 0, 62);

				var ledge = game.add.tileSprite(425, 300, 425, 100, 'atlas', 'ground');
				game.physics.arcade.enable(ledge);
				ledge.body.immovable = true;
				platforms.add(ledge);
				ledge.body.setSize(ledge.body.width, ledge.body.height / 2 - 15, 0, 62);

				var waterMonster = monsters.add(new Monster(game, 'atlas', 'waterl1', 100, 450, 0.13, 'water', player));
				var fireMonster = monsters.add(new Monster(game, 'atlas', 'firel1', 475, 300, 0.13, 'fire', player));
				var earthMonster = monsters.add(new Monster(game, 'atlas', 'earthl', 950, 450, 0.13, 'earth', player));

				fireFairy = new Fairy(game, 'atlas', 'ffairy', 650, game.world.height - 100, 1, 'fire');
				game.add.existing(fireFairy);
			}

			else if (state == 8)
			{
				var ledge = game.add.tileSprite(425, 325, 425, 100, 'atlas', 'ground');
				game.physics.arcade.enable(ledge);
				ledge.body.immovable = true;
				platforms.add(ledge);
				ledge.body.setSize(ledge.body.width, ledge.body.height / 2 - 15, 0, 62);

				var ledge = game.add.tileSprite(50, 475, 300, 100, 'atlas', 'ground');
				game.physics.arcade.enable(ledge);
				ledge.body.immovable = true;
				platforms.add(ledge);
				ledge.body.setSize(ledge.body.width, ledge.body.height / 2 - 15, 0, 62);

				var ledge = game.add.tileSprite(25, 175, 325, 100, 'atlas', 'ground');
				game.physics.arcade.enable(ledge);
				ledge.body.immovable = true;
				platforms.add(ledge);
				ledge.body.setSize(ledge.body.width, ledge.body.height / 2 - 15, 0, 62);

				var ledge = game.add.tileSprite(900, 175, 325, 100, 'atlas', 'ground');
				game.physics.arcade.enable(ledge);
				ledge.body.immovable = true;
				platforms.add(ledge);
				ledge.body.setSize(ledge.body.width, ledge.body.height / 2 - 15, 0, 62);

				var airMonster = monsters.add(new Monster(game, 'atlas', 'airl', 100, 175, 0.13, 'air', player));
				var waterMonster = monsters.add(new Monster(game, 'atlas', 'waterl1', 500, 325, 0.13, 'water', player));
				var earthMonster = monsters.add(new Monster(game, 'atlas', 'earthl', 950, 175, 0.13, 'earth', player));
			}

			else if (state == 9)
			{
				var ledge = game.add.tileSprite(50, 475, 400, 100, 'atlas', 'ground');
				game.physics.arcade.enable(ledge);
				ledge.body.immovable = true;
				platforms.add(ledge);
				ledge.body.setSize(ledge.body.width, ledge.body.height / 2 - 15, 0, 62);

				var ledge = game.add.tileSprite(825, 475, 400, 100, 'atlas', 'ground');
				game.physics.arcade.enable(ledge);
				ledge.body.immovable = true;
				platforms.add(ledge);
				ledge.body.setSize(ledge.body.width, ledge.body.height / 2 - 15, 0, 62);

				var ledge = game.add.tileSprite(525, 325, 200, 100, 'atlas', 'ground');
				game.physics.arcade.enable(ledge);
				ledge.body.immovable = true;
				platforms.add(ledge);
				ledge.body.setSize(ledge.body.width, ledge.body.height / 2 - 15, 0, 62);

				var ledge = game.add.tileSprite(50, 175, 400, 100, 'atlas', 'ground');
				game.physics.arcade.enable(ledge);
				ledge.body.immovable = true;
				platforms.add(ledge);
				ledge.body.setSize(ledge.body.width, ledge.body.height / 2 - 15, 0, 62);

				var ledge = game.add.tileSprite(825, 175, 400, 100, 'atlas', 'ground');
				game.physics.arcade.enable(ledge);
				ledge.body.immovable = true;
				platforms.add(ledge);
				ledge.body.setSize(ledge.body.width, ledge.body.height / 2 - 15, 0, 62);

				var airMonster = monsters.add(new Monster(game, 'atlas', 'airl', 900, 175, 0.13, 'air', player));
				var fireMonster = monsters.add(new Monster(game, 'atlas', 'firel1', 125, 175, 0.13, 'fire', player));
				var waterMonster = monsters.add(new Monster(game, 'atlas', 'waterl1', 900, 475, 0.13, 'water', player));
				var earthMonster = monsters.add(new Monster(game, 'atlas', 'earthl', 135, 475, 0.13, 'earth', player));

				earthFairy = new Fairy(game, 'atlas', 'efairy', 625, 325, 1, 'earth');
				game.add.existing(earthFairy);
			}
		}
		//player.body.setSize(30, 52, 17, 8); //adjust player's hitbox to match sprite dimensions (width, height, offsetx, offsety) 

		game.add.text(16, 16, 'Press M to go to the next level', { fontSize: '32px', fill: '#FFFFFF'});
	},

	update: function()
	{

		right = false;
		left = false;
		jump = false;
		addWater = false; 
		addEarth = false; 
		addFire = false; 
		addAir = false; 
		switchNext = false;
		switchPrev = false;
		attack = false;

		//advances screen to level 1, this will eventually be the first screen that is loaded instead of the 'gameplay' screen
		if(game.input.keyboard.justPressed(Phaser.Keyboard.M)) {
			repeat = true;
			state += 1;
			game.state.start('GamePlay', true, false, player.hasElement, player.equippedElement, 
				player.noneEquipped, player.currentIndex, player.health, player.notCollectedYet, player.fairyCount, state);
		}

		for (i = 0; i < monsters.length; i++)
		{
			if (monsters.children[i].cleared == false)
			{
				unlock = false;
			}
			else 
			{
				unlock = true;
			}
		}

		if (player.body.position.x > 1280 && unlock == true)
		{
			repeat = true;
			state += 1;
			game.state.start('GamePlay', true, false, player.hasElement, player.equippedElement, 
				player.noneEquipped, player.currentIndex, player.health, player.notCollectedYet, player.fairyCount, state);
		}

		game.physics.arcade.collide(player, platforms); //allows collision between player and ground
		//different cases when a player collides with each elemental fairy
		game.physics.arcade.collide(player, waterFairy, addWaterFairy, null, this);
		game.physics.arcade.collide(player, earthFairy, addEarthFairy, null, this);
		game.physics.arcade.collide(player, fireFairy, addFireFairy, null, this);
		game.physics.arcade.collide(player, airFairy, addAirFairy, null, this);
		//if the players bullets hit any type of monster, call the calcDmg function
		game.physics.arcade.collide(player.bullets, monsters, calcDmg, null, this);
		game.physics.arcade.collide(player, monsters); //allows collision between player and monsters

		function calcDmg(bullet, monster) //calculates what kind of damage the monster takes depending on type of bullet collided with type of monster.
		{
			if (monster.enableCollision == true)
			{
				//if the bullet is of type water 
				if (bullet.element == 'water')
				{
					if (monster.element == 'water') //if the monster's type is also water
					{
						if (monster.health < 10) //if the monster health isn't full
						{
							monster.health += heal; //add the heal value to its health pool
						}
					}
					else if (monster.element == 'earth') // if the monster's type is earth
					{
						monster.health -= reg_dmg; //the monster takes regular damage
					}
					else if (monster.element == 'fire') //if the monster's type is fire
					{
						monster.health -= super_dmg; //the monster takes super effective damage
					}
					else //then the monster's type must be air
					{
						monster.health -= bad_dmg; //monster takes not very effective damage
					}
				}
				//if the bullet's element is earth
				else if (bullet.element == 'earth')
				{
					if (monster.element == 'water')
					{
						monster.health -= reg_dmg;
					}
					else if (monster.element == 'earth')
					{
						if (monster.health < 10)
						{
							monster.health += heal;
						}
					}
					else if (monster.element == 'fire')
					{
						monster.health -= bad_dmg;
					}
					else 
					{
						monster.health -= super_dmg;
					}
				}
				//if the bullets element is fire
				else if (bullet.element == 'fire')
				{
					if (monster.element == 'water')
					{
						monster.health -= bad_dmg;
					}
					else if (monster.element == 'earth')
					{
						monster.health -= super_dmg;
					}
					else if (monster.element == 'fire')
					{
						if (monster.health < 10)
						{
							monster.health += heal;
						}
					}
					else 
					{
						monster.health -= reg_dmg;
					}
				}
				//bullet's element is air
				else 
				{
					if (monster.element == 'water')
					{
						monster.health -= super_dmg;
					}
					else if (monster.element == 'earth')
					{
						monster.health -= bad_dmg;
					}
					else if (monster.element == 'fire')
					{
						monster.health -= reg_dmg;
					}
					else 
					{
						if (monster.health < 10)
						{
							monster.health += heal;
						}
					}

				}
				console.log(monster.health);
				bullet.kill(); //get rid of the bullet on collision
			}
			else 
				bullet.kill(); //get rid of the bullet on collision
		}

		//if the W button is down and the player is touching on the ground then set jump equal to true
		if (game.input.keyboard.isDown(Phaser.Keyboard.W) && player.body.touching.down)
		{
			jump = true;
		}
		if (game.input.keyboard.isDown(Phaser.Keyboard.D)) //if the D key is down, then set right to true
		{
			right = true;
		}
		else if (game.input.keyboard.isDown(Phaser.Keyboard.A)) //if the A key is down, then set left to true
		{
			left = true;
		}
	    
		if (game.input.keyboard.justPressed(Phaser.Keyboard.E)) //if the E key is pressed, then set switchNext to true
    	{
        	switchNext = true;
    	}
    	else if (game.input.keyboard.justPressed(Phaser.Keyboard.Q)) //if the Q key is pressed, then set switchPrev to true (note that switching to prev fairy hasn't been implemented yet)
    	{
        	switchPrev = true;
    	}

		if (game.input.keyboard.justPressed(Phaser.Keyboard.SPACEBAR)) //if spacebar is pressed, set attack to true
		{
			attack = true;
		}

		//these next four functions are for when the player collides with a specific typed fairy
		//sets respective elemental var to true
		//sets player field notCollectedYet to false meaning that the player has now collected a fairy 
		//increment player's fairy count by one
		//kill fairy
		function addWaterFairy(player, fairy) 
		{
			addWater = true;
			player.notCollectedYet = false;
			player.fairyCount += 1;
			player.health = 20;
			console.log(player.fairyCount);
			fairy.kill();
		}

		function addEarthFairy(player, fairy)
		{
			addEarth = true;
			player.notCollectedYet = false;
			player.fairyCount += 1;
			player.health = 20;
			console.log(player.fairyCount);
			fairy.kill();
		}

		function addFireFairy(player, fairy)
		{
			addFire = true;
			player.notCollectedYet = false;
			player.fairyCount += 1;
			player.health = 20;
			console.log(player.fairyCount);
			fairy.kill();
		}

		function addAirFairy(player, fairy)
		{
			addAir = true;
			player.notCollectedYet = false;
			player.fairyCount += 1;
			player.health = 20;
			console.log(player.fairyCount);
			fairy.kill();
		}
	},
	render: function() //this is just debug stuff
	{
		//game.debug.body(player);
		game.debug.body(RightProjectile);
		game.debug.body(monsters);
		//game.debug.physicsGroup(platforms);
	},
}

var EndGame = function(game) {};
EndGame.prototype ={
	preload: function()
	{
		console.log('EndGame: preload');
	},

	create: function()
	{
		
	},

	update: function()
	{
		
	}
}

//add states to state manager
game.state.add('menu', menu);
game.state.add('GamePlay', GamePlay); //this will change to the first game state instead of just gameplay
game.state.add('EndGame', EndGame)
game.state.start('menu'); //start with the menu screen
