export class ScholarshipLimitExceededError extends Error {
  constructor(year: number) {
    super(
      `Limite institucional atingido: O ano letivo de ${year} já possui o máximo de 10 bolsas ativas.`,
    );
    this.name = "ScholarshipLimitExceededError";
  }
}
