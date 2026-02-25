import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "../api/api";

// Fetch dashboard data
export const fetchDashboardData = createAsyncThunk(
  "dashboard/fetchDashboardData",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get("/api/dashboard/dashboard-data", {
        withCredentials: true,
      });
      // console.log("dashboard data",data);
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data || "Failed to fetch dashboard data");
    }
  }
);

// Add income or expense
export const addIncomeExpense = createAsyncThunk(
  "dashboard/addIncomeExpense",
  async ({ show, payload }, { rejectWithValue }) => {
    try {
      const { data } = await api.post(`/api/${show}/add-${show}`, payload, {
        withCredentials: true,
      });
      return { type: show, item: data[show] || data.expense || data.income || data };
    } catch (err) {
      return rejectWithValue(err.response?.data || "Failed to add data");
    }
  }
);

// Delete income or expense
export const deleteIncomeExpense = createAsyncThunk(
  "dashboard/deleteIncomeExpense",
  async ({ id, show }, { rejectWithValue }) => {
    try {
      await api.delete(`/api/${show}/delete-${show}/${id}`, {
        withCredentials: true,
      });
      return { id, type: show };
    } catch (err) {
      return rejectWithValue(err.response?.data || "Failed to delete");
    }
  }
);

const dashboardSlice = createSlice({
  name: "dashboard",
  initialState: {
    income: [],
    expense: [],
    totalIncome: 0,
    totalExpense: 0,
    balance: 0,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDashboardData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDashboardData.fulfilled, (state, action) => {
        state.loading = false;
        state.income = action.payload.data.incomeTransactions;
        state.expense = action.payload.data.expenseTransactions;
        state.totalIncome = action.payload.data.totalIncome;
        state.totalExpense = action.payload.data.totalExpense;
        state.balance = action.payload.data.balance;
      })
      .addCase(fetchDashboardData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(addIncomeExpense.fulfilled, (state, action) => {
        if (action.payload.type === "income") state.income.unshift(action.payload.item);
        if (action.payload.type === "expense") state.expense.unshift(action.payload.item);
        state.totalIncome = state.income.reduce((sum, i) => sum + i.amount, 0);
        state.totalExpense = state.expense.reduce((sum, i) => sum + i.amount, 0);
        state.balance = state.totalIncome - state.totalExpense;
      })
      .addCase(deleteIncomeExpense.fulfilled, (state, action) => {
        if (action.payload.type === "income") state.income = state.income.filter(i => i._id !== action.payload.id);
        if (action.payload.type === "expense") state.expense = state.expense.filter(e => e._id !== action.payload.id);
        state.totalIncome = state.income.reduce((sum, i) => sum + i.amount, 0);
        state.totalExpense = state.expense.reduce((sum, i) => sum + i.amount, 0);
        state.balance = state.totalIncome - state.totalExpense;
      });
  },
});

export default dashboardSlice.reducer;