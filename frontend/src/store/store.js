import { configureStore } from "@reduxjs/toolkit"
import authSlice from "../features/authSlice"
import dashboardSlice from "../features/dashboardSlice"
import modalSlice from "../features/modalSlice"

const store = configureStore({
    reducer: {
        auth: authSlice,
        dashboard: dashboardSlice,
        modal: modalSlice
    }
})

export default store;