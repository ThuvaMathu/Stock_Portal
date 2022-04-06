import React from "react";
import { BrowserRouter as Router, Route, } from "react-router-dom";
import Home from "./components/pages/home";
import History from "./components/pages/history";
import Stock from "./components/pages/stock";
import Quote from "./components/pages/quote";

export const AppRouter= () => 
<Router>

          <Route exact path="/" component={Home}> <Home/> </Route>
          <Route path="/quote" component={Quote}> <Quote/> </Route>
          <Route path="/history" component={History}> <History/> </Route> 
          <Route path="/stock" component={Stock}> <Stock/>
          </Route>
            
</Router>
