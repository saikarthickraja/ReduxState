import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  cardList: [],
};

const cardSlice = createSlice({
  name: 'cards',
  initialState,
  reducers: {
    addCard: (state, action) => {
      state.cardList.push(action.payload);
    },
    updateCard: (state, action) => {
      const {id, updatedCard} = action.payload;
      const index = state.cardList.findIndex(card => card.id === id);
      if (index !== -1) {
        state.cardList[index] = updatedCard;
      }
    },
    removeCard: (state, action) => {
      state.cardList = state.cardList.filter(
        card => card.id !== action.payload,
      );
    },
  },
});

export const {addCard, updateCard, removeCard} = cardSlice.actions;
export default cardSlice.reducer;
