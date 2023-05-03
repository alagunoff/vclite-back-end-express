interface LoginDataValidationErrors {
  username?: string;
  password?: string;
}

interface ValidatedLoginData {
  username: string;
  password: string;
}

export type { LoginDataValidationErrors, ValidatedLoginData };
