import { Badge } from "@/components/ui/badge";
import fs from "node:fs/promises";
import path from "node:path";

type KiceRow = {
  year: string;
  examType: string;
  number: string;
  category: string;
  subject: string;
};

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
      const [year, examType, number, category, subject] = row;

      if (!year || !examType || !category || !subject) {
        return null;
      }

      return {
        year: year.trim(),
        examType: examType.trim(),
        number: number?.trim() ?? "",
        category: category.trim(),
        subject: subject.trim(),
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

      <div className="space-y-8">
        {years.map((year, index) => (
          <div key={year} className="relative flex gap-6">
            <div className="relative flex w-16 flex-col items-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full border border-zinc-200 bg-background text-base font-semibold text-zinc-900 shadow-sm dark:border-zinc-800 dark:text-zinc-100">
                {year}
              </div>
              {index !== years.length - 1 ? (
                <div className="mt-4 h-full w-px bg-zinc-200 dark:bg-zinc-800" />
              ) : null}
            </div>
            <div className="flex-1 space-y-5 pt-1">
              {EXAM_TYPES.map((examType) => {
                const items = yearMap.get(year)?.get(examType) ?? [];
                return (
                  <div key={`${year}-${examType}`} className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Badge variant="default">{examType}</Badge>
                    </div>
                    <div className="space-y-2">
                      {items.length === 0 ? (
                        <p className="text-sm text-muted-foreground">
                          해당 시험 데이터가 없습니다.
                        </p>
                      ) : (
                        items.map((item) => (
                          <div
                            key={`${year}-${examType}-${item.number}-${item.subject}`}
                            className="flex flex-wrap items-center gap-2"
                          >
                            <Badge variant="secondary">{item.category}</Badge>
                            <span className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                              {item.subject}
                            </span>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
