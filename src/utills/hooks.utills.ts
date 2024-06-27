import type { Store } from "pinia";
import { ref, watch, type Ref } from "vue";

export function useDimensionsChange(tetrisStore: Store<"tetris", any>) {
  let width: Ref<number> = ref(tetrisStore.getWidth);
  let height: Ref<number> = ref(tetrisStore.getHeight);
  watch(tetrisStore.getWidthRef(), (newWidth: number) => {
    console.log("width changed");
    width.value = newWidth;
  });
  watch(tetrisStore.getHeightRef(), (newHeight: number) => {  
    console.log("height changed");
    height.value = newHeight;
  });
  return [width, height];
}
