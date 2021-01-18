import React, { ReactElement } from 'react';
import { Switch, Route } from 'react-router-dom';
import { HomePage } from '../../features/home/HomePage';
import { ItemPage } from '../../features/items/ItemPage';
import { PartyPage } from '../../features/party/PartyPage';
import { DishPage } from '../../features/dishes/DishPage';
import { ToolPage } from '../../features/tools/ToolPage';
import { PartyStatsPage } from '../../features/party-stats/PartyStatsPage';

export const AppRouter = (): ReactElement => {
  return (
    <Switch>
      <Route path="/" exact component={HomePage} />
      <Route path="/party" component={PartyPage} />
      <Route path="/party-stats" component={PartyStatsPage} />
      <Route path="/dishes" component={DishPage} />
      <Route path="/items" component={ItemPage} />
      <Route path="/tools" component={ToolPage} />
    </Switch>
  );
};
