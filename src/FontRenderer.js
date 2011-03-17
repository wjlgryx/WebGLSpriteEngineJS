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

FontRenderer.prototype.getStringDimensions = function(s) {
	var w = 0;
	for(var i = 0,len = s.length;i<len;i++ ) {
		var c = s.charCodeAt(i)-32;
		if( c >= 0 && c < this.font_data.length ) {
			w += this.font_data[(c*2)+1]-this.font_data[c*2];
		}			
	}
	return {width:w,height:this.font.height};
}

FontRenderer.prototype.renderCharacter = function(sx,sy,w,h,x,y) {
	var sw = this.sprite.texture.image.width;
	var sh = this.sprite.texture.image.height;
	this.engine.drawSprite(this.sprite,x,y,0,w/sw,h/sh,sx,w,sy,h);
}


