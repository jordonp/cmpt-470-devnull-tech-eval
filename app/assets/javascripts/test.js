var testScene;
var playerObject;
var obstacleModel;
var obstacles =[];
var jumping  = false;
var score = 0;
var life = 3;
var difficulty = 0;

function reset() {
  score = 0;
  obstacles = [];
  jumping = false;
  score = 0;
  difficulty = 0;
  testScene.objects = [testScene.objects[0], testScene.objects[1], testScene.objects[2], testScene.objects[3]];
  obstacleModel = new GameObject();
  obstacleModel.z = Math.floor(Math.random()*3)*2-6;
  obstacleModel.x = 300.0;
  obstacleModel.color = [1.0, 1.0, 0.6];
  obstacleModel.setTexture("assets/crate.jpg");
  testScene.objects.push(obstacleModel);
  obstacles.push(obstacleModel);
}

var collision_detect = function(obj1, obj2) {
	
    var hHit = false;
    var vHit = false;

	distx1 = (obj1.x + obj1.boundWidth);
	disty1 = 2*(Math.abs(obj1.y) + obj1.boundHeight/2);
	distx2 = (obj2.x + obj2.boundWidth);
	disty2 = 2*(Math.abs(obj2.y) + obj2.boundHeight/2);
	
	if (obj1.x <= distx2 && obj2.x <= distx1){
		hHit = true;
	}	
	if (Math.abs(obj1.y) <= disty2 && Math.abs(obj2.y) <= disty1){
		vHit = true;
	}

    if (hHit == true && vHit == true)
        return true;
    
	return false;
}

function gameLoop() {
	//game logic here

	if (life == 0){ 
		alert("You're dead!");
		console.log(score);
	}

  difficulty++;

  if(difficulty % 500 == 0) {
    if(obstacles.length < 100) {
      obstacleModel = new GameObject();
      obstacleModel.z = Math.floor(Math.random()*3)*2-6;
      obstacleModel.x = 300.0;
      obstacleModel.width = 2.0;
      obstacleModel.boundWidth = 3.0;
      obstacleModel.color = [1.0, 1.0, 0.6];
      obstacleModel.setTexture("assets/crate.jpg");
      testScene.objects.push(obstacleModel);
      obstacles.push(obstacleModel);
    }
  }

  for(var i = 0; i < obstacles.length; i++) {
  	if(obstacles[i].x <= -20)
  	{
      obstacles[i].z = Math.floor(Math.random()*3)*2-6;
  	  obstacles[i].x = 300;
  	}
    if (!collision_detect(playerObject, obstacles[i]) || playerObject.z != obstacles[i].z)
    {
  	    $("#status").html("Great, no collision detection. Keep going!");
        obstacles[i].x-= 1;
        continue;
    }
    else if (collision_detect(playerObject, obstacles[i]))
    {
        $("#status").html("You've hit a box, game over!");
        
        break;   
    }
  }


	if(playerObject.y > 0 && !jumping) {
		playerObject.y-= 0.25/playerObject.y/5;
	}

	if(playerObject.y < 0 + playerObject.boundHeight/2) {
		playerObject.y = 0 + playerObject.boundHeight/2;
    if(playerObject.currentAnimation == 1) {
      playerObject.boundHeight *= 2;
      playerObject.animations[1].currentFrame = 0;
      playerObject.currentAnimation = 0;
    }
	}

	if(jumping)
	{
		if(playerObject.y < 2.0) {
			playerObject.y += 0.2/playerObject.y/2;
      playerObject.x += 0.05;
		} else {
			jumping = false;
		}
	} else if ( playerObject.x > -5.0) {
    playerObject.x -= 0.01;
    if(playerObject.x < -5.0) {
      playerObject.x = -5.0;
    }
  }
}

$(function() {
  $("#game-over").hide();
  
  $(document).keydown(function(e){
      if (e.keyCode == 37) { //left
        if(playerObject.z > -6.0) {
          playerObject.z -= 2.0;
        }
         return false;
      }
      if (e.keyCode == 39) { //right
        if(playerObject.z < -2.0) {
          playerObject.z += 2.0;
        }
         return false;
      }
      if (e.keyCode == 32 || e.keyCode == 38) { //space or up
      	if(!jumping && playerObject.y == 0 + playerObject.boundHeight/2) {
          jumping = true;
          playerObject.currentAnimation = 1;
          playerObject.boundHeight /= 2;
     	}
         return false;
      }
      if (e.keyCode == 82) { //space or up
        reset();
         return false;
      }
  });
  
  initRenderer();

  var run = new Animation();
  for(var i = 1; i <= 13; i++ ) {
    run.addFrameFromJson("/run/charrun" + i.toString(), "assets/char.jpg");
  }
  run.speed = 0.5;

  var jump = new Animation();
  for(var i = 8; i <= 28; i++ ) {
    jump.addFrameFromJson("/jump/charjump" + i.toString(), "assets/char.jpg");
  }
  jump.speed = 0.35;
  jump.loop = false;

  $('#loading').hide();
  

  var testObject = new GameObject();
  testObject.z = -4.0;
  testObject.x = -5;
  testObject.y = 2.0;
  testObject.rotateY = 100;
  testObject.boundHeight = 1.3;
  testObject.loadModelFromJson("/run/charrun1", "assets/char.jpg");
  testObject.animations.push(run);
  testObject.animations.push(jump);

  var testObject3 = new GameObject();
  testObject3.z = -4.0;
  testObject3.y = -1.0;
  testObject3.width = 500.0;
  testObject3.depth = 2.0;
  testObject3.boundWidth = 500.0;
  testObject3.boundDepth = 2.0;
  testObject3.color = [0.8, 0.5, 0.5];

  var testObject4 = new GameObject();
  testObject4.z = -6.0;
  testObject4.y = -1.0;
  testObject4.width = 500.0;
  testObject4.depth = 2.0;
  testObject4.boundWidth = 500.0;
  testObject4.boundDepth = 2.0;
  testObject4.color = [0.5, 0.8, 0.5];

  var testObject5 = new GameObject();
  testObject5.z = -2.0;
  testObject5.y = -1.0;
  testObject5.width = 500.0;
  testObject5.depth = 2.0;
  testObject5.boundWidth = 500.0;
  testObject5.boundDepth = 2.0;
  testObject5.color = [0.5, 0.5, 0.8];

  obstacleModel = new GameObject();
  obstacleModel.z = -4.0;
  obstacleModel.x = 100.0;
  obstacleModel.width = 2.0;
  obstacleModel.boundWidth = 3.0;
  obstacleModel.color = [1.0, 1.0, 0.6];
  obstacleModel.setTexture("assets/crate.jpg");

  testScene = new Scene();
  testScene.objects.push(testObject);
  testScene.objects.push(testObject3);
  testScene.objects.push(testObject4);
  testScene.objects.push(testObject5);
  
  playerObject = testScene.objects[0];

  testScene.objects.push(obstacleModel);
  obstacles.push(obstacleModel);

  setScene(testScene);

  setInterval(gameLoop, 1000 / 60);

  render();

  return true;

});
