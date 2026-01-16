'use client';

import { useMemo, useState } from "react";

export default function CountCharactersPage() {
  const [text, setText] = useState("");
  const stats = useMemo(() => {
    const trimmed = text ?? "";
    const charsWithSpaces = trimmed.length;
    const charsWithoutSpaces = trimmed.replace(/\s/g, "").length;
    const bytes = new TextEncoder().encode(trimmed).length;
    return {
      charsWithSpaces,
      charsWithoutSpaces,
      bytes,
    };
  }, [text]);

  return (
    <section className="surface mx-auto max-w-4xl space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">
          글자 수 세기
        </h1>
        <p className="text-sm text-muted-foreground">글자 수를 빠르게 세어보세요.</p>
      </div>
      <div className="relative">
        <textarea
          value={text}
          onChange={(event) => setText(event.target.value)}
          placeholder="텍스트를 입력하거나 붙여 넣어 주세요."
          className="min-h-80 w-full resize-none rounded-2xl border border-border/70 bg-background/80 p-6 pr-48 text-base leading-7 text-foreground shadow-inner transition focus:border-primary/60 focus:outline-none focus:ring-2 focus:ring-primary/40"
        />
        <dl className="pointer-events-none absolute bottom-4 right-4 flex flex-col items-end gap-1 rounded-lg bg-card/80 px-3 py-2 text-xs text-muted-foreground shadow-sm backdrop-blur">
          <div className="flex items-center gap-2">
            <dt className="font-medium text-foreground/70">띄어쓰기 포함</dt>
            <dd className="font-semibold text-foreground">{stats.charsWithSpaces}</dd>
          </div>
          <div className="flex items-center gap-2">
            <dt className="font-medium text-foreground/70">띄어쓰기 제외</dt>
            <dd className="font-semibold text-foreground">{stats.charsWithoutSpaces}</dd>
          </div>
          <div className="flex items-center gap-2">
            <dt className="font-medium text-foreground/70">Bytes</dt>
            <dd className="font-semibold text-foreground">{stats.bytes}</dd>
          </div>
        </dl>
      </div>
    </section>
  );
}
