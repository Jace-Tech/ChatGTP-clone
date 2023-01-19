export class CustomError extends Error {
  statusCode: number;
  name: string;

  constructor(message: string, statusCode: number = 400) {
    super(message)
    this.statusCode = statusCode
    this.name = this.constructor.name
  }
}