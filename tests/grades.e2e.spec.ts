import { test, expect } from "@playwright/test";

test.describe("Grades Module - School Board Layout Workflow", () => {
  test("should allow a teacher to fill out the form and submit a grade successfully", async ({
    page,
  }) => {
    // O robô acessa o dashboard
    await page.goto("http://localhost:3000");

    // Garante que o cabeçalho técnico da escola carregou perfeitamente
    await expect(page.locator("h1")).toContainText(
      "Painel de Monitoramento de Rendimento (ENEM",
    );

    // Simula o preenchimento do valor da nota e do tipo
    await page.locator("input[type='number']").fill("85.50");
    await page.locator("select").first().selectOption("SIMULATED_ENEM");

    // Preenche os UUIDs obrigatórios de relacionamento nos inputs
    await page
      .getByPlaceholder("UUID do Aluno")
      .fill("a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11");
    await page
      .getByPlaceholder("UUID do Professor")
      .fill("b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a22");
    await page
      .getByPlaceholder("UUID da Turma")
      .fill("c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a33");

    // Captura o alerta nativo de sucesso para confirmação
    page.on("dialog", async (dialog) => {
      expect(dialog.message()).toContain(
        "Nota lançada com sucesso no sistema!",
      );
      await dialog.accept();
    });

    // Clica no botão de submissão
    await page.locator("button[type='submit']").click();
  });
});
