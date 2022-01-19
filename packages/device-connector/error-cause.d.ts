interface ErrorOptions {
  cause?: Error | unkown
}

interface Error {
  cause?: Error
}

interface ErrorConstructor {
  new (message?: string, options?: ErrorOptions): Error
  (message?: string, options?: ErrorOptions): Error
}
