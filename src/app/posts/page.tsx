import Link from "next/link";
import { getAllPosts } from "@/lib/post";

export const metadata = {
  title: "Posts",
  description: "All posts",
};

export default function PostPage() {
  const posts = getAllPosts();

  return (
    <section className="surface mx-auto max-w-3xl space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">
          Posts
        </h1>
        <p className="text-sm text-muted-foreground">All posts</p>
      </div>
      <ul className="space-y-4">
        {posts.map((post) => (
          <li
            key={post.slug}
            className="rounded-2xl border border-zinc-200/70 bg-white/70 p-5 backdrop-blur transition-colors hover:border-emerald-500/40 dark:border-zinc-800/80 dark:bg-zinc-950/60 dark:hover:border-emerald-400/40"
          >
            <Link
              href={`/posts/${post.slug}`}
              className="text-lg font-semibold text-zinc-900 transition-colors hover:text-emerald-500 dark:text-zinc-100 dark:hover:text-emerald-400"
            >
              {post.title}
            </Link>
            <p className="mt-2 text-sm text-muted-foreground">
              {post.description}
            </p>
            <div className="mt-4 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
              <span>{post.date}</span>
              <span>•</span>
              <span>{post.readingMinutes} min read</span>
              <span>•</span>
              <span>{post.wordCount} words</span>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
