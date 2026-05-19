import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  score: 0,
  lives: 30,
  isGameStarted: false,
  isGameOver: false,
  audio: false,
  gyro: false,
};

const gameSlice = createSlice({
  name: 'game',
  initialState,
  reducers: {
    startGame: (state) => {
      state.isGameStarted = true;
      state.isGameOver = false;
      state.score = 0;
      state.lives = 30;
      state.gyro = false;
    },
    addScore: (state, action) => {
      state.score += action.payload ?? 1;
    },
    startAudio: (state, action) => {
      state.audio = action.payload ?? false;
    },
    loseLife: (state) => {
      state.lives -= 1;

      if (state.lives <= 0) {
        state.lives = 0;
        state.isGameOver = true;
      }
    },
    handleGyro: (state, action) => {
      state.gyro = action.payload;
    },
    resetGame: () => initialState,
  },
});

export const {
  startGame,
  addScore,
  loseLife,
  resetGame,
  startAudio,
  handleGyro,
} = gameSlice.actions;

export default gameSlice.reducer;
