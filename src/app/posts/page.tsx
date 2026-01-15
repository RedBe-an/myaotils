import Link from 'next/link';
import { getAllPosts } from '@/lib/post';

export const metadata = {
  title: 'Posts',
  description: 'All posts',
};

export default function PostPage() {
  const posts = getAllPosts();

  return (
    <div className="mx-auto w-full max-w-3xl px-6 py-12">
      <h1 className="text-3xl font-semibold tracking-tight">Posts</h1>
      <ul className="mt-8 space-y-6">
        {posts.map((post) => (
          <li key={post.slug} className="rounded-lg border border-border p-4">
            <Link
              href={`/posts/${post.slug}`}
              className="text-lg font-bold text-foreground hover:underline"
            >
              {post.title}
            </Link>
            <p className="mt-2 text-sm text-muted-foreground">
              {post.description}
            </p>
            <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
              <span>{post.date}</span>
              <span>•</span>
              <span>{post.readingMinutes} min read</span>
              <span>•</span>
              <span>{post.wordCount} words</span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}