Engine = function() {
	mvMatrix = null;
	pMatrix = null;
	this.gl = null;
}

Engine.prototype.initialize = function(id) {
    var canvas = document.getElementById(id);
    this.initGL(canvas);
    this.initSettings();
    this.initShaders();
    this.initBuffers();
    this.initTextures();
    var me = this;
    canvas.addEventListener('mousedown', function(evt) {
	evt.preventDefault();
	curX = evt.clientX + document.body.scrollLeft + document.documentElement.scrollLeft-canvas.offsetLeft; 
    	curY = evt.clientY + document.body.scrollTop + document.documentElement.scrollTop-canvas.offsetTop; 
	if(me.mouseDown != undefined) { me.mouseDown(curX,curY); }
    }, false);
    canvas.addEventListener('mouseup', function(evt) {
	evt.preventDefault();
	curX = evt.clientX + document.body.scrollLeft + document.documentElement.scrollLeft-canvas.offsetLeft; 
  	curY = evt.clientY + document.body.scrollTop + document.documentElement.scrollTop-canvas.offsetTop; 
	if(me.mouseUp != undefined) { me.mouseUp(curX,curY); }
    }, false);
    canvas.addEventListener('mousemove', function(evt) {
	evt.preventDefault();
	curX = evt.clientX + document.body.scrollLeft + document.documentElement.scrollLeft-canvas.offsetLeft; 
  	curY = evt.clientY + document.body.scrollTop + document.documentElement.scrollTop-canvas.offsetTop; 
	if(me.mouseMove != undefined) { me.mouseMove(curX,curY); }
    }, false);
    canvas.setAttribute('tabindex', '10000'); //need to be focusable to receive key events
    window.addEventListener('keydown', function(evt) {
	evt.preventDefault();
	var shiftPressed=evt.shiftKey;
   	var altPressed  =evt.altKey;
   	var ctrlPressed =evt.ctrlKey;
	if(me.keyDown != undefined) { me.keyDown(evt.keyCode,shiftPressed,altPressed,ctrlPressed); }
    }, false);	
    window.addEventListener('keyup', function(evt) {
	evt.preventDefault();
	var shiftPressed=evt.shiftKey;
   	var altPressed  =evt.altKey;
   	var ctrlPressed =evt.ctrlKey;
	if(me.keyUp != undefined) { me.keyUp(evt.keyCode,shiftPressed,altPressed,ctrlPressed); }
    }, false);	
}

Engine.prototype.initSettings = function() {
    this.gl.clearColor(0.0, 0.0, 0.0, 1.0);
    this.gl.clearDepth(1.0);
    this.gl.enable(this.gl.DEPTH_TEST);
    this.gl.depthFunc(this.gl.LEQUAL);
}

Engine.prototype.start = function(callback,fps) {
    setInterval(callback, 1000/fps);
}

Engine.prototype.initGL = function(canvas) {
    try {
      this.gl = canvas.getContext("experimental-webgl");
      this.gl.viewportWidth = canvas.width;
      this.gl.viewportHeight = canvas.height;
    } catch(e) {
    }
    if (!this.gl) {
      alert("Could not initialise WebGL, sorry :-(");
    }
  }
 

Engine.prototype.initShaders = function() {

}

Engine.prototype.initBuffers = function() {

}

Engine.prototype.initTextures = function() {

}

Engine.prototype.loadIdentity = function() {
    this.mvMatrix = Matrix.I(4);
  }
 
 
Engine.prototype.multMatrix = function(m) {
    this.mvMatrix = this.mvMatrix.x(m);
  }
 
Engine.prototype.mvScale = function(v) {
    var m = Matrix.I(4);
    m.elements[0][0] = v[0];
    m.elements[1][1] = v[1];
    m.elements[2][2] = v[2];
    m.elements[3][3] = v[3];
    this.multMatrix(m);
  }
 
Engine.prototype.mvTranslate = function(v) {
    var m = Matrix.Translation($V([v[0], v[1], v[2]])).ensure4x4();
    this.multMatrix(m);
  }
 
Engine.prototype.mvRotate = function(ang, v) {
    var m = Matrix.Rotation(Math.rad(ang), $V([v[0], v[1], v[2]])).ensure4x4();
    this.multMatrix(m);
}
 
Engine.prototype.perspective = function(fovy, aspect, znear, zfar) {
    this.pMatrix = makePerspective(fovy, aspect, znear, zfar);
  }

Engine.prototype.ortho = function(width,height) {
    this.pMatrix = makeOrtho(0,width,height,0,0,100);
}

Engine.prototype.run = function() {

}

Engine.prototype.getShader = function(id) {
    var shaderScript = document.getElementById(id);
    if (!shaderScript) {
      return null;
    }
 
    var str = "";
    var k = shaderScript.firstChild;
    while (k) {
      if (k.nodeType == 3) {
        str += k.textContent;
      }
      k = k.nextSibling;
    }
 
    var shader;
    if (shaderScript.type == "x-shader/x-fragment") {
      shader = this.gl.createShader(this.gl.FRAGMENT_SHADER);
    } else if (shaderScript.type == "x-shader/x-vertex") {
      shader = this.gl.createShader(this.gl.VERTEX_SHADER);
    } else {
      return null;
    }
 
    this.gl.shaderSource(shader, str);
    this.gl.compileShader(shader);
 
    if (!this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)) {
      alert(this.gl.getShaderInfoLog(shader));
      return null;
    }
 
    return shader;
  }
 
Engine.prototype.createShaderProgram = function(shaders) {
    var program = this.gl.createProgram();
    for(var i in shaders) {
      this.gl.attachShader(program, this.getShader(shaders[i]));
    }
    this.gl.linkProgram(program);
 
    if (!this.gl.getProgramParameter(program, this.gl.LINK_STATUS)) {
      alert("Could not initialise shaders");
    }
    return program;
}

Engine.prototype.createBuffer = function( array, itemSize, numItems ) {
    var buffer = this.gl.createBuffer();
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, buffer);
    this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(array), this.gl.STATIC_DRAW);
    buffer.itemSize = itemSize;
    buffer.numItems = numItems;
    return buffer;
} 

Engine.prototype.handleLoadedTexture = function(texture) {
    this.gl.bindTexture(this.gl.TEXTURE_2D, texture);
    this.gl.pixelStorei(this.gl.UNPACK_FLIP_Y_WEBGL, true);
    this.gl.texImage2D(this.gl.TEXTURE_2D, 0, this.gl.RGBA, this.gl.RGBA, this.gl.UNSIGNED_BYTE, texture.image);
    this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.gl.LINEAR);
    this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_S, this.gl.CLAMP_TO_EDGE);
    this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_T, this.gl.CLAMP_TO_EDGE);
    this.gl.bindTexture(this.gl.TEXTURE_2D, null);
  }

Engine.prototype.loadTexture = function(img) { 
    var texture = this.gl.createTexture();
    texture.image = img;
    this.handleLoadedTexture(texture)
    return texture
}


