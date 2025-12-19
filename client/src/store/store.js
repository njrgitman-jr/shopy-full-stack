//client/src/store/store.js
// ===============================
// Redux Store Configuration File
// ===============================

// Import the configureStore function from Redux Toolkit.
// This function simplifies store creation by automatically combining reducers,
// adding good default middleware (like thunk), and enabling Redux DevTools by default.
import { configureStore } from "@reduxjs/toolkit";

// ===============================
// Import individual slice reducers
// ===============================

// Each reducer below is a "slice" of your global Redux state.
// Every slice manages its own logic (actions + reducers) for a specific feature of the app.

import userReducer from "./userSlice"; // → Handles user authentication and profile info (login, logout, user data)
import productReducer from "./productSlice"; // → Manages product-related data (listings, filters, single product details)
import cartReducer from "./cartProduct"; // → Controls cart functionality (add to cart, remove, update quantity)
import addressReducer from "./addressSlice"; // → Manages user address data (add, update, delete, select default address)
import orderReducer from './orderSlice'    // → (Optional/Future) Will manage order history, order placement, etc.

// ===============================
// Configure and export the Redux store
// ===============================

// The Redux store is the central data container for your entire app.
// It holds the global state tree and allows any component to access or modify that state via actions.
export const store = configureStore({
  // The `reducer` key defines how your store's global state is structured.
  // You pass in an object where each key represents a slice name,
  // and each value is the corresponding reducer that manages that slice.
  reducer: {
    // The `user` key will hold all user-related state.
    // It is handled by the logic inside userSlice.js (the userReducer).
    // Example usage in components: `useSelector(state => state.user)`
    user: userReducer,
    product: productReducer,
    cartItem: cartReducer,
    addresses: addressReducer,
    orders: orderReducer,
  },
});
