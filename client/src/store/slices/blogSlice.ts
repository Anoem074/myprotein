import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { RootState } from '../store';

export interface Blog {
  _id: string;
  title: string;
  content: string;
  image: string;
  createdAt: string;
  updatedAt: string;
}

interface BlogState {
  blogs: Blog[];
  loading: boolean;
  error: string | null;
}

const initialState: BlogState = {
  blogs: [],
  loading: false,
  error: null,
};

// Helper function to get auth header
const getAuthHeader = (getState: () => RootState) => {
  const token = getState().auth.token;
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

export const fetchBlogs = createAsyncThunk('blogs/fetchBlogs', async (_, { getState }) => {
  const response = await axios.get('http://localhost:5000/api/blogs', getAuthHeader(getState as any));
  return response.data;
});

export const createBlog = createAsyncThunk(
  'blogs/createBlog',
  async (blogData: Partial<Blog>, { getState }) => {
    const response = await axios.post(
      'http://localhost:5000/api/blogs',
      blogData,
      getAuthHeader(getState as any)
    );
    return response.data;
  }
);

export const updateBlog = createAsyncThunk(
  'blogs/updateBlog',
  async ({ id, blogData }: { id: string; blogData: Partial<Blog> }, { getState }) => {
    const response = await axios.put(
      `http://localhost:5000/api/blogs/${id}`,
      blogData,
      getAuthHeader(getState as any)
    );
    return response.data;
  }
);

export const deleteBlog = createAsyncThunk(
  'blogs/deleteBlog',
  async (id: string, { getState }) => {
    await axios.delete(
      `http://localhost:5000/api/blogs/${id}`,
      getAuthHeader(getState as any)
    );
    return id;
  }
);

const blogSlice = createSlice({
  name: 'blogs',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchBlogs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBlogs.fulfilled, (state, action) => {
        state.loading = false;
        state.blogs = action.payload;
      })
      .addCase(fetchBlogs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch blogs';
      })
      .addCase(createBlog.fulfilled, (state, action) => {
        state.blogs.push(action.payload);
      })
      .addCase(updateBlog.fulfilled, (state, action) => {
        const index = state.blogs.findIndex((blog) => blog._id === action.payload._id);
        if (index !== -1) {
          state.blogs[index] = action.payload;
        }
      })
      .addCase(deleteBlog.fulfilled, (state, action) => {
        state.blogs = state.blogs.filter((blog) => blog._id !== action.payload);
      });
  },
});

export default blogSlice.reducer;
