import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "../api/api";

export const login = createAsyncThunk(
  "auth/login",
  async (credential, { rejectWithValue }) => {
    try {
      const response = await api.post("/api/auth/login", credential, {
        withCredentials: true,
      });
      // console.log("res", response);
      // console.log("user logged in", response.data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Something went wrong");
    }
  }
);

export const register = createAsyncThunk(
  "auth/register",
  async (credential, { rejectWithValue }) => {
    try {
      const response = await api.post("/api/auth/register", credential, {
        withCredentials: true,
      });
      // console.log("user registered", response.data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Something went wrong");
    }
  }
);

export const logout = createAsyncThunk(
  "auth/logout",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.post("/api/auth/logout", {}, {
        withCredentials: true,
      });
      // console.log("user logged out", response.data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Something went wrong");
    }
  }
);

export const checkAuth = createAsyncThunk(
  "auth/checkAuth",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get("/api/auth/userInfo", {
        withCredentials: true,
      });
      // console.log("user info", data);
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data || "Not authenticated");
    }
  }
);

const initialState = {
  user:  null,
  token: null,
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Register
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Check Auth
      .addCase(checkAuth.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(checkAuth.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user || null;
      })
      .addCase(checkAuth.rejected, (state, action) => {
        state.loading = false;
        state.user = null;
        state.error = action.payload;
      })

      // Logout
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.token = null;
      })
      .addCase(logout.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export default authSlice.reducer;