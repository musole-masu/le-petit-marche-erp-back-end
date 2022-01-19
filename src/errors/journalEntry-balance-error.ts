import { CustomError } from "./custom-error";
export class JournalEntryBalanceError extends CustomError {
  statusCode = 400;

  constructor() {
    super(
      "Entrée de journal non valide. Transactions non équilibrées. Total non nul"
    );

    Object.setPrototypeOf(this, JournalEntryBalanceError.prototype);
  }

  serializeErrors() {
    return [
      {
        message:
          "Entrée de journal non valide. Transactions non équilibrées. Total non nul",
      },
    ];
  }
}
