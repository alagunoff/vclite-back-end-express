type ValidationResult =
  | {
      isValid: true;
      errors: null;
    }
  | {
      isValid: false;
      errors: Record<string, string>;
    };

export type { ValidationResult };
