import KiceDownloadClient, {
  type KiceRow,
} from "@/app/utils/kice-korean-download/KiceDownloadClient";
import fs from "node:fs/promises";
import path from "node:path";

const EXAM_TYPES = ["수능", "9모", "6모"] as const;

const parseCsv = (input: string) => {
  const rows: string[][] = [];
  let currentField = "";
  let currentRow: string[] = [];
  let inQuotes = false;

  for (let i = 0; i < input.length; i += 1) {
    const char = input[i];

    if (char === '"') {
      const nextChar = input[i + 1];
      if (inQuotes && nextChar === '"') {
        currentField += '"';
        i += 1;
      } else {
        inQuotes = !inQuotes;
      }
      continue;
    }

    if (char === "," && !inQuotes) {
      currentRow.push(currentField.trim());
      currentField = "";
      continue;
    }

    if ((char === "\n" || char === "\r") && !inQuotes) {
      if (char === "\r" && input[i + 1] === "\n") {
        i += 1;
      }

      if (currentField.length > 0 || currentRow.length > 0) {
        currentRow.push(currentField.trim());
        rows.push(currentRow);
      }

      currentField = "";
      currentRow = [];
      continue;
    }

    currentField += char;
  }

  if (currentField.length > 0 || currentRow.length > 0) {
    currentRow.push(currentField.trim());
    rows.push(currentRow);
  }

  return rows;
};

const normalizeRows = (rows: string[][]): KiceRow[] => {
  const [, ...dataRows] = rows;

  return dataRows
    .map((row) => {
      const [year, examType, number, category, subject, id] = row;

      if (!year || !examType || !category || !subject || !id) {
        return null;
      }

      return {
        year: year.trim(),
        examType: examType.trim(),
        number: number?.trim() ?? "",
        category: category.trim(),
        subject: subject.trim(),
        id: id.trim(),
      };
    })
    .filter((row): row is KiceRow => row !== null);
};

export default async function UtilsPage() {
  const filePath = path.join(
    process.cwd(),
    "public",
    "kice",
    "map-of-kice.csv",
  );
  const csv = await fs.readFile(filePath, "utf8");
  const rows = normalizeRows(parseCsv(csv));

  const yearMap = new Map<
    string,
    Map<(typeof EXAM_TYPES)[number], KiceRow[]>
  >();

  rows.forEach((row) => {
    const examType = row.examType as (typeof EXAM_TYPES)[number];
    if (!EXAM_TYPES.includes(examType)) {
      return;
    }

    const yearGroup = yearMap.get(row.year) ?? new Map();
    const items = yearGroup.get(examType) ?? [];
    items.push(row);
    yearGroup.set(examType, items);
    yearMap.set(row.year, yearGroup);
  });

  const years = Array.from(yearMap.keys()).sort(
    (a, b) => Number(b) - Number(a),
  );

  const groups = years.map((year) => ({
    year,
    examTypes: EXAM_TYPES.map((examType) => ({
      examType,
      items: yearMap.get(year)?.get(examType) ?? [],
    })),
  }));

  return (
    <section className="surface mx-auto max-w-4xl space-y-10">
      <div className="space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">
          평가원 국어 지문 다운로드
        </h1>
        <p className="text-sm text-muted-foreground">
          평가원 국어 지문을 원하는 형식으로 변환하고 내려받을 수 있는
          도구입니다.
        </p>
      </div>

      <KiceDownloadClient groups={groups} />
    </section>
  );
}
