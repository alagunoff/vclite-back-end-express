interface ValidatedCreationData {
  image: string;
  username: string;
  password: string;
  firstName?: string;
  lastName?: string;
}

interface ValidationErrors {
  image?: string;
  username?: string;
  password?: string;
  firstName?: string;
  lastName?: string;
}

export type { ValidatedCreationData, ValidationErrors };
