import { EntityNotFoundError, QueryFailedError } from 'typeorm';

export enum DbException {
  UniqueViolation = '23505',
  ForeignKeyViolation = '23503',
  NotFound = '02000',
  InternalServerError = 'Internal server error',
}

export class DBExceptionHandler {
  static handleError(error: any): DbException {
    switch (error.constructor) {
      case QueryFailedError: // this is a TypeOrm error
        const errorCode = (error as QueryFailedError)
          .driverError as QueryFailedErrorCode;
        if (errorCode.code === DbException.UniqueViolation) {
          return DbException.UniqueViolation;
        }

        return DbException.InternalServerError;

      case EntityNotFoundError: // this is another TypeOrm error
        return DbException.NotFound;

      default:
        return DbException.InternalServerError;
    }
  }
}

export type QueryFailedErrorCode = {
  code: string;
};
