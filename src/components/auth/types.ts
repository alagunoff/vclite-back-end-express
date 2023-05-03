interface ValidatedLoginData {
  username: string;
  password: string;
}

interface LoginDataValidationErrors {
  username?: string;
  password?: string;
}

export type { ValidatedLoginData, LoginDataValidationErrors };
