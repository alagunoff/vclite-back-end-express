type ValidationResult =
  | {
      isValid: true;
      errors: null;
    }
  | {
      isValid: false;
      errors: Record<string, unknown>;
    };

export type { ValidationResult };
