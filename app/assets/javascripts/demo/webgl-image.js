var kernels = {
		normal: [
			0, 0, 0,
			0, 1, 0,
			0, 0, 0
		],
		gaussianBlur: [
		0.045, 0.122, 0.045,
		0.122, 0.332, 0.122,
		0.045, 0.122, 0.045
		],
		edgeDetect: [
			-1, -1, -1, 
			-1,  8, -1, 
			-1, -1, -1],
		emboss: [
			-2, -1, 0,
			-1,  1, 1,
			 0,  1, 2
		]
	};

function drawRectangle(gl, x, y, width, height) {
	var x1 = x;
	var x2 = x + width;
	var y1 = y;
	var y2 = y + height;
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
		x1, y1,
		x2, y1,
		x1, y2,
		x1, y2,
		x2, y1,
		x2, y2]), gl.STATIC_DRAW);
}

function createTexture(gl) {
	var texture = gl.createTexture();
	gl.bindTexture(gl.TEXTURE_2D, texture);;

	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);

	return texture;
}


function render(image)
{
	var canvas = $('#canvas')[0];
	var gl = canvas.getContext("experimental-webgl");

	var vShader = createShaderFromScriptElement(gl, "vertex-shader");
	var fShader = createShaderFromScriptElement(gl, "fragment-shader");

	var program = createProgram(gl, [vShader, fShader]);
	gl.useProgram(program);

	var positionLocation = gl.getAttribLocation(program, "a_position");
	var texCoordLocation = gl.getAttribLocation(program, "a_texCoord");
	var resolutionLocation = gl.getUniformLocation(program, "u_resolution");
	var textureSizeLocation = gl.getUniformLocation(program, "u_textureSize");
	var kernelLocation = gl.getUniformLocation(program, "u_kernel[0]");
	var flipYLocation = gl.getUniformLocation(program, "u_flipY");
	var angleLocation = gl.getUniformLocation(program, "u_angle");
	var scaleLocation = gl.getUniformLocation(program, "u_scale");
	
	gl.uniform2f(resolutionLocation, canvas.width, canvas.height);
	gl.uniform2f(textureSizeLocation, image.width, image.height);
	gl.uniform1f(angleLocation, 0.0);
	gl.uniform1f(scaleLocation, 1.0);
	gl.uniform1fv(kernelLocation, [
		-1, -1, -1,
		-1,  8, -1,
		-1, -1, -1]);

	var texCoordBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, texCoordBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
		0.0, 0.0,
		1.0, 0.0,
		0.0, 1.0,
		0.0, 1.0,
		1.0, 0.0,
		1.0, 1.0]), gl.STATIC_DRAW);
	gl.enableVertexAttribArray(texCoordLocation);
	gl.vertexAttribPointer(texCoordLocation, 2, gl.FLOAT, false, 0, 0);

	var positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.enableVertexAttribArray(positionLocation);
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);
    drawRectangle(gl, 0, 0, image.width, image.height);
	
	var originalImageTexture = createTexture(gl);
	gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);

	var textures = [];
	var framebuffers = [];
	for (var i = 0; i < 2; i++) {
		var texture = createTexture(gl);
		textures.push(texture);

		gl.texImage2D(
      		gl.TEXTURE_2D, 0, gl.RGBA, image.width, image.height, 0,
      		gl.RGBA, gl.UNSIGNED_BYTE, null);

		var fbo = gl.createFramebuffer();
		framebuffers.push(fbo);
		gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);

		 gl.framebufferTexture2D(
      		gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0);
	}

	var effectsToApply = [{"effect": "gaussianBlur",
						   "amount": 0 },
						   {"effect": "emboss",
						   "amount": 0 },
						   {"effect": "edgeDetect",
						   "amount": 0 }];

	draw();

	function draw() {
		gl.bindTexture(gl.TEXTURE_2D, originalImageTexture);
		gl.uniform1f(flipYLocation, 1);
		for (var i = 0; i<effectsToApply.length; i++) {
			for (var j = 1; j <= effectsToApply[i].amount; j++) {
				setFramebuffer(framebuffers[(j+i) % 2], image.width, image.height);

				drawWithKernel(effectsToApply[i].effect);

				gl.bindTexture(gl.TEXTURE_2D, textures[(j + i) % 2]);
			}
		}
		gl.uniform1f(flipYLocation, -1);
		setFramebuffer(null, canvas.width, canvas.height);
		drawWithKernel("normal");
	}

	function setFramebuffer(fbo, width, height) {
        gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
        gl.uniform2f(resolutionLocation, width, height);
        gl.viewport(0, 0, width, height);
    }

    function drawWithKernel(name) {
        gl.uniform1fv(kernelLocation, kernels[name]);
        gl.drawArrays(gl.TRIANGLES, 0, 6);
    }

    $( "#rotate-slider-result" ).html("0 rad");
    $( "#rotate-slider" ).slider({
           animate: true,
               range: "min",
               value: 0,
               min: 0,
               max: 6.282,
               step: 0.01,
 
               //this gets a live reading of the value and prints it on the page
               slide: function( event, ui ) {
                   $( "#rotate-slider-result" ).html( (ui.value == 6.282 ? "2π" : ui.value == 3.14 ? "π" : ui.value) + " rad" );
                   gl.uniform1f(angleLocation, ui.value);
                   draw();
               }
 
               });

    $( "#scale-slider-result" ).html("1.0");
    $( "#scale-slider" ).slider({
           animate: true,
               range: "min",
               value: 1.0,
               min: 0.1,
               max: 2,
               step: 0.01,
 
               //this gets a live reading of the value and prints it on the page
               slide: function( event, ui ) {
                   $( "#scale-slider-result" ).html( ui.value );
                   gl.uniform1f(scaleLocation, ui.value);
                   draw();
               }
 
               });
    $( "#blur-slider-result" ).html("0");
    $( "#blur-slider" ).slider({
           animate: true,
               range: "min",
               value: 0,
               min: 0,
               max: 10,
               step: 1,
 
               //this gets a live reading of the value and prints it on the page
               slide: function( event, ui ) {
                   $( "#blur-slider-result" ).html( ui.value );
                   for (var i = 0; i < effectsToApply.length; i++) {
                   	if(effectsToApply[i].effect == "gaussianBlur") {
                   		effectsToApply[i].amount = ui.value;
                   		break;
                   	}
                   }
                   draw();
               }
 
               });
    $( "#emboss-slider-result" ).html("0");
    $( "#emboss-slider" ).slider({
           animate: true,
               range: "min",
               value: 0,
               min: 0,
               max: 10,
               step: 1,
 
               //this gets a live reading of the value and prints it on the page
               slide: function( event, ui ) {
                   $( "#emboss-slider-result" ).html( ui.value );
                   for (var i = 0; i < effectsToApply.length; i++) {
                   	if(effectsToApply[i].effect == "emboss") {
                   		effectsToApply[i].amount = ui.value;
                   		break;
                   	}
                   }
                   draw();
               }
 
               });
    $( "#edge-slider-result" ).html("0");
    $( "#edge-slider" ).slider({
           animate: true,
               range: "min",
               value: 0,
               min: 0,
               max: 10,
               step: 1,
 
               //this gets a live reading of the value and prints it on the page
               slide: function( event, ui ) {
                   $( "#edge-slider-result" ).html( ui.value );
                   for (var i = 0; i < effectsToApply.length; i++) {
                   	if(effectsToApply[i].effect == "edgeDetect") {
                   		effectsToApply[i].amount = ui.value;
                   		break;
                   	}
                   }
                   draw();
               }

               });
}

$(function() {
	var image = new Image();
	image.onload = function() {
		render(image);
	}
	image.src = $('#image-select select').val();
	$('#image-select select').change(function () {
		image.src = $(this).val();
	})
});