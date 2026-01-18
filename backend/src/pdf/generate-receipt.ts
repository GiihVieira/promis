import { PDFDocument, StandardFonts, rgb } from "pdf-lib";

// ===============================
// TYPES
// ===============================
type PrescriptionPdfItem = {
  title: string;
  description: string;
};

type PrescriptionPdfData = {
  patientName: string;
  dentistName: string;
  cro?: string;
  dateExtenso: string;
  items: PrescriptionPdfItem[];
};

// ===============================
// PAGE (A5)
// ===============================
const PAGE_WIDTH = 420;
const PAGE_HEIGHT = 595;

// ===============================
// LAYOUT (IGUAL AO PYTHON)
// ===============================
const LEFT_STRIP_WIDTH = 60;
const CONTENT_PADDING = 15;
const RIGHT_MARGIN = 30;

const CONTENT_X = LEFT_STRIP_WIDTH + CONTENT_PADDING;
const CONTENT_WIDTH = PAGE_WIDTH - CONTENT_X - RIGHT_MARGIN;

const VERTICAL_OFFSET = -30;

// ===============================
// POSIÇÕES
// ===============================
const TITLE_Y = 520 + VERTICAL_OFFSET;
const PATIENT_Y = 480 + VERTICAL_OFFSET;
const ITEMS_START_Y = 450 + VERTICAL_OFFSET;

// ===============================
// ASSINATURA
// ===============================
const SIGNATURE_WIDTH = 220;
const SIGNATURE_Y = 135;

// ===============================
// HELPERS
// ===============================
function safeText(value: unknown): string {
  if (typeof value !== "string") return "";
  return value;
}

function drawCenteredText(
  page: any,
  text: string,
  centerX: number,
  y: number,
  size: number,
  font: any
) {
  const safe = safeText(text);
  const textWidth = font.widthOfTextAtSize(safe, size);

  page.drawText(safe, {
    x: centerX - textWidth / 2,
    y,
    size,
    font,
  });
}

// ===============================
// MAIN
// ===============================
export async function generatePrescriptionPdf(
  templateBytes: ArrayBuffer,
  data: PrescriptionPdfData
): Promise<ArrayBuffer> {
  const pdfDoc = await PDFDocument.load(templateBytes);
  const page = pdfDoc.getPage(0);

  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const bold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  // ===== TÍTULO =====
  drawCenteredText(
    page,
    "RECEITUÁRIO",
    CONTENT_X + CONTENT_WIDTH / 2,
    TITLE_Y,
    14,
    bold
  );

  // ===== PACIENTE =====
  page.drawText("Paciente:", {
    x: CONTENT_X,
    y: PATIENT_Y,
    size: 11,
    font: bold,
  });

  const patientName = safeText(data.patientName);
  const nameX = CONTENT_X + 70;

  page.drawText(patientName, {
    x: nameX,
    y: PATIENT_Y,
    size: 11,
    font,
  });

  const nameWidth = font.widthOfTextAtSize(patientName, 11);

  page.drawLine({
    start: { x: nameX, y: PATIENT_Y - 2 },
    end: { x: nameX + nameWidth, y: PATIENT_Y - 2 },
    thickness: 1,
    color: rgb(0, 0, 0),
  });

  // ===== ITENS =====
  let y = ITEMS_START_Y;
  let index = 1;

  for (const item of data.items ?? []) {
    const title = safeText(item.title);
    const description = safeText(item.description);

    page.drawText(`${index}) ${title}`, {
      x: CONTENT_X,
      y,
      size: 11,
      font: bold,
    });

    y -= 18;

    page.drawText(description, {
      x: CONTENT_X + 15,
      y,
      size: 10,
      font,
    });

    y -= 18 * 1.8;
    index++;
  }

  // ===== ASSINATURA =====
  const signatureX = PAGE_WIDTH - SIGNATURE_WIDTH - RIGHT_MARGIN;
  const centerX = signatureX + SIGNATURE_WIDTH / 2;

  page.drawLine({
    start: { x: signatureX, y: SIGNATURE_Y },
    end: { x: signatureX + SIGNATURE_WIDTH, y: SIGNATURE_Y },
    thickness: 1,
    color: rgb(0, 0, 0),
  });

  drawCenteredText(
    page,
    safeText(data.dentistName),
    centerX,
    SIGNATURE_Y - 18,
    10,
    font
  );

  if (data.cro) {
    drawCenteredText(
      page,
      safeText(data.cro),
      centerX,
      SIGNATURE_Y - 32,
      9,
      font
    );
  }

  drawCenteredText(
    page,
    safeText(data.dateExtenso),
    centerX,
    SIGNATURE_Y - 46,
    9,
    font
  );

  const bytes = await pdfDoc.save();
  return bytes.slice().buffer;
}
