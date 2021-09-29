import React from 'react';
import {
  BrowserRouter,
  Switch,
  Route,
} from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import Characters from './pages/Characters/Characters';
import Character from './pages/Character/Character';

const Router = () => (
  <BrowserRouter>
    <Switch>
      <Route path="/character/:id">
        <Character />
      </Route>
      <Route path="/">
        <Characters />
      </Route>
    </Switch>
    <ToastContainer />
  </BrowserRouter>
);

export default Router;
