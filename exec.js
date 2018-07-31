


function update() {
    // clearButton.text1.text = touches.length
//    activeCount = 0;
//    timeSinceLastDrawn = Date.now()-lastDrawn;
    if (startedAt && introContainer.alpha > 0) {
        if (introContainer.alpha-0.2 >= 0) {
            introContainer.alpha -= 0.2;
        } else {
            introContainer.alpha = 0;
            introContainer.visible = false;
        }
    }
    if (menuContainer.alpha > 0 && !menuOn) {
        if (menuContainer.alpha-0.2 >= 0) {
            menuContainer.alpha -= 0.2;
        } else {
            menuContainer.alpha = 0;
            menuContainer.visible = false;
        }
    }
    if (menuContainer.alpha < 0.9 && menuOn) {
        if (!menuContainer.visible) {
            menuContainer.visible = true;
        }
        if (menuContainer.alpha+0.2 <= 0.9) {
            menuContainer.alpha += 0.2;
        } else {
            menuContainer.alpha = 0.9;
        }
    }

    if (rainbowMode) {
        cycleColors(2);
    };

    if (!shifting && wobbling && simulationRunning) {
        if (counter % wobbleSpeed === 0) {
            if (directions.indexOf(wobbleDirection) >= 0 && directions.indexOf(wobbleDirection) < 3) {
                wobbleDirection = directions[directions.indexOf(wobbleDirection)+1];
            } else {
                wobbleDirection = directions[0];
            }
        }
        Wobble(wobbleDirection,wobbleAmount);

    }



    if (simulationRunning) {
        cloneTileData();
    for (var tileIndex=0;tileIndex<tiles.length;tileIndex++) {

        var currentTile = tiles[tileIndex];
//        if (!currentTile.alive && currentTile.hasSprite) {
//        if (currentTile.currentAlpha-(currentTile.currentAlpha/200) >= 0) {
//            currentTile.sprite.alpha -= currentTile.sprite.alpha/200;
//            currentTile.currentAlpha -= currentTile.currentAlpha/200;
//        } else {
//            currentTile.sprite.alpha = 0;
//            currentTile.currentAlpha = 0;
//        }
//        };


        if (currentTile.isActive()) {
//            activeCount++;
            var liveNeighbors = currentTile.liveNeighbors();
            if (!currentTile.alive) {
                if (liveNeighbors === ruleVariables.comeToLifeIfEqual || liveNeighbors === ruleVariables.comeToLifeIfEqual2) {
                    currentTile.comeToLife(1);

                }
            } else {
                if (liveNeighbors < ruleVariables.dieIfUnder || liveNeighbors > ruleVariables.dieIfOver) {
                    currentTile.die();
                }
            }
        }
        if (!menuOn && touches.length > 0 && touches.length < 2 && !RMBDown && !currentTile.alive && currentTile.beingTouched()) {
//            if (!currentTile.alive) {
            currentTile.comeToLife(2);
//                currentTile.wakeNeighbors(paintbrushSize,1);
            currentTile.wakeRandomNeighbors(2);
//            }
//            lastSimStepTime = Date.now();
        }
    };

//    lastSimStepTime = Date.now();

    }

    if (touches.length <= 2 && !menuOn && (touches.length === 2 || RMBDown)) {
        if (touches.length === 1) {
            var touchToTrack = 0;
        } else {
            var touchToTrack = 1;
        }
        var diffX = touches[touchToTrack].pos.x-lastDoubleTapPosition.x;
        var diffY = touches[touchToTrack].pos.y-lastDoubleTapPosition.y;
        lastDoubleTapPosition = touches[touchToTrack].pos;
        Shift(diffX,diffY);
    }

    if (menuOn && menubg.scrollbar.slider.visible && (menubg.scrollbar.slider.grabbed || menubg.grabbed || scrolledUp === counter || scrolledDown === counter)) {
        if (scrolledUp === counter || scrolledDown === counter || touchingAtLastFrame) {
            if (scrolledUp === counter) {
                var amountMoved = -hamburgerWidth/2;
            } else if (scrolledDown === counter) {
                var amountMoved = hamburgerWidth/2;
            } else {
                var amountMoved = touchingAtLastFrame.y-touches[0].pos.y;
            }
            var reverse = 1;
            if (menubg.grabbed) {
                reverse = -1;
            }

            if (menubg.scrollbar.slider.y >= menubg.scrollbar.slider.homeSpot+amountMoved*reverse &&
                menubg.scrollbar.slider.y <= menubg.scrollbar.slider.endSpot+amountMoved*reverse) {
                menuContents.y += amountMoved*reverse;
                menubg.scrollbar.slider.y -= amountMoved*reverse;
//            }
            } else if (menubg.scrollbar.slider.y < menubg.scrollbar.slider.homeSpot+amountMoved*reverse) {
                menubg.scrollbar.slider.y = menubg.scrollbar.slider.homeSpot;
                menuContents.y = menuContainer.y;
            } else if (menubg.scrollbar.slider.y > menubg.scrollbar.slider.endSpot+amountMoved*reverse) {
                var oldY = menubg.scrollbar.slider.y;
                menubg.scrollbar.slider.y = menubg.scrollbar.slider.endSpot;
                menuContents.y -= menubg.scrollbar.slider.y-oldY;
            }
        }
        if (touches.length > 0 && touches[0].pos.y >= menubg.scrollbar.slider.homeSpot && touches[0].pos.y <= menubg.scrollbar.slider.endSpot+menubg.scrollbar.slider.height) {
            touchingAtLastFrame = touches[0].pos
        }
    }

    lastUpdated = Date.now();
    renderer.render(stage);
    counter++;
    // game = setTimeout(update,1000/60);
    game = requestAnimationFrame(update);

};
