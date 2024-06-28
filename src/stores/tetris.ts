import { defineStore } from "pinia"
import { computed, ref, type Ref } from "vue"
import { appStateEnum, gameStateEnum } from "@/config/tetris.enums";
import { generateAnyFieldMatrix, renderFieldMatrix, getMiddlePosition, getPresetMatrix, getCleaningStateByStaticMatrix, renderCleanedFieldMatrix, combineStaticMatrixPartsInOne, calculateSizePixels } from "@/utills/tetris.store.utills";
import { generateFieldTypes } from "@/config/tetris.enums";
import { calculateFallingSpeed, calculateScorePoints, getRandomElementId } from "@/utills/common.utills";
import allElements from '@/assets/elements/all-elms';
import conf from '@/config/tetris.config.ts';

export const useTetrisStore = defineStore('tetris', () => {

  // STATE:
  const width = ref(conf.defaultWidth);
  const height = ref(conf.defaultHeight);
  const widthPixels = ref(calculateSizePixels(width.value));
  const heightPixels = ref(calculateSizePixels(height.value));
  const appState = ref(appStateEnum.init);
  const gameState = ref(gameStateEnum.nothing);
  const score = ref(0);
  const frames = ref(-1);
  const fieldMatrix = ref(generateAnyFieldMatrix(width.value, height.value, generateFieldTypes['filled']));
  // const staticMatrix = ref(getPresetMatrix());
  const staticMatrix = ref(generateAnyFieldMatrix(width.value, height.value, generateFieldTypes['empty']));
  const elementId = ref(-1);
  const nextElementId = ref(getRandomElementId(allElements.length, elementId.value));
  const elementSpin = ref(0);
  const prevElementCoords = ref([0,1]);
  const elementCoords = ref([0,0]); 
  const speedLevel = ref(conf.defaultSpeedLevel);
  const fallingSpeed = ref(calculateFallingSpeed(speedLevel.value, conf.speedIncreaseFactor));
  const movementSpeed: Ref<number> = ref(balanceMovementSpeed(conf.movementSpeed));
  const sideSpeed = ref(conf.sideSpeed);
  const intervalIdFalling: Ref<number|undefined> = ref(undefined);
  const intervalIdCleaning: Ref<number|undefined> = ref(undefined);
  const keyPressed: Ref<{ [key:string]:boolean }> = ref({ ArrowUp: false, ArrowLeft: false, ArrowRight: false, ArrowDown: false, Space: false });
  const keyInterval: Ref<{ [key:string]:number|undefined }> = ref({ ArrowUp: undefined, ArrowLeft: undefined, ArrowRight: undefined, ArrowDown: undefined, Space: undefined });
  const cleaningState: Ref<{ byXAxis:number[];byYAxis:number[] }> = ref({ byXAxis:[], byYAxis:[] });
  const linesErasedCounter = ref(0);

  // LOGGING:
  const startTimestamp = performance.now();
  function getMSLog() {
    let difference = (performance.now() - startTimestamp).toString();
    if (difference.length == 5) {
      difference += ".000000000000";
    }
    return `${difference}: `;
  }
  function getAppAndGameStateLog() {
    return `<App: [${appStateEnum[appState.value]}] & Game: [${gameStateEnum[gameState.value]}]> ->`;
  }
  function addFrames() {
    return `Frame<${frames.value}>`;
  }
  function myLog(logInfo: string) {
    // console.log(`
    //   ${addFrames()} 
    //   ${getAppAndGameStateLog()} 
    //   ${logInfo}
    // `);
  }

  // GETTERS:
  const getWidth = computed(() => width.value);
  const getWidthRef = () => width;
  const getHeight = computed(() => height.value);
  const getHeightRef = () => height;
  const getWidthPixelsRef = () => widthPixels;
  const getHeightPixelsRef = () => heightPixels;
  const getAppState = computed(() => appState.value);
  const getAppStateRef = () => appState;
  const getGameState = computed(() => gameState.value);
  const getGameStateRef = () => gameState;
  const getScore = computed(() => score.value);
  const getFrames = computed(() => frames.value);
  const getFramesRef = () => frames;
  const getFieldMatrixRef = () => fieldMatrix;
  const getElementCoords = computed(() => elementCoords.value);
  const getFallingSpeed = computed(() => fallingSpeed.value);
  const getMovementSpeed = computed(() => movementSpeed.value);
  const getSideSpeed = computed(() => sideSpeed.value);
  const getKeyPressed = computed(() => keyPressed.value);
  const getKeyInterval = computed(() => keyInterval.value);
  const getNextElementId = computed(() => nextElementId.value);
  const getSpeedLevel = computed(() => speedLevel.value);
  const getLinesErasedCounter = computed(() => linesErasedCounter.value);

  // ACTIONS:
  function goToNextAppState() {
    let nextAppState = getAppState.value + 1;
    if (appStateEnum[nextAppState] === undefined) {
      nextAppState = 0;
    }
    setAppState(nextAppState);
  }
  function startFalling(speed: number) {
    myLog("startFalling()");
    stopFalling();
    if (appStateEnum[appState.value] == 'runned') {
      intervalIdFalling.value = setInterval(() => {
        if (appStateEnum[appState.value] == 'runned') {
          myLog("startFalling() -> intervalIdFalling is active...");
          renderNewFrame([0,1]);
        }
      }, speed);
    }
  }
  function stopFalling() {
    myLog("stopFalling()")
    if (intervalIdFalling.value !== undefined) {
      clearInterval(intervalIdFalling.value!);
      intervalIdFalling.value = undefined;
    }
  }
  function startCleaning(speed:number) {
    myLog("startCleaning()");
    stopCleaning();
    if (appStateEnum[appState.value] == 'runned') {
      intervalIdCleaning.value = setInterval(() => {
        if (appStateEnum[appState.value] == 'runned' && intervalIdFalling.value === undefined) {
          myLog("startCleaning() -> intervalIdCleaning is active...");
          renderNewCleaningFrame();
        }
      }, speed);
    }
  }
  function stopCleaning() {
    myLog("stopCleaning()");
    if (intervalIdCleaning.value !== undefined) {
      clearInterval(intervalIdCleaning.value!);
      intervalIdCleaning.value = undefined;
    }
  }
  function setWidth(newWidth: number) {
    myLog("setWidth()");
    width.value = newWidth;
    widthPixels.value = calculateSizePixels(newWidth);
    staticMatrix.value = generateAnyFieldMatrix(width.value, height.value, generateFieldTypes['empty']);
    myLog('setWidth from ' + width.value + " to " + newWidth);
  }
  function setHeight(newHeight: number) {
    myLog("setHeight()");
    height.value = newHeight;
    heightPixels.value = calculateSizePixels(newHeight);
    staticMatrix.value = generateAnyFieldMatrix(width.value, height.value, generateFieldTypes['empty']);
    myLog('setHeight from ' + height.value + " to " + newHeight);
  }
  function setAppState(newState: appStateEnum) {
    myLog("PREPARE TO set App state to: " + appStateEnum[newState] + "...");
    if (appStateEnum[newState] == 'init') {
      myLog("setAppState -> init");
      appState.value = newState;
      fieldMatrix.value = generateAnyFieldMatrix(width.value, height.value, generateFieldTypes.filled);
      staticMatrix.value = generateAnyFieldMatrix(width.value, height.value, generateFieldTypes.empty);
      resetFrames();
      resetGameScore();
    } else if (appStateEnum[newState] == 'runned') {
      myLog("setAppState -> runned");
      appState.value = newState;
      setGameState(gameStateEnum.birth);
    } else if (appStateEnum[newState] == 'finished') {
      myLog("setAppState -> finished");
      appState.value = newState;
      setGameState(gameStateEnum.nothing);
      setTimeout(() => {
      }, 2000);
    }
  }
  function setGameState(newState: gameStateEnum) {
    myLog("PREPARE TO set Game state to: " + gameStateEnum[newState] + "...");
    if (gameStateEnum[newState] == 'birth') {
      myLog("setGameState -> birth");
      elementId.value = nextElementId.value;
      // elementId.value = 1;
      nextElementId.value = getRandomElementId(allElements.length, elementId.value);
      elementSpin.value = 0;
      prevElementCoords.value = [getMiddlePosition(width.value, allElements[elementId.value][elementSpin.value][0].length), -1];
      elementCoords.value = [getMiddlePosition(width.value, allElements[elementId.value][elementSpin.value][0].length), 0];
      renderNewFrame([0,0]);
      if (gameState.value != gameStateEnum.nothing && gameState.value != gameStateEnum.movement) {
        myLog('setGameState -> birth -> setGameState to movement');
        setGameState(gameStateEnum.movement);
      };
    } else if (gameStateEnum[newState] == 'movement') {
      myLog("setGameState -> movement");
      gameState.value = newState;
      startFalling(fallingSpeed.value);
    } else if (gameStateEnum[newState] == 'collision') {
      myLog("setGameState -> collision");
      updateCleaningState();
      if (cleaningState.value.byYAxis.length > 0) {
        clearAllIntervals();
        stopFalling();
        startCleaning(conf.cleaningSpeed);
        setGameState(gameStateEnum.cleaning);
      } else {
        setGameState(gameStateEnum.birth);
      }
    } else if (gameStateEnum[newState] == 'cleaning') {
      myLog("setGameState -> cleaning");
      gameState.value = newState;
    } else if (gameStateEnum[newState] == 'nothing') {
      myLog("setGameState -> nothing");
      gameState.value = newState;
      stopFalling();
    }
  }
  function updateGameScore(linesWasCleared: number) {
    myLog("updateGameScore()");
    console.log(linesWasCleared);
    console.log(speedLevel.value)
    console.log(conf.linesScore)
    score.value += calculateScorePoints(linesWasCleared, speedLevel.value, conf.linesScore);
  }
  function resetGameScore() {
    myLog("resetGameScore()");
    score.value = 0 
  }
  function setGameScore(setTo: number) {
    score.value = setTo;
  }
  function updateFrames() {
    myLog("updateFrames()");
    frames.value += 1;
  }
  function resetFrames() {
    myLog("resetFrames()");
    frames.value = -1;
  }
  function backToPrevSpin() {
    myLog("backToPrevSpin()");
    const nextSpin = elementSpin.value - 1;
    elementSpin.value = allElements[elementId.value][nextSpin] != undefined ? nextSpin : allElements[elementId.value].length - 1;
  }
  function updateSpin() {
    myLog("updateSpin()");
    const nextSpin = elementSpin.value + 1;
    elementSpin.value = allElements[elementId.value][nextSpin] != undefined ? nextSpin : 0;
  }
  function renderNewFrame(relativeCoords: number[]) {
    myLog("renderNewFrame()");
    // Saving previous coordinates values before updating them to the new state:
    const prevElementCoordsBackup = JSON.parse(JSON.stringify(prevElementCoords.value));
    const elementCoordsBackup = JSON.parse(JSON.stringify(elementCoords.value));
    elementCoordsUpdate(relativeCoords);
    // Rendering the next game frame:
    const result = renderFieldMatrix(staticMatrix.value, fieldMatrix.value, elementId.value, prevElementCoords.value, elementCoords.value, elementSpin.value);
    fieldMatrix.value = JSON.parse(JSON.stringify(result.matrix));
    // Updating frames value to refresh Vue components:
    updateFrames();
    // If we have an order to return to previous coordinates, let's do it:
    if (result.returnPrevCoords) {
      prevElementCoords.value = prevElementCoordsBackup;
      elementCoords.value = elementCoordsBackup;
    }
    // If the game is over:
    if (result.isGameOver !== undefined && result.isGameOver) {
      myLog("renderNewFrame() -> isGameOver !!! app state set to finished");
      setAppState(appStateEnum.finished);
    // If the game still continues:
    } else {
      // If there was a "collision" event, use the current matrix state as the default (swap object and environment into the new environment):
      if (result.gameState == gameStateEnum.collision) {
        staticMatrix.value = JSON.parse(JSON.stringify(result.matrix));
      }
      // Change the game state if we have this order:
      if (result.gameState != gameState.value) {
        myLog("renderNewFrame -> setGameState to " + gameStateEnum[result.gameState]);
        setGameState(result.gameState);
      }
      // Set previous coordinates as current coordinates if needed:
      if (result.returnPrevSpin) {
        backToPrevSpin();
      }
    }
  }
  function renderNewCleaningFrame() {
    myLog("renderNewCleaningFrame()");
    const result = renderCleanedFieldMatrix(staticMatrix.value, cleaningState.value);
    staticMatrix.value = result.nextStaticMatrix;
    fieldMatrix.value = result.nextStaticMatrix;
    cleaningState.value = result.nextCleaningState;
    // If cleaning is over:
    if (result.nextCleaningState.byXAxis.length == 0) {
      myLog("renderNewCleaningFrame() -> cleaning is over");
      stopCleaning();
      const newStaticMatrix = combineStaticMatrixPartsInOne({ staticMatrix: result.nextStaticMatrix, lines: result.nextCleaningState.byYAxis });
      staticMatrix.value = newStaticMatrix;
      fieldMatrix.value = newStaticMatrix;
      setTimeout(() => {
        const linesErased = result.nextCleaningState.byYAxis.length;
        linesErasedCounter.value += linesErased;
        updateGameScore(linesErased);
        updateSpeedLevel();
        setGameState(gameStateEnum.birth);
      }, conf.cleaningSpeed);
    // Else - to continue cleaning process:
    } else {
      myLog("renderNewCleaningFrame() -> continue cleaning...");
      staticMatrix.value = result.nextStaticMatrix;
      fieldMatrix.value = result.nextStaticMatrix;
    }
    updateFrames();
  }
  function clearAllIntervals() {
    const keysOfIntervals = Object.keys(keyInterval.value);
    for(let key of keysOfIntervals) {
      if (keyInterval.value[key] !== undefined) {
        clearInterval(keyInterval.value[key]);
        keyInterval.value[key] = undefined;
      }
    }
  }
  function updateSpeedLevel() {
    myLog("updateSpeedLevel()");
    if (linesErasedCounter.value >= 10) {
      linesErasedCounter.value -= 10;
      increaseSpeedLevel();
    }
  }
  function elementCoordsUpdate(relativeCoords: number[]) {
    myLog("elementCoordsUpdate()");
    prevElementCoords.value = JSON.parse(JSON.stringify(elementCoords.value));
    elementCoords.value[0] += relativeCoords[0];
    elementCoords.value[1] += relativeCoords[1];
  }
  function updateCleaningState() {
    myLog("updateCleaningState()");
    cleaningState.value = getCleaningStateByStaticMatrix(staticMatrix.value);
  }
  function balanceMovementSpeed(movementSpeedValue: number) {
    myLog("balanceMovementSpeed()");
    return JSON.parse(JSON.stringify((fallingSpeed.value > movementSpeedValue ? conf.movementSpeed : fallingSpeed.value)));
  }
  function setSpeedLevel(newSpeedLevelValue: number) {
    myLog("setSpeedLevel()");
    speedLevel.value = newSpeedLevelValue;
    fallingSpeed.value = calculateFallingSpeed(newSpeedLevelValue, conf.speedIncreaseFactor);
    movementSpeed.value = balanceMovementSpeed(movementSpeed.value);
  }
  function increaseSpeedLevel() {
    myLog("increaseSpeedLevel()");
    setSpeedLevel(speedLevel.value + 1);
  }
  function getStatsInConsole(place: string) {
    console.log("*************** FRAME # [" + frames.value + "] IN <" + place + "> **************");
    // console.log("width: " + width.value);
    // console.log("height: " + height.value);
    console.log("appState: " + appStateEnum[appState.value]);
    console.log("gameState: " + gameStateEnum[gameState.value]);
    // console.log("score: " + score.value);
    // console.log("fieldMatrixSize: " + fieldMatrix.value[0].length + "/" + fieldMatrix.value.length);
    // console.log("staticMatrixSize: " + staticMatrix.value[0].length + "/" + staticMatrix.value.length);
    // console.log("prevElementId: " + prevElementId.value);
    // console.log("elementId: " + elementId.value);
    // console.log("elementSpin: " + elementSpin.value);
    // console.log("prevElementCoords: " + prevElementCoords.value);
    // console.log("elementCoords: " + elementCoords.value);
    // console.log("fallingSpeed: " + fallingSpeed.value);
    console.log("intervalIdFalling: " + intervalIdFalling.value);
    console.log("intervalIdCleaning: " + intervalIdCleaning.value);
    // console.log(`keyPressed: { ArrowUp: ${keyPressed.value.ArrowUp}, ArrowLeft: ${keyPressed.value.ArrowLeft}, ArrowRight: ${keyPressed.value.ArrowRight}, ArrowDown: ${keyPressed.value.ArrowDown}, Space: ${keyPressed.value.Space} }`);
    // console.log(`keyInterval: { ArrowUp: ${keyInterval.value.ArrowUp}, ArrowLeft: ${keyInterval.value.ArrowLeft}, ArrowRight: ${keyInterval.value.ArrowRight}, ArrowDown: ${keyInterval.value.ArrowDown}, Space: ${keyInterval.value.Space} }`);
    console.log(`keyPressed: { ArrowDown: ${keyPressed.value.ArrowDown} }`);
    console.log(`keyInterval: { ArrowDown: ${keyInterval.value.ArrowDown} }`);
    console.log("****************************************");
  }

  return { 
    getWidth, 
    getWidthRef, 
    getHeight,
    getHeightRef,
    getWidthPixelsRef,
    getHeightPixelsRef,
    getAppState,
    getAppStateRef,
    getGameState,
    getGameStateRef,
    getScore,
    getFrames,
    getFramesRef,
    getFieldMatrixRef,
    getElementCoords,
    getFallingSpeed,
    getMovementSpeed,
    getSideSpeed,
    getKeyPressed,
    getKeyInterval,
    getNextElementId,
    getSpeedLevel,
    getLinesErasedCounter,
    goToNextAppState,
    startFalling,
    stopFalling,
    setWidth,
    setHeight,
    setAppState,
    setGameState,
    updateGameScore,
    resetGameScore,
    setGameScore,
    updateFrames,
    resetFrames,
    backToPrevSpin,
    updateSpin,
    renderNewFrame,
    setSpeedLevel,
    getStatsInConsole
  }
});
