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

var heal = 3; //value for hitting an elemental monster with same type projectile
var bad_dmg  =1; //value for hitting an elemental monster with not very effective type projectile 
var reg_dmg = 3; //value for hitting an elemental monster with neutral type projectile
var super_dmg = 5; //value for hitting an elemental monster with super effective type projectile

var repeat = false; //if player has advanced to a new screen
var state = 0;
var unlock = false;
var preUnlock = false;

var player;
var finalBoss;

var reverse = false;

var inPlace = false;

var gamePlayMusic = null;

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

	init: function(hasElement, equippedElement, noneEquipped, currentIndex, health, notCollectedYet, fairyCount, music)
	{
		nextPlayerhasElement = hasElement;
		nextPlayerEquippedElement = equippedElement;
		nextPlayerNoneEquipped = noneEquipped;
		nextPlayerCurrentIndex = currentIndex;
		nextPlayerHealth = health;
		nextPlayerNotCollectedYet = notCollectedYet;
		nextPlayerFairyCount = fairyCount;
		nextMusic = music;
	},

	preload: function() 
	{
		game.load.atlas('atlas', 'assets/img/atlas.png', 'assets/img/atlas.JSON');
		game.load.audio('main_music', 'assets/audio/main_music.mp3'); //made by Whitesand on Youtube
	},

	create: function()
	{
		gamePlayMusic = game.add.audio('main_music');

		if (state == 0)
		{
			gamePlayMusic.play('', 0, 1, true); //plays main game music on loop
			console.log(gamePlayMusic);
		}
		
		console.log(nextMusic);
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

		boundary = game.add.group();
		boundary.enableBody = true;

    	if (repeat == false)
    	{
			player = new Player(game, 'atlas', 'playerr0', 100, game.world.height - 160, 0.2) //add in a player object by calling Player prefab constructor
			game.add.existing(player); //add in to world
			var waterMonster = monsters.add(new Monster(game, 'atlas', 'waterl1', 800, game.world.height - 100, 0.13, 'water', player, boundary));
			waterMonster.health = 2;

			var TutText1 = "The Fluorescent Forest can be\na very dangerous place, but luckily these\nfairies are willing to guide you through.";
			Tutbox1 = game.add.text(25, 200, TutText1, {font: "12px 'Helvetica'", fill: "#FFFFFF", align: "left", backgroundColor: "#797D7F"});

			var TutText2 = "Use WAD to move and jump.\nTouch the fairies to collect them.\nThis will imbue you with their power.";
			Tutbox2 = game.add.text(250, 200, TutText2, {font:"12px 'Helvetica'", fill: "#FFFFFF", align: "left", backgroundColor: "#797D7F"});

			var TutText3 = "Press E to change which fairy's\npower is equipped. Press SPACEBAR\nto use the equipped power.";
			Tutbox3 = game.add.text(450, 200, TutText3, {font:"12px 'Helvetica'", fill: "#FFFFFF", align: "left", backgroundColor: "#797D7F"});

			var TutText4 = "The fairies don't like enemies of the\nforest and its inhabitants, so be\ncareful when attacking them.";
			Tutbox4 = game.add.text(660, 200, TutText4, {font:"12px 'Helvetica'", fill: "#FFFFFF", align: "left", backgroundColor: "#797D7F"});

			var TutText5 = "You may attack monsters until they\ndie or fight them until they reach\ntheir idle state and then heal them.";
			Tutbox5 = game.add.text(855, 200, TutText5, {font:"12px 'Helvetica'", fill: "#FFFFFF", align: "left", backgroundColor: "#797D7F"});

			var TutText6 = "Each type of monster has an element\nthey are weaker to and are healed\nby their own element.";
			Tutbox6 = game.add.text(1050, 200, TutText6, {font:"12px 'Helvetica'", fill: "#FFFFFF", align: "left", backgroundColor: "#797D7F"});

			var TutText7 = "Killing enemies may grant you a \ndamage bonus, but the fairies will\nstart to resent you and one will leave.";
			Tutbox7 = game.add.text(450, 300, TutText7, {font:"12px 'Helvetica'", fill: "#FFFFFF", align: "left", backgroundColor: "#797D7F"});

			var TutText8 = "On the other hand, healing\nenemies keeps the fairies happy\nand grants you extra Energy.";
			Tutbox8 = game.add.text(660, 300, TutText8, {font:"12px 'Helvetica'", fill: "#FFFFFF", align: "left", backgroundColor: "#797D7F"});

			var TutText9 = "Go ahead and heal this monster\nusing the Water Fairy.";
			Tutbox9 = game.add.text(750, 525, TutText9, {font:"12px 'Helvetica'", fill: "#FFFFFF", align: "left", backgroundColor: "#797D7F"});

			spirit = game.add.sprite(1300, 400, 'atlas', 'gf0');
			spirit.scale.setTo(0.3, 0.3);
			game.physics.arcade.enable(spirit);
			spirit.animations.add('walking', ['gf0', 'gf7'], 10, true);

			//var earthMonster = monsters.add(new Monster(game, 'atlas', 'earthl', 800, game.world.height - 100, 0.13, 'earth', player));

			//var fireMonster = monsters.add(new Monster(game, 'atlas', 'firel1', 800, game.world.height - 100, 0.13, 'fire', player));

			//var airMonster = monsters.add(new Monster(game, 'atlas', 'airl', 800, game.world.height - 100, 0.13, 'air', player));
			//add in all four fairies for testing
			waterFairy = new Fairy(game, 'atlas', 'w0', 300, game.world.height - 250, 0.1, 'water', platforms); 
			game.add.existing(waterFairy);
			waterFairy.body.setSize(260, 260, 135, 135)
 	  
			earthFairy = new Fairy(game, 'atlas', 'e0', 400, game.world.height - 250, 0.1, 'earth', platforms);
			game.add.existing(earthFairy);
			earthFairy.body.setSize(260, 260, 135, 135)
		
			fireFairy = new Fairy(game, 'atlas', 'f0', 500, game.world.height - 250, 0.1, 'fire', platforms);
			game.add.existing(fireFairy);
			fireFairy.body.setSize(260, 260, 135, 135)
		
			airFairy = new Fairy(game, 'atlas', 'a0', 600, game.world.height - 250, 0.1, 'air', platforms);
			game.add.existing(airFairy);
			airFairy.body.setSize(260, 260, 135, 135)
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
			//console.log(player); 

			if (state == 1)
			{
				var fireMonster = monsters.add(new Monster(game, 'atlas', 'firel1', 800, game.world.height - 100, 0.13, 'fire', player, boundary));
			}

			else if (state == 2)
			{
				//(xpos, ypos, width, height, key, frame)
				ledge = game.add.tileSprite(700, 450, 400, 100, 'atlas', 'ground');
				game.physics.arcade.enable(ledge);
				ledge.body.immovable = true;
				platforms.add(ledge);
				ledge.body.setSize(ledge.body.width, ledge.body.height / 2 - 15, 0, 62);

				bound = game.add.tileSprite(ledge.body.position.x, ledge.body.position.y, 10, 100, 'atlas', 'ground');
				game.physics.arcade.enable(bound);
				bound.body.immovable = true;
				boundary.add(bound);

				bound = game.add.tileSprite(ledge.body.position.x + ledge.body.width, ledge.body.position.y, 10, 100, 'atlas', 'ground');
				game.physics.arcade.enable(bound);
				bound.body.immovable = true;
				boundary.add(bound);

				var earthMonster = monsters.add(new Monster(game, 'atlas', 'earthl', 775, 450, 0.13, 'earth', player, boundary));
				var airMonster = monsters.add(new Monster(game, 'atlas', 'airl', 800, game.world.height - 100, 0.13, 'air', player, boundary));
			}

			else if (state == 3)
			{
				//(xpos, ypos, width, height, key, frame)
				var ledge = game.add.tileSprite(200, 475, 300, 100, 'atlas', 'ground');
				game.physics.arcade.enable(ledge);
				ledge.body.immovable = true;
				platforms.add(ledge);
				ledge.body.setSize(ledge.body.width, ledge.body.height / 2 - 15, 0, 62);

				bound = game.add.tileSprite(ledge.body.position.x, ledge.body.position.y, 10, 100, 'atlas', 'ground');
				game.physics.arcade.enable(bound);
				bound.body.immovable = true;
				boundary.add(bound);

				bound = game.add.tileSprite(ledge.body.position.x + ledge.body.width, ledge.body.position.y, 10, 100, 'atlas', 'ground');
				game.physics.arcade.enable(bound);
				bound.body.immovable = true;
				boundary.add(bound);

				var ledge = game.add.tileSprite(650, 350, 400, 100, 'atlas', 'ground');
				game.physics.arcade.enable(ledge);
				ledge.body.immovable = true;
				platforms.add(ledge);
				ledge.body.setSize(ledge.body.width, ledge.body.height / 2 - 15, 0, 62);

				bound = game.add.tileSprite(ledge.body.position.x, ledge.body.position.y, 10, 100, 'atlas', 'ground');
				game.physics.arcade.enable(bound);
				bound.body.immovable = true;
				boundary.add(bound);

				bound = game.add.tileSprite(ledge.body.position.x + ledge.body.width, ledge.body.position.y, 10, 100, 'atlas', 'ground');
				game.physics.arcade.enable(bound);
				bound.body.immovable = true;
				boundary.add(bound);

				var waterMonster = monsters.add(new Monster(game, 'atlas', 'waterl1', 300, 475, 0.13, 'water', player));
				var fireMonster = monsters.add(new Monster(game, 'atlas', 'firel1', 800, 350, 0.13, 'fire', player));

				waterFairy = new Fairy(game, 'atlas', 'w0', 1000, game.world.height - 100, 0.1, 'water', platforms); 
				game.add.existing(waterFairy);
				waterFairy.body.setSize(260, 260, 135, 135)
			}

			else if (state == 4)
			{
				//(xpos, ypos, width, height, key, frame)
				var ledge = game.add.tileSprite(850, 475, 375, 100, 'atlas', 'ground');
				game.physics.arcade.enable(ledge);
				ledge.body.immovable = true;
				platforms.add(ledge);
				ledge.body.setSize(ledge.body.width, ledge.body.height / 2 - 15, 0, 62);

				bound = game.add.tileSprite(ledge.body.position.x, ledge.body.position.y, 10, 100, 'atlas', 'ground');
				game.physics.arcade.enable(bound);
				bound.body.immovable = true;
				boundary.add(bound);

				bound = game.add.tileSprite(ledge.body.position.x + ledge.body.width, ledge.body.position.y, 10, 100, 'atlas', 'ground');
				game.physics.arcade.enable(bound);
				bound.body.immovable = true;
				boundary.add(bound);

				//(xpos, ypos, width, height, key, frame)
				var ledge = game.add.tileSprite(220, 325, 500, 100, 'atlas', 'ground');
				game.physics.arcade.enable(ledge);
				ledge.body.immovable = true;
				platforms.add(ledge);
				ledge.body.setSize(ledge.body.width, ledge.body.height / 2 - 15, 0, 62);

				bound = game.add.tileSprite(ledge.body.position.x, ledge.body.position.y, 10, 100, 'atlas', 'ground');
				game.physics.arcade.enable(bound);
				bound.body.immovable = true;
				boundary.add(bound);

				bound = game.add.tileSprite(ledge.body.position.x + ledge.body.width, ledge.body.position.y, 10, 100, 'atlas', 'ground');
				game.physics.arcade.enable(bound);
				bound.body.immovable = true;
				boundary.add(bound);

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

				bound = game.add.tileSprite(ledge.body.position.x, ledge.body.position.y, 10, 100, 'atlas', 'ground');
				game.physics.arcade.enable(bound);
				bound.body.immovable = true;
				boundary.add(bound);

				bound = game.add.tileSprite(ledge.body.position.x + ledge.body.width, ledge.body.position.y, 10, 100, 'atlas', 'ground');
				game.physics.arcade.enable(bound);
				bound.body.immovable = true;
				boundary.add(bound);

				var ledge = game.add.tileSprite(600, 325, 475, 100, 'atlas', 'ground');
				game.physics.arcade.enable(ledge);
				ledge.body.immovable = true;
				platforms.add(ledge);
				ledge.body.setSize(ledge.body.width, ledge.body.height / 2 - 15, 0, 62);

				bound = game.add.tileSprite(ledge.body.position.x, ledge.body.position.y, 10, 100, 'atlas', 'ground');
				game.physics.arcade.enable(bound);
				bound.body.immovable = true;
				boundary.add(bound);

				bound = game.add.tileSprite(ledge.body.position.x + ledge.body.width, ledge.body.position.y, 10, 100, 'atlas', 'ground');
				game.physics.arcade.enable(bound);
				bound.body.immovable = true;
				boundary.add(bound);

				var ledge = game.add.tileSprite(50, 200, 375, 100, 'atlas', 'ground');
				game.physics.arcade.enable(ledge);
				ledge.body.immovable = true;
				platforms.add(ledge);
				ledge.body.setSize(ledge.body.width, ledge.body.height / 2 - 15, 0, 62);

				bound = game.add.tileSprite(ledge.body.position.x, ledge.body.position.y, 10, 100, 'atlas', 'ground');
				game.physics.arcade.enable(bound);
				bound.body.immovable = true;
				boundary.add(bound);

				bound = game.add.tileSprite(ledge.body.position.x + ledge.body.width, ledge.body.position.y, 10, 100, 'atlas', 'ground');
				game.physics.arcade.enable(bound);
				bound.body.immovable = true;
				boundary.add(bound);

				var waterMonster = monsters.add(new Monster(game, 'atlas', 'waterl1', 700, 325, 0.13, 'water', player));
				var airMonster = monsters.add(new Monster(game, 'atlas', 'airl', 100, 200, 0.13, 'air', player));

				airFairy = new Fairy(game, 'atlas', 'a0', 800, game.world.height - 75, 0.1, 'air', platforms);
				game.add.existing(airFairy);
				airFairy.body.setSize(260, 260, 135, 135)
			}

			else if (state == 6)
			{
				//(xpos, ypos, width, height, key, frame)
				var ledge = game.add.tileSprite(675, 475, 450, 100, 'atlas', 'ground');
				game.physics.arcade.enable(ledge);
				ledge.body.immovable = true;
				platforms.add(ledge);
				ledge.body.setSize(ledge.body.width, ledge.body.height / 2 - 15, 0, 62);

				bound = game.add.tileSprite(ledge.body.position.x, ledge.body.position.y, 10, 100, 'atlas', 'ground');
				game.physics.arcade.enable(bound);
				bound.body.immovable = true;
				boundary.add(bound);

				bound = game.add.tileSprite(ledge.body.position.x + ledge.body.width, ledge.body.position.y, 10, 100, 'atlas', 'ground');
				game.physics.arcade.enable(bound);
				bound.body.immovable = true;
				boundary.add(bound);

				var ledge = game.add.tileSprite(50, 325, 475, 100, 'atlas', 'ground');
				game.physics.arcade.enable(ledge);
				ledge.body.immovable = true;
				platforms.add(ledge);
				ledge.body.setSize(ledge.body.width, ledge.body.height / 2 - 15, 0, 62);

				bound = game.add.tileSprite(ledge.body.position.x, ledge.body.position.y, 10, 100, 'atlas', 'ground');
				game.physics.arcade.enable(bound);
				bound.body.immovable = true;
				boundary.add(bound);

				bound = game.add.tileSprite(ledge.body.position.x + ledge.body.width, ledge.body.position.y, 10, 100, 'atlas', 'ground');
				game.physics.arcade.enable(bound);
				bound.body.immovable = true;
				boundary.add(bound);

				var ledge = game.add.tileSprite(720, 225, 375, 100, 'atlas', 'ground');
				game.physics.arcade.enable(ledge);
				ledge.body.immovable = true;
				platforms.add(ledge);
				ledge.body.setSize(ledge.body.width, ledge.body.height / 2 - 15, 0, 62);

				bound = game.add.tileSprite(ledge.body.position.x, ledge.body.position.y, 10, 100, 'atlas', 'ground');
				game.physics.arcade.enable(bound);
				bound.body.immovable = true;
				boundary.add(bound);

				bound = game.add.tileSprite(ledge.body.position.x + ledge.body.width, ledge.body.position.y, 10, 100, 'atlas', 'ground');
				game.physics.arcade.enable(bound);
				bound.body.immovable = true;
				boundary.add(bound);

				var airMonster = monsters.add(new Monster(game, 'atlas', 'airl', 800, 225, 0.13, 'air', player));
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

				bound = game.add.tileSprite(ledge.body.position.x, ledge.body.position.y, 10, 100, 'atlas', 'ground');
				game.physics.arcade.enable(bound);
				bound.body.immovable = true;
				boundary.add(bound);

				bound = game.add.tileSprite(ledge.body.position.x + ledge.body.width, ledge.body.position.y, 10, 100, 'atlas', 'ground');
				game.physics.arcade.enable(bound);
				bound.body.immovable = true;
				boundary.add(bound);

				var ledge = game.add.tileSprite(900, 450, 300, 100, 'atlas', 'ground');
				game.physics.arcade.enable(ledge);
				ledge.body.immovable = true;
				platforms.add(ledge);
				ledge.body.setSize(ledge.body.width, ledge.body.height / 2 - 15, 0, 62);

				bound = game.add.tileSprite(ledge.body.position.x, ledge.body.position.y, 10, 100, 'atlas', 'ground');
				game.physics.arcade.enable(bound);
				bound.body.immovable = true;
				boundary.add(bound);

				bound = game.add.tileSprite(ledge.body.position.x + ledge.body.width, ledge.body.position.y, 10, 100, 'atlas', 'ground');
				game.physics.arcade.enable(bound);
				bound.body.immovable = true;
				boundary.add(bound);

				var ledge = game.add.tileSprite(425, 300, 425, 100, 'atlas', 'ground');
				game.physics.arcade.enable(ledge);
				ledge.body.immovable = true;
				platforms.add(ledge);
				ledge.body.setSize(ledge.body.width, ledge.body.height / 2 - 15, 0, 62);

				bound = game.add.tileSprite(ledge.body.position.x, ledge.body.position.y, 10, 100, 'atlas', 'ground');
				game.physics.arcade.enable(bound);
				bound.body.immovable = true;
				boundary.add(bound);

				bound = game.add.tileSprite(ledge.body.position.x + ledge.body.width, ledge.body.position.y, 10, 100, 'atlas', 'ground');
				game.physics.arcade.enable(bound);
				bound.body.immovable = true;
				boundary.add(bound);

				var waterMonster = monsters.add(new Monster(game, 'atlas', 'waterl1', 100, 450, 0.13, 'water', player));
				var fireMonster = monsters.add(new Monster(game, 'atlas', 'firel1', 475, 300, 0.13, 'fire', player));
				var earthMonster = monsters.add(new Monster(game, 'atlas', 'earthl', 950, 450, 0.13, 'earth', player));

				fireFairy = new Fairy(game, 'atlas', 'f0', 650, game.world.height - 100, 0.1, 'fire', platforms);
				game.add.existing(fireFairy);
				fireFairy.body.setSize(260, 260, 135, 135)
			}

			else if (state == 8)
			{
				var ledge = game.add.tileSprite(425, 325, 425, 100, 'atlas', 'ground');
				game.physics.arcade.enable(ledge);
				ledge.body.immovable = true;
				platforms.add(ledge);
				ledge.body.setSize(ledge.body.width, ledge.body.height / 2 - 15, 0, 62);

				bound = game.add.tileSprite(ledge.body.position.x, ledge.body.position.y, 10, 100, 'atlas', 'ground');
				game.physics.arcade.enable(bound);
				bound.body.immovable = true;
				boundary.add(bound);

				bound = game.add.tileSprite(ledge.body.position.x + ledge.body.width, ledge.body.position.y, 10, 100, 'atlas', 'ground');
				game.physics.arcade.enable(bound);
				bound.body.immovable = true;
				boundary.add(bound);

				var ledge = game.add.tileSprite(50, 475, 300, 100, 'atlas', 'ground');
				game.physics.arcade.enable(ledge);
				ledge.body.immovable = true;
				platforms.add(ledge);
				ledge.body.setSize(ledge.body.width, ledge.body.height / 2 - 15, 0, 62);

				bound = game.add.tileSprite(ledge.body.position.x, ledge.body.position.y, 10, 100, 'atlas', 'ground');
				game.physics.arcade.enable(bound);
				bound.body.immovable = true;
				boundary.add(bound);

				bound = game.add.tileSprite(ledge.body.position.x + ledge.body.width, ledge.body.position.y, 10, 100, 'atlas', 'ground');
				game.physics.arcade.enable(bound);
				bound.body.immovable = true;
				boundary.add(bound);

				var ledge = game.add.tileSprite(25, 175, 325, 100, 'atlas', 'ground');
				game.physics.arcade.enable(ledge);
				ledge.body.immovable = true;
				platforms.add(ledge);
				ledge.body.setSize(ledge.body.width, ledge.body.height / 2 - 15, 0, 62);

				bound = game.add.tileSprite(ledge.body.position.x, ledge.body.position.y, 10, 100, 'atlas', 'ground');
				game.physics.arcade.enable(bound);
				bound.body.immovable = true;
				boundary.add(bound);

				bound = game.add.tileSprite(ledge.body.position.x + ledge.body.width, ledge.body.position.y, 10, 100, 'atlas', 'ground');
				game.physics.arcade.enable(bound);
				bound.body.immovable = true;
				boundary.add(bound);

				var ledge = game.add.tileSprite(900, 175, 325, 100, 'atlas', 'ground');
				game.physics.arcade.enable(ledge);
				ledge.body.immovable = true;
				platforms.add(ledge);
				ledge.body.setSize(ledge.body.width, ledge.body.height / 2 - 15, 0, 62);

				bound = game.add.tileSprite(ledge.body.position.x, ledge.body.position.y, 10, 100, 'atlas', 'ground');
				game.physics.arcade.enable(bound);
				bound.body.immovable = true;
				boundary.add(bound);

				bound = game.add.tileSprite(ledge.body.position.x + ledge.body.width, ledge.body.position.y, 10, 100, 'atlas', 'ground');
				game.physics.arcade.enable(bound);
				bound.body.immovable = true;
				boundary.add(bound);

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

				bound = game.add.tileSprite(ledge.body.position.x, ledge.body.position.y, 10, 100, 'atlas', 'ground');
				game.physics.arcade.enable(bound);
				bound.body.immovable = true;
				boundary.add(bound);

				bound = game.add.tileSprite(ledge.body.position.x + ledge.body.width, ledge.body.position.y, 10, 100, 'atlas', 'ground');
				game.physics.arcade.enable(bound);
				bound.body.immovable = true;
				boundary.add(bound);

				var ledge = game.add.tileSprite(825, 475, 400, 100, 'atlas', 'ground');
				game.physics.arcade.enable(ledge);
				ledge.body.immovable = true;
				platforms.add(ledge);
				ledge.body.setSize(ledge.body.width, ledge.body.height / 2 - 15, 0, 62);

				bound = game.add.tileSprite(ledge.body.position.x, ledge.body.position.y, 10, 100, 'atlas', 'ground');
				game.physics.arcade.enable(bound);
				bound.body.immovable = true;
				boundary.add(bound);

				bound = game.add.tileSprite(ledge.body.position.x + ledge.body.width, ledge.body.position.y, 10, 100, 'atlas', 'ground');
				game.physics.arcade.enable(bound);
				bound.body.immovable = true;
				boundary.add(bound);

				var ledge = game.add.tileSprite(525, 325, 200, 100, 'atlas', 'ground');
				game.physics.arcade.enable(ledge);
				ledge.body.immovable = true;
				platforms.add(ledge);
				ledge.body.setSize(ledge.body.width, ledge.body.height / 2 - 15, 0, 62);

				bound = game.add.tileSprite(ledge.body.position.x, ledge.body.position.y, 10, 100, 'atlas', 'ground');
				game.physics.arcade.enable(bound);
				bound.body.immovable = true;
				boundary.add(bound);

				bound = game.add.tileSprite(ledge.body.position.x + ledge.body.width, ledge.body.position.y, 10, 100, 'atlas', 'ground');
				game.physics.arcade.enable(bound);
				bound.body.immovable = true;
				boundary.add(bound);

				var ledge = game.add.tileSprite(50, 175, 400, 100, 'atlas', 'ground');
				game.physics.arcade.enable(ledge);
				ledge.body.immovable = true;
				platforms.add(ledge);
				ledge.body.setSize(ledge.body.width, ledge.body.height / 2 - 15, 0, 62);

				bound = game.add.tileSprite(ledge.body.position.x, ledge.body.position.y, 10, 100, 'atlas', 'ground');
				game.physics.arcade.enable(bound);
				bound.body.immovable = true;
				boundary.add(bound);

				bound = game.add.tileSprite(ledge.body.position.x + ledge.body.width, ledge.body.position.y, 10, 100, 'atlas', 'ground');
				game.physics.arcade.enable(bound);
				bound.body.immovable = true;
				boundary.add(bound);

				var ledge = game.add.tileSprite(825, 175, 400, 100, 'atlas', 'ground');
				game.physics.arcade.enable(ledge);
				ledge.body.immovable = true;
				platforms.add(ledge);
				ledge.body.setSize(ledge.body.width, ledge.body.height / 2 - 15, 0, 62);

				bound = game.add.tileSprite(ledge.body.position.x, ledge.body.position.y, 10, 100, 'atlas', 'ground');
				game.physics.arcade.enable(bound);
				bound.body.immovable = true;
				boundary.add(bound);

				bound = game.add.tileSprite(ledge.body.position.x + ledge.body.width, ledge.body.position.y, 10, 100, 'atlas', 'ground');
				game.physics.arcade.enable(bound);
				bound.body.immovable = true;
				boundary.add(bound);

				var airMonster = monsters.add(new Monster(game, 'atlas', 'airl', 900, 175, 0.13, 'air', player));
				var fireMonster = monsters.add(new Monster(game, 'atlas', 'firel1', 125, 175, 0.13, 'fire', player));
				var waterMonster = monsters.add(new Monster(game, 'atlas', 'waterl1', 900, 475, 0.13, 'water', player));
				var earthMonster = monsters.add(new Monster(game, 'atlas', 'earthl', 135, 475, 0.13, 'earth', player));

				finalBoss = new Boss(game, 'atlas', 'fatherl0', 525, 325, 0.2, player);
				game.add.existing(finalBoss);

				earthFairy = new Fairy(game, 'atlas', 'e0', 625, 325, 0.1, 'earth', platforms);
				game.add.existing(earthFairy);
				earthFairy.body.setSize(260, 260, 135, 135)
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
		reverse = false;

		if (repeat == false && monsters.children[0].cleared == true && inPlace == false) {
			Tutbox1.kill();
			Tutbox2.kill();
			Tutbox3.kill();
			Tutbox4.kill();
			Tutbox5.kill();
			Tutbox6.kill();
			Tutbox7.kill();
			Tutbox8.kill();
			Tutbox9.kill();
			console.log("It read the thing");
			game.time.events.add(Phaser.Timer.SECOND * 0.1, walkLeft, this);
			inPlace = true;
		}

		function walkLeft()
		{
			spirit.body.velocity.x = -100;
			spirit.animations.play('walking');
			game.time.events.add(Phaser.Timer.SECOND * 3, stay, this);
		}

		function stay()
		{
			spirit.body.velocity.x = 0;
			game.time.events.add(Phaser.Timer.SECOND * 3, walkRight, this);
			spirit.animations.stop('walking');
			spirit.frameName = ('atlas', 'gf0');
		}
		function walkRight()
		{
			spirit.body.velocity.x = 100;
			spirit.animations.play('walking');
		}

		//advances screen to level 1, this will eventually be the first screen that is loaded instead of the 'gameplay' screen
		if(game.input.keyboard.justPressed(Phaser.Keyboard.M)) {
			repeat = true;
			state += 1;
			game.state.start('GamePlay', true, false, player.hasElement, player.equippedElement, 
				player.noneEquipped, player.currentIndex, player.health, player.notCollectedYet, player.fairyCount, gamePlayMusic);
		}

		if (state != 9)
		{
			for (i = 0; i < monsters.length; i++)
			{
				if (monsters.children[i].cleared == false)
				{
					unlock = false;
					break;
				}
				else
				{
					unlock = true;
				}
			}
		}
		else if (state == 9)
		{
			for (i = 0; i < monsters.length; i++)
			{
				if (monsters.children[i].cleared == false)
				{
					unlock = false;
					break;
				}
				else 
				{
					preUnlock = true;
				}
			}
			if (preUnlock == true && finalBoss.cleared == true)
			{
				unlock = true;
			}
		}

		if (player.body.position.x > 1280 && unlock == true)
		{
			repeat = true;
			state += 1;
			game.state.start('GamePlay', true, false, player.hasElement, player.equippedElement, 
				player.noneEquipped, player.currentIndex, player.health, player.notCollectedYet, player.fairyCount, gamePlayMusic);
		}

		game.physics.arcade.collide(player, platforms); //allows collision between player and ground
		game.physics.arcade.collide(finalBoss, platforms);
		//different cases when a player collides with each elemental fairy
		game.physics.arcade.collide(player, waterFairy, addWaterFairy, null, this);
		game.physics.arcade.collide(player, earthFairy, addEarthFairy, null, this);
		game.physics.arcade.collide(player, fireFairy, addFireFairy, null, this);
		game.physics.arcade.collide(player, airFairy, addAirFairy, null, this);
		//if the players bullets hit any type of monster, call the calcDmg function
		game.physics.arcade.collide(player.bullets, monsters, calcDmg, null, this); 
		//game.physics.arcade.collide(player.bullets, finalBoss, attackBoss, null, this);
		//game.physics.arcade.collide(player, monsters); //allows collision between player and monsters

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

		/*function attackBoss(bullet, finalBoss)
		{
			bullet.kill();
			finalBoss.health -= reg_dmg;
		}*/

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
			if (player.hasElement[0] == false)
			{
				addWater = true;
				player.notCollectedYet = false;
				player.fairyCount += 1;
				player.health = 20;
				console.log(player.fairyCount);
			}
			fairy.kill();
		}

		function addEarthFairy(player, fairy)
		{
			if (player.hasElement[1] == false)
			{
				addEarth = true;
				player.notCollectedYet = false;
				player.fairyCount += 1;
				player.health = 20;
				console.log(player.fairyCount);
			}
			fairy.kill();
		}

		function addFireFairy(player, fairy)
		{
			if (player.hasElement[2] == false)
			{
				addFire = true;
				player.notCollectedYet = false;
				player.fairyCount += 1;
				player.health = 20;
				console.log(player.fairyCount);
			}
			fairy.kill();
		}

		function addAirFairy(player, fairy)
		{
			if (player.hasElement[3] == false)
			{
				addAir = true;
				player.notCollectedYet = false;
				player.fairyCount += 1;
				player.health = 20;
				console.log(player.fairyCount);
			}
			fairy.kill();
		}
	},
	render: function() //this is just debug stuff
	{
		//game.debug.body(player);
		//game.debug.physicsGroup(player.bullets);
		//game.debug.physicsGroup(platforms);
		//game.debug.physicsGroup(boundary);
		//game.debug.physicsGroup(monsters);
		//game.debug.body(waterFairy);
		//game.debug.body(earthFairy);
		//game.debug.body(fireFairy);
		//game.debug.body(airFairy);
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
		lose = game.add.tileSprite(0, 0, game.world.width, game.world.height, 'atlas', 'loseScreen');
		//lose.scale.setTo(0.23997000375, 0.24);
		
		nextMusic.stop();
		//console.log(gamePlayMusic);
	},

	update: function()
	{
		if(game.input.keyboard.justPressed(Phaser.Keyboard.SPACEBAR))
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
			heal = 3; 
			bad_dmg  =1; 
			reg_dmg = 3;
			super_dmg = 5; 
			repeat = false; 
			state = 0;
			unlock = false;
			preUnlock = false;
			player = null;
			finalBoss = null;
			reverse = false;
			inPlace = false;
			gamePlayMusic = null;
			game.state.start('menu');
		}
	}
}

//add states to state manager
game.state.add('menu', menu);
game.state.add('GamePlay', GamePlay); //this will change to the first game state instead of just gameplay
game.state.add('EndGame', EndGame)
game.state.start('menu'); //start with the menu screen
