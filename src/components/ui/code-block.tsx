"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

function getTextFromNode(node: React.ReactNode): string {
  if (node === null || node === undefined) {
    return "";
  }
  if (typeof node === "string" || typeof node === "number") {
    return String(node);
  }
  if (Array.isArray(node)) {
    return node.map(getTextFromNode).join("");
  }
  if (React.isValidElement(node)) {
    const element = node as React.ReactElement<{ children?: React.ReactNode }>;
    return getTextFromNode(element.props.children);
  }
  return "";
}

export function CodeBlock({ className, children, ...props }: React.HTMLAttributes<HTMLPreElement>) {
  const [copied, setCopied] = React.useState(false);
  const codeText = React.useMemo(() => getTextFromNode(children), [children]);

  const handleCopy = async () => {
    if (!codeText) {
      return;
    }
    try {
      await navigator.clipboard.writeText(codeText);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div className="code-block group relative">
      <button
        type="button"
        onClick={handleCopy}
        className="absolute right-3 top-3 z-10 rounded-md border border-white/10 bg-white/10 px-2.5 py-1 text-xs font-medium text-white/90 opacity-0 backdrop-blur transition hover:bg-white/20 focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40 group-hover:opacity-100"
        aria-label={copied ? "복사됨" : "코드 복사"}
      >
        {copied ? "복사됨" : "복사"}
      </button>
      <pre className={cn("pt-10", className)} {...props}>
        {children}
      </pre>
    </div>
  );
}
