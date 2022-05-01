import React from "react";
import { BrowserRouter as Router, Route, } from "react-router-dom";
import Home from "./components/pages/home";
import Stock from "./components/pages/stock";
import Quote from "./components/pages/quote";
import Company from "./components/pages/company.js";
import History from "./components/pages/pricehistory";

export const AppRouter = () =>
        <Router>

                <Route exact path="/" component={Home} />
                <Route path="/quote" component={Quote} />
                <Route path="/stock" component={Stock} />
                <Route path="/company" component={Company} />
                <Route path={['/history/:propsymbol,:propname', '/history']} component={History} />
        </Router>
