import React from 'react';
import {Route} from 'react-router';
import App from './components/App';
import Success from './components/Success';
import Home from './components/Home';
import Products from './components/Products';
import Company from './components/Company';
import Introduction from './components/Introduction';
import PolicyList from './components/PolicyList';
import OrderList from './components/OrderList';
import Policy from './components/Policy';
import InsuredCondition from './components/InsuredCondition';
import Order from './components/Order';
import InsuredDetail from './components/InsuredDetail';
import PolicyBuy from './components/PolicyBuy';
import Partners from './components/Partners';

export default (
  <Route component={App}>
    <Route path='/' component={Home} />
    <Route path='/home' component={Home} />
    <Route path='/products' component={Products} />
    <Route path='/policys' component={PolicyList} />
    <Route path='/orders' component={OrderList} />
    <Route path='/company' component={Company} />
    <Route path='/introduction/:code' component={Introduction} />
    <Route path='/success' component={Success} />
    <Route path='/insured/condition' component={InsuredCondition} />
    <Route path='/insured/detail' component={InsuredDetail} />
    <Route path='/policy/:id' component={Policy} />
    <Route path='/policy/buy/sweet' component={PolicyBuy}>
        <Route path='/policy/buy/sweet/:id' component={PolicyBuy} />
    </Route>
    <Route path='/order/:id' component={Order} />
    <Route path='/partners' component={Partners} />
  </Route>
);
