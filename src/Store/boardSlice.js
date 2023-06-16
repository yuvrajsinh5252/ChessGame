import { createSlice } from '@reduxjs/toolkit'; 

const boardSlice = createSlice({
    name: 'board',
    initialState: {board: []},
    reducers: { 
        setBoard(state, action) {
            state.board = action.payload;
        }
    }
});

export const boardActions = boardSlice.actions;
export default boardSlice;