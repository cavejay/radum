/**
 *	Tutorial
 *	interactive tutorial module
 *	(c) doublespeak games 2015	
 **/
define(['app/graphics', 'app/touch-prompt'], function(Graphics, TouchPrompt) {
	
	var HEIGHT = 200
	ANIMATION_DURATION = 300
	;

	var _stages
	, _currentStage = 0
	, _transition = 1
	, _prompt = new TouchPrompt({x: Graphics.width() / 2, y: 40}, 'negative', true)
	, _lastStage
	;

	function _init(stages) {
		_stages = stages;
		_transition = 0;
		Graphics.toggleMenu(false);
	}

	function _testAdvance() {
		if (!_stage()) { return; }

		if (_stage().reverseTest && _stage().reverseTest()) {
			_reverse();
		} else if (_stage().advanceTest && _stage().advanceTest()) {
			_advance();
		}
	}

	function _advance() {
		_lastStage = _stage();
		_currentStage++;
		_transition = 0;
		_lastStage.onAdvance && _lastStage.onAdvance();
		_stage() && _stage().onActivate && _stage().onActivate();
	}

	function _reverse() {
		_lastStage = _stage();
		_currentStage--;
		_transition = 0;
		_stage() && _stage().onActivate && _stage().onActivate();
	}

	function _do(delta) {
		if (_transition < 1) {
			_transition += delta / ANIMATION_DURATION;
			_transition = _transition > 1 ? 1 : _transition;
		}

		_prompt.do(delta);
		_testAdvance();
	}

	function _stage() {
		return _stages ? _stages[_currentStage] : null;
	}

	function _draw() {

		if (!_stage()) {
			return;
		}

		if (_lastStage && _transition < 1 && _lastStage.message) {
			Graphics.setAlpha(1 - _transition);
			Graphics.rect(20, (HEIGHT * (1 -_transition)) - 2, Graphics.width() - 40, HEIGHT, 'negative', 'menu', 4, 0.9, true);
			_lastStage.message.forEach(function(text, idx) {
				Graphics.text(text, Graphics.width() / 2, (HEIGHT * (1 - _transition)) - 50 - (idx * 34), 32, 'negative', null, null, true);
			});
		}

		if (_stage().message) {
			Graphics.setAlpha(_transition);
			Graphics.rect(20, (HEIGHT * _transition) - 2, Graphics.width() - 40, HEIGHT, 'negative', 'menu', 4, 0.9, true);

			_stage().message.forEach(function(text, idx) {
				Graphics.text(text, Graphics.width() / 2, (HEIGHT * _transition) - 50 - (idx * 34), 32, 'negative', null, null, true);
			});

			if (_transition === 1 && !_stage().advanceTest) {
				_prompt.draw();
			}
		}
		Graphics.setAlpha(1);
	}

	return {
		do: _do,
		draw: _draw,
		init: _init,
		deactivate: function() {
			_stages = null;
			_currentStage = 0;
			_lastStage = null;
		},
		isActive: function() { 
			return !!_stages; 
		},
		isBlocking: function() {
			return _stages && _stage() && !_stage().advanceTest;
		},
		canSubmit: function() {
			return !_stages || !_stage() || _stage().canSubmit;
		},
		advance: _advance,
	};
});