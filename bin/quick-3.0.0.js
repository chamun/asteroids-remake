/**
 * Copyright (c) 2014, 2015 Diogo Schneider
 * 
 * Released under The MIT License (MIT)
 * 
 * https://github.com/dgsprb/quick
 */

(function () {

	"use strict";

	var CANVAS_TAG = "canvas";
	var CONTEXT = "2d";
	var KEY_DOWN = "keydown";
	var KEY_UP = "keyup";
	var MOUSE_DOWN = "mousedown";
	var MOUSE_MOVE = "mousemove";
	var MOUSE_UP = "mouseup";
	var RADIAN_DEGREES = 180;
	var TOUCH_END = "touchend";
	var TOUCH_MOVE = "touchmove";
	var TOUCH_START = "touchstart";

	var CommandEnum = {
		"UP" : 0,
		"DOWN" : 1,
		"LEFT" : 2,
		"RIGHT" : 3,
		"A" : 4,
		"B" : 5,
		"X" : 6,
		"Y" : 7,
		"SELECT" : 8,
		"START" : 9
	};

	var Quick  = (function () {

		var DEFAULT_AUTO_SCALE = true;
		var DEFAULT_FRAME_TIME = 30;
		var DEFAULT_KEEP_ASPECT = false;
		var DEFAULT_NAME = "Game";
		var DEFAULT_NUMBER_OF_LAYERS = 1;
		var IMG_TAG = "img";
		var LOADING_TIMEOUT = 100;
		var PX = "px";
		var RESIZE_EVENT = "resize";

		var autoScale = DEFAULT_AUTO_SCALE;
		var canvas;
		var everyOther = true;
		var frameTime;
		var keepAspect = DEFAULT_KEEP_ASPECT;
		var images;
		var input;
		var isRunning;
		var isTransitioning = false;
		var name = DEFAULT_NAME;
		var numberOfLayers = DEFAULT_NUMBER_OF_LAYERS;
		var realWidth = 0;
		var realHeight = 0;
		var renderableLists = [];
		var scene;
		var sceneFactory;
		var sound;
		var transition;
		var width = 0, height = 0;

		var Quick = {};

		Quick.init = function (firstSceneFactory, canvasElement) {
			sceneFactory = firstSceneFactory;
			canvas = canvasElement || document.getElementsByTagName(CANVAS_TAG)[0];
			width = canvas.width;
			height = canvas.height;
			realWidth = width;
			realHeight = height;
			images = document.getElementsByTagName(IMG_TAG);
			input = new Input();
			isRunning = true;
			sound = new Sound();
			addEventListener(RESIZE_EVENT, scale, false);
			autoScale && scale();
			polyfill();
			this.setFrameTime();

			for (var i = 0; i < numberOfLayers; ++i) {
				renderableLists.push(new RenderableList());
			}

			load();
		};

		Quick.addControllerDevice = function (device) {
			input.addController(device);
		};

		Quick.clear = function () {
			var context = canvas.getContext(CONTEXT);
			context.clearRect(0, 0, width, height);
		};

		Quick.fadeOut = function () {
			sound.fadeOut();
		};

		Quick.getBoundary = function () {
			return new Rect(0, 0, Quick.getWidth(), Quick.getHeight());
		};

		Quick.getBottom = function () {
			return height - 1;
		};

		Quick.getCenter = function () {
			return new Point(this.getCenterX(), this.getCenterY());
		};

		Quick.getCenterX = function () {
			return Math.floor(this.getWidth() / 2);
		};

		Quick.getCenterY = function () {
			return Math.floor(this.getHeight() / 2);
		};

		Quick.getHeight = function () {
			return height;
		};

		Quick.getOffsetLeft = function () {
			return canvas.offsetLeft;
		};

		Quick.getOffsetTop = function () {
			return canvas.offsetTop;
		};

		Quick.getRight = function () {
			return width - 1;
		};

		Quick.getController = function (id) {
			return input.getController(id);
		};

		Quick.getEveryOther = function () {
			return everyOther;
		};

		Quick.getFrameTime = function () {
			return frameTime;
		};

		Quick.getPointer = function (id) {
			return input.getPointer(id);
		};

		Quick.getRealHeight = function () {
			return realHeight;
		};

		Quick.getRealWidth = function () {
			return realWidth;
		};

		Quick.getWidth = function () {
			return width;
		};

		Quick.load = function () {
			return localStorage.saveData && JSON.parse(localStorage.saveData);
		};

		Quick.mute = function () {
			sound.mute();
		};

		Quick.paint = function (renderable, index) {
			var layer = renderableLists[index || 0];
			layer.add(renderable);
		};

		Quick.play = function (id) {
			sound.play(id);
		};

		Quick.playTheme = function (name) {
			sound.playTheme(name);
		};

		Quick.random = function (ceil) {
			var random = Math.random();
			var raw = random * (ceil + 1);
			return Math.floor(raw);
		};

		Quick.save = function (data) {
			localStorage.saveData = JSON.stringify(data);
		};

		Quick.setAutoScale = function (customAutoScale) {
			autoScale = customAutoScale == undefined || customAutoScale;
		};

		Quick.setFrameTime = function (customFrameTime) {
			frameTime = customFrameTime || DEFAULT_FRAME_TIME;
		};

		Quick.setKeepAspect = function (customKeepAspect) {
			keepAspect = customKeepAspect || DEFAULT_KEEP_ASPECT;
		};

		Quick.setName = function (customName) {
			name = customName;
			document.title = name;
		};

		Quick.setNumberOfLayers = function (customNumberOfLayers) {
			numberOfLayers = customNumberOfLayers;
		};

		Quick.stopTheme = function () {
			sound.stopTheme();
		};

		function load() {
			for (var i = 0; i < images.length; ++i) {
				var image = images[i];

				if (!image.complete) {
					setTimeout(onTimeout, LOADING_TIMEOUT);
					return;
				}
			}

			scene = sceneFactory();
			loop();

			function onTimeout() {
				load();
			}
		}

		function loop() {
			var startTime = Date.now();
			var context = canvas.getContext(CONTEXT);
			everyOther = !everyOther;
			input.update();

			if (transition != null) {
				if (transition.sync()) {
					transition = null;
				}
			} else {
				if (isTransitioning) {
					isTransitioning = false;
					scene = scene.getNext();
				}

				if (scene.sync()) {
					isTransitioning = true;
					transition = scene.getTransition();
				} else {
					scene.update();
				}
			}

			sound.update();

			for (var i = 0; i < renderableLists.length; ++i) {
				var layer = renderableLists[i];
				layer.render(context);
			}

			var elapsedTime = Date.now() - startTime;
			var interval = frameTime - elapsedTime;
			setTimeout(onTimeout, interval);

			function onTimeout() {
				isRunning && requestAnimationFrame(loop);
			}
		}

		function polyfill() {
			if (!window.requestAnimationFrame) {
				window.requestAnimationFrame = requestAnimationFrameFacade;
			}

			function requestAnimationFrameFacade(functionReference) {
				functionReference();
			}
		}

		function scale() {
			var width, height;

			if (keepAspect) {
				var proportion = window.innerWidth / canvas.width;

				if (window.innerHeight < canvas.height * proportion) {
					proportion = window.innerHeight / canvas.height;
				}

				width = canvas.width * proportion;
				height = canvas.height * proportion
			} else {
				width = window.innerWidth;
				height = window.innerHeight;
			}

			realWidth = width;
			realHeight = height;
			canvas.style.width = width + PX;
			canvas.style.height = height + PX;
		}

		return Quick;

	})();

	var ImageFactory = (function () {

		var ImageFactory = {};

		ImageFactory.flip = function (image) {
			return invert(image, false, true);
		};

		ImageFactory.mirror = function (image) {
			return invert(image, true, false);
		};

		ImageFactory.rotate = function (image, degrees) {
			if (degrees % 360 == 0 ) {
				return image;
			}

			var radians = toRadians(degrees);
			var canvas = document.createElement(CANVAS_TAG);
			var sideA = image.width;
			var sideB = image.height;

			if (degrees == 90 || degrees == 270) {
				sideA = image.height;
				sideB = image.width;
			}

			canvas.width = sideA;
			canvas.height = sideB;
			var context = canvas.getContext(CONTEXT);
			context.translate(canvas.width / 2, canvas.height / 2);
			context.rotate(radians);
			context.drawImage(image, -image.width / 2, -image.height / 2);
			return canvas;
		};

		function invert(image, isMirror, isFlip) {
			var canvas = document.createElement(CANVAS_TAG);
			canvas.width = image.width;
			canvas.height = image.height;
			var context = canvas.getContext(CONTEXT);
			context.translate(isMirror ? canvas.width : 0, isFlip ? canvas.height : 0);
			context.scale(isMirror ? -1 : 1, isFlip ? - 1 : 1);
			context.drawImage(image, 0, 0);
			return canvas;
		}

		return ImageFactory;

	})();

	var Mouse = (function () {

		function Mouse(event) {
			var that = this;
			this.buffer = false;
			this.position = new Point();
			addEventListener(MOUSE_DOWN, onMouseDown, false);
			addEventListener(MOUSE_MOVE, onMouseMove, false);
			addEventListener(MOUSE_UP, onMouseUp, false);
			event && onMouseDown(event);

			function onMouseDown(event) {
				event.preventDefault();
				that.buffer = true;
			}

			function onMouseUp(event) {
				event.preventDefault();
				that.buffer = false;
			}

			function onMouseMove(event) {
				event.preventDefault();
				that.updateCoordinates(event);
			}
		}

		Mouse.prototype.getCommand = function () {
			return this.buffer;
		};

		Mouse.prototype.getX = function () {
			return this.position.getX();
		};

		Mouse.prototype.getY = function () {
			return this.position.getY();
		};

		Mouse.prototype.updateCoordinates = function (event) {
			this.position.setX(event.x || event.clientX);
			this.position.setY(event.y || event.clientY);
		};

		return Mouse;

	})();

	var Touch = (function () {

		var CHANGED_TOUCHES = "changedTouches";

		function Touch(event) {
			var that = this;
			this.buffer = false;
			this.position = new Point();
			addEventListener(TOUCH_END, onTouchEnd, false);
			addEventListener(TOUCH_MOVE, onTouchMove, false);
			addEventListener(TOUCH_START, onTouchStart, false);
			onTouchStart(event);

			function onTouchEnd(event) {
				event.preventDefault();
				that.buffer = false;
				that.updateCoordinates(event);
			}

			function onTouchMove(event) {
				event.preventDefault();
				that.updateCoordinates(event);
			}

			function onTouchStart(event) {
				event.preventDefault();
				that.buffer = true;
				that.updateCoordinates(event);
			}
		}

		Touch.prototype.getCommand = function () {
			return this.buffer;
		};

		Touch.prototype.getX = function () {
			return this.position.getX();
		};

		Touch.prototype.getY = function () {
			return this.position.getY();
		};

		Touch.prototype.updateCoordinates = function (event) {
			var touches = event[CHANGED_TOUCHES];
			var touch = touches[0];
			this.position.setX(touch.pageX);
			this.position.setY(touch.pageY);
		};

		return Touch;

	})();

	var Pointer = (function () {

		function Pointer() {
			this.active = false;
			this.device = null;
			this.hold = false;
			this.position = new Point();
		}

		Pointer.prototype.getDown = function () {
			return this.active;
		};

		Pointer.prototype.getPush = function () {
			return this.active && !this.hold;
		};

		Pointer.prototype.setDevice = function (device) {
			this.device = device;
		};

		Pointer.prototype.update = function () {
			if (!this.device) {
				return;
			}

			this.hold = false;
			var last = this.active;
			this.active = this.device.getCommand();

			if (this.active && last) {
				this.hold = true;
			}

			var realX = this.device.getX() - Quick.getOffsetLeft();
			var realY = this.device.getY() - Quick.getOffsetTop();
			this.position.setX(Math.floor(realX * Quick.getWidth() / Quick.getRealWidth()));
			this.position.setY(Math.floor(realY * Quick.getHeight() / Quick.getRealHeight()));
		};

		Pointer.prototype.getPosition = function () {
			return this.position;
		};

		return Pointer;

	})();

	var Controller = (function () {

		function Controller() {
			this.active = {};
			this.device = null;
			this.hold = {};
		}

		Controller.prototype.keyDown = function (commandEnum) {
			return this.active[commandEnum];
		};

		Controller.prototype.keyPush = function (commandEnum) {
			return this.active[commandEnum] && !this.hold[commandEnum];
		};

		Controller.prototype.setDevice = function (device) {
			this.device = device;
		};

		Controller.prototype.update = function () {
			if (!this.device) {
				return;
			}

			this.hold = {};
			var last = this.active;
			this.active = this.device.getCommands();

			for (var i in this.active) {
				if (this.active.hasOwnProperty(i)) {
					if (last[i]) {
						this.hold[i] = true;
					}
				}
			}
		};

		return Controller;

	})();

	var GamePad = (function () {

		var ANALOG_THRESHOLD = 0.5;
		var PRESSED = "pressed";

		var AxisEnum = {
			"LEFT_X" : 0,
			"LEFT_Y" : 1,
			"RIGHT_X" : 2,
			"RIGHT_Y" : 3
		};

		var ButtonEnum = {
			"A" : 0,
			"B" : 1,
			"X" : 2,
			"Y" : 3,
			"L1" : 4,
			"R1" : 5,
			"L2" : 6,
			"R2" : 7,
			"SELECT" : 8,
			"START" : 9,
			"L3" : 10,
			"R3" : 11,
			"UP" : 12,
			"DOWN" : 13,
			"LEFT" : 14,
			"RIGHT" : 15
		};

		var ButtonToCommandMap = {};
			ButtonToCommandMap[ButtonEnum.UP] = CommandEnum.UP;
			ButtonToCommandMap[ButtonEnum.DOWN] = CommandEnum.DOWN;
			ButtonToCommandMap[ButtonEnum.LEFT] = CommandEnum.LEFT;
			ButtonToCommandMap[ButtonEnum.RIGHT] = CommandEnum.RIGHT;
			ButtonToCommandMap[ButtonEnum.A] = CommandEnum.A;
			ButtonToCommandMap[ButtonEnum.B] = CommandEnum.B;
			ButtonToCommandMap[ButtonEnum.X] = CommandEnum.X;
			ButtonToCommandMap[ButtonEnum.Y] = CommandEnum.Y;
			ButtonToCommandMap[ButtonEnum.START] = CommandEnum.START;
			ButtonToCommandMap[ButtonEnum.SELECT] = CommandEnum.SELECT;

		function GamePad(id) {
			this.id = id || 0;
		}

		GamePad.prototype.getCommands = function () {
			var result = {};

			if (Input.getGamePadAxes(this.id)[AxisEnum.LEFT_Y] < - ANALOG_THRESHOLD) {
				result[CommandEnum.UP] = true;
			} else if (Input.getGamePadAxes(this.id)[AxisEnum.LEFT_Y] > ANALOG_THRESHOLD) {
				result[CommandEnum.DOWN] = true;
			}

			if (Input.getGamePadAxes(this.id)[AxisEnum.LEFT_X] < - ANALOG_THRESHOLD) {
				result[CommandEnum.LEFT] = true;
			} else if (Input.getGamePadAxes(this.id)[AxisEnum.LEFT_X] > ANALOG_THRESHOLD) {
				result[CommandEnum.RIGHT] = true;
			}

			var buttons = Input.getGamePadButtons(this.id);

			for (var i in ButtonToCommandMap) {
				if (ButtonToCommandMap.hasOwnProperty(i)) {
					if (buttons[i] && buttons[i][PRESSED]) {
						result[ButtonToCommandMap[i]] = true;
					}
				}
			}

			return result;
		};

		return GamePad;

	})();

	var Input = (function () {

		var AXES = "axes";

		function Input() {
			this.controllers = [];
			this.controllerQueue = [];
			this.controllerRequestQueue = [];
			this.pointers = [];
			this.pointerQueue = [];
			this.pointerRequestQueue = [];
			this.gamePads = 0;
			this.waitKeyboard();
			this.waitMouse();
			this.waitTouch();
		}

		Input.getGamePadAxes = function (id) {
			if (getGamePads()[id]) {
				return getGamePads()[id][AXES];
			}

			return [];
		};

		Input.getGamePadButtons = function (id) {
			var gamePad = getGamePads()[id];
			return gamePad && gamePad.buttons || [];
		};

		Input.prototype.addController = function (device) {
			this.controllerQueue.push(device);
			this.checkControllerQueues();
		};

		Input.prototype.addPointer = function (device) {
			this.pointerQueue.push(device);
			this.checkPointerQueues();
		};

		Input.prototype.checkGamePads = function () {
			if (getGamePads()[this.gamePads]) {
				this.addController(new GamePad(this.gamePads++));
			}
		};

		Input.prototype.checkControllerQueues = function () {
			if (this.controllerRequestQueue.length > 0 && this.controllerQueue.length > 0) {
				var requester = this.controllerRequestQueue.shift();
				var device = this.controllerQueue.shift();
				requester.setDevice(device);
			}
		};

		Input.prototype.checkPointerQueues = function () {
			if (this.pointerRequestQueue.length > 0 && this.pointerQueue.length > 0) {
				var requester = this.pointerRequestQueue.shift();
				var device = this.pointerQueue.shift();
				requester.setDevice(device);
			}
		};

		Input.prototype.getController = function (id) {
			id = id || 0;

			if (this.controllers.length < id + 1) {
				var controller = new Controller();
				this.controllers.push(controller);
				this.controllerRequestQueue.push(controller);
				this.checkControllerQueues();
			}

			return this.controllers[id];
		};

		Input.prototype.getPointer = function (id) {
			id = id || 0;

			if (this.pointers.length < id + 1) {
				var pointer = new Pointer();
				this.pointers.push(pointer);
				this.pointerRequestQueue.push(pointer);
				this.checkPointerQueues();
			}

			return this.pointers[id];
		};

		Input.prototype.update = function () {
			this.checkGamePads();

			for (var i in this.controllers) {
				if (this.controllers.hasOwnProperty(i)) {
					var controller = this.controllers[i];
					controller.update();
				}
			}

			for (var j in this.pointers) {
				if (this.pointers.hasOwnProperty(j)) {
					var pointer = this.pointers[j];
					pointer.update();
				}
			}
		};

		Input.prototype.waitKeyboard = function () {
			var that = this;
			addEventListener(KEY_DOWN, onKeyDown, false);

			function onKeyDown(event) {
				removeEventListener(KEY_DOWN, onKeyDown, false);
				that.addController(new Keyboard(event));
			}
		};

		Input.prototype.waitMouse = function () {
			var that = this;
			addEventListener(MOUSE_DOWN, onMouseDown, false);

			function onMouseDown(event) {
				removeEventListener(MOUSE_DOWN, onMouseDown, false);
				that.addPointer(new Mouse(event));
			}
		};

		Input.prototype.waitTouch = function () {
			var that = this;
			addEventListener(TOUCH_START, onTouchStart, false);

			function onTouchStart(event) {
				removeEventListener(TOUCH_START, onTouchStart, false);
				that.addPointer(new Touch(event));
			}
		};

		function getGamePads() {
			if (navigator.getGamepads) {
				return navigator.getGamepads();
			}

			return [];
		}

		return Input;

	})();

	var Keyboard = (function () {

		var KeyEnum = {
			"ENTER" : 13,
			"SHIFT" : 16,
			"CTRL" : 17,
			"ALT" : 18,
			"ESC" : 27,
			"SPACE" : 32,
			"LEFT" : 37,
			"UP" : 38,
			"RIGHT" : 39,
			"DOWN" : 40,
			"D" : 68,
			"E" : 69,
			"F" : 70,
			"I" : 73,
			"J" : 74,
			"K" : 75,
			"L" : 76,
			"S" : 83,
			"F5" : 116,
			"F11" : 122,
			"F12" : 123
		};

		var KeyToCommandMap = {};
			KeyToCommandMap[KeyEnum.UP] = CommandEnum.UP;
			KeyToCommandMap[KeyEnum.E] = CommandEnum.UP;
			KeyToCommandMap[KeyEnum.I] = CommandEnum.UP;
			KeyToCommandMap[KeyEnum.DOWN] = CommandEnum.DOWN;
			KeyToCommandMap[KeyEnum.D] = CommandEnum.DOWN;
			KeyToCommandMap[KeyEnum.K] = CommandEnum.DOWN;
			KeyToCommandMap[KeyEnum.LEFT] = CommandEnum.LEFT;
			KeyToCommandMap[KeyEnum.S] = CommandEnum.LEFT;
			KeyToCommandMap[KeyEnum.J] = CommandEnum.LEFT;
			KeyToCommandMap[KeyEnum.RIGHT] = CommandEnum.RIGHT;
			KeyToCommandMap[KeyEnum.F] = CommandEnum.RIGHT;
			KeyToCommandMap[KeyEnum.L] = CommandEnum.RIGHT;
			KeyToCommandMap[KeyEnum.SPACE] = CommandEnum.A;
			KeyToCommandMap[KeyEnum.ALT] = CommandEnum.B;
			KeyToCommandMap[KeyEnum.CTRL] = CommandEnum.X;
			KeyToCommandMap[KeyEnum.SHIFT] = CommandEnum.Y;
			KeyToCommandMap[KeyEnum.ENTER] = CommandEnum.START;
			KeyToCommandMap[KeyEnum.ESC] = CommandEnum.SELECT;

		var PassThrough = [];
			PassThrough[KeyEnum.F5] = true;
			PassThrough[KeyEnum.F11] = true;
			PassThrough[KeyEnum.F12] = true;

		function Keyboard(event) {
			var that = this;
			this.buffer = {};
			addEventListener(KEY_DOWN, onKeyDown, false);
			addEventListener(KEY_UP, onKeyUp, false);
			onKeyDown(event);

			function onKeyDown(event) {
				PassThrough[event.keyCode] || event.preventDefault();
				onKey(event.keyCode, true);
			}

			function onKeyUp(event) {
				onKey(event.keyCode, false);
			}

			function onKey(keyCode, isDown) {
				that.buffer[KeyToCommandMap[keyCode]] = isDown;
			}
		}

		Keyboard.prototype.getCommands = function () {
			var result = {};

			for (var i in this.buffer) {
				if (this.buffer.hasOwnProperty(i)) {
					if (this.buffer[i]) {
						result[i] = true;
					}
				}
			}

			return result;
		};

		return Keyboard;

	})();

	var RenderableList = (function () {

		function RenderableList() {
			this.elements = [];
		}

		RenderableList.prototype.add = function (renderable) {
			this.elements.push(renderable);
		};

		RenderableList.prototype.render = function (context) {
			for (var i = 0; i < this.elements.length; ++i) {
				var renderable = this.elements[i];
				renderable.render(context);
			}

			this.elements.length = 0;
		};

		return RenderableList;

	})();

	var Scene = (function () {

		function Scene() {
			this.delegate = null;
			this.gameObjects = [];
			this.nextObjects = [];
			this.expiration = -1;
			this.isExpired = false;
			this.tick = -1;
			this.transition = null;
		}

		Scene.prototype.add = function (gameObject) {
			gameObject.setScene(this);
			gameObject.init();
			this.nextObjects.push(gameObject);
			gameObject.move(gameObject.getSpeedX() * -1, gameObject.getSpeedY() * -1);
		};

		Scene.prototype.build = function (map, tileFactory, offsetX, offsetY) {
			tileFactory = tileFactory || function (id) { return new BaseTile(id) };

			for (var i = 0; i < map.length; ++i) {
				var line = map[i];

				for (var j = 0; j < line.length; ++j) {
					var id = map[i][j];

					if (id) {
						var tile = tileFactory(id);
						var x = offsetX ? offsetX : tile.getWidth();
						var y = offsetY ? offsetY : tile.getHeight();
						tile.setTop(i * y);
						tile.setLeft(j * x);
						this.add(tile);
					}
				}
			}

		};

		Scene.prototype.expire = function () {
			this.isExpired = true;
		};

		Scene.prototype.sync = function () {
			if (this.isExpired) {
				return true;
			}

			var gameObjects = [];
			var solidGameObjects = [];

			for (var i = 0; i < this.gameObjects.length; ++i) {
				var gameObject = this.gameObjects[i];
				gameObject.update();

				if (gameObject.sync()) {
					if (gameObject.getEssential()) {
						this.expire();
					}
				} else {
					if (gameObject.getSolid()) {
						solidGameObjects.push(gameObject);
					}

					gameObjects.push(gameObject);
					Quick.paint(gameObject, gameObject.getLayerIndex());
				}
			}

			checkCollisions(solidGameObjects);
			this.gameObjects = gameObjects.concat(this.nextObjects);
			this.nextObjects = [];

			if (++this.tick == this.expiration) {
				this.expire();
			}

			return false;
		};

		Scene.prototype.getNext = function () {
			if (this.delegate && this.delegate.getNext) {
				return this.delegate.getNext();
			}
		};

		Scene.prototype.getObjectsWithTag = function (tag) {
			var result = [];

			for (var i = 0; i < this.gameObjects.length; ++i) {
				var gameObject = this.gameObjects[i];

				if (gameObject.hasTag(tag)) {
					result.push(gameObject);
				}
			}

			return result;
		};

		Scene.prototype.getTick = function () {
			return this.tick;
		};

		Scene.prototype.getTransition = function () {
			return this.transition;
		};

		Scene.prototype.setDelegate = function (delegate) {
			this.delegate = delegate;
		};

		Scene.prototype.setExpiration = function (expiration) {
			this.expiration = expiration;
		};

		Scene.prototype.setTransition = function (transition) {
			this.transition = transition;
		};

		Scene.prototype.update = function () {
			this.delegate && this.delegate.update && this.delegate.update();
		};

		function checkCollisions(gameObjects) {
			var length = gameObjects.length;

			for (var i = 0; i < length - 1; ++i) {
				var leftGameObject = gameObjects[i];

				for (var j = i + 1; j < length; ++j) {
					var rightGameObject = gameObjects[j];

					if (leftGameObject.hasCollision(rightGameObject)) {
						leftGameObject.onCollision(rightGameObject);
						rightGameObject.onCollision(leftGameObject);
					}
				}
			}
		}

		return Scene;

	})();

	var Sound = (function () {

		var DEFAULT_MUTE = false;
		var DEFAULT_SOUND_EFFECTS_VOLUME = 0.3;

		function Sound() {
			this.isFading = false;
			this.isMute = DEFAULT_MUTE;
			this.nextThemeName = null;
			this.queue = {};
			this.theme = null;
			this.volume = 100;
		}

		Sound.prototype.fadeOut = function () {
			if (!this.theme) {
				return;
			}

			this.isFading = true;
			this.volume = 100;
		};

		Sound.prototype.mute = function () {
			this.isMute = !this.isMute;

			if (!this.isMute) {
				this.theme.play();
			} else {
				this.theme.pause();
			}
		};

		Sound.prototype.pause = function () {
			if (this.theme) {
				this.theme.pause();
			}
		};

		Sound.prototype.play = function (id) {
			if (this.isMute) {
				return;
			}

			this.queue[id] = true;
		};

		Sound.prototype.playTheme = function (id) {
			if (this.theme && this.theme.currentTime > 0) {
				this.nextThemeName = id;

				if (!this.isFading) {
					this.fadeOut();
				}

				return;
			}

			this.stopTheme();
			this.theme = document.getElementById(id);

			if (this.theme.currentTime > 0) {
				this.theme.currentTime = 0;
			}

			if (this.isMute) {
				return;
			}

			this.theme.volume = 1;
			this.theme.play();
		};

		Sound.prototype.resume = function () {
			if (this.isMute) {
				return;
			}

			if (this.theme.paused) {
				this.theme.play();
			}
		};

		Sound.prototype.stopTheme = function () {
			if (this.theme) {
				this.theme.pause();
				this.theme.currentTime = 0;
			}
		};

		Sound.prototype.update = function () {
			for (var i in this.queue) {
				if (this.queue.hasOwnProperty(i)) {
					var sound = document.getElementById(i);
					sound.pause();

					if (sound.currentTime > 0) {
						sound.currentTime = 0;
					}

					sound.volume = DEFAULT_SOUND_EFFECTS_VOLUME;
					sound.play();
				}
			}

			this.queue = {};

			if (this.isFading) {
				if (--this.volume > 0) {
					this.theme.volume = this.volume / 100;
				} else {
					this.isFading = false;
					this.theme = null;

					if (this.nextThemeName) {
						this.playTheme(this.nextThemeName);
						this.nextThemeName = null;
					}
				}
			}
		};

		return Sound;

	})();

	var Point = (function () {

		function Point(x, y) {
			this.setAccelerationX();
			this.setAccelerationY();
			this.setMaxSpeedX();
			this.setMaxSpeedY();
			this.setSpeedX();
			this.setSpeedY();
			this.setX(x);
			this.setY(y);
			this.lastX = this.x;
			this.lastY = this.y;
		}

		Point.prototype.bounceX = function () {
			this.setSpeedX(this.getSpeedX() * -1);
			this.moveX(this.getSpeedX());
		};

		Point.prototype.bounceY = function () {
			this.setSpeedY(this.getSpeedY() * -1);
			this.moveY(this.getSpeedY());
		};

		Point.prototype.getAccelerationX = function () {
			return this.accelerationX;
		};

		Point.prototype.getAccelerationY = function () {
			return this.accelerationY;
		};

		Point.prototype.getAngle = function () {
			return toDegrees(Math.atan2(this.getSpeedY(), this.getSpeedX()));
		};

		Point.prototype.getCenter = function () {
			return this;
		};

		Point.prototype.getCenterX = function () {
			return this.x;
		};

		Point.prototype.getCenterY = function () {
			return this.y;
		};

		Point.prototype.getDirection = function () {
			var direction = new Direction();

			if (this.getX() < this.getLastX()) {
				direction.setLeft();
			} else if (this.getX() > this.getLastX()) {
				direction.setRight();
			}

			if (this.getY() < this.getLastY()) {
				direction.setTop();
			} else if (this.getY() > this.getLastY()) {
				direction.setBottom();
			}

			return direction;
		};

		Point.prototype.getLastPosition = function () {
			return new Point(this.getLastX(), this.getLastY());
		};

		Point.prototype.getLastX = function () {
			return this.lastX;
		};

		Point.prototype.getLastY = function () {
			return this.lastY;
		};

		Point.prototype.getSpeedX = function () {
			return this.speedX;
		};

		Point.prototype.getSpeedY = function () {
			return this.speedY;
		};

		Point.prototype.getX = function () {
			return this.x;
		};

		Point.prototype.getY = function () {
			return this.y;
		};

		Point.prototype.move = function (width, height) {
			this.moveX(width);
			this.moveY(height);
		};

		Point.prototype.moveX = function (width) {
			this.setX(this.getX() + width);
		};

		Point.prototype.moveY = function (height) {
			this.setY(this.getY() + height);
		};

		Point.prototype.setAccelerationX = function (accelerationX) {
			this.accelerationX = accelerationX || 0;
		};

		Point.prototype.setAccelerationY = function (accelerationY) {
			this.accelerationY = accelerationY || 0;
		};

		Point.prototype.setMaxSpeedX = function (maxSpeedX) {
			this.maxSpeedX = maxSpeedX || 0;
		};

		Point.prototype.setMaxSpeedY = function (maxSpeedY) {
			this.maxSpeedY = maxSpeedY || 0;
		};

		Point.prototype.setPosition = function (point) {
			this.setX(point.getX());
			this.setY(point.getY());
		};

		Point.prototype.setSpeedToAngle = function (speed, degrees) {
			var radians = toRadians(degrees);
			this.setSpeedX(speed * Math.cos(radians));
			this.setSpeedY(speed * Math.sin(radians));
		};

		Point.prototype.setSpeedToPoint = function (speed, point) {
			var squareDistance = Math.abs(this.getCenterX() - point.getX()) + Math.abs(this.getCenterY() - point.getY());
			this.setSpeedX((point.getX() - this.getCenterX()) * speed / squareDistance);
			this.setSpeedY((point.getY() - this.getCenterY()) * speed / squareDistance);
		};

		Point.prototype.setSpeedX = function (speedX) {
			this.speedX = speedX || 0;
		};

		Point.prototype.setSpeedY = function (speedY) {
			this.speedY = speedY || 0;
		};

		Point.prototype.setX = function (x) {
			this.x = x || 0;
		};

		Point.prototype.setY = function (y) {
			this.y = y || 0;
		};

		Point.prototype.stop = function () {
			this.setSpeedX(0);
			this.setSpeedY(0);
		};

		Point.prototype.sync = function () {
			this.setSpeedX(this.getSpeedX() + this.accelerationX);

			if (this.maxSpeedX && this.getSpeedX() > this.maxSpeedX) {
				this.setSpeedX(this.maxSpeedX);
			}

			this.setSpeedY(this.getSpeedY() + this.accelerationY);

			if (this.maxSpeedY && this.getSpeedY() > this.maxSpeedY) {
				this.setSpeedY(this.maxSpeedY);
			}

			this.lastX = this.getX();
			this.lastY = this.getY();
			this.move(this.getSpeedX(), this.getSpeedY());
			return false;
		};

		return Point;

	})();

	var Rect = (function () {

		function Rect(x, y, width, height) {
			Point.call(this, x, y);
			this.setHeight(height);
			this.setWidth(width);
		}

		Rect.prototype = Object.create(Point.prototype);

		Rect.prototype.bounceFrom = function (direction) {
			if ((this.getSpeedX() < 0 && direction.getLeft()) || (this.getSpeedX() > 0 && direction.getRight())) {
				this.bounceX();
			}

			if ((this.getSpeedY() < 0 && direction.getTop()) || (this.getSpeedY() > 0 && direction.getBottom())) {
				this.bounceY();
			}
		};

		Rect.prototype.getBottom = function () {
			return this.getY() + this.getHeight() - 1;
		};

		Rect.prototype.getCenter = function () {
			return new Point(this.getCenterX(), this.getCenterY());
		};

		Rect.prototype.getCenterX = function () {
			return this.getX() + this.getHalfWidth();
		};

		Rect.prototype.getCenterY = function () {
			return this.getY() + this.getHalfHeight();
		};

		Rect.prototype.getCollision = function (rect) {
			var direction = new Direction();

			var ta = this.getTop();
			var ra = this.getRight();
			var ba = this.getBottom();
			var la = this.getLeft();
			var xa = this.getCenterX();
			var ya = this.getCenterY();

			var tb = rect.getTop();
			var rb = rect.getRight();
			var bb = rect.getBottom();
			var lb = rect.getLeft();

			if (xa <= lb && ra < rb) {
				direction.setRight();
			} else if (xa >= rb && la > lb) {
				direction.setLeft();
			}

			if (ya <= tb && ba < bb) {
				direction.setBottom();
			} else if (ya >= bb && ta > tb) {
				direction.setTop();
			}

			return direction;
		};

		Rect.prototype.getHalfHeight = function () {
			return Math.floor(this.getHeight() / 2);
		};

		Rect.prototype.getHalfWidth = function () {
			return Math.floor(this.getWidth() / 2);
		};

		Rect.prototype.getHeight = function () {
			return this.height;
		};

		Rect.prototype.getLeft = function () {
			return this.getX();
		};

		Rect.prototype.getRight = function () {
			return this.getX() + this.getWidth() - 1;
		};

		Rect.prototype.getTop = function () {
			return this.getY();
		};

		Rect.prototype.getWidth = function () {
			return this.width;
		};

		Rect.prototype.hasCollision = function (rect) {
			return !(
				this.getLeft() > rect.getRight() ||
				this.getRight() < rect.getLeft() ||
				this.getTop() > rect.getBottom() ||
				this.getBottom() < rect.getTop()
			);
		};

		Rect.prototype.increase = function (width, height) {
			this.increaseWidth(width);
			this.increaseHeight(height);
		};

		Rect.prototype.increaseHeight = function (height) {
			this.setHeight(this.getHeight() + height);
		};

		Rect.prototype.increaseWidth = function (width) {
			this.setWidth(this.getWidth() + width);
		};

		Rect.prototype.setBottom = function (y) {
			this.setY(y - this.getHeight() + 1);
		};

		Rect.prototype.setCenter = function (point) {
			this.setCenterX(point.getX());
			this.setCenterY(point.getY());
		};

		Rect.prototype.setCenterX = function (x) {
			this.setX(x - this.getHalfWidth());
		};

		Rect.prototype.setCenterY = function (y) {
			this.setY(y - this.getHalfHeight());
		};

		Rect.prototype.setHeight = function (height) {
			this.height = height || 0;
		};

		Rect.prototype.setLeft = function (x) {
			this.setX(x);
		};

		Rect.prototype.setRight = function (x) {
			this.setX(x - this.getWidth() + 1);
		};

		Rect.prototype.setSize = function (width, height) {
			this.setWidth(width);

			if (arguments.length > 1) {
				this.setHeight(height);
			} else {
				this.setHeight(width);
			}
		};

		Rect.prototype.setTop = function (y) {
			this.setY(y);
		};

		Rect.prototype.setWidth = function (width) {
			this.width = width || 0;
		};

		return Rect;

	})();

	var Direction = (function () {

		function Direction() {
			this.isBottom = false;
			this.isLeft = false;
			this.isRight = false;
			this.isTop = false;
		}

		Direction.prototype.getBottom = function () {
			return this.isBottom;
		};

		Direction.prototype.getLeft = function () {
			return this.isLeft;
		};

		Direction.prototype.getRight = function () {
			return this.isRight;
		};

		Direction.prototype.getTop = function () {
			return this.isTop;
		};

		Direction.prototype.setBottom = function (isBottom) {
			this.isBottom = isBottom == undefined || isBottom;
		};

		Direction.prototype.setLeft = function (isLeft) {
			this.isLeft = isLeft == undefined || isLeft;
		};

		Direction.prototype.setRight = function (isRight) {
			this.isRight = isRight == undefined || isRight;
		};

		Direction.prototype.setTop = function (isTop) {
			this.isTop = isTop == undefined || isTop;
		};

		return Direction;

	})();

	var Frame = (function () {

		function Frame(image, duration) {
			this.duration = duration || 0;
			this.image = image || new Image();
		}

		Frame.prototype.getDuration = function () {
			return this.duration;
		};

		Frame.prototype.getHeight = function () {
			return this.image.height;
		};

		Frame.prototype.getImage = function () {
			return this.image;
		};

		Frame.prototype.getWidth = function () {
			return this.image.width;
		};

		return Frame;

	})();

	var Animation = (function () {

		function Animation(frames) {
			this.setFrames(frames);
		}

		Animation.prototype.getHeight = function () {
			return this.frame.getHeight();
		};

		Animation.prototype.getImage = function () {
			return this.frame.getImage();
		};

		Animation.prototype.getWidth = function () {
			return this.frame.getWidth();
		};

		Animation.prototype.setFrameIndex = function (frameIndex) {
			if (frameIndex < this.frames.length && frameIndex > -1) {
				this.frameIndex = frameIndex;
				this.tick = 0;
				this.frame = this.frames[frameIndex];
				return true;
			}

			return false;
		};

		Animation.prototype.setFrames = function (frames) {
			this.frames = frames || [new Frame()];
			this.setFrameIndex(0);
		};

		Animation.prototype.update = function () {
			var hasLooped = false;

			if (this.frame.getDuration() && ++this.tick > this.frame.getDuration()) {
				var index = this.frameIndex + 1;

				if (index == this.frames.length) {
					hasLooped = true;
					index = 0;
				}

				this.setFrameIndex(index);
			}

			return hasLooped;
		};

		return Animation;

	})();

	var Sprite = (function () {

		function Sprite() {
			Rect.call(this);
			this.animation = null;
			this.boundary = null;
			this.delegate = null;
		}

		Sprite.prototype = Object.create(Rect.prototype);

		Sprite.prototype.getImage = function () {
			return this.animation.getImage();
		};

		Sprite.prototype.offBoundary = function () {
			if (this.delegate && this.delegate.offBoundary) {
				this.delegate.offBoundary();
			} else {
				this.expire();
			}
		};

		Sprite.prototype.onAnimationLoop = function () {
			this.delegate && this.delegate.onAnimationLoop && this.delegate.onAnimationLoop();
		};

		Sprite.prototype.render = function (context) {
			if (this.animation) {
				var image = this.getImage();
				var x = Math.floor(this.getX());
				var y = Math.floor(this.getY());
				context.drawImage(image, x, y, this.getWidth(), this.getHeight());
			}
		};

		Sprite.prototype.setAnimation = function (animation) {
			if (this.animation == animation) {
				return;
			}

			this.animation = animation;
			this.animation.setFrameIndex(0);
			this.setHeight(this.animation.getHeight());
			this.setWidth(this.animation.getWidth());
		};

		Sprite.prototype.setBoundary = function (rect) {
			this.boundary = rect || Quick.getBoundary();
		};

		Sprite.prototype.setDelegate = function (delegate) {
			this.delegate = delegate;
		};

		Sprite.prototype.setImage = function (image) {
			this.setAnimation(new Animation([new Frame(image)]));
		};

		Sprite.prototype.setImageId = function (id) {
			this.setImage(document.getElementById(id));
		};

		Sprite.prototype.sync = function () {
			var result = Rect.prototype.sync.call(this);

			if (this.animation && this.animation.update()) {
				this.onAnimationLoop();
			}

			if (this.boundary && !this.hasCollision(this.boundary)) {
				this.offBoundary();
			}

			return result;
		};

		return Sprite;

	})();

	var GameObject = (function () {

		function GameObject() {
			Sprite.call(this);
			this.color = null;
			this.layerIndex = 0;
			this.isEssential = false;
			this.expiration = -1;
			this.isExpired = false;
			this.isSolid = false;
			this.isVisible = true;
			this.scene = null;
			this.tags = {};
			this.tick = 0;
		}

		GameObject.prototype = Object.create(Sprite.prototype);

		GameObject.prototype.addTag = function (tag) {
			this.tags[tag] = true;
		};

		GameObject.prototype.expire = function () {
			this.isExpired = true;
		};

		GameObject.prototype.getColor = function () {
			return this.color;
		};

		GameObject.prototype.getEssential = function () {
			return this.isEssential;
		};

		GameObject.prototype.getExpired = function () {
			return this.isExpired;
		};

		GameObject.prototype.getLayerIndex = function () {
			return this.layerIndex;
		};

		GameObject.prototype.getScene = function () {
			return this.scene;
		};

		GameObject.prototype.getSolid = function () {
			return this.isSolid;
		};

		GameObject.prototype.getTick = function () {
			return this.tick;
		};

		GameObject.prototype.getVisible = function () {
			return this.isVisible;
		};

		GameObject.prototype.hasTag = function (tag) {
			return this.tags[tag]
		};

		GameObject.prototype.init = function () {
			this.delegate && this.delegate.init && this.delegate.init();
		};
		
		GameObject.prototype.onCollision = function (gameObject) {
			this.delegate && this.delegate.onCollision && this.delegate.onCollision(gameObject);
		};

		GameObject.prototype.setColor = function (color) {
			this.color = color;
		};

		GameObject.prototype.setEssential = function (isEssential) {
			this.isEssential = isEssential == undefined || isEssential;
		};

		GameObject.prototype.setLayerIndex = function (layerIndex) {
			this.layerIndex = layerIndex || 0;
		};

		GameObject.prototype.setScene = function (scene) {
			this.scene = scene;
		};

		GameObject.prototype.setSolid = function (isSolid) {
			this.isSolid = isSolid == undefined || isSolid;
		};

		GameObject.prototype.setVisible = function (isVisible) {
			this.isVisible = isVisible == undefined || isVisible;
		};

		GameObject.prototype.setExpiration = function (expiration) {
			this.expiration = expiration;
		};

		GameObject.prototype.render = function (context) {
			if (!this.isVisible) {
				return;
			}

			if (this.color) {
				var x = Math.floor(this.getX());
				var y = Math.floor(this.getY());
				context.fillStyle = this.color;
				context.fillRect(x, y, this.getWidth(), this.getHeight());
			}

			Sprite.prototype.render.call(this, context);
		};

		GameObject.prototype.sync = function () {
			if (this.getExpired()) {
				return true;
			}

			if (++this.tick == this.expiration) {
				this.expire();
			}

			return Sprite.prototype.sync.call(this);
		};

		GameObject.prototype.update = function () {
			this.delegate && this.delegate.update && this.delegate.update();
		};

		return GameObject;

	})();

	var Text = (function () {

		var FONT_SUFFIX = "Font";
		var LINE_FEED = "\n";
		var SPACE = 4;
		var SPACE_CHARACTER = " ";
		var SPACING = 0;

		function Text(string) {
			GameObject.call(this);
			this.setString(string || "");
		}

		Text.prototype = Object.create(GameObject.prototype);

		Text.prototype.getString = function () {
			return this.string;
		};

		Text.prototype.parse = function (context) {
			var height = 0;
			var width = 0;
			var x = 0;
			var y = 0;

			for (var i = 0; i < this.string.length; ++i) {
				var character = this.string[i];

				if (character == SPACE_CHARACTER) {
					x += SPACE + SPACING;
				} else if (character == LINE_FEED) {
					x = 0;
					y += height + SPACING;
				} else {
					var image = document.getElementById(character + FONT_SUFFIX);

					if (context) {
						context.drawImage(image, this.getX() + x, this.getY() + y, image.width, image.height);
					}

					x += image.width + SPACING;

					if (x > width) {
						width = x;
					}

					if (image.height > height) {
						height = image.height;
					}
				}
			}

			this.setWidth(width);
			this.setHeight(y + height);
		};

		Text.prototype.render = function (context) {
			this.parse(context);
		};

		Text.prototype.setString = function (string) {
			this.string = string;
			this.parse();
		};

		return Text;

	})();

	var BaseTile = (function () {

		function BaseTile(id) {
			GameObject.call(this);
			this.setImageId(id);
		}

		BaseTile.prototype = Object.create(GameObject.prototype);

		return BaseTile;

	})();

	var BaseTransition = (function () {

		var COLOR = "Black";
		var FRAMES = 32;

		function BaseTransition() {
			GameObject.call(this);
			this.setColor(COLOR);
			this.setHeight(Quick.getHeight());
			this.increase = Quick.getWidth() / FRAMES;
		}

		BaseTransition.prototype = Object.create(GameObject.prototype);

		BaseTransition.prototype.sync = function () {
			if (this.getWidth() > Quick.getWidth()) {
				return true;
			}

			this.increaseWidth(this.increase);
			Quick.paint(this);
			return GameObject.prototype.sync.call(this);
		};

		return BaseTransition;

	})();

	function toDegrees(radians) {
		return radians * RADIAN_DEGREES / Math.PI;
	}

	function toRadians(degrees) {
		return degrees * Math.PI / RADIAN_DEGREES;
	}

	function publish() {
		if (!window.com) {
			window.com = {};
		}

		if (!window.com.dgsprb) {
			window.com.dgsprb = {};
		}

		window.com.dgsprb.quick = {
			"Animation" : Animation,
			"BaseTile" : BaseTile,
			"BaseTransition" : BaseTransition,
			"CommandEnum" : CommandEnum,
			"Controller" : Controller,
			"Frame" : Frame,
			"GameObject" : GameObject,
			"ImageFactory" : ImageFactory,
			"Mouse" : Mouse,
			"Point" : Point,
			"Quick" : Quick,
			"Rect" : Rect,
			"Scene" : Scene,
			"Sprite" : Sprite,
			"Text" : Text
		};
	}

	publish();

})();
