var testScene;
var playerObject;
var obstacle;
var jumping  = false;
var collision_detect = function(obj1, obj2) {
	
    var hHit = false;
    var vHit = false;

	distx1 = 2*(Math.abs(obj1.x) + obj1.boundWidth/2);
	disty1 = 2*(Math.abs(obj1.y) + obj1.boundHeight/2);
	distx2 = 2*(Math.abs(obj2.x) + obj2.boundWidth/2);
	disty2 = 2*(Math.abs(obj2.y) + obj2.boundHeight/2);
	
	if (Math.abs(obj1.x) <= distx2 && Math.abs(obj2.x) <= distx1){
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
	$("#debug").html("No Hit! :[");
    if (collision_detect(playerObject, obstacle))
        $("#debug").html("HIT");

    obstacle.x-= 1;
	if(obstacle.x == -20)
	{
		obstacle.x = 300;
	}

	if(playerObject.y > 0 && !jumping) {
		playerObject.y-= 0.5/playerObject.y/2;
	}

	if(playerObject.y < 0 + playerObject.boundHeight/2) {
		playerObject.y = 0 + playerObject.boundHeight/2;
	}

	if(jumping)
	{
		if(playerObject.y < 3.0) {
			playerObject.y += 0.5/playerObject.y/3;
		} else {
			jumping = false;
		}
	}
}

$(function() {
  
  $(document).keydown(function(e){
      if (e.keyCode == 37) { //left
         playerObject.x -= 0.1;
         return false;
      }
      if (e.keyCode == 38) { //up
         playerObject.y += 0.1;
         return false;
      }
      if (e.keyCode == 39) { //right
         playerObject.x += 0.1;
         return false;
      }
      if (e.keyCode == 40) { //down
         playerObject.y -= 0.1;
         return false;
      }
      if (e.keyCode == 32) { //space
      	if(!jumping && playerObject.y == 0 + playerObject.boundHeight/2) {
          jumping = true;
     	}
         return false;
      }
  });
  
  
  initRenderer();

  var testObject = new GameObject();
  testObject.z = -4.0;
  testObject.x = -3;
  testObject.y = 2.0;
  testObject.rotateY = 90;
  testObject.boundHeight = 1.3;
  testObject.loadModelFromJson();
  testObject.setTexture("assets/char.jpg");
  testObject.renderBounds = true;
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
