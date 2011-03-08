FontRenderer = function(engine,src) {
	this.engine = engine;
	this.font = new Image()
	this.font_data = [];
	this.loaded = false;
	this.sprite = null;
	var me = this;
	this.font.onload = function() {
		me.sprite = engine.createSprite(me.font);
		var canvas = document.createElement('canvas');
		canvas.width = me.font.width;
		canvas.height = me.font.height;
		var ctx = canvas.getContext('2d');	
		ctx.drawImage(me.font,0,0);
		var n = (126-32)*2; //twice the number of letters we render
		var imgd = ctx.getImageData(0,0, n, 1);
		var pix = imgd.data;
	
		for(var i = 0; i <n; i++ ) {
			me.font_data.push(pix[i*4+0]<<16|pix[i*4+1]<<8|pix[i*4+2]);
		}
		me.loaded = true;
	}
	this.font.src = src;	
}

FontRenderer.prototype.drawText = function(s,x,y) {
	if( !this.loaded ) {
		return;
	}
	var h = this.font.height-1; //account for data row
	for(var i = 0; i < s.length ; i++ ) {
		var c = s.charCodeAt(i)-32;	
		var sx = this.font_data[c*2];
		var w = this.font_data[(c*2)+1]-sx;
		this.renderCharacter(sx,1,w,h,x,y); //accoutn for data row
		x+=w;
	}
}
/*FontRenderer.prototype.getSprite = function(ctx,s) {
	var canvas = document.createElement('canvas');
	var finalWidth = 0;
	for(var i = 0; i < s.length ; i++ ) {
		var c = s.charCodeAt(i)-32;	
		var sx = this.font_data[c*2];
		var w = this.font_data[(c*2)+1]-sx;
		finalWidth += w;
	}
	var h = this.font.height-1; //account for data row
	canvas.width = finalWidth;
	canvas.height = h;
	var ctx = canvas.getContext('2d');
	ctx.fillStyle = "blue";
	ctx.fillRect(0,0,finalWidth,h);
	var dataUrl = canvas.toDataURL("image/png");
	var x=0;
	var y=0;
	for(var i = 0; i < s.length ; i++ ) {
		var c = s.charCodeAt(i)-32;	
		var sx = this.font_data[c*2];
		var w = this.font_data[(c*2)+1]-sx;
		ctx.drawImage(this.font,sx,1,w,h,x,y,w,h);
		x+=w;
	}
	dataUrl = canvas.toDataURL("image/png");

	var img = new Image();
	img.src = dataUrl;
	return img;
}
*/
FontRenderer.prototype.renderCharacter = function(sx,sy,w,h,x,y) {
	var sw = this.sprite.texture.image.width;
	var sh = this.sprite.texture.image.height;
	this.engine.drawSprite(this.sprite,x,y,0,w/sw,h/sh,sx,w,sy,h);
}


