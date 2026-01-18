"use client";

import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import JSZip from "jszip";
import { useMemo, useState } from "react";

export type KiceRow = {
  year: string;
  examType: string;
  number: string;
  category: string;
  subject: string;
  id: string;
};

type ExamTypeGroup = {
  examType: string;
  items: KiceRow[];
};

type YearGroup = {
  year: string;
  examTypes: ExamTypeGroup[];
};

type Props = {
  groups: YearGroup[];
};

const createDownload = (id: string, fileName: string) => {
  const link = document.createElement("a");
  link.href = `/kice/texts/${id}.pdf`;
  link.download = fileName;
  link.rel = "noopener";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

const sanitizeFileName = (value: string) =>
  value.replace(/[\\/:*?"<>|]/g, "-").replace(/\s+/g, " ").trim();

const buildZip = async (items: KiceRow[], zipName: string) => {
  const zip = new JSZip();

  await Promise.all(
    items.map(async (item, index) => {
      const response = await fetch(`/kice/texts/${item.id}.pdf`);
      if (!response.ok) {
        return;
      }

      const blob = await response.blob();
      const fileName = sanitizeFileName(
        `${index + 1}-${item.year}-${item.examType}-${item.number || item.category}-${item.subject}-${item.id}.pdf`,
      );
      zip.file(fileName, blob);
    }),
  );

  const content = await zip.generateAsync({ type: "blob" });
  const link = document.createElement("a");
  const url = URL.createObjectURL(content);
  link.href = url;
  link.download = sanitizeFileName(zipName);
  link.rel = "noopener";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
};

export default function KiceDownloadClient({ groups }: Props) {
  const [selected, setSelected] = useState<Record<string, KiceRow>>({});
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [isZipping, setIsZipping] = useState(false);

  const selectedItems = useMemo(() => Object.values(selected), [selected]);
  const allItems = useMemo(
    () => groups.flatMap((group) => group.examTypes.flatMap((exam) => exam.items)),
    [groups],
  );
  const categories = useMemo(() => {
    const set = new Set(allItems.map((item) => item.category));
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  }, [allItems]);
  const categoryItems = useMemo(() => {
    if (categoryFilter === "all") {
      return [];
    }
    return allItems.filter((item) => item.category === categoryFilter);
  }, [allItems, categoryFilter]);

  const filteredGroups = useMemo(() => {
    if (categoryFilter === "all") {
      return groups;
    }
    return groups.map((group) => ({
      ...group,
      examTypes: group.examTypes.map((examType) => ({
        ...examType,
        items: examType.items.filter(
          (item) => item.category === categoryFilter,
        ),
      })),
    }));
  }, [groups, categoryFilter]);

  const toggleItem = (item: KiceRow, checked: boolean) => {
    setSelected((prev) => {
      const next = { ...prev };
      if (checked) {
        next[item.id] = item;
      } else {
        delete next[item.id];
      }
      return next;
    });
  };

  const handleSingleDownload = (item: KiceRow) => {
    const fileName = `${item.year}-${item.examType}-${item.number || item.category}-${item.subject}.pdf`;
    createDownload(item.id, fileName);
  };

  const handleBulkDownload = async () => {
    if (selectedItems.length === 0 || isZipping) {
      return;
    }

    setIsZipping(true);
    try {
      await buildZip(selectedItems, `kice-selected-${selectedItems.length}.zip`);
    } finally {
      setIsZipping(false);
    }
  };

  const handleCategoryDownload = async () => {
    if (categoryItems.length === 0 || isZipping) {
      return;
    }

    setIsZipping(true);
    try {
      await buildZip(
        categoryItems,
        `kice-${categoryFilter}-${categoryItems.length}.zip`,
      );
    } finally {
      setIsZipping(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2">
          <label className="text-xs font-medium text-muted-foreground" htmlFor="kice-category-filter">
            카테고리 필터
          </label>
          <select
            id="kice-category-filter"
            value={categoryFilter}
            onChange={(event) => setCategoryFilter(event.target.value)}
            className="h-9 rounded-md border border-zinc-200 bg-background px-2 text-sm text-zinc-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-zinc-500 dark:border-zinc-800 dark:text-zinc-100"
          >
            <option value="all">전체</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>
        <button
          type="button"
          onClick={handleBulkDownload}
          className="inline-flex items-center rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-white"
          disabled={selectedItems.length === 0 || isZipping}
        >
          선택 다운로드 ({selectedItems.length})
        </button>
        {categoryFilter !== "all" ? (
          <button
            type="button"
            onClick={handleCategoryDownload}
            className="inline-flex items-center rounded-md border border-zinc-200 px-4 py-2 text-sm font-medium text-zinc-900 shadow-sm transition hover:bg-zinc-100 disabled:cursor-not-allowed disabled:opacity-60 dark:border-zinc-800 dark:text-zinc-100 dark:hover:bg-zinc-900"
            disabled={categoryItems.length === 0 || isZipping}
          >
            카테고리 다운로드 ({categoryItems.length})
          </button>
        ) : null}
        <span className="text-xs text-muted-foreground">
          지문 주제를 클릭하면 즉시 PDF를 내려받습니다.
        </span>
      </div>

      {filteredGroups.map((group, index) => (
        <div key={group.year} className="relative flex gap-6">
          <div className="relative flex w-16 flex-col items-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full border border-zinc-200 bg-background text-base font-semibold text-zinc-900 shadow-sm dark:border-zinc-800 dark:text-zinc-100">
              {group.year}
            </div>
            {index !== groups.length - 1 ? (
              <div className="mt-4 h-full w-px bg-zinc-200 dark:bg-zinc-800" />
            ) : null}
          </div>
          <div className="flex-1 space-y-5 pt-1">
            {group.examTypes.map((examTypeGroup) => (
              <div key={`${group.year}-${examTypeGroup.examType}`} className="space-y-3">
                <div className="flex items-center gap-2">
                  <Badge variant="default">{examTypeGroup.examType}</Badge>
                </div>
                <div className="space-y-2">
                  {examTypeGroup.items.length === 0 ? (
                    <p className="text-sm text-muted-foreground">
                      해당 시험 데이터가 없습니다.
                    </p>
                  ) : (
                    examTypeGroup.items.map((item) => {
                      const checkboxId = `${item.year}-${item.examType}-${item.number}-${item.subject}`;
                      const isChecked = Boolean(selected[item.id]);

                      return (
                        <div
                          key={`${item.year}-${item.examType}-${item.number}-${item.subject}`}
                          className="flex flex-wrap items-center gap-2"
                        >
                          <Checkbox
                            id={checkboxId}
                            checked={isChecked}
                            onCheckedChange={(checked) => toggleItem(item, Boolean(checked))}
                          />
                          <Badge variant="secondary">{item.category}</Badge>
                          <button
                            type="button"
                            onClick={() => handleSingleDownload(item)}
                            className="text-left text-sm font-medium text-zinc-900 transition hover:text-zinc-600 dark:text-zinc-100 dark:hover:text-zinc-300"
                          >
                            {item.subject}
                          </button>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
