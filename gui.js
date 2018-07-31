function Hamburger() {
    this.sprite = new PIXI.Sprite(hamburgerText);
    if (isTouchDevice) {
        this.sprite.width = this.sprite.height = hamburgerWidth;
    } else {
        this.sprite.width = this.sprite.height = hamburgerWidth/2;
    }
    this.sprite.x = this.sprite.y = 0;
    this.sprite.tint = "0x999999";
    this.sprite.alpha = 0.5;

    this.touchAction = function() {

    }
    this.liftAction = function() {

    }
    this.sprite.on("touchstart",this.touchAction);
    this.sprite.on("touchendoutside",this.liftAction);
    this.sprite.on("mousedown",this.touchAction);
    this.sprite.on("mouseupoutside",this.liftAction);

    stage.addChild(this.sprite);
}
function ClearButton() {
    this.sprite = new PIXI.Sprite(pixelText);
    this.sprite.width = hamburgerWidth*1.5;
    if (!isTouchDevice) {
        this.sprite.width *= 0.75;
    }
    this.sprite.alpha = 0;
    this.textStyle = {
        fontFamily : 'Helvetica',
		fontSize : (hamburgerWidth/3) + 'px',
        fill : '#eeeeee',
        stroke : "#555555",
        strokeThickness : 2
    };
    this.text1 = new PIXI.Text("CLEAR",this.textStyle);
    this.text1.anchor.x = 0.5;
    this.text1.ratio = this.text1.width/this.text1.height;
    this.text1.width = this.sprite.width*0.65;
    this.text1.height = this.text1.width/this.text1.ratio;
    this.sprite.height = (this.text1.height)*1.1;
    this.sprite.x = currentSize.x-this.sprite.width;
    this.sprite.y = 0;
    this.text1.x = this.sprite.x+(this.sprite.width/2);
    this.text1.y = this.sprite.height*0.1;
    this.sprite.interactive = true;
    this.text1.interactive = true;
    this.touchAction = function() {
        
        // justCleared = true;
    }
    this.liftAction = function() {
        resetBoard();
        // justCleared = false;
    }
    this.sprite.on("touchstart",this.touchAction);
    this.sprite.on("touchendoutside",this.liftAction);
    this.sprite.on("touchend",this.liftAction);
    this.sprite.on("mousedown",this.touchAction);
    this.sprite.on("mouseupoutside",this.liftAction);
    this.sprite.on("mouseup",this.liftAction);

    this.text1.on("touchstart",this.touchAction);
    this.text1.on("touchendoutside",this.liftAction);
    this.text1.on("touchend",this.liftAction);
    this.text1.on("mousedown",this.touchAction);
    this.text1.on("mouseupoutside",this.liftAction);
    this.text1.on("mouseup",this.liftAction);
    this.text1.alpha = 0.75


    stage.addChild(this.sprite);
    stage.addChild(this.text1);

}
function TextLine(button,contents) {
    this.text = new PIXI.Text(contents,textStyle);
    var WHRatio = this.text.height/this.text.width;
    this.text.height = button.sprite.height*0.8;
    this.text.width = this.text.height/WHRatio;
    this.text.ownButton = button;
    this.text.x = menubg.x+hamburgerWidth/2;
    this.text.y = button.sprite.y+(button.sprite.height/2)-(this.text.height/2);

    this.text.interactive = true;
    this.text.on("touchstart",function() {
        this.ownButton.sprite.toggle();
    });
    this.text.on("mousedown",function() {
        this.ownButton.sprite.toggle();
    });
    menuContainer.addChild(this.text);
}

function Scrollbar(scrollObject) {
    this.groove = new PIXI.Sprite(pixelText);
    this.slider = new PIXI.Sprite(pixelText);
    this.groove.tint = 0x3b3b3b;
    this.slider.tint = 0x777777;
    this.groove.x = scrollObject.x+scrollObject.width;
    this.groove.y = scrollObject.y;
    this.groove.width = menubg.width*scrollbarWidth;
    this.groove.height = scrollObject.height;
    this.slider.padding = this.groove.width*0.1;
    this.slider.width = this.groove.width-(this.slider.padding*2);

    this.slider.x = this.groove.x+this.slider.padding;
    this.slider.y = this.slider.homeSpot = this.groove.y+this.slider.padding;

    this.slider.grabbed = false;
    this.slider.interactive = true;

    this.slider.on("touchstart",function(){
        this.grabbed = true;
    })
    this.slider.on("touchend",function(){
        this.grabbed = false;
    })
    this.slider.on("touchendoutside",function(){
        this.grabbed = false;
    })
    this.slider.on("mousedown",function(){
        this.grabbed = true;
    })
    this.slider.on("mouseup",function(){
        this.grabbed = false;
    })
    this.slider.on("mouseupoutside",function(){
        this.grabbed = false;
    })
    menuContainer.addChild(this.groove);
    menuContainer.addChild(this.slider);
    var maskToMenuRatio = visibleMenuArea/totalMenuHeight;
    if (totalMenuHeight > visibleMenuArea) {
        this.slider.height = (visibleMenuArea-(this.slider.padding*2))*maskToMenuRatio;
    } else {
        this.slider.visible = false;
    }
    this.slider.endSpot = scrollObject.y+scrollObject.height-this.slider.height-this.slider.padding;



}
function Legend(contents,relatedObject) {
    this.textHeight = (hamburgerWidth/2)*0.6;
    this.textStyle = {
        fontFamily : 'Helvetica',
		fontSize : this.textHeight + 'px',
        fill : '#eeeeee',
    };
    this.text = new PIXI.Text(contents,this.textStyle);
    if (nightMode && (contents === "TILE COLOR" || contents === "HIGHLIGHT COLOR")) {
        this.text.alpha = 0.25;
    }
    this.text.relatedObject = relatedObject;
    this.text.anchor.y = 0.5;
    this.text.x = menubg.x+hamburgerWidth/2;
    this.text.y = this.text.relatedObject.sprite.y;
    this.text.interactive = true;

    this.text.on("touchstart",function() {
//        this.relatedObject.sprite.toggle();
        menubg.grabbed = true;
    })
    this.text.on("mousedown",function() {
        menubg.grabbed = true;
//        this.relatedObject.sprite.toggle();
    })

    menuContents.addChild(this.text);

}
function coloredButton(selected,sizeX,sizeY,posX,posY,effect){
    this.sprite = new PIXI.Sprite(pixelText);
    this.sprite.width = sizeX;
    this.sprite.height = sizeY;
    this.sprite.anchor.set(0.5);
    this.sprite.x = posX;
    this.sprite.y = posY;
    this.sprite.interactive = true;
    this.sprite.buttonMode = true;
    this.sprite.ownButton = this;
    this.sprite.tint = selected;
    if (nightMode) {
        this.sprite.alpha = 0.25;
    }
    this.sprite.on("touchstart",function() {
        this.toggle();
    });
    this.sprite.on("mousedown",function() {
        this.toggle();
    });
    this.sprite.toggle = function() {
        if (this.alpha === 1) {
            effect();
        }
    }
    menuContents.addChild(this.sprite);
}
function toggleInverted() {
    if (!inverted) {
        document.body.style.filter = "invert(100%)"
        inverted = true
    } else {
        document.body.style.filter = "invert(0%)"
        inverted = false
    }
}
function OnOffButton(buttonOn,sizeX,sizeY,posX,posY,effect){
    this.sprite = new PIXI.Sprite(tileText);
    this.sprite.width = sizeX;
    this.sprite.height = sizeY;
    this.sprite.anchor.x = this.sprite.anchor.y = 0.5;
    this.sprite.x = posX;
    this.sprite.y = posY;
    this.sprite.interactive = true;
    this.sprite.buttonMode = true;
    this.sprite.ownButton = this;
    this.textHeight = sizeY*0.7;
    this.textStyle = {
        fontFamily : 'Helvetica',
		fontSize : this.textHeight + 'px',
        fill : '#eeeeee',
//        stroke : "#555555",
//        strokeThickness : 2
    };
    if (buttonOn) {
        this.sprite.tint = buttonOnColor;
        this.label = new PIXI.Text("ON",this.textStyle);
        this.sprite.scale.x *= -1;
        this.sprite.scale.y *= -1;
    } else {
        this.sprite.tint = buttonOffColor;
        this.label = new PIXI.Text("OFF",this.textStyle);
    }
    this.label.anchor.x = this.label.anchor.y = 0.5;
    this.label.x = this.sprite.x;
    this.label.y = this.sprite.y;
    this.label.ownButton = this;
    this.label.interactive = true;
    this.label.buttonMode = true;

    this.sprite.on("touchstart",function() {
        this.toggle();
    });
    this.sprite.on("mousedown",function() {
        this.toggle();
    });
    this.label.on("touchstart",function() {
        this.ownButton.sprite.toggle();

    });
    this.label.on("mousedown",function() {
        this.ownButton.sprite.toggle();
    });

    this.sprite.toggle = function() {
        if (this.alpha == 1) {
            if (this.tint == buttonOnColor) {
                this.tint = buttonOffColor;
                this.ownButton.label.text = "OFF";
            } else if (this.tint == buttonOffColor) {
                this.tint = buttonOnColor;
                this.ownButton.label.text = "ON";

            }
            this.scale.x *= -1;
            this.scale.y *= -1;
            effect();
        }
    }

    menuContents.addChild(this.sprite);
    menuContents.addChild(this.label);
}
function TextSwitchButton(selected,sizeX,sizeY,posX,posY,selectArray,effect){
    this.selection = selectArray;
    this.sprite = new PIXI.Sprite(pixelText);
    this.sprite.width = sizeX;
    this.sprite.height = sizeY;
    this.sprite.anchor.x = this.sprite.anchor.y = 0.5;
    this.sprite.x = posX;
    this.sprite.y = posY;
    this.sprite.tint = "0x444444";
    this.sprite.interactive = true;
    this.sprite.buttonMode = true;
    this.sprite.ownButton = this;
    this.textHeight = sizeY*0.6;
    this.textStyle = {
        fontFamily : 'Helvetica',
		fontSize : this.textHeight + 'px',
        fill : '#eeeeee',
    };
    this.label = new PIXI.Text(selected,this.textStyle);
    this.label.anchor.x = this.label.anchor.y = 0.5;
    this.label.x = this.sprite.x;
    this.label.y = this.sprite.y;
    this.label.ownButton = this;
    this.label.interactive = true;
    this.label.buttonMode = true;

    this.sprite.on("touchstart",function() {
        this.toggle();
    });
    this.sprite.on("mousedown",function() {
        this.toggle();
    });
    this.label.on("touchstart",function() {
        this.ownButton.sprite.toggle();

    });
    this.label.on("mousedown",function() {
        this.ownButton.sprite.toggle();
    });

    this.sprite.toggle = function() {
        effect();
    }

    menuContents.addChild(this.sprite);
    menuContents.addChild(this.label);
}
function NumberToggleButton(selected,sizeX,sizeY,posX,posY,varAdjusted){
    this.sprite = new PIXI.Sprite(pixelText);
    this.sprite.width = sizeX;
    this.sprite.height = sizeY;
    this.sprite.anchor.x = this.sprite.anchor.y = 0.5;
    this.sprite.x = posX;
    this.sprite.y = posY;
    this.sprite.tint = "0x444444";
    this.sprite.interactive = true;
    this.textHeight = sizeY*0.6;
    this.textStyle = {
        fontFamily : 'Helvetica',
		fontSize : this.textHeight + 'px',
        fill : '#eeeeee',
    };
    this.label = new PIXI.Text(selected,this.textStyle);
    this.label.anchor.x = this.label.anchor.y = 0.5;
    this.label.x = this.sprite.x;
    this.label.y = this.sprite.y;

    this.leftArrow = new PIXI.Sprite(arrowText)
    this.rightArrow = new PIXI.Sprite(arrowText)
    this.leftArrow.tint = this.rightArrow.tint = 0xdddddd
    this.leftArrow.anchor.x = this.leftArrow.anchor.y = 0.5;

    this.rightArrow.anchor.x = this.rightArrow.anchor.y = 0.5;
    this.leftArrow.width = this.rightArrow.width = this.sprite.width/4
    this.leftArrow.height = this.rightArrow.height = this.sprite.height*0.8
    this.rightArrow.scale.x *= -1
    
    this.leftArrow.x = this.sprite.x-(this.leftArrow.width*1.1)
    this.rightArrow.x = this.sprite.x+(this.leftArrow.width*1.1)
    this.leftArrow.y = this.rightArrow.y = this.sprite.y
    this.leftArrow.ownButton = this.rightArrow.ownButton = this
    this.leftArrow.interactive = this.rightArrow.interactive = this.leftArrow.buttonMode = this.rightArrow.buttonMode = true;

    this.leftArrow.on("touchstart",function() {
        this.tint = 0xffffff;
        if (ruleVariables[varAdjusted] > 1) {
            ruleVariables[varAdjusted]--
            this.ownButton.label.text = ruleVariables[varAdjusted]
            if (rulesButton.label.text !== "CUSTOM") {
                rulesButton.label.text = "CUSTOM";
            } 
        }
    });
    this.leftArrow.on("mousedown",function() {
        this.tint = 0xffffff;
        if (ruleVariables[varAdjusted] > 1) {
            ruleVariables[varAdjusted]--
            this.ownButton.label.text = ruleVariables[varAdjusted]
            if (rulesButton.label.text !== "CUSTOM") {
                rulesButton.label.text = "CUSTOM";
            } 
        }
    });
    this.rightArrow.on("touchstart",function() {
        this.tint = 0xffffff;
        if (ruleVariables[varAdjusted] < 8) {
            ruleVariables[varAdjusted]++
            this.ownButton.label.text = ruleVariables[varAdjusted]
            if (rulesButton.label.text !== "CUSTOM") {
                rulesButton.label.text = "CUSTOM";
            } 
        }
    });
    this.rightArrow.on("mousedown",function() {
        this.tint = 0xffffff;
        if (ruleVariables[varAdjusted] < 8) {
            ruleVariables[varAdjusted]++
            this.ownButton.label.text = ruleVariables[varAdjusted]
            if (rulesButton.label.text !== "CUSTOM") {
                rulesButton.label.text = "CUSTOM";
            } 
        }
    });
    this.leftArrow.on("touchend",function() {
        this.tint = 0xdddddd;
        
    });
    this.leftArrow.on("mouseup",function() {
        this.tint = 0xdddddd;
        
    });
    this.rightArrow.on("touchend",function() {
        this.tint = 0xdddddd;
        
    });
    this.rightArrow.on("mouseup",function() {
        this.tint = 0xdddddd;
        
    });
    menuContents.addChild(this.sprite);
    menuContents.addChild(this.leftArrow);
    menuContents.addChild(this.rightArrow);
    menuContents.addChild(this.label);
}
function ImageSelectButton(sizeX,sizeY,posX,posY,selectArray){
    this.selection = selectArray;
    this.sprite = new PIXI.Sprite(pixelText);
    this.sprite.width = sizeX;
    this.sprite.height = sizeY;
    this.sprite.anchor.x = this.sprite.anchor.y = 0.5;
    this.sprite.x = posX;
    this.sprite.y = posY;
    this.sprite.tint = "0x444444";

    this.sprite.ownButton = this;
    this.textHeight = sizeY*0.6;
    this.textStyle = {
        fontFamily : 'Helvetica',
		fontSize : this.textHeight + 'px',
        fill : '#eeeeee',
//        stroke : "#555555",
//        strokeThickness : 2
    };

    this.padding = 0.2;
    this.items = [];
    for (var t=0;t<this.selection.length;t++) {
        var thumb = new PIXI.Sprite(cellTextures[t]);
        thumb.anchor.x = 1;
        thumb.anchor.y = 0.5;
        thumb.height = thumb.width = this.sprite.height;
        thumb.y = this.sprite.y;
        var nextXPosition = menubg.x+menubg.width-hamburgerWidth/2-(t*thumb.width*this.padding)-(t*thumb.width);
        thumb.x = nextXPosition;
        thumb.ownButton = this;
        thumb.tint = tileColor;
        thumb.highlightAndSet = function() {
            cellText = this.texture;
            for (var i=0;i<this.ownButton.items.length;i++) {
                if (this.ownButton.items[i].texture == cellText) {
                    this.ownButton.items[i].alpha = 1;
                } else {
                    this.ownButton.items[i].alpha = 0.25;
                };
            }
            for (var u=0;u<tiles.length;u++) {
                if (tiles[u].sprite) {
                    tiles[u].sprite.texture = cellText;
                }
            }

        }
        thumb.on("touchstart",function(){
            this.highlightAndSet();
        })
        thumb.on("mousedown",function(){
            this.highlightAndSet();
        })
        if (thumb.texture == cellText) {
            thumb.alpha = 1;
        } else {
            thumb.alpha = 0.25;
        };
        thumb.interactive = thumb.buttonMode = true;
        this.items.push(thumb);
        menuContents.addChild(thumb);
    }
    this.sprite.alpha = 0;
}