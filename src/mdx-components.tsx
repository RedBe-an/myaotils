import type { MDXComponents } from "mdx/types";

import {
  Blockquote,
  H1,
  H2,
  H3,
  H4,
  InlineCode,
  List,
  P,
  Small,
  Table,
  TableCell,
  TableHead,
  TableRow,
} from "@/components/ui/typography";
import { CodeBlock } from "@/components/ui/code-block";

const components: MDXComponents = {
  h1: ({ className, ...props }) => <H1 className={className} {...props} />,
  h2: ({ className, ...props }) => <H2 className={className} {...props} />,
  h3: ({ className, ...props }) => <H3 className={className} {...props} />,
  h4: ({ className, ...props }) => <H4 className={className} {...props} />,
  p: ({ className, ...props }) => <P className={className} {...props} />,
  blockquote: ({ className, ...props }) => (
    <Blockquote className={className} {...props} />
  ),
  ul: ({ className, ...props }) => <List className={className} {...props} />,
  pre: ({ className, ...props }) => (
    <CodeBlock className={className} {...props} />
  ),
  code: ({ className, ...props }) => {
    const isBlock = className?.includes("language-");
    if (isBlock) {
      return <code className={className} {...props} />;
    }
    return <InlineCode className={className} {...props} />;
  },
  table: ({ className, ...props }) => (
    <Table className={className} {...props} />
  ),
  tr: ({ className, ...props }) => (
    <TableRow className={className} {...props} />
  ),
  th: ({ className, ...props }) => (
    <TableHead className={className} {...props} />
  ),
  td: ({ className, ...props }) => (
    <TableCell className={className} {...props} />
  ),
  small: ({ className, ...props }) => (
    <Small className={className} {...props} />
  ),
};

export function useMDXComponents(): MDXComponents {
  return components;
}
