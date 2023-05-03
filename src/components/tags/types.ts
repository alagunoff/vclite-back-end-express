interface ValidatedCreationData {
  name: string;
}

interface ValidatedUpdateData {
  name?: string;
}

interface ValidationErrors {
  name?: string;
}

export type { ValidatedCreationData, ValidatedUpdateData, ValidationErrors };
