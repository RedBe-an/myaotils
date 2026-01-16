"use client";

import { useMemo, useState } from "react";

const parseItems = (value: string) =>
  value
    .split(/[\n,]+/)
    .map((item) => item.trim())
    .filter(Boolean);

export default function RandomPickerPage() {
  const [itemsInput, setItemsInput] = useState("");
  const [picked, setPicked] = useState<string | null>(null);

  const items = useMemo(() => parseItems(itemsInput), [itemsInput]);

  const handlePick = () => {
    if (items.length === 0) {
      setPicked(null);
      return;
    }
    const index = Math.floor(Math.random() * items.length);
    setPicked(items[index]);
  };

  const handleReset = () => {
    setItemsInput("");
    setPicked(null);
  };

  return (
    <section className="surface mx-auto max-w-4xl space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">
          랜덤 뽑기
        </h1>
        <p className="text-sm text-muted-foreground">
          랜덤하게 무언가를 선택해야 할 때 유용한 도구입니다.
        </p>
      </div>
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-3">
          <div className="space-y-1">
            <h2 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">
              후보 목록
            </h2>
            <p className="text-xs text-muted-foreground">
              쉼표 또는 줄바꿈으로 구분해 입력하세요.
            </p>
          </div>
          <textarea
            className="min-h-45 w-full rounded-lg border border-zinc-200 bg-background px-3 py-2 text-sm text-zinc-900 shadow-sm outline-none transition focus:border-zinc-400 dark:border-zinc-800 dark:text-zinc-100"
            placeholder="예: 피자, 햄버거, 김밥"
            value={itemsInput}
            onChange={(event) => setItemsInput(event.target.value)}
          />
          <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
            <span>총 {items.length}개 항목</span>
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={handlePick}
              className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900"
            >
              뽑기
            </button>
            <button
              type="button"
              onClick={handleReset}
              className="rounded-lg border border-zinc-200 px-4 py-2 text-sm font-semibold text-zinc-700 shadow-sm transition hover:bg-zinc-50 dark:border-zinc-800 dark:text-zinc-200 dark:hover:bg-zinc-900"
            >
              초기화
            </button>
          </div>
        </div>
        <div className="space-y-3">
          <div className="space-y-1">
            <h2 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">
              결과
            </h2>
            <p className="text-xs text-muted-foreground">
              뽑기 결과가 여기에 표시됩니다.
            </p>
          </div>
          <div className="flex min-h-45 items-center justify-center rounded-lg border border-dashed border-zinc-200 bg-zinc-50 px-4 py-6 text-center dark:border-zinc-800 dark:bg-zinc-900">
            {picked ? (
              <span className="text-2xl font-semibold text-zinc-900 dark:text-zinc-100">
                {picked}
              </span>
            ) : (
              <span className="text-sm text-muted-foreground">
                아직 선택된 항목이 없습니다.
              </span>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
