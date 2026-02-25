import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "../api/api";

export const login = createAsyncThunk(
    "auth/login",
    async (credential, { rejectWithValue }) => {
        try {
            const response = await api.post("/api/auth/login", credential, {
                withCredentials: true
            });
            console.log("user logged in", response.data);
            return response.data;

        } catch (error) {
            return rejectWithValue(error.response?.data || "Something went wrong");
        }
    }
)

export const register = createAsyncThunk(
    "auth/register",
    async (credential, { rejectWithValue }) => {
        try {
            const response = await api.post("/api/auth/register", credential, {
                withCredentials: true
            });
            console.log("user registered", response.data);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || "Something went wrong");
        }
    }
)

export const logout = createAsyncThunk(
    "auth/logout",
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.post("/api/auth/logout", {}, {
                withCredentials: true
            });
            console.log("user logged out", response.data);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || "Something went wrong");
        }
    }
)

export const checkAuth = createAsyncThunk(
  "auth/checkAuth",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get("/api/auth/getMe", {
        withCredentials: true,
      });
      return data.user;
    } catch (err) {
      return rejectWithValue(err.response?.data || "Not authenticated");
    }
  }
);

// export const checkAuth = createAsyncThunk(
//     "auth/checkAuth",
//     async (_, { rejectWithValue }) => {
//         try {
//             const { data } = await api.get("api/auth/userInfo", { withCredentials: true });
//             console.log("user info", data);
//             return data.user;
//         } catch (err) {
//             return rejectWithValue(err.response?.data || "Not authenticated");
//         }
//     }
// );

const authSlice = createSlice({
    name: "auth",
    initialState: {
        user: null,
        token: null,
        loading: false,
        error: null
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
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
            .addCase(checkAuth.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(checkAuth.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload;
            })
            .addCase(checkAuth.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(logout.fulfilled, (state) => {
                state.user = null;   // Redux se user remove
                state.token = null;  // agar token bhi state me save ho
            })
            .addCase(logout.rejected, (state, action) => {
                state.error = action.payload;
            })
    }
})

export default authSlice.reducer;