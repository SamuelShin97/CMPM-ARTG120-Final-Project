var game = new Phaser.Game(1280, 720, Phaser.CANVAS);

//state structure and state switching came from Nathan Altice's code from fourth lecture slide
var menu = function(game){};
menu.prototype = {
	preload: function()
	{
		console.log('menu: preload');
	},

	create: function()
	{
		var startLabel = game.add.text(80, game.world.height - 100, 'Press the spacebar to start...', 
			{font: '25px', fill: '#FFFFFF'} );
	},

	update: function()
	{
		if (game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR))
		{
			game.state.start('GamePlay'); //play the game once space is pressed
		}
	}
}

var fairies = [];
var GamePlay = function(game) {}; //this will change to a different game state in separate js files
GamePlay.prototype = {
	preload: function() 
	{
		game.load.atlas('atlas', 'assets/img/spritesheet.png', 'assets/img/sprites.JSON');
	},

	create: function()
	{
		// enables the Arcade Physics system
    	game.physics.startSystem(Phaser.Physics.ARCADE);
    	game.stage.backgroundColor = "#228b22";
		//everything is place holder art 
		player = new Player(game, 'atlas', 'playerBlue_walk2', 100, 620, 1)
		game.add.existing(player);

		monster1 = new Monster(game, 'atlas', 'enemySpikey_3', 500, 500, 1);
		game.add.existing(monster1);

		//left arrow is water fairy
		waterFairy = new Fairy(game, 'atlas', 'flatDark23', 300, 300, 1, 'water'); 
		game.add.existing(waterFairy);
		//right arrow is earth
		earthFairy = new Fairy(game, 'atlas', 'flatDark24', 400, 300, 1, 'earth');
		game.add.existing(earthFairy);
		//up arrow is fire
		fireFairy = new Fairy(game, 'atlas', 'flatDark25', 500, 300, 1, 'fire');
		game.add.existing(fireFairy);
		//down arrow is air
		airFairy = new Fairy(game, 'atlas', 'flatDark26', 600, 300, 1, 'air');
		game.add.existing(airFairy);
	},

	update: function()
	{
		game.physics.arcade.collide(player, Fairy, addFairy, null, this);


		if (game.input.keyboard.justPressed(Phaser.Keyboard.SPACEBAR))
		{
			if (player.water == true)
			{
				//spawn water bullet/projectile
			}
			else if (player.earth == true)
			{

			}
			else if (player.fire == true)
			{

			}
			else 
			{

			}
		}

		function addFairy(player, Fairy)
		{
			fairies.add(Fairy);
		}

	}
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
