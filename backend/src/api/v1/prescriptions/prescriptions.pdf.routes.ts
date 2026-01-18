import { Hono } from "hono";
import type { AppEnv } from "../../../app/types";
import { authMiddleware } from "../../../app/middlewares/auth.middleware";
import {
  getPrescriptionById,
  getDentistInfo,
} from "./prescriptions.service";
import { generatePrescriptionPdf } from "../../../pdf/generate-receipt";

export function registerPrescriptionPdfRoutes(app: Hono<AppEnv>) {
  app.get(
    "/api/v1/prescriptions/:id/pdf",
    authMiddleware,
    async (c) => {
      const prescriptionId = c.req.param("id");

      // ===== PRESCRIÇÃO =====
      const prescription = await getPrescriptionById(
        c.env.DB,
        prescriptionId
      );

      if (!prescription) {
        return c.json({ error: "Prescription not found" }, 404);
      }

      // ===== TEMPLATE PDF =====
      const templateResponse = await fetch(
        new URL("./pdf/receituario.template.pdf", c.req.url)
      );

      if (!templateResponse.ok) {
        return c.json(
          { error: "PDF template not found" },
          500
        );
      }

      const templateBytes = await templateResponse.arrayBuffer();

      // ===== DENTISTA =====
      const dentist = await getDentistInfo(
        c.env.DB,
        prescription.dentist_id
      );

      if (!dentist) {
        return c.json(
          { error: "Dentist not found" },
          500
        );
      }

      // ===== ITENS DA PRESCRIÇÃO (FORMATO PDF) =====
      const items = prescription.items.map((item) => ({
        title: item.medication_name,
        description: item.posology,
      }));

      // ===== DATA POR EXTENSO =====
      const dateExtenso = new Date(
        prescription.created_at
      ).toLocaleDateString("pt-BR", {
        day: "numeric",
        month: "long",
        year: "numeric",
      });

      // ===== GERAR PDF =====
      const pdfBuffer = await generatePrescriptionPdf(
        templateBytes,
        {
          patientName: "Paciente", // TODO: ligar com tabela patients
          dentistName: dentist.name,
          cro: dentist.cro ? `${dentist.cro}` : undefined,
          dateExtenso,
          items,
        }
      );

      // ===== RESPONSE =====
      return new Response(pdfBuffer, {
        headers: {
          "Content-Type": "application/pdf",
          "Content-Disposition":
            'inline; filename="receituario.pdf"',
        },
      });
    }
  );
}
