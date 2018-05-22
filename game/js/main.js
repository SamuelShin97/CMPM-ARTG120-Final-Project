var game = new Phaser.Game(1280, 720, Phaser.CANVAS);

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

var heal = 1; //value for hitting an elemental monster with same type projectile
var bad_dmg  =1; //value for hitting an elemental monster with not very effective type projectile 
var reg_dmg = 3; //value for hitting an elemental monster with neutral type projectile
var super_dmg = 5; //value for hitting an elemental monster with super effective type projectile

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
}

var GamePlay = function(game) {}; //this will change to a different game state in separate js files
GamePlay.prototype = {
	preload: function() 
	{
		game.load.atlas('atlas', 'assets/img/roughsheet.png', 'assets/img/roughsheet.JSON');
		game.load.audio('main_music', 'assets/audio/main_music.mp3'); //made by Whitesand on Youtube

		game.state.add('level1', levelState);
	},

	create: function()
	{
		gamePlayMusic = game.add.audio('main_music');
		gamePlayMusic.play('', 0, 1, true); //plays main game music on loop
		// enables the Arcade Physics system
    	game.physics.startSystem(Phaser.Physics.ARCADE);
    	game.stage.backgroundColor = "#228b22";
		//everything is place holder art 

		ground = game.add.tileSprite(0, game.world.height - 64, game.world.width, 64, 'atlas', 'tileBlue_22');
    	game.physics.arcade.enable(ground); // Enable physics for the ground
    	ground.body.immovable = true; // Make the ground immovable (so the player can jump on it)

		player = new Player(game, 'atlas', 'playerrough', 100, game.world.height - 160, 1) //add in a player object by calling Player prefab constructor
		game.add.existing(player); //add in to world
		player.body.setSize(30, 52, 17, 8); //adjust player's hitbox to match sprite dimensions (width, height, offsetx, offsety)

		monsters = game.add.group(); //make monsters a game group
		monsters.enableBody = true;

		//adding a single water type monster to the world for testing
		var waterMonster = monsters.add(new Monster(game, 'atlas', 'wmonster', 800, game.world.height - 100, 1, 'water', player)); 
	    

		//add in all four fairies for testing
		waterFairy = new Fairy(game, 'atlas', 'wfairy', 300, game.world.height - 250, 1, 'water'); 
		game.add.existing(waterFairy);
 	  
		earthFairy = new Fairy(game, 'atlas', 'efairy', 400, game.world.height - 250, 1, 'earth');
		game.add.existing(earthFairy);
		
		fireFairy = new Fairy(game, 'atlas', 'ffairy', 500, game.world.height - 250, 1, 'fire');
		game.add.existing(fireFairy);
		
		airFairy = new Fairy(game, 'atlas', 'afairy', 600, game.world.height - 250, 1, 'air');
		game.add.existing(airFairy);

		game.add.text(16, 16, 'Press M to go to the next level', { fontSize: '32px', fill: '#FFFFFF'});
	},

	update: function()
	{
		//advances screen to level 1, this will eventually be the first screen that is loaded instead of the 'gameplay' screen
		if(game.input.keyboard.justPressed(Phaser.Keyboard.M)) {
			game.state.start('level1');
		}

		game.physics.arcade.collide(player, ground); //allows collision between player and ground
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


		right = false;
		left = false;
		jump = false;
		switchNext = false;
		switchPrev = false;
		attack = false;

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
		game.debug.body(player);
		game.debug.body(RightProjectile);
		game.debug.body(monsters);
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
