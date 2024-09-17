export interface FileChanges {
  fileName: string;
  patch: string;
}

export interface CodeReviewResponse {
  standards: string;
  score: number;
  codeReview: CodeReview[];
}

export interface CodeReview {
  fileName: string;
  review: string;
}
