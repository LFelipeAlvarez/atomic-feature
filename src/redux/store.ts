import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./userSlice";
import commentsReducer from "./commentsSlice";

const store = configureStore({
  reducer: {
    user: userReducer,
    comments: commentsReducer
  }
});

export type RootState = ReturnType<typeof store.getState>;
export default store;