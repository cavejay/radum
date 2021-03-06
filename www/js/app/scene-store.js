/**
 *	Scene Store
 *	retrieve scenes by name
 *	(c) doublespeak games 2015	
 **/
define(['app/scenes/game-board', 'app/scenes/main-menu', 'app/scenes/stage-screen', 
    'app/scenes/game-over', 'app/scenes/loading', 'app/scenes/nag'], 
	function(GameBoard, MainMenu, StageScreen, GameOver, Loading, Nag) {

	return {
		get: function(sceneName) {
			return require('app/scenes/' + sceneName);
		}
	};
});