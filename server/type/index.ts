export type LetterStatus = "Hit" | "Present" | "Miss";

export interface LetterResult {
  letter: string;
  status: LetterStatus;
}
