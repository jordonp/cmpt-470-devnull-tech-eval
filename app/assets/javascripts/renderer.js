var tdl;

function Scene () {
  this.objects = [];
}

Scene.prototype.draw = function() {
  for (var i = 0; i < this.objects.length; i++) {
    this.objects[i].draw();
  };
};

function GameObject () {
  var cube = tdl.primitives.createCube(1.0);
  var model = new tdl.models.Model(program, cube, {});
  this.model = model;
  this.x = 0.0;
  this.y = 0.0;
  this.z = 0.0;
  this.width = 1.0;
  this.height = 1.0;
  this.depth = 1.0;
  this.rotateX = 0.0;
  this.rotateY = 0.0;
  this.rotateZ = 0.0;
  this.transform = new Float32Array(16);
  this.color = [0.0, 0.0, 1.0];

}

GameObject.prototype.draw = function() {
  tdl.fast.identity4(this.transform);
  tdl.fast.matrix4.rotateX(this.transform, this.rotateX);
  tdl.fast.matrix4.rotateY(this.transform, this.rotateY);
  tdl.fast.matrix4.rotateZ(this.transform, this.rotateZ);
  tdl.fast.matrix4.scale(this.transform, [this.width, this.height, this.depth]);
  tdl.fast.matrix4.setTranslation(this.transform, [this.x, this.y, this.z]);
  var transformInv = new Float32Array(16);
  tdl.fast.inverse4(transformInv, this.transform)
  this.model.drawPrep();
  this.model.draw({"transform": this.transform, "transformInv": transformInv, "color": this.color, "view": view, "projection": projection});
};


var canvas;
var gl;
var program;

var transform = new Float32Array(16);
var view = new Float32Array(16);
var projection = new Float32Array(16);
var eye = [0.0, 2.0, 0.0];
var sceneToRender;


function createProgramFromTags(vertexTagId, fragmentTagId) {
  return tdl.programs.loadProgram(
      document.getElementById(vertexTagId).text,
      document.getElementById(fragmentTagId).text);
}

function initRenderer() {
  canvas = document.getElementById("canvas");
  canvas.width = $("body").width();
  canvas.height = window.innerHeight - $(".navbar").height();

  gl = tdl.webgl.setupWebGL(canvas);
  if (!gl) {
    return;  // Do nothing
  }
  program = createProgramFromTags("vertex-shader", "fragment-shader");

  tdl.fast.matrix4.perspective(
        projection,
        tdl.math.degToRad(60),
        canvas.clientWidth / canvas.clientHeight,
        1,
        5000);

  tdl.fast.matrix4.lookAt(
      view,
      eye,
      [0.0, 0.0, -4.0],
      [0.0, 1.0, 0.0]);
  gl.depthMask(true);
  gl.clearColor(0.1,0.1,0.1,1);
  gl.clearDepth(1);
  gl.enable(gl.CULL_FACE);
  gl.enable(gl.DEPTH_TEST);
}

function setScene(scene) {
  sceneToRender = scene;
}

function render() {
  
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  sceneToRender.draw();
  tdl.webgl.requestAnimationFrame(render, canvas);
}


