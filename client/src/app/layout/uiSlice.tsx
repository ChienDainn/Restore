// uiSlice.ts
import { createSlice } from "@reduxjs/toolkit";

interface UIState {
    isLoading: boolean;
    darkMode: boolean;
}

// Hàm lấy dark mode từ localStorage
const getInitialDarkMode = (): boolean => {
    const storedValue = localStorage.getItem('darkMode');
    return storedValue ? JSON.parse(storedValue) : false;
};

const initialState: UIState = {
    isLoading: false,
    darkMode: getInitialDarkMode()
};

export const uiSlice = createSlice({
    name: 'ui',
    initialState,
    reducers: {
        startLoading: (state) => {
            state.isLoading = true;
        },
        stopLoading: (state) => {
            state.isLoading = false;
        },
        setDarkMode: (state) => {
            state.darkMode = !state.darkMode;
            localStorage.setItem('darkMode', JSON.stringify(state.darkMode));
        }
    }
});

export const { startLoading, stopLoading, setDarkMode } = uiSlice.actions;
