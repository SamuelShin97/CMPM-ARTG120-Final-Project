var levelState3;

var levelState2 = {
	preload: function() {
		game.state.add('Lev2Scr2', Lev2Scr2);
	},

	create: function() {
		game.add.text(16, 45, 'Screen 1', {fontSize: '32px', fill: '#FFFFFF'});
		game.add.text(16, 16, 'Level 2', {fontSize: '32px', fill: '#FFFFFF'});
	},

	update: function() {
		if(game.input.keyboard.isDown(Phaser.Keyboard.M)) {
			game.state.start('Lev2Scr2');
		}
	}
}
var Lev2Scr2 = function(game) {};
Lev2Scr2.prototype = {
	preload: function() {
		game.state.add('Lev2Scr3', Lev2Scr3);
	},

	create: function() {
		game.add.text(16, 45, 'Screen 2', {fontSize: '32px', fill: '#FFFFFF'});
		game.add.text(16, 16, 'Level 2', {fontSize: '32px', fill: '#FFFFFF'});
	},

	update: function() {
		if(game.input.keyboard.isDown(Phaser.Keyboard.M)) {
			game.state.start('Lev2Scr3');
		}
	}
}

var Lev2Scr3 = function(game) {};
Lev2Scr3.prototype = {
	preload: function() {
		game.state.add('level3', levelState3);
	},

	create: function() {
		game.add.text(16, 45, 'Screen 3', {fontSize: '32px', fill: '#FFFFFF'});
		game.add.text(16, 16, 'Level 2', {fontSize: '32px', fill: '#FFFFFF'});
	},

	update: function() {
		if(game.input.keyboard.isDown(Phaser.Keyboard.M)) {
			game.state.start('level3');
		}
	},
}