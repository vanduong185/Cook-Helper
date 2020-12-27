import Database from '../database/Database';

declare global {
  namespace NodeJS {
    interface Global {
      database: Database;
    }
  }
}
