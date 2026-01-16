import { notFound } from "next/navigation";
import { compileMdx } from "@/lib/mdx";
import { getAllPosts } from "@/lib/post";

export const dynamicParams = false;

export async function generateStaticParams() {
  return getAllPosts().map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getAllPosts().find((v) => v.slug === slug);

  if (!post) {
    return {
      title: "Post not found",
    };
  }

  return {
    title: post.title,
    description: post.description,
  };
}

export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getAllPosts().find((v) => v.slug === slug);

  if (!post) {
    notFound();
  }

  const { content } = await compileMdx(post.content);

  return (
    <article className="surface mx-auto max-w-3xl space-y-8">
      <header className="space-y-3">
        <h1 className="text-3xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">
          {post.title}
        </h1>
        <p className="text-sm text-muted-foreground">{post.description}</p>
        <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
          <span>{post.date}</span>
          <span>•</span>
          <span>{post.readingMinutes} min read</span>
          <span>•</span>
          <span>{post.wordCount} words</span>
        </div>
      </header>
      <div className="prose prose-zinc max-w-none dark:prose-invert">
        {content}
      </div>
    </article>
  );
}
