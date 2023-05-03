interface ValidatedCreationData {
  name: string;
}

interface CreationDataValidationErrors {
  name?: string;
}

interface ValidatedUpdateData {
  name?: string;
}

interface UpdateDataValidationErrors {
  name?: string;
}

export type {
  ValidatedCreationData,
  CreationDataValidationErrors,
  ValidatedUpdateData,
  UpdateDataValidationErrors,
};
