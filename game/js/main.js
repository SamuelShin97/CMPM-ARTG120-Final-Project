var game = new Phaser.Game(1280, 720, Phaser.CANVAS);
var right = false;
var left = false;
var jump = false;
var addWater = false;
var addEarth = false;
var addFire = false;
var addAir = false;
var switchNext = false;
var switchPrev = false; //Testing git push
var attack = false;
var levelState;
var heal = 1;
var bad_dmg  =1;
var reg_dmg = 3;
var super_dmg = 6;

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
		if (game.input.keyboard.isDown(Phaser.Keyboard.M))
		{
			game.state.start('GamePlay'); //play the game once space is pressed
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
		gamePlayMusic.play('', 0, 1, true);
		// enables the Arcade Physics system
    	game.physics.startSystem(Phaser.Physics.ARCADE);
    	game.stage.backgroundColor = "#228b22";
		//everything is place holder art 

		ground = game.add.tileSprite(0, game.world.height - 200, game.world.width, 64, 'atlas', 'tileBlue_22');
    	game.physics.arcade.enable(ground); // Enable physics for the ground
    	ground.body.immovable = true; // Make the ground immovable (so the player can jump on it)

		player = new Player(game, 'atlas', 'playerrough', 100, ground.height + 200, 1)
		game.add.existing(player);

		monsters = game.add.group();
		monsters.enableBody = true;

		var waterMonster = monsters.add(new Monster(game, 'atlas', 'enemySpikey_3', 800, 450, 1, 'water'));
	    

		//left arrow is water fairy
		waterFairy = new Fairy(game, 'atlas', 'wfairy', 300, game.world.height - 250, 1, 'water'); 
		game.add.existing(waterFairy);
 	    //right arrow is earth
		earthFairy = new Fairy(game, 'atlas', 'efairy', 400, game.world.height - 250, 1, 'earth');
		game.add.existing(earthFairy);
		//up arrow is fire
		fireFairy = new Fairy(game, 'atlas', 'ffairy', 500, game.world.height - 250, 1, 'fire');
		game.add.existing(fireFairy);
		//down arrow is air
		airFairy = new Fairy(game, 'atlas', 'afairy', 600, game.world.height - 250, 1, 'air');
		game.add.existing(airFairy);

		game.add.text(16, 16, 'Press M to go to the next level', { fontSize: '32px', fill: '#FFFFFF'});
	},

	update: function()
	{
		if(game.input.keyboard.justPressed(Phaser.Keyboard.M)) {
			game.state.start('level1');
		}

		game.physics.arcade.collide(player, ground);
		game.physics.arcade.collide(player, waterFairy, addWaterFairy, null, this);
		game.physics.arcade.collide(player, earthFairy, addEarthFairy, null, this);
		game.physics.arcade.collide(player, fireFairy, addFireFairy, null, this);
		game.physics.arcade.collide(player, airFairy, addAirFairy, null, this);
		game.physics.arcade.collide(player.bullets, monsters, calcDmg, null, this);

		function calcDmg(bullet, monster)
		{
			console.log(bullet.element);
			console.log(monster.element);
			console.log(bullet);
			if (bullet.element == 'water')
			{
				if (monster.element == 'water')
				{
					if (monster.health < 10)
					{
						monster.health += heal;
					}
				}
				else if (monster.element == 'earth')
				{
					monster.health -= reg_dmg;
				}
				else if (monster.element == 'fire')
				{
					monster.health -= super_dmg;
				}
				else 
				{
					monster.health -= bad_dmg;
				}
			}
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
			bullet.kill();
		}


		right = false;
		left = false;
		jump = false;
		//addWater = false;
		//addEarth = false;
		//addFire = false;
		//addAir = false;
		switchNext = false;
		switchPrev = false;
		attack = false;
		if (game.input.keyboard.isDown(Phaser.Keyboard.W) && player.body.touching.down)
		{
			jump = true;
		}
		if (game.input.keyboard.isDown(Phaser.Keyboard.D))
		{
			right = true;
		}
		else if (game.input.keyboard.isDown(Phaser.Keyboard.A))
		{
			left = true;
		}
	    
		if (game.input.keyboard.justPressed(Phaser.Keyboard.E))
    	{
        	switchNext = true;
    	}
    	else if (game.input.keyboard.justPressed(Phaser.Keyboard.Q))
    	{
        	switchPrev = true;
    	}

		if (game.input.keyboard.justPressed(Phaser.Keyboard.SPACEBAR)) //attack
		{
			attack = true;
		}

		function addWaterFairy(player, fairy)
		{
			addWater = true;
			fairy.kill();
			console.log('collected water fairy');
		}

		function addEarthFairy(player, fairy)
		{
			addEarth = true;
			fairy.kill();
			console.log('collected earth fairy');
		}

		function addFireFairy(player, fairy)
		{
			addFire = true;
			fairy.kill();
			console.log('collected fire fairy');
		}

		function addAirFairy(player, fairy)
		{
			addAir = true;
			fairy.kill();
			console.log('collected air fairy');
		}
	},
	render: function()
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
