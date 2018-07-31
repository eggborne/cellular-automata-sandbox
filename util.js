function resetBoard() {

    for (var t=0;t<tiles.length;t++) {
        var tile = tiles[t]
        if (tile.hasSprite) {
            // container.removeChild(tile.sprite)
            tile.lived = 0
            tile.currentAlpha = tile.sprite.alpha = 0;
            // tile.hasSprite = false
            tile.alive = false
            tile.changed = -1
        }
    }

    touches = [];
};
function randomInt(min,max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
};
function distanceFromABtoXY(a,b,x,y) {
    var distanceX = x-a;
    var distanceY = y-b;
    return Math.round( Math.sqrt( (distanceX*distanceX)+(distanceY*distanceY) ));
}
function pointAtAngle(x,y,angle,distance) {
    return {x:x+distance*Math.cos(angle),y:y+distance*Math.sin(angle)};
};

function angleOfPointABFromXY(a,b,x,y) {
    return Math.atan2(b-y,a-x)+(Math.PI/2);
};
function advanceTwoDigitHex(orig) {
    if (orig !== "ff") {
        var newArray = [orig.charAt(0),orig.charAt(1)];
        newArray[1] = hexDigits[hexDigits.indexOf(newArray[1])+1];
        if (!newArray[1]) {
            newArray[0] = hexDigits[hexDigits.indexOf(newArray[0])+1];
            if (!newArray[0]) {
                newArray[0] = "f";
                newArray[1] = "f";
            } else {
                newArray[1] = "0";
            }
        }
        return newArray.join("");
    } else { // if white
        return orig;
    }
}

function sizeStage(outerX,outerY) {
    switch (cellSize) {
        case "TINY":
            tilesPerShorterDimension = 84;
            break;
        case "SMALL":
            tilesPerShorterDimension = 56;
            break;
        case "MEDIUM":
            tilesPerShorterDimension = 36;
            break;
        case "LARGE":
            tilesPerShorterDimension = 24;
            break;
        case "HUGE":
            tilesPerShorterDimension = 16;
            break;
    }
    PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;
    PIXI.settings.RESOLUTION = window.devicePixelRatio
    renderer = PIXI.autoDetectRenderer({
        width: outerX,
        height: outerY,
        backgroundColor : bgColor,
        antialias: false,
        powerPreference: 'high-performance',
        roundPixels: true
    });
    // renderer.setBlendMode(2)
    renderer.plugins.interaction.interactionFrequency = 1;
    stage = new PIXI.Container();
    stage.interactive = true;
    bg = new PIXI.Sprite(pixelText);
    bg.alpha = 1;
    container = new PIXI.Container();
    menuContainer = new PIXI.Container();
//    menuContainer.visible = menuOn;
    menubg = new PIXI.Sprite(pixelText);
    menuContainer.alpha = 0;
    menuContents = new PIXI.Container();
    stage.addChild(bg);
    stage.addChild(container);
    stage.addChild(menuContainer);
    menuContainer.addChild(menubg);
    menuContainer.addChild(menuContents);
    menuContainer.visible = false;
    viewWidth = outerX;
    viewHeight = outerY;
    if (outerX >= outerY) {
        shorterDimension = outerY;
        longerDimension = outerX;
    } else {
        shorterDimension = outerX;
        longerDimension = outerY;
    }
    document.body.appendChild(renderer.view);
    stage.width = bg.width = outerX;
    stage.height = bg.height = outerY;
    hamburgerWidth = shorterDimension/8;
}
function toggleRules() {
    var currentIndex = rulesList.indexOf(rules);
    if (currentIndex < rulesList.length-1){
        rules = rulesList[currentIndex+1];
    } else {
        rules = rulesList[0];
    }
    if (rules === "CONWAY") {
        ruleVariables.comeToLifeIfEqual = 3;
        ruleVariables.comeToLifeIfEqual2 = 3;
        ruleVariables.dieIfUnder = 2;
        ruleVariables.dieIfOver = 3;
        rules = "CONWAY";
    } else if (rules === "HIGHLIFE") {
        ruleVariables.comeToLifeIfEqual = 3;
        ruleVariables.comeToLifeIfEqual2 = 6;
        ruleVariables.dieIfUnder = 2;
        ruleVariables.dieIfOver = 3;
        rules = "HIGHLIFE";
    } else if (rules === "34 LIFE") {
        ruleVariables.comeToLifeIfEqual = 3;
        ruleVariables.comeToLifeIfEqual2 = 4;
        ruleVariables.dieIfUnder = 3;
        ruleVariables.dieIfOver = 4;
        rules = "34 LIFE";
    } else if (rules === "CUSTOM") {

        rules = "CUSTOM";
    }
    bornIf1Button.label.text = ruleVariables.comeToLifeIfEqual;
    bornIf2Button.label.text = ruleVariables.comeToLifeIfEqual2;
    dieLessThanButton.label.text = ruleVariables.dieIfUnder;
    dieGreaterThanButton.label.text = ruleVariables.dieIfOver;
    rulesButton.label.text = rules;
}

function changeCeilingHeight() {
    if (alphaLimit < 5) {
        alphaLimit += 1;
    } else {
        alphaLimit = 3;
    }
    ceilingHeightButton.label.text = alphaLimit-2;
    resetOnMenuExit = true;
}
function changeCellSize() {
    var cellIndex = cellSizes.indexOf(cellSize);
    if (cellIndex < cellSizes.length-1) {
        cellSize = cellSizes[cellIndex+1];
    } else {
        cellSize = cellSizes[0];
    };
    cellSizeButton.label.text = cellSize;
    resetOnMenuExit = true;
}
function toggleNightMode() {
    nightMode ? nightMode = false : nightMode = true;
    if (nightMode) {
        nightModeButton.sprite.tint = buttonOnColor;
        colorButton.sprite.alpha = 0.25;
        colorButtonLegend.text.alpha = 0.25;
        highlightColorButton.sprite.alpha = 0.25;
        highlightColorButtonLegend.text.alpha = 0.25;
        container.filters = null;
    } else {
        nightModeButton.sprite.tint = buttonOffColor;
        colorButton.sprite.alpha = 1;
        colorButtonLegend.text.alpha = 1;
        highlightColorButton.sprite.alpha = 1;
        highlightColorButtonLegend.text.alpha = 1;
        container.filters = [shadow];
    }

//    resetBoard();
    resetOnMenuExit = true;
}
function toggleTileColor() {
    if (rainbowMode || tileColor === tileColors[tileColors.length-1]) {
        if (!rainbowMode) {
            rainbowMode = true;
            colorChanged = Date.now();
            colorButton.sprite.texture = rainbowText;
            tileColor = randomColor();
            colorButton.sprite.tint = 0xffffff;
            // for (var t=0;t<cellStyleButton.items.length;t++) {
            //     cellStyleButton.items[t].tint = tileColor;
            // }

        } else {
            rainbowMode = false;
            colorButton.sprite.texture = pixelText;
            tileColor = tileColors[0];
            colorButton.sprite.tint = tileColor;
            for (var t=0;t<cellStyleButton.items.length;t++) {
                cellStyleButton.items[t].tint = tileColor;
            }
        }

    } else if (tileColor !== tileColors[tileColors.length-1]) {
        tileColor = tileColors[tileColors.indexOf(tileColor)+1];
        colorButton.sprite.tint = tileColor;
        for (var t=0;t<cellStyleButton.items.length;t++) {
            cellStyleButton.items[t].tint = tileColor;
        }
    } else {
        tileColor = tileColors[0];
        colorButton.sprite.tint = tileColor;
        for (var t=0;t<cellStyleButton.items.length;t++) {
            cellStyleButton.items[t].tint = tileColor;
        }
    }
    for (var u=0;u<tiles.length;u++) {
        if (tiles[u].sprite) {
            tiles[u].origColor = tileColor;
        }
    }
}
function toggleMenu() {
    if (menuOn) {
//        container.filters = null;
        menuOn = false;

        if (resetOnMenuExit) {
            // resetBoard();
            document.body.removeChild(renderer.view);
            clearTimeout(game);
            var fullOnExit = fullScreen
            init(true);
            if (fullOnExit) {
                setTimeout(function(){
                    fullscreen()
                    fullScreen = true;
                },500)

            }
            resetOnMenuExit = false;
        }
//        simulationRunning = true;
    } else {
//        container.filters = [blurFilter];
        menuOn = true;
//        menuContainer.visible = true;

//        simulationRunning = false;
        if (introContainer.visible) {
            introContainer.visible = false;
        }
    }

}
function toggleWobble() {
    if (wobbling) {
        wobbling = false;
        snapHome();
    } else {
        wobbling = true;

    }

}
function toggleHighlight() {
    if (highlightLivingCells) {
        highlightLivingCells = false;
        for (var i=0;i<tiles.length;i++) {
            if (tiles[i].sprite && tiles[i].sprite.tint == liveColor) {
                tiles[i].sprite.tint = tileColor;
                if (tiles[i].currentAlpha < 1) {
                    tiles[i].sprite.alpha = tiles[i].currentAlpha;
                };
            }
        }
    } else {
        highlightLivingCells = true;
    }
}


function toggleHighlightColor() {
    highlightColorButton.sprite.tint = liveColor;
    if (liveColor !== tileColors[tileColors.length-1]) {
        liveColor = tileColors[tileColors.indexOf(liveColor)+1];
    } else {
        liveColor = tileColors[0];
    }
    highlightColorButton.sprite.tint = liveColor;

    for (var i=0;i<tiles.length;i++) {
        if (tiles[i].sprite && tiles[i].alive) {
            tiles[i].sprite.tint = liveColor;
        }
    }

}

function toggleFullscreen() {
    // document.body.removeChild(renderer.view);
    if (fullScreen) {
        exitFullscreen();
        // currentSize.x = origX;
        // currentSize.y = origY;
    } else {
        fullscreen();
        // currentSize.x = origScreenX;
        // currentSize.y = origScreenY;
    }
    touches = [];
    // clearTimeout(game);

    // init();
}

function randomColor() {
    var characters = [0,"x"];
    while (characters.length < 8) {
        characters.push(hexDigits[randomInt(0,15)]);
    };
    return characters.join("");
};
function lightenColor2(colorString) {
    var newColorArray = [];
    newColorArray[0] = "0";
    newColorArray[1] = "x";
    newColorArray[2] = hexDigits[hexDigits.indexOf(colorString.charAt(2))+1];
    newColorArray[3] = hexDigits[hexDigits.indexOf(colorString.charAt(3))+0];
    newColorArray[4] = "f";
    newColorArray[5] = "f";
    newColorArray[6] = hexDigits[hexDigits.indexOf(colorString.charAt(6))+0];
    newColorArray[7] = hexDigits[hexDigits.indexOf(colorString.charAt(7))+1];
    for (var i=0;i<newColorArray.length;i++) {
        if (newColorArray[i] == undefined) {
            newColorArray[i] = "f";
        }
    }
    return newColorArray.join("");

}
function lightenColor(colorString) {
    var newColorArray = ["0x"];
    for (var c=2;c<8;c+=2) {
        if (!(colorString.charAt(c) === "f" && colorString.charAt(c+1) === "f")) {
            var twoDigitHex = [];
            twoDigitHex[0] = colorString.charAt(c).toString();
            twoDigitHex[1] = colorString.charAt(c+1).toString();
            newColorArray.push(advanceTwoDigitHex(twoDigitHex.join("")));
        } else {
            newColorArray.push("ff")
        }
    }
    return newColorArray.join("");
}

function Wobble(direction,speed) {
    for (var tile=0;tile<tiles.length;tile++) {
        var currentTile = tiles[tile];
        if (currentTile.sprite) {
        switch (direction) {
            case "north":
                currentTile.sprite.y -= currentTile.currentAlpha*speed;
                break;
            case "east":
                currentTile.sprite.x += currentTile.currentAlpha*speed;
                break;
            case "south":
                currentTile.sprite.y += currentTile.currentAlpha*speed;
                break;
            case "west":
                currentTile.sprite.x -= currentTile.currentAlpha*speed;
                break;
        };

        };


    };
};
function Wobble1(speed) {
    for (var tile=0;tile<tiles.length;tile++) {
        var currentTile = tiles[tile];
        if (currentTile.sprite) {
            var distanceFromOrigin = distanceFromABtoXY(boardPositions[tile].x,boardPositions[tile].y,currentTile.sprite.x,currentTile.sprite.y);
            var angleFromOrigin = angleOfPointABFromXY(currentTile.sprite.x,currentTile.sprite.y,boardPositions[tile].x,boardPositions[tile].y)
            if (distanceFromOrigin === 0) {
                currentTile.sprite.tint = 0xffffff
                currentTile.sprite.y -= currentTile.currentAlpha*speed*200;
            } else {
//                var newPosition = pointAtAngle(boardPositions[tile].x,boardPositions[tile].y,)
            }



        };


    };
};

function Shift(amountX,amountY) {
    for (var tile=0;tile<tiles.length;tile++) {
        if (tiles[tile].sprite) {
                tiles[tile].sprite.x += (tiles[tile].currentAlpha)*amountX*0.2;
                tiles[tile].sprite.y += (tiles[tile].currentAlpha)*amountY*0.2;

//                tiles[tile].sprite.y += tiles[tile].currentAlpha*0.15*amountY;
        };


    };
};

function snapHome() {
    for (var tile=0;tile<tiles.length;tile++) {
        if (tiles[tile].sprite) {
            tiles[tile].sprite.x = boardPositions[tile].x;
            tiles[tile].sprite.y = boardPositions[tile].y;
        };


    };
}

function createSkeleton() {
    boardPositions = []; // an array of hashes
    clonedTileData = [];
    activeTiles = [];
    tiles = [];
    if (window.innerWidth >= window.innerHeight) {

        tileSize = shorterDimension/tilesPerShorterDimension;
        tilesPerRow = Math.floor(longerDimension/tileSize);
        numberOfRows = tilesPerShorterDimension;
        bufferSpace = (longerDimension-(tilesPerRow*tileSize))/2;
        for (var row=0;row<numberOfRows;row++) {
            for (var tile=0;tile<tilesPerRow;tile++) {
                boardPositions.push({x:bufferSpace+(tile*tileSize),y:row*tileSize});
                new Tile(cellText,boardPositions[boardPositions.length-1].x,boardPositions[boardPositions.length-1].y);
            }

        };
    } else {

        tileSize = shorterDimension/tilesPerShorterDimension;
        tilesPerRow = tilesPerShorterDimension;
        if (fullScreen) {
            numberOfRows = Math.floor(origScreenY/tileSize);
        } else {
            numberOfRows = Math.floor(origY/tileSize);
        };
        bufferSpace = (longerDimension-(numberOfRows*tileSize))/2;
        for (var row=0;row<numberOfRows;row++) {
            for (var tile=0;tile<tilesPerRow;tile++) {
                boardPositions.push({x:tile*tileSize,y:bufferSpace+(row*tileSize)});
                new Tile(cellText,boardPositions[boardPositions.length-1].x,boardPositions[boardPositions.length-1].y);
            }

        };
    }

    for (var t=0;t<tiles.length;t++) {
        tiles[t].getNeighbors();

    }

};

function cloneTileData() {

    for (var i=0;i<tiles.length;i++) {
        var current = tiles[i];
        clonedTileData[i] = current.alive;
        if (current.active) {
            activeTiles[i] = current;
        }
    };

}

function fullscreen() {
    var el = renderer.view;
    fullScreen = true;
    if (el.webkitRequestFullscreen) {

        el.webkitRequestFullscreen();
    } else {

        el.mozRequestFullScreen()
    }
//    init();
}

function exitFullscreen() {
    fullScreen = false;
    if (document.exitFullScreen) {
        document.exitFullScreen();
    } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
    } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen()
    }
//    init();
};

function cycleColors(speed) {
    if (Date.now()-colorChanged >= speed) {
        tileColor = changeRGB(tileColor,cycleComponents[cycleComponentIndex],cycleDirection);
        for (var u=0;u<tiles.length;u++) {
            if (tiles[u].sprite) {
                tiles[u].origColor = tileColor;
            }
        }
        colorChanged = Date.now();
        if (counter == cycleFinished) {
            if (cycleDirection == "increase") {
                cycleDirection = "decrease";
            } else {
                cycleDirection = "increase";
            };
            if (cycleComponentIndex == 2) {
                cycleComponentIndex = 0;
            } else {
                cycleComponentIndex++;
            };
        };
    };
};
function hexToDec(hexString) {
    var num = hexString.substr(2,7);
    var newNum = [];
    newNum.push( (hexDigits.indexOf(num.charAt(0))*16) + hexDigits.indexOf(num.charAt(1)) );
    newNum.push( (hexDigits.indexOf(num.charAt(2))*16)+ hexDigits.indexOf(num.charAt(3)) );
    newNum.push( (hexDigits.indexOf(num.charAt(4))*16) + hexDigits.indexOf(num.charAt(5)) );
    return newNum;
};

function changeRGB(colorString,rgb,direction) {
    if (rgb == "r") {
        var valueArr = [colorString.charAt(2),colorString.charAt(3)];
        var getNewString = function() {
            return "0x" + valueArr.join("")+colorString.substr(4,8);
        };
    };
    if (rgb == "g") {
        var valueArr = [colorString.charAt(4),colorString.charAt(5)];
        var getNewString = function() {
            return "0x" + colorString.charAt(2) + colorString.charAt(3) + valueArr.join("") + colorString.charAt(6) + colorString.charAt(7);
        };
    };
    if (rgb == "b") {
        var valueArr = [colorString.charAt(6),colorString.charAt(7)];
        var getNewString = function() {
            return colorString.substr(0,6) + valueArr.join("");
        };
    };

    if (direction == "increase") {
        valueArr[1] = hexDigits[hexDigits.indexOf(valueArr[1])+1]
        if (valueArr[1] == undefined) {
            valueArr[1] = hexDigits[0];
            valueArr[0] = hexDigits[hexDigits.indexOf(valueArr[0])+1]
            if (hexDigits.indexOf(valueArr[0]) == -1) {
                valueArr[0] = hexDigits[15];
                cycleFinished = counter;
            };
        };
    } else {
        valueArr[1] = hexDigits[hexDigits.indexOf(valueArr[1])-1]
        if (valueArr[1] == undefined) {
            valueArr[1] = hexDigits[15];
            valueArr[0] = hexDigits[hexDigits.indexOf(valueArr[0])-1]
            if (hexDigits.indexOf(valueArr[0]) == -1) {
                valueArr[0] = hexDigits[0];
                cycleFinished = counter;
            };
        };
    };
    return getNewString();
};