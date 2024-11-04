// src/logging/ConsoleLogger.ts
import { injectable } from "inversify";
import { Logger } from "./logger";

@injectable()
export class ConsoleLogger implements Logger {
  log(message: string): void {
    console.log(message);
  }

  error(message: string): void {
    console.error(message);
  }
}
