export function getMillisecondsByFPS(fps: number) {
  return Math.ceil(1000 / fps);
}
export function getRandomElementId(length: any, prevElementId: number) {
  let newElementId = getRandomFromX(length) - 1;
  return newElementId != prevElementId ? newElementId : (prevElementId != (length-1) ? newElementId+1 : 0);
}
export function getRandomFromX(count: number) {
  return Math.ceil(Math.random() * count);
}
export function calculateScorePoints(linesWasCleared: number, speedLevel: number, linesScore: number[]) {
  return linesScore[linesWasCleared-1] * (speedLevel + 1);
}
export function calculateFallingSpeed(speedLevel: number, speedIncreaseFactor: number) {
  return Math.floor((48 - (speedIncreaseFactor * speedLevel)) / 60 * 1000);
}
export function isMobileDevice() {
  const userAgent = navigator.userAgent;
  return /android|iPad|iPhone|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);
}
