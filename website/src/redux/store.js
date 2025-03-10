import { configureStore } from '@reduxjs/toolkit';
import userReducer from './user/userSlice';
import selectedTabReducer from './selectedTab/selectedTabSlice';
import dropDownReducer from './dropDown/dropDownSlice';
import languageReducer from './language/languageSlice';

const store = configureStore({
    reducer: {
        user: userReducer,
        selectedTab: selectedTabReducer,
        dropDown: dropDownReducer,
        language: languageReducer,
    },
});

export default store;