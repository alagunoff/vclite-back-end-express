interface ValidatedCreationData {
  content: string;
  postId: number;
}

interface ValidationErrors {
  content?: string;
}

export type { ValidatedCreationData, ValidationErrors };
