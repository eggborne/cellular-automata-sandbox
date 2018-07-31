function Tile(texture,posX,posY) {
    this.alive = false;
    this.active = false;
    this.hasSprite = false;
    this.changed = -1;
    this.lived = 0;
    this.hitBox = new PIXI.Rectangle(posX,posY,tileSize,tileSize);
    this.hitBox.interactive = true;
    this.neighbors = [];
    tiles.push(this);
};

Tile.prototype.isActive = function() {
    var active = false;
    if (counter === this.changed+1) {
        active = true;
    };
    if (this.neighbors) {
        for (var i=0; i<this.neighbors.length; i++) {
            if (this.neighbors[i] && counter == this.neighbors[i].changed+1) {
                active = true;
            };
        };
    };
    return active;
};

Tile.prototype.createSprite = function() {
    this.hasSprite = true;
    this.sprite = new PIXI.Sprite(cellText);
    // this.sprite.cacheAsBitmap = true
    this.sprite.width = this.sprite.height = tileSize;
    this.sprite.x = this.hitBox.x;
    this.sprite.y = this.hitBox.y;
    this.currentAlpha = this.sprite.alpha = 0.05;
    this.sprite.tint = this.origColor = tileColor;
    this.sprite.blendMode = PIXI.BLEND_MODES.SCREEN;
    container.addChild(this.sprite);
    spritesGenerated++
};

Tile.prototype.comeToLife = function(amount) {
    this.alive = true;
    this.lived++;
    if (!this.sprite) {
        this.createSprite();
    }
    if (highlightLivingCells) {
        if (nightMode) {
            this.sprite.tint = "0x333333";
        } else {
            this.sprite.tint = liveColor;
            this.sprite.alpha = liveAlpha;
        };
    };
    if (this.currentAlpha < alphaLimit) {
        var diff = alphaLimit-this.currentAlpha;
        this.currentAlpha += amount*diff*diff*diff*alphaIncrement;
//        this.currentAlpha += amount*(alphaLimit-this.currentAlpha)*(alphaLimit-this.currentAlpha)*(alphaLimit-this.currentAlpha)*alphaIncrement;

//        if (this.lived % 2 == 0) {
//            this.sprite.width += 0.01;
//            this.sprite.height += 0.01;
//        };
    }
//    container.removeChild(this.sprite);
//    container.addChild(this.sprite);
    this.changed = counter;
    this.activateArea();
}
Tile.prototype.die = function() {
    this.alive = false;
    if (this.currentAlpha < 1) {
        this.sprite.alpha = this.currentAlpha;
        this.origColor = lightenColor(this.origColor);

    } else {
        this.origColor = lightenColor(this.origColor);

    }
    this.sprite.tint = this.origColor;
    if (nightMode) {
        this.sprite.tint = "0x000000";
    }

    this.changed = counter;


}

Tile.prototype.beingTouched = function() {

    var touched = false;
//    for (var t=0;t<touches.length;t++) {
        if (this.hitBox.contains(touches[touches.length-1].pos.x,touches[touches.length-1].pos.y)) {
            touched = true;
        }
//    }
    return touched;
}

Tile.prototype.getNeighbors = function() {
    var index = tiles.indexOf(this);
    // top row
    this.neighbors.push(tiles[index-1-tilesPerRow]);
    this.neighbors.push(tiles[index-tilesPerRow]);
    this.neighbors.push(tiles[index+1-tilesPerRow]);
    // left and right
    this.neighbors.push(tiles[index-1]);
    this.neighbors.push(tiles[index+1]);
    // bottom row
    this.neighbors.push(tiles[index-1+tilesPerRow]);
    this.neighbors.push(tiles[index+tilesPerRow]);
    this.neighbors.push(tiles[index+1+tilesPerRow]);
    for (var n=0;n<this.neighbors.length;n++) {
        if (!this.neighbors[n]) {
            this.neighbors.splice(n,1);
        };
    }

}

Tile.prototype.activateArea = function() {
    this.active = true;
    for (var n=0;n<this.neighbors.length;n++) {
        if (this.neighbors[n] && !this.neighbors[n].active) {
            this.neighbors[n].active = true;
        };
    }
}

Tile.prototype.wakeRandomNeighbors = function(num) {
    for (var i=0;i<num;i++) {
        var rando = randomInt(0,this.neighbors.length-1);
        if (this.neighbors[rando] && !this.neighbors[rando].alive) {
            this.neighbors[rando].comeToLife(1);
        };
    };
}
Tile.prototype.wakeNeighbors = function(levels,amount) {
    for (var i=0;i<this.neighbors.length;i++) {
        if (this.neighbors[i] && !this.neighbors[i].alive) {
            this.neighbors[i].comeToLife(amount);
            if (levels === 2) {
                this.neighbors[i].wakeNeighbors(1,amount);
            }
        }
    };
}

Tile.prototype.liveNeighbors = function() {
    var alive = 0;
    for (var n=0;n<this.neighbors.length;n++) {
        if (clonedTileData[tiles.indexOf(this.neighbors[n])] && clonedTileData[tiles.indexOf(this.neighbors[n])]) {
            alive++
        };
    }
    return alive;
}
