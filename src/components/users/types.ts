interface ValidatedCreationData {
  image: string;
  username: string;
  password: string;
  firstName?: string;
  lastName?: string;
}

interface CreationDataValidationErrors {
  image?: string;
  username?: string;
  password?: string;
  firstName?: string;
  lastName?: string;
}

export type { ValidatedCreationData, CreationDataValidationErrors };
