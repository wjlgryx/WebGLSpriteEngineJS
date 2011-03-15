SpriteEngine = function() {
	this.shaderProgram = null;
	this.vMulColor = [1,1,1,1];
	this.identity();
}

SpriteEngine.prototype = new Engine();
SpriteEngine.prototype.constructor = SpriteEngine;

SpriteEngine.prototype.initSettings = function() {
    Engine.prototype.initSettings.call(this);
    this.gl.enable(this.gl.BLEND);
    this.gl.blendFunc(this.gl.SRC_ALPHA, this.gl.ONE);
    this.f32pMatrix = new Float32Array([1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]);
    this.f32mvMatrix = new Float32Array([1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]);
    this.f32mMulColor = new Float32Array([1,1,1,1]);
}

SpriteEngine.prototype.initShaders = function() {
    document.head.innerHTML += shaders.create_fragment_shader();
    document.head.innerHTML += shaders.create_vertex_shader();
    this.shaderProgram = this.createShaderProgram(["sprite-shader-fs","sprite-shader-vs"]);
    this.gl.useProgram(this.shaderProgram);
 
    this.shaderProgram.vertexPositionAttribute = this.gl.getAttribLocation(this.shaderProgram, "aVertexPosition");
    this.gl.enableVertexAttribArray(this.shaderProgram.vertexPositionAttribute);
    this.shaderProgram.vertexColorAttribute = this.gl.getAttribLocation(this.shaderProgram, "aVertexColor");
    this.gl.enableVertexAttribArray(this.shaderProgram.vertexColorAttribute);
    this.shaderProgram.textureCoordAttribute = this.gl.getAttribLocation(this.shaderProgram, "aTextureCoord");
    this.gl.enableVertexAttribArray(this.shaderProgram.textureCoordAttribute);

    this.shaderProgram.pMatrixUniform = this.gl.getUniformLocation(this.shaderProgram, "uPMatrix");
    this.shaderProgram.mvMatrixUniform = this.gl.getUniformLocation(this.shaderProgram, "uMVMatrix");
    this.shaderProgram.uSampler = this.gl.getUniformLocation(this.shaderProgram, "uSampler");
    this.shaderProgram.vMulColor = this.gl.getUniformLocation(this.shaderProgram, "vMulColor");
    this.shaderProgram.startS = this.gl.getUniformLocation(this.shaderProgram, "startS");
    this.shaderProgram.endS = this.gl.getUniformLocation(this.shaderProgram, "endS");
    this.shaderProgram.startT = this.gl.getUniformLocation(this.shaderProgram, "startT");
    this.shaderProgram.endT = this.gl.getUniformLocation(this.shaderProgram, "endT");
  }

SpriteEngine.prototype.setUniforms = function() {
    var pm = this.pMatrix.flatten();
    for(var i=0;i<16;i++) {
       this.f32pMatrix[i] = pm[i]; 
    }
    this.gl.uniformMatrix4fv(this.shaderProgram.pMatrixUniform, false, this.f32pMatrix );
    var mvm = this.mvMatrix.flatten();
    for(var i=0;i<16;i++) {
       this.f32mvMatrix[i] = mvm[i]; 
    }
    this.gl.uniformMatrix4fv(this.shaderProgram.mvMatrixUniform, false, this.f32mvMatrix);
    this.f32mMulColor[0] = this.vMulColor[0];
    this.f32mMulColor[1] = this.vMulColor[1];
    this.f32mMulColor[2] = this.vMulColor[2];
    this.f32mMulColor[3] = this.vMulColor[3];
    this.gl.uniform4fv(this.shaderProgram.vMulColor, this.f32mMulColor);
  } 

SpriteEngine.prototype.renderSprite = function(sprite,src_x,src_y,src_width,src_height) {
    var positionBuffer = sprite.positionBuffer;
    var colorBuffer = sprite.colorBuffer;
    var textureCoordBuffer = sprite.uvBuffer;
    var texture = sprite.texture;
    var w = texture.image.width;
    var h = texture.image.height;
    if( src_x == undefined ) {
        src_x = 0;
    }
    if( src_width == undefined ) {
        src_width = w;
    }
    if( src_y == undefined ) {
        src_y = 0;
    }
    if( src_height == undefined ) {
        src_height = h;
    }
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, positionBuffer);
    this.gl.vertexAttribPointer(this.shaderProgram.vertexPositionAttribute, positionBuffer.itemSize, this.gl.FLOAT, false, 0, 0);
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, colorBuffer);
    this.gl.vertexAttribPointer(this.shaderProgram.vertexColorAttribute, colorBuffer.itemSize, this.gl.FLOAT, false, 0, 0);
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, textureCoordBuffer);
    this.gl.vertexAttribPointer(this.shaderProgram.textureCoordAttribute, textureCoordBuffer.itemSize, this.gl.FLOAT, false, 0, 0);
    
    this.gl.activeTexture(this.gl.TEXTURE0);
    this.gl.bindTexture(this.gl.TEXTURE_2D, texture);
    this.gl.uniform1i(this.shaderProgram.samplerUniform, 0);
   
    this.setUniforms();

    this.gl.uniform1f(this.shaderProgram.startS, src_x/w );
    this.gl.uniform1f(this.shaderProgram.endS, src_width/w );
    this.gl.uniform1f(this.shaderProgram.startT, (h-(src_y+src_height))/h );
    this.gl.uniform1f(this.shaderProgram.endT, (src_height)/h );
 
    this.gl.drawArrays(this.gl.TRIANGLE_STRIP, 0, positionBuffer.numItems);
}

SpriteEngine.prototype.createSprite = function(img) {
    var vertices = [
         img.width, img.height, 0.0,
         0, img.height, 0.0,
         img.width, 0, 0.0,
         0, 0,  0.0
    ];
    var vertexPositionBuffer = this.createBuffer(vertices,3,4);
    
    var color = [
      1,1,1,1,
      1,1,1,1,
      1,1,1,1,
      1,1,1,1
    ];
    var vertexColorBuffer = this.createBuffer(color,4,4);
	
    var coords = [
         1,0,
	 0,0,
         1,1,
         0,1
    ];
    var textureCoordBuffer = this.createBuffer(coords,2,4);
    
    return {positionBuffer:vertexPositionBuffer, colorBuffer:vertexColorBuffer, uvBuffer:textureCoordBuffer, texture:this.loadTexture(img)};
}

SpriteEngine.prototype.drawSprite = function(sprite,x,y,angle,scale_x,scale_y,start_s,end_s,start_t,end_t) {
	var w = sprite.texture.image.width;
	var h = sprite.texture.image.height;
	if( angle == undefined ) angle = 0;
	if( scale_x == undefined ) scale_x = 1;
	if( scale_y == undefined ) scale_y = 1;
	if( start_s == undefined ) start_s = 0;
	if( end_s == undefined ) end_s = w;
	if( start_t == undefined ) start_t = 0;
	if( end_t == undefined ) end_t = h;
	
	var a = Math.rad(angle);	

	this.mvMatrix.elements[0][0] = scale_x*Math.cos(a);
	this.mvMatrix.elements[1][0] = Math.sin(a);
	this.mvMatrix.elements[2][0] = 0;
	this.mvMatrix.elements[3][0] = 0;

	this.mvMatrix.elements[0][1] = -Math.sin(a);
	this.mvMatrix.elements[1][1] = scale_y*Math.cos(a);
	this.mvMatrix.elements[2][1] = 0;
	this.mvMatrix.elements[3][1] = 0;

	this.mvMatrix.elements[0][2] = 0;
	this.mvMatrix.elements[1][2] = 0;
	this.mvMatrix.elements[2][2] = 1;
	this.mvMatrix.elements[3][2] = 0;

	this.mvMatrix.elements[0][3] = x;
	this.mvMatrix.elements[1][3] = y;
	this.mvMatrix.elements[2][3] = 0;
	this.mvMatrix.elements[3][3] = 1;

    	engine.renderSprite(sprite,start_s,start_t,end_s,end_t);
}

SpriteEngine.prototype.drawSpriteCentered = function(sprite,x,y,angle,scale_x,scale_y,start_s,end_s,start_t,end_t) {
	var w = sprite.texture.image.width;
	var h = sprite.texture.image.height;
	if( angle == undefined ) angle = 0;
	if( scale_x == undefined ) scale_x = 1;
	if( scale_y == undefined ) scale_y = 1;
	if( start_s == undefined ) start_s = 0;
	if( end_s == undefined ) end_s = w;
	if( start_t == undefined ) start_t = 0;
	if( end_t == undefined ) end_t = h;
	
	var a = Math.rad(angle);	

	this.mvMatrix.elements[0][0] = scale_x*Math.cos(a);
	this.mvMatrix.elements[1][0] = Math.sin(a);
	this.mvMatrix.elements[2][0] = 0;
	this.mvMatrix.elements[3][0] = 0;

	this.mvMatrix.elements[0][1] = -Math.sin(a);
	this.mvMatrix.elements[1][1] = scale_y*Math.cos(a);
	this.mvMatrix.elements[2][1] = 0;
	this.mvMatrix.elements[3][1] = 0;

	this.mvMatrix.elements[0][2] = 0;
	this.mvMatrix.elements[1][2] = 0;
	this.mvMatrix.elements[2][2] = 1;
	this.mvMatrix.elements[3][2] = 0;

	this.mvMatrix.elements[0][3] = x-w/2;
	this.mvMatrix.elements[1][3] = y-h/2;
	this.mvMatrix.elements[2][3] = 0;
	this.mvMatrix.elements[3][3] = 1;

    	engine.renderSprite(sprite,start_s,start_t,end_s,end_t);
}

SpriteEngine.prototype.scale = function(x,y) {
	this.mvScale([x,y,1,1]);
}

SpriteEngine.prototype.move = function(x,y) {
	this.mvTranslate([x,y,0]);
}

SpriteEngine.prototype.rotate = function(deg) {
	this.mvRotate(deg,[0,0,1]);
}

SpriteEngine.prototype.identity = function() {
	this.loadIdentity();
}

SpriteEngine.prototype.setTint = function(r,g,b) {
	this.vMulColor = [r,g,b,this.vMulColor[3]];
}

SpriteEngine.prototype.setAlpha = function(a) {
	this.vMulColor = [this.vMulColor[0],this.vMulColor[1],this.vMulColor[2],a];
}

SpriteEngine.prototype.clear = function(r,g,b) {
	if( r != undefined ) {
		this.gl.clearColor(r,g,b,1.0);
	}
    	this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
}

SpriteEngine.prototype.setView = function(x, y, width, height) {
    this.gl.viewport(0, 0, this.gl.viewportWidth, this.gl.viewportHeight);
    this.ortho(this.gl.viewportWidth,this.gl.viewportHeight);
}

SpriteEngine.prototype.height = function() {
    return this.gl.viewportHeight;
}
SpriteEngine.prototype.width = function() {
    return this.gl.viewportWidth;
}
