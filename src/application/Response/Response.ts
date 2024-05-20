export enum ResponseStatus {
  SUCCESS = 'success',
  FAILED = 'failed',
  ERROR = 'error',
}

export interface IResponse<T extends object> {
  status: ResponseStatus;
  message: string;
  data: T;
}

export class ResponseDTO implements IResponse<object> {
  status: ResponseStatus;
  message: string;
  data: object;

  constructor(status: ResponseStatus, message: string, data: object = {}) {
    this.status = status;
    this.message = message;
    this.data = data;
  }
}
