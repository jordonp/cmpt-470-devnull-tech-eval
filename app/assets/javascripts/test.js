var testScene;
var playerObject;
$(function() {

  $(document).keydown(function(e){
      if (e.keyCode == 37) { //left
         playerObject.x -= 0.1;
		 if (collision_detect(playerObject, testObject2)){
			playerObject.x += 0.1;
			}
         return false;
      }
      if (e.keyCode == 38) { //up
         playerObject.y += 0.1;
		 if (collision_detect(playerObject, testObject2)){
			playerObject.y -= 0.1;
			}
         return false;
      }
      if (e.keyCode == 39) { //right
         playerObject.x += 0.1;
		 if (collision_detect(playerObject, testObject2)){
			playerObject.x -= 0.1;
			}
         return false;
      }
      if (e.keyCode == 40) { //down
         playerObject.y -= 0.1;
		 if (collision_detect(playerObject, testObject2)){
			playerObject.y += 0.1;
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

  var testObject = new GameObject();
  testObject.z = -4.0;
  testObject.x = -2.5;
  testObject.loadModelFromJson();
  testObject.setTexture("assets/char.jpg");

  var testObject2 = new GameObject();
  testObject2.z = -4.0;
  testObject2.width = 2.0;
  testObject2.boundWidth = 3.0;
  testObject2.color = [1.0, 1.0, 0.6];
  testObject2.setTexture("assets/crate.jpg");

  testScene = new Scene();
  testScene.objects.push(testObject);
  testScene.objects.push(testObject2);
  
  playerObject = testScene.objects[0];

  setScene(testScene);

  render();
  return true;

});
