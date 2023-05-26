class ApiError {
  readonly code: number;
  readonly reason?: string;

  constructor(code: number, reason?: string) {
    this.code = code;
    this.reason = reason;
  }
}

export { ApiError };
