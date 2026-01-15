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
    <article className="mx-auto mt-8 w-full max-w-3xl px-6">
      <header className="mb-8">
        <h1 className="mb-2 text-3xl font-semibold tracking-tight">
          {post.title}
        </h1>
        <p className="text-sm text-muted-foreground">{post.description}</p>
        <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
          <span>{post.date}</span>
          <span>•</span>
          <span>{post.readingMinutes} min read</span>
          <span>•</span>
          <span>{post.wordCount} words</span>
        </div>
      </header>
      <section>{content}</section>
    </article>
  );
}
