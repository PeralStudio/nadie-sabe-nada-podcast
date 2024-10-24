import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { BrowserRouter as Router } from "react-router-dom";
import NavBar from "./components/Header/Header";
import ScrollToTop from "./components/ScrollToTop/ScrollToTop";
import { HelmetProvider } from "react-helmet-async";
import { Provider } from 'react-redux';
import { store } from './store/store';

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
    <React.StrictMode>
        <Provider store={store}>
            <Router>
                <NavBar />
                <HelmetProvider>
                    <App />
                </HelmetProvider>
                <ScrollToTop />
            </Router>
        </Provider>
    </React.StrictMode>
);