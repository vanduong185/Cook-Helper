import React, { ReactElement } from 'react';
import { Switch, Route } from 'react-router-dom';
import { HomePage } from '../../features/home/HomePage';
import { ItemPage } from '../../features/items/ItemPage';
import { PartyPage } from '../../features/party/PartyPage';
import { DishesPage } from '../../features/dishes/DishesPage';
import { ToolsPage } from '../../features/tools/ToolsPage';

export const AppRouter = (): ReactElement => {
  return (
    <Switch>
      <Route path="/" exact component={HomePage} />
      <Route path="/party" component={PartyPage} />
      <Route path="/dishes" component={DishesPage} />
      <Route path="/items" component={ItemPage} />
      <Route path="/tools" component={ToolsPage} />
    </Switch>
  );
};
