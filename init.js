fullScreen = false;
FRAMERATE = 60;
isTouchDevice = 'ontouchstart' in document.documentElement;
timeSinceLastDrawn = undefined;
origX = window.innerWidth;
origY = window.innerHeight;
origScreenX = window.outerWidth;
origScreenY = window.outerHeight;
currentSize = {x:origX,y:origY}
lastSimStepTime = Date.now();
simRate = 60;
nightMode = false;
bgColor = 0x000000;
paintMode = false;
simulationRunning = true;
paintbrushSize = 2;
cellSizes = ["TINY","SMALL","MEDIUM","LARGE","HUGE"];
cellSize = "MEDIUM";
rulesList = ["CONWAY","HIGHLIFE","34 LIFE","CUSTOM"];
rules = "HIGHLIFE";
resetOnMenuExit = false;
justCleared = false;
startedAt = scrolledUp = scrolledDown = undefined;
touchedHamburger = -1;
doubleTapped = -1;
lastDoubleTapPosition = undefined;
shiftPoint = undefined;
shifting = false;
ruleVariables = {
    "comeToLifeIfEqual" : 3,
    "comeToLifeIfEqual2" : 6,
    "dieIfUnder" : 2,
    "dieIfOver" : 3
}
comeToLifeIfEqual = 3;
comeToLifeIfEqual2 = 6;
dieIfUnder = 2;
dieIfOver = 3;
inverted = false

function createMenuItems() {
    highlightButton = new OnOffButton(highlightLivingCells,hamburgerWidth,hamburgerWidth/2,menubg.x+menubg.width-hamburgerWidth,menubg.y+hamburgerWidth*0.75,toggleHighlight);
    highlightButtonLegend = new Legend("HIGHLIGHT ACTIVE",highlightButton);
    fullscreenButton = new OnOffButton(inverted,hamburgerWidth,hamburgerWidth/2,menubg.x+menubg.width-hamburgerWidth,menubg.y+hamburgerWidth*1.5,toggleInverted);
    fullscreenButtonLegend = new Legend("INVERT COLORS",fullscreenButton);
    wobbleButton = new OnOffButton(wobbling,hamburgerWidth,hamburgerWidth/2,menubg.x+menubg.width-hamburgerWidth,menubg.y+hamburgerWidth*2.25,toggleWobble);
    wobbleButtonLegend = new Legend("WOBBLE",wobbleButton);
    colorButton = new coloredButton(tileColor,hamburgerWidth*1.5,hamburgerWidth/2,menubg.x+menubg.width-hamburgerWidth*1.25,menubg.y+hamburgerWidth*3.5,toggleTileColor);
    colorButtonLegend = new Legend("CELL COLOR",colorButton);
    highlightColorButton = new coloredButton(liveColor,hamburgerWidth*1.5,hamburgerWidth/2,menubg.x+menubg.width-hamburgerWidth*1.25,menubg.y+hamburgerWidth*4.25,toggleHighlightColor);
    highlightColorButtonLegend = new Legend("ACTIVE COLOR",highlightColorButton);
    cellSizeButton = new TextSwitchButton(cellSize,hamburgerWidth*2,hamburgerWidth/2,menubg.x+menubg.width-hamburgerWidth*1.5,menubg.y+hamburgerWidth*5.5,cellSizes,changeCellSize);
    cellSizeButtonLegend = new Legend("CELL SIZE",cellSizeButton);
    cellStyleButton = new ImageSelectButton(hamburgerWidth*2,hamburgerWidth/2,menubg.x+menubg.width-hamburgerWidth*1.5,menubg.y+hamburgerWidth*6.25,cellTextures);
    cellStyleButtonLegend = new Legend("CELL STYLE",cellStyleButton);
//    ceilingHeightButton = new TextSwitchButton(alphaLimit-2,hamburgerWidth*2,hamburgerWidth/2,menubg.x+menubg.width-hamburgerWidth*1.5,menubg.y+hamburgerWidth*7.5,cellSizes,changeCeilingHeight);
//    ceilingHeightButtonLegend = new Legend("CEILING",ceilingHeightButton);
    rulesButton = new TextSwitchButton(rules,hamburgerWidth*2,hamburgerWidth/2,menubg.x+menubg.width-hamburgerWidth*1.5,menubg.y+hamburgerWidth*7.5,cellSizes,toggleRules);
    rulesButtonLegend = new Legend("RULES",rulesButton);
    
    dieLessThanButton = new NumberToggleButton(dieIfUnder,hamburgerWidth*2,hamburgerWidth/2,menubg.x+menubg.width-hamburgerWidth*1.5,menubg.y+hamburgerWidth*8.25,"dieIfUnder");
    dieLessThanLegend = new Legend("DIE  <",dieLessThanButton);

    dieGreaterThanButton = new NumberToggleButton(dieIfOver,hamburgerWidth*2,hamburgerWidth/2,menubg.x+menubg.width-hamburgerWidth*1.5,menubg.y+hamburgerWidth*9,"dieIfOver");
    dieGreaterThanLegend = new Legend("DIE  >",dieGreaterThanButton);
    bornIf1Button = new NumberToggleButton(comeToLifeIfEqual,hamburgerWidth*2,hamburgerWidth/2,menubg.x+menubg.width-hamburgerWidth*1.5,menubg.y+hamburgerWidth*9.75,"comeToLifeIfEqual");
    bornIf1Legend = new Legend("BORN  =",bornIf1Button);
    bornIf2Button = new NumberToggleButton(comeToLifeIfEqual2,hamburgerWidth*2,hamburgerWidth/2,menubg.x+menubg.width-hamburgerWidth*1.5,menubg.y+hamburgerWidth*10.5,"comeToLifeIfEqual2");
    bornIf2Legend = new Legend("BORN  =",bornIf2Button);
    if (window.innerWidth === longerDimension) {
        totalMenuHeight = hamburgerWidth*20;
    } else {
        totalMenuHeight = bornIf2Button.sprite.y+bornIf2Button.sprite.height+(hamburgerWidth)-(menubg.y*2);
    }

};
hexDigits = ["0","1","2","3","4","5","6","7","8","9","a","b","c","d","e","f"]
directions = ["north","east","south","west"];
menuOn = false;
scrollbarWidth = 0.12;
buttonOnColor = 0x22ff22;
buttonOffColor = 0x991111;
tileColors = ["0xffffff","0x222222","0xff0000","0x00ff00","0x0000ff","0xaa00ee","0x00ffff"];
//tileColor = "0x00ff00";
//liveColor = "0xff0000";
if (randomInt(0,1)) {
    tileColor = "0x00ff00"
} else {
    tileColor = "0x0000ff"
}

liveColor = "0xff0000"

// liveColor = tileColors[randomInt(0,tileColors.length-1)];

liveAlpha = 1;

highlightLivingCells = true

wobbling = true;
wobbleDirection = "north";

spritesGenerated = 0;

RMBDown = false;
counter = 0;
touchingAtLastFrame = undefined;
cursorX = undefined;
cursorY = undefined;

LMBDown = RMBDown = false;

pixelText = PIXI.Texture.fromImage("assets/pixel.bmp");
tileText = PIXI.Texture.fromImage("assets/pixel.bmp");
// tileText = PIXI.Texture.fromImage("assets/tile.png");
sphereText = PIXI.Texture.fromImage("assets/spheregap.png");
sawText = PIXI.Texture.fromImage("assets/saw2.png");
squareText = PIXI.Texture.fromImage("assets/square.png");
ringText = PIXI.Texture.fromImage("assets/ring.png");
chickenText = PIXI.Texture.fromImage("assets/chicken.png");
rainbowText = PIXI.Texture.fromImage("assets/rainbowbar.png");
arrowText = PIXI.Texture.fromImage("assets/arrow.png");

hamburgerText = PIXI.Texture.fromImage("assets/hamburger.png");


cellTextures = [tileText,sphereText,sawText,ringText]

cellText = sawText;
//cellText = cellTextures[randomInt(0,cellTextures.length-1)];

touches = [];
fingerOnScreen = false;
touchingAt = undefined;
alphaLimit = 3.5;

wobbleAmount = 2.2-alphaLimit*0.5;
//alphaIncrement = 0.002/alphaLimit;
alphaIncrement = 0.004/alphaLimit;

wobbleSpeed = 18;
colorChanged = undefined;
cycleComponents = ["g","r","b"];
beganCycle = 0;
cycleComponentIndex = 0;
cycleDirection = undefined;
cycleFinished = undefined;
rainbowMode = false;

function init(skipIntro) {

    lastDrawn = Date.now();
    lastUpdated = Date.now();

    if (nightMode) {
        bgColor = 0x222222;
    }

    sizeStage(currentSize.x,currentSize.y);
    createSkeleton();

    menuYSpace = hamburgerWidth/2;
    menubg.width = currentSize.x-hamburgerWidth*2;
    menubg.height = currentSize.y-hamburgerWidth;
    if (menubg.width > menubg.height) {
        menubg.width = menubg.height
    };
    menubg.x = (currentSize.x/2)-(menubg.width/2);
    menubg.y = (currentSize.y/2)-(menubg.height/2);
    menubg.tint = "0x555555";

    // add scrollbar

    menubg.width *= (1-scrollbarWidth);
    menuMask = new PIXI.Graphics();
    menuMask.beginFill(0xFF700B, 4);
    menuMask.drawRect(menubg.x,menubg.y,menubg.width,menubg.height)
//    menuMask.lineStyle(2);

    visibleMenuArea = menubg.height;

    menubg.grabbed = false;
    menubg.interactive = true;
    menubg.on("pointerdown",function(){
        menubg.grabbed = true;
    })
    menubg.on("pointerup",function(){
        menubg.grabbed = false;
    })
    menubg.on("pointerupoutside",function(){
        menubg.grabbed = false;
    })
    // menubg.on("mousedown",function(){
    //     menubg.grabbed = true;
    // })
    // menubg.on("mouseup",function(){
    //     menubg.grabbed = false;
    // })
    // menubg.on("mouseupoutside",function(){
    //     menubg.grabbed = false;
    // })

    container.addChild(menuMask);
    menuContents.mask = menuMask;

//    shadow = new PIXI.filters.DropShadowFilter;
//    shadow.distance = 1;

//    container.filters = [shadow];

    clearButton = new ClearButton();
    createMenuItems();
    menubg.scrollbar = new Scrollbar(menubg);

    introStyle = {
        fontFamily : 'Helvetica',
		fontSize : (hamburgerWidth/2) + 'px',
        fill : '#bfbfbf',
        wordWrap : true,
        wordWrapWidth : menubg.width,
        align : "center"
    };
    introContainer = new PIXI.Container();
    if (isTouchDevice) {
        var instructionString = "Swipe to start\n \nTwo fingers to shift view"
    } else {
        var instructionString = "Drag to start\n \nRight click to shift view"
    }
    introContainer.instructions = new PIXI.Text(instructionString,introStyle);
    introContainer.instructions.anchor.set(0.5);
    introContainer.instructions.x = currentSize.x/2;
    introContainer.instructions.y = currentSize.y/2;
    if (skipIntro) {
        introContainer.alpha = 0;
    }
    introContainer.addChild(introContainer.instructions);
    stage.addChild(introContainer);

    stage.onDragStart = function(event)
    {
        var e = event || window.event;
        this.data = e.data;
        if (this.data.originalEvent.button === 2) {
            RMBDown = true;
        }
        var touch = {
            id: this.data.identifier || 0,
            pos: this.data.getLocalPosition(this)
        };
        if (touches.length < 2 && touches.indexOf(touch) === -1) {
            touches.push(touch);
        }
        // console.log(this.data.getLocalPosition(this).x + " POS")
        if (RMBDown || touches.length === 2) {
            shifting = true;
//            doubleTapped = counter;
            lastDoubleTapPosition = touch.pos;
            snapHome();
        } else {
//            cursorPosition = touch.pos;
        }
        if (touch.pos.x < hamburgerWidth && touch.pos.y < hamburgerWidth) {
            touchedHamburger = counter;
            toggleMenu();
            justCleared = true;
        } else {
            fingerOnScreen = true;
            if (!startedAt) {
                startedAt = counter;
            }
        }
    }
    stage.onDragMove = function(event)
    {
        var e = event || window.event;
        this.data = e.data;
        for (var i = 0; i < touches.length; i++) {
            if(touches[i].id === (this.data.identifier || 0)) {
                touches[i].pos = this.data.getLocalPosition(this);
            }
        };
    }
    stage.onDragEnd = function (event)
    {
        var e = event || window.event;
        this.data = e.data;
        for (var i = 0; i < touches.length; i++) {
            if(touches[i].id === (this.data.identifier || 0)) {
                if (touches[i].pos.x < hamburgerWidth && touches[i].pos.y < hamburgerWidth) {
                    justCleared = false;
                }
                touches.splice(i,1);
            }
        };
        if (touches.length <= 1) {
            if (shifting) {
                shifting = false;
                snapHome();
            }
        }
        if (touches.length === 0) {
            fingerOnScreen = false;
            touchingAtLastFrame = undefined;
        }
        if (RMBDown) {
            RMBDown = false;
            fingerOnScreen = false;
        }
    }

    stage.on("pointerdown",stage.onDragStart);
    stage.on("pointermove",stage.onDragMove);
    stage.on("pointerup",stage.onDragEnd);
    stage.on("pointerupoutside",stage.onDragEnd);

    function wheelHandler(event) {
        if (event.deltaY > 0) {
            scrolledUp = counter;
        } else {
            scrolledDown = counter;
        }
    }
    document.addEventListener("wheel", wheelHandler, false);
    new Hamburger();
    bg.alpha = 0;
    // bg.tint =0xffffff;

    update();
};