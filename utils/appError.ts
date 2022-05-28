export class AppError extends Error {
  constructor(readonly message: string) {
    super('AppError. ' + message || '')
  }
}