import { StackFrame } from "error-stack-parser";

export interface JsErrorPayload {
  type: string;
  message: string;
  stack?: StackFrame[];
}
