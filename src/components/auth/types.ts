interface ValidatedLoginData {
  username: string;
  password: string;
}

interface ValidationErrors {
  username?: string;
  password?: string;
}

export type { ValidatedLoginData, ValidationErrors };
