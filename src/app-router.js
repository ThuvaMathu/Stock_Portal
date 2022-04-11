import React from "react";
import { BrowserRouter as Router, Route, } from "react-router-dom";
import Home from "./components/pages/home";
import History2 from "./components/pages/history2";
import Stock from "./components/pages/stock";
import Quote from "./components/pages/quote";
import Company from "./components/pages/company.js";
export const AppRouter= () => 
<Router>

          <Route exact path="/" component={Home}/>
          <Route path="/quote" component={Quote}/>
          <Route path="/history" component={History2}/> 
          <Route path="/stock" component={Stock}></Route>
         
          <Route path="/company" component={Company}/> 
          
            
</Router>
