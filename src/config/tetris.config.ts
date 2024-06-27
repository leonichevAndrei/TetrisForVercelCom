export default {
  width: {
    min: 18,
    max: 60
  },
  height: {
    min: 20,
    max: 28
  },
  defaultWidth: 18,
  defaultHeight: 28,
  speedLevels: {
    min: 0,
    max: 29
  },
  defaultSpeedLevel: 16,
  elementsIcons: [
    'tetris-icons-1-1.png',
    'tetris-icons-2.png',
    'tetris-icons-3.png',
    'tetris-icons-4-1.png',
    'tetris-icons-5.png',
    'tetris-icons-1-2.png',
    'tetris-icons-4-2.png',
  ],
  speedIncreaseFactor: 1.60, // Only in the range of 0.01 - 1.62!
  linesScore: [ 40, 100, 300, 1200 ],
  movementSpeed: 50, // optimal - 50
  sideSpeed: 75, // optimal - 75
  cleaningSpeed: 25 // optimal - 25
}