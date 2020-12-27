import React, { ReactElement } from 'react';
import { Button } from '@material-ui/core';
import { remote } from 'electron';
import { Database } from '../../database/Database';

export const App = (): ReactElement => {
  const database: Database = remote.getGlobal('database');

  const testDatabase = async (): Promise<void> => {
    const insert = await database.insert('test');

    console.log('Insert: ');
    console.table(insert);
    console.log('Fetch: ');
    console.table(await database.fetchAll());
  };

  return (
    <div>
      <h1>Welcome to Electron React App</h1>
      <Button
        variant="contained"
        color="primary"
        onClick={(): void => {
          testDatabase();
        }}
      >
        Test Database
      </Button>
    </div>
  );
};
