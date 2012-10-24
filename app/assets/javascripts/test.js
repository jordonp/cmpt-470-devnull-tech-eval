var testScene;
var playerObject;
var obstacle;
var jumping  = false;

function gameLoop() {
	//game logic here
	obstacle.x-= 0.5;
	if(obstacle.x == -20)
	{
		obstacle.x = 300;
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
  
  $(document).keydown(function(e){
      if (e.keyCode == 37) { //left
        if(playerObject.z > -6.0) {
          playerObject.z -= 2.0;
        }
		 if (collision_detect(playerObject, testObject2)){
			playerObject.z += 2.0;
			}
         return false;
      }
      if (e.keyCode == 39) { //right
        if(playerObject.z < -2.0) {
          playerObject.z += 2.0;
        }
		 if (collision_detect(playerObject, testObject2)){
			playerObject.z -= 2.0;
			}
         return false;
      }
      if (e.keyCode == 32) { //space
      	if(!jumping && playerObject.y == 0 + playerObject.boundHeight/2) {
          jumping = true;
          playerObject.currentAnimation = 1;
          playerObject.boundHeight /= 2;
     	}
         return false;
      }
  });
  
  var collision_detect = function(obj1, obj2) {
	
	distx1 = Math.abs(obj1.x) + obj1.boundWidth/2;
	disty1 = Math.abs(obj1.y) + obj1.boundHeight/2;
	distx2 = Math.abs(obj2.x) + obj2.boundWidth/2;
	disty2 = Math.abs(obj2.y) + obj2.boundHeight/2;

	a = Math.abs(obj1.x) + Math.abs(obj2.x);
	b = Math.abs(obj1.y) + Math.abs(obj2.y);
	
	hypo = Math.sqrt(a*a + b*b);
	
	if (hypo <= (distx1 + distx2)/2){
		console.log(distx1, disty1, distx2, disty2);
		console.log(distx1-distx2, disty1-disty2, hypo);
		console.log("Horizontal collision.");
		return true;
	}	

	if (hypo <= (disty1 + disty2)/2){
		console.log(distx1, disty1, distx2, disty2);
		console.log(distx1-distx2, disty1-disty2, hypo);
		console.log("Vertical collision.");
		return true;
	}	

	console.log(distx1, disty1, distx2, disty2);
	console.log(distx1-distx2, disty1-disty2);
	console.log("No collision.");
	return false;
}
  initRenderer();

  var run = new Animation();
  for(var i = 1; i <= 13; i++ ) {
    console.log("loading: " + (i/34*100).toString() + "%");
    run.addFrameFromJson("/run/charrun" + i.toString(), "assets/char.jpg");
  }
  run.speed = 0.5;

  var jump = new Animation();
  for(var i = 8; i <= 28; i++ ) {
    console.log("loading: " + ((i+6)/34*100).toString() + "%");
    jump.addFrameFromJson("/jump/charjump" + i.toString(), "assets/char.jpg");
  }
  jump.speed = 0.35;
  jump.loop = false;
  

  var testObject = new GameObject();
  testObject.z = -4.0;
  testObject.x = -5;
  testObject.y = 2.0;
  testObject.rotateY = 100;
  testObject.boundHeight = 1.3;
  testObject.loadModelFromJson("/run/charrun1", "assets/char.jpg");
  testObject.animations.push(run);
  testObject.animations.push(jump);

  var testObject2 = new GameObject();
  testObject2.z = -4.0;
  testObject2.width = 2.0;
  testObject2.boundWidth = 3.0;
  testObject2.color = [1.0, 1.0, 0.6];
  testObject2.setTexture("assets/crate.jpg");

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

  testScene = new Scene();
  testScene.objects.push(testObject);
  testScene.objects.push(testObject2);
  testScene.objects.push(testObject3);
  testScene.objects.push(testObject4);
  testScene.objects.push(testObject5);
  
  playerObject = testScene.objects[0];
  obstacle = testScene.objects[1];

  setScene(testScene);

  setInterval(gameLoop, 1000 / 60);
  render();

  return true;

});
