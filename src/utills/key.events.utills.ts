import { appStateEnum, gameStateEnum } from "@/config/tetris.enums";
import { onMounted, onUnmounted, watch } from "vue";
import { useTetrisStore } from '@/stores/tetris';

export function useKeyEvents() {
  const tetrisStore = useTetrisStore();
  addEventListeners((event: KeyboardEvent) => {
    if (event.type === 'keydown') {
      if (event.code === 'ArrowLeft' || event.code === 'ArrowRight' || event.code === 'ArrowDown' || event.code === 'Space') {
        tetrisStore.getKeyPressed[event.code] = true;
        if (appStateEnum[tetrisStore.getAppState] == 'runned' && gameStateEnum[tetrisStore.getGameState] == 'movement') {
          if (!tetrisStore.getKeyInterval[event.code]) {
            handleKeyPress(event.code);
            tetrisStore.getKeyInterval[event.code] = setInterval(() => 
              event.code !== "Space" ? handleKeyPress(event.code) : {}, 
              (event.code === "ArrowLeft" || event.code === "ArrowRight") ? tetrisStore.getSideSpeed : tetrisStore.getMovementSpeed
            );
          }
        }
      } else {
        if (event.code === 'ControlLeft' || event.code == 'ControlRight') {
          tetrisStore.goToNextAppState();
        }
      }
    } else if (event.type === 'keyup') {
      if (event.code === 'ArrowLeft' || event.code === 'ArrowRight' || event.code === 'ArrowDown' || event.code === 'Space') {
        tetrisStore.getKeyPressed[event.code] = false;
        if (tetrisStore.getKeyInterval[event.code]) {
          clearInterval(tetrisStore.getKeyInterval[event.code]!);
          tetrisStore.getKeyInterval[event.code] = undefined;
        }
      }
    }
  });
  function addEventListeners (handler: (event: KeyboardEvent) => void) {
    onMounted(() => {
      document.addEventListener('keydown', handler);
      document.addEventListener('keyup', handler);
    });
    onUnmounted(() => {
      document.removeEventListener('keydown', handler);
      document.removeEventListener('keyup', handler);
    });
    watch(() => tetrisStore.getKeyPressed.ArrowUp, key => stopFallingWhileKeyDown(key));
    watch(() => tetrisStore.getKeyPressed.ArrowDown, key => stopFallingWhileKeyDown(key));
  }
  function handleKeyPress(key: string) {
    if (appStateEnum[tetrisStore.getAppState] == 'runned' && gameStateEnum[tetrisStore.getGameState] == 'movement') {
      switch (key) {
        case 'ArrowUp':
          tetrisStore.renderNewFrame([0, -1]);
          break;
        case 'ArrowLeft':
          tetrisStore.renderNewFrame([-1, 0]);
          break;
        case 'ArrowRight':
          tetrisStore.renderNewFrame([1, 0]);
          break;
        case 'ArrowDown':
          tetrisStore.renderNewFrame([0, 1]);
          break;
        case 'Space':
          tetrisStore.updateSpin();
          tetrisStore.renderNewFrame([0, 0]);
      }
    }
  }
  function stopFallingWhileKeyDown(keyState: boolean) {
    if (appStateEnum[tetrisStore.getAppState] == 'runned' && gameStateEnum[tetrisStore.getGameState] == 'movement') {
      if (keyState === true) {
        tetrisStore.stopFalling();
      } else if (keyState === false) {
        tetrisStore.startFalling(tetrisStore.getFallingSpeed);
      }
    }
  }
}

export function triggerKeyDownEvent(key: string) {
  const keydownEvent = new KeyboardEvent('keydown', { key, code: key, bubbles: true, cancelable: true });
  return document.dispatchEvent(keydownEvent);
}

export function triggerKeyUpEvent(key: string) {
  const keyupEvent = new KeyboardEvent('keyup', { key, code: key, bubbles: true, cancelable: true });
  return document.dispatchEvent(keyupEvent);
}
