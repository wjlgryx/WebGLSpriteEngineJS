MegaManExperiment = function() {
        this.megamanSprite = null;
}

MegaManExperiment.prototype = new SpriteEngine();
MegaManExperiment.prototype.constructor = MegaManExperiment;

MegaManExperiment.prototype.initBuffers = function() {
	this.megamanSprite = this.createSprite(150,150,[1,1,1,1],"megaman.png")
}

var i = 0
MegaManExperiment.prototype.run = function() {
    SpriteEngine.prototype.run.call(this);
    this.clear();
    this.reset();
    this.setTint((5+Math.sin(i/3)*50)/100.0,(50+Math.sin(i/25)*50)/100.0,(50+Math.sin(i/50)*50)/100.0);
    this.setAlpha((50+Math.sin(i/10)*50)/100.0);
    this.move(this.gl.viewportWidth/2.0-75, this.gl.viewportHeight/2.0-75);
    this.move(75,75);
    this.rotate(45+i);
    this.move(-75.0, -75.0);
    this.drawSprite(this.megamanSprite);

    i++;   
}
 

