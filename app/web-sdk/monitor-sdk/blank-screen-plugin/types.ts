import { ReportedEvent } from "../types";

export interface BlankScreenPayload {
  score: number;
  screenshot?: string;
  relatedEvents?: ReportedEvent[];
}
