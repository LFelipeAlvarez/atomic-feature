import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { Comment, CommentsState } from "../types";

const initialState: CommentsState = {
  comments: null,
  loading: false,
};

export const commentsSlice = createSlice({
  name: 'comments',
  initialState,
  reducers: {
    setComments: (state, action: PayloadAction<Comment[]>) => {
      state.comments = action.payload;
    },

    addComment: (state, action: PayloadAction<Comment>) => {
      if (state.comments) state.comments.unshift(action.payload);
    },

    deleteComment: (state, action: PayloadAction<Comment['id']>) => {
      if (state.comments) state.comments = state.comments.filter(comment => comment.id !== action.payload);
    },

    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
  }
});


export const { setComments, setLoading, addComment, deleteComment } = commentsSlice.actions;
export default commentsSlice.reducer;