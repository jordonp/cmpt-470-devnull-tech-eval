var testScene;
var playerObject;
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
  });
  initRenderer();

  var testObject = new GameObject();
  testObject.z = -4.0;
  testObject.x = -0.5;
  testObject.height = 2.0;
  testObject.color = [0.0, 0.2, 0.2];

  var testObject2 = new GameObject();
  testObject2.z = -4.0;
  testObject2.width = 2.0;
  testObject2.color = [0.2, 0.2, 0.0];

  testScene = new Scene();
  testScene.objects.push(testObject);
  testScene.objects.push(testObject2);
  
  playerObject = testScene.objects[0];

  setScene(testScene);

  render();
  return true;

});