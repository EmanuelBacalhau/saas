export class UnauthorizedRequest extends Error {
  constructor(message?: string) {
    super(message || 'Unauthorized')
  }
}
