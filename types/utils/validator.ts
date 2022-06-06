import type { ValidationError } from 'yup'
import { AppError } from '../../utils/appError'

const isValidationError = (err: any): err is ValidationError => {
  return typeof err === 'object' && err.message && err.path
}

export type InputErrorsMap = Record<string, string[]>

export abstract class Validator {
  abstract schema: any
  constructor(protected yup: any) { }

  public async validate (
    data: Record<string, any>
  ): Promise<InputErrorsMap | undefined> {
    let result: undefined | InputErrorsMap = undefined
    try {
      await this.schema.validate(data, { abortEarly: false })
    } catch (err: any) {
      const errors = Object.values(err.inner)
      result = {}
      for (const err of errors) {
        if (isValidationError(err)) {
          if (!err.path) {
            throw new AppError(
              'path is a required key in validation error.'
            )
          }
          result[err.path] = result[err.path]
            ? [...result[err.path], err.message]
            : [err.message]
        }
      }
    }
    return result
  }
}
