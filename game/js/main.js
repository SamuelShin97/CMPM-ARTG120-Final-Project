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

var GamePlay = function(game) {};
GamePlay.prototype = {
	preload: function() 
	{
		game.load.atlas('atlas', 'assets/img/spritesheet.png', 'assets/img/sprites.JSON');
	},

	create: function()
	{
		monster1 = new Monster(game, 'atlas', 'enemySpikey_3', 500, 500, 1);
		game.add.existing(monster1);
	},

	update: function()
	{
		
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
game.state.add('GamePlay', GamePlay);
game.state.add('EndGame', EndGame)
game.state.start('menu'); //start with the menu screen
