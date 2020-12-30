import React, { ReactElement } from 'react';
import { Button } from '@material-ui/core';
import { remote } from 'electron';
import { Database } from '../../database/Database';

export const App = (): ReactElement => {
  const database: Database = remote.getGlobal('database');

  const makeSeed = async (): Promise<void> => {
    await database.seed();
  };

  const showSeed = async (): Promise<void> => {
    console.table(await database.fetchAllUnit());
    console.table(await database.fetchAllCookType());
  };

  return (
    <div>
      <h1>Welcome to Electron React App</h1>
      <Button
        variant="contained"
        color="primary"
        onClick={(): void => {
          makeSeed();
        }}
      >
        Seed
      </Button>
      <Button
        variant="contained"
        color="primary"
        onClick={(): void => {
          showSeed();
        }}
      >
        Show seed
      </Button>
    </div>
  );
};
