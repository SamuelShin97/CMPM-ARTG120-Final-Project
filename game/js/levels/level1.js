var levelState2;

var levelState = function(game){};
	levelState.prototype = {
		preload: function() {
			game.state.add('Lev1Scr2', Lev1Scr2);
		},

		create: function() {
			game.add.text(16, 45, 'Screen 1', {fontSize: '32px', fill: '#FFFFFF'});
			game.add.text(16, 16, 'Level 1', {fontSize: '32px', fill: '#FFFFFF'});

			ground = game.add.tileSprite(0, game.world.height - 64, game.world.width, 64, 'atlas', 'tileBlue_22');
    		game.physics.arcade.enable(ground); // Enable physics for the ground
    		ground.body.immovable = true; // Make the ground immovable (so the player can jump on it)

    		game.add.existing(player);
		},

		update: function() {
			if(game.input.keyboard.isDown(Phaser.Keyboard.M)) {
				game.state.start('Lev1Scr2');
			}
		},
	}

var Lev1Scr2 = function(game) {};
Lev1Scr2.prototype = {
	preload: function() {
		game.state.add('Lev1Scr3', Lev1Scr3);
	},

	create: function() {
		game.add.text(16, 45, 'Screen 2', {fontSize: '32px', fill: '#FFFFFF'});
		game.add.text(16, 16, 'Level 1', {fontSize: '32px', fill: '#FFFFFF'});
	},

	update: function() {
		if(game.input.keyboard.isDown(Phaser.Keyboard.M)) {
			game.state.start('Lev1Scr3');
		}
	}
}

var Lev1Scr3 = function(game) {};
Lev1Scr3.prototype = {
	preload: function() {
		game.state.add('level2', levelState2);
	},

	create: function() {
		game.add.text(16, 45, 'Screen 3', {fontSize: '32px', fill: '#FFFFFF'});
		game.add.text(16, 16, 'Level 1', {fontSize: '32px', fill: '#FFFFFF'});
	},

	update: function() {
		if(game.input.keyboard.isDown(Phaser.Keyboard.M)) {
			game.state.start('level2');
		}
	},
}