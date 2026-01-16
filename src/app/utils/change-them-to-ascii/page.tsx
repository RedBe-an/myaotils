"use client";

import { useMemo, useState } from "react";

const toAscii = (value: string) => {
  const codes: string[] = [];
  for (const char of value) {
    const code = char.codePointAt(0);
    if (code !== undefined) {
      codes.push(String(code));
    }
  }
  return codes.join(" ");
};

const toText = (value: string) => {
  const tokens = value.split(/[\s,]+/).filter(Boolean);
  const chars: string[] = [];

  tokens.forEach((token) => {
    const code = Number.parseInt(token, 10);
    if (
      !Number.isNaN(code) &&
      Number.isFinite(code) &&
      code >= 0 &&
      code <= 0x10ffff
    ) {
      chars.push(String.fromCodePoint(code));
    }
  });

  return chars.join("");
};

export default function AsciiChangePage() {
  const [textInput, setTextInput] = useState("");
  const [asciiInput, setAsciiInput] = useState("");

  const asciiOutput = useMemo(() => toAscii(textInput), [textInput]);
  const textOutput = useMemo(() => toText(asciiInput), [asciiInput]);

  return (
    <section className="surface mx-auto max-w-4xl space-y-10">
      <div className="space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">
          아스키코드 변환
        </h1>
        <p className="text-sm text-muted-foreground">
          텍스트를 아스키코드로 변환하거나, 아스키코드를 텍스트로 변환해요.
        </p>
      </div>
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-3">
          <div className="space-y-1">
            <h2 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">
              텍스트 → 아스키코드
            </h2>
            <p className="text-xs text-muted-foreground">
              입력한 텍스트를 공백으로 구분된 코드로 변환합니다.
            </p>
          </div>
          <textarea
            className="min-h-40 w-full rounded-lg border border-zinc-200 bg-background px-3 py-2 text-sm text-zinc-900 shadow-sm outline-none transition focus:border-zinc-400 dark:border-zinc-800 dark:text-zinc-100"
            placeholder="변환할 텍스트를 입력하세요."
            value={textInput}
            onChange={(event) => setTextInput(event.target.value)}
          />
          <textarea
            className="min-h-40 w-full rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm text-zinc-900 shadow-sm outline-none dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-100"
            placeholder="여기에 아스키코드 결과가 표시됩니다."
            value={asciiOutput}
            readOnly
          />
        </div>

        <div className="space-y-3">
          <div className="space-y-1">
            <h2 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">
              아스키코드 → 텍스트
            </h2>
            <p className="text-xs text-muted-foreground">
              공백/쉼표로 구분된 숫자 코드를 입력하세요.
            </p>
          </div>
          <textarea
            className="min-h-40 w-full rounded-lg border border-zinc-200 bg-background px-3 py-2 text-sm text-zinc-900 shadow-sm outline-none transition focus:border-zinc-400 dark:border-zinc-800 dark:text-zinc-100"
            placeholder="예: 72 101 108 108 111"
            value={asciiInput}
            onChange={(event) => setAsciiInput(event.target.value)}
          />
          <textarea
            className="min-h-40 w-full rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm text-zinc-900 shadow-sm outline-none dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-100"
            placeholder="여기에 텍스트 결과가 표시됩니다."
            value={textOutput}
            readOnly
          />
        </div>
      </div>
    </section>
  );
}
