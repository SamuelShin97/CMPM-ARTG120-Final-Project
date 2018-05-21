var levelState3 = {
	preload: function() {
		game.state.add('Lev3Scr2', Lev3Scr2);
	},

	create: function() {
		game.add.text(16, 45, 'Screen 1', {fontSize: '32px', fill: '#FFFFFF'});
		game.add.text(16, 16, 'Level 3', {fontSize: '32px', fill: '#FFFFFF'});
	},

	update: function() {
		if(game.input.keyboard.isDown(Phaser.Keyboard.M)) {
			game.state.start('Lev3Scr2');
		}
	}
}

var Lev3Scr2 = function(game) {};
Lev3Scr2.prototype = {
	preload: function() {
		game.state.add('Lev3Scr3', Lev3Scr3);
	},

	create: function() {
		game.add.text(16, 45, 'Screen 2', {fontSize: '32px', fill: '#FFFFFF'});
		game.add.text(16, 16, 'Level 3', {fontSize: '32px', fill: '#FFFFFF'});
	},

	update: function() {
		if(game.input.keyboard.isDown(Phaser.Keyboard.M)) {
			game.state.start('Lev3Scr3');
		}
	}
}

var Lev3Scr3 = function(game) {};
Lev3Scr3.prototype = {
	preload: function() {
	
	},

	create: function() {
		game.add.text(16, 45, 'Screen 3', {fontSize: '32px', fill: '#FFFFFF'});
		game.add.text(16, 16, 'Level 3', {fontSize: '32px', fill: '#FFFFFF'});
	},

	update: function() {
		
	},
}