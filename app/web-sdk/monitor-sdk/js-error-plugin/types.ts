import { StackFrame } from "error-stack-parser";

export interface JsErrorPayload {
  type: string;
  name: string;
  message: string;
  stack?: StackFrame[];
}
