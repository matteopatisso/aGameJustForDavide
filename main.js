(function ( $ ) {
	'use strict';

	var playGroundSettings = { // in px
		width  : 350,
		height : 350,
		catcher : { width: 59, height: 30 },
		time : 120,
		initSpeed : 2
	};

	var catcher, target, hits, stop, timeCounter, timeEl, hitEl, targetImages = [];

	function Catcher ( options ) {
		this.x = 0;
		this.y = 0;
		this.width = 0;
		this.height = 0;
		this.el = null;
		this.direction = null;
		this.speed = null;

		this.move = function () {
			if(!this.direction) return;

			switch ( this.direction ) {
				case 'up': this.y = (this.y - this.speed) <= 0 ? 0 : this.y - this.speed;
					break;

				case 'right': this.x = (this.x + this.width + this.speed) >= playGroundSettings.width ?
										(playGroundSettings.width - this.width) : this.x + this.speed;
					break;

				case 'down': this.y = (this.y + this.height + this.speed) >= playGroundSettings.height ?
										(playGroundSettings.height - this.height) : this.y += this.speed;
					break;

				case 'left': this.x = (this.x - this.speed) <= 0 ? 0 : this.x - this.speed;
					break;
			}
		};

		this.draw = function () {
			this.el.css({
				'top' : this.y + 'px',
				'left' : this.x + 'px'
			});
		};

		this.checkCollision = function () {
			return (Math.abs(this.x - target.x) <= this.width) && (Math.abs(target.y - this.y) <= this.height);
		};

		this.setOptions = function ( options ) {
			for(var prop in options) {
				if(options.hasOwnProperty(prop) && this.hasOwnProperty( prop )) {
					this[prop] = options[prop];
				}
			}
		};

		if( options ) {
			this.setOptions( options );
		}
	}

	function Target ( options ) {
		this.x = 0;
		this.y = 0;
		this.width = null;
		this.height = null;
		this.el = null;

		this.rebuild = function (  ) {
			var backgroundImage = targetImages[Math.floor(Math.random() * targetImages.length)];

			this.setOptions({
				width: backgroundImage.width,
				height: backgroundImage.height,
				x : Math.random() * (playGroundSettings.width - backgroundImage.width),
				y : Math.random() * (playGroundSettings.height - backgroundImage.height)
			});

			this.el.css( {
				'background' : 'url("' + backgroundImage.src + '")',
				'width' : backgroundImage.width,
				'height': backgroundImage.height
			});
		};

		this.draw = function () {
			this.el.css({
				'top' : this.y + 'px',
				'left' : this.x + 'px'
			});
		};

		this.setOptions = function ( options ) {
			for(var prop in options) {
				if(options.hasOwnProperty(prop) && this.hasOwnProperty( prop )) {
					this[prop] = options[prop];
				}
			}
		};

		if( options ) {
			this.setOptions( options );
		}

		this.rebuild();
	}

	var gameLoop = function (  ) {
		if(stop) return;
		catcher.move();

		target.draw();
		catcher.draw();

		if( catcher.checkCollision() ) {
			hitEl.html(hits++);
			catcher.speed = playGroundSettings.initSpeed + (hits-1) / 2;
			target.rebuild();
		}

		setTimeout(gameLoop, 33);
	};

	var setDirection = function ( keyCode ) {
		var directions = { 39 : 'right', 40 : 'down', 38 : 'up', 37 : 'left' };

		if(keyCode == 32) {
			catcher.direction = null;
			return;
		}

		if(directions.hasOwnProperty( keyCode )) {
			catcher.direction = directions[keyCode];
		}
	};

	var initGame = function (  ) {
		target = new Target({ el : $('#target') });

		catcher = new Catcher({
			el : $('#catcher'),
			speed: playGroundSettings.initSpeed,
			width: playGroundSettings.catcher.width,
			height: playGroundSettings.catcher.height
		});

		timeEl = $('.time');
		hitEl = $('.hits');
	};

	var initPlayGround = function (  ) {
		var playground = $('#playground');

		playground.css({
			'position' : 'relative',
			'height'   : playGroundSettings.height,
			'width'    : playGroundSettings.width
		});

		timeCounter = playGroundSettings.time;
		hits = 0;
	};

	var timeLoop = function () {
		timeEl.html(timeCounter--);
		if(timeCounter < 0) {
			stop = true;
			return;
		}
		setTimeout(timeLoop, 1000);
	};
	
	var loadTargetImages = function ( callback ) {
		var img,
			numImages = 4,
			counter = numImages;

		for(var i = 1; i <= 4; i++) {
			img = new Image();
			img.src = 'img/target/target_' + i + '.png';

			img.onload = function () {
				targetImages.push(this);

				if(--counter == 0) {
					callback();
				}
			}
		}
	};

	var init = function () {
		initPlayGround();
		initGame();
		$(document).on('keydown', function ( e ) { setDirection( e.keyCode ) });
		gameLoop();
		timeLoop();
	};

	$(document).ready(function () {
		loadTargetImages( init );
	})

}( jQuery ));