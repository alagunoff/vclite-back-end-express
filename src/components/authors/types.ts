interface ValidatedCreationData {
  description?: string;
  userId: number;
}

interface ValidatedUpdateData {
  description?: string;
}

interface ValidationErrors {
  description?: string;
  userId?: string;
}

export type { ValidatedCreationData, ValidatedUpdateData, ValidationErrors };
