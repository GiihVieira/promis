import type { PDFFont, PDFPage } from "pdf-lib";

export function drawMultilineText(
  page: PDFPage,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number,
  font: PDFFont,
  size: number
): number {
  const words = text.split(" ");
  let line = "";
  let cursorY = y;

  for (const word of words) {
    const testLine = line + word + " ";
    const width = font.widthOfTextAtSize(testLine, size);

    if (width > maxWidth) {
      page.drawText(line.trim(), { x, y: cursorY, size, font });
      line = word + " ";
      cursorY -= lineHeight;
    } else {
      line = testLine;
    }
  }

  if (line) {
    page.drawText(line.trim(), { x, y: cursorY, size, font });
    cursorY -= lineHeight;
  }

  return cursorY;
}
