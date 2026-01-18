import { PDFDocument } from "pdf-lib";
import * as fs from "fs";

type SplitRange = {
  start: number;      // 1-based
  end: number;        // 1-based (inclusive)
  filename: string;
};

async function splitPdfWithNames(
  inputPath: string,
  ranges: SplitRange[]
) {
  const inputBytes = fs.readFileSync(inputPath);
  const srcPdf = await PDFDocument.load(inputBytes);
  const totalPages = srcPdf.getPageCount();

  for (const { start, end, filename } of ranges) {
    if (start < 1 || end > totalPages || start > end) {
      throw new Error(`잘못된 페이지 범위: ${start}~${end}`);
    }

    const newPdf = await PDFDocument.create();

    const pageIndices = [];
    for (let i = start - 1; i <= end - 1; i++) {
      pageIndices.push(i);
    }

    const copiedPages = await newPdf.copyPages(srcPdf, pageIndices);
    copiedPages.forEach((page: any) => newPdf.addPage(page));

    const pdfBytes = await newPdf.save();
    fs.writeFileSync(filename, pdfBytes);
  }
}

// 사용 예시
(async () => {
  await splitPdfWithNames("input.pdf", [
    { start: 1, end: 3, filename: "pages_1_3.pdf" },
    { start: 2, end: 4, filename: "pages_2_4.pdf" },
    { start: 3, end: 5, filename: "pages_3_5.pdf" },
  ]);
})();
