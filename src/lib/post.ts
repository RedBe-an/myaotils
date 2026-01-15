import { sync } from "glob";
import path from "path";
import dayjs from "dayjs";
import fs from "fs";
import matter from "gray-matter";
import readingTime from "reading-time";

const POSTS_PATH = path.join(process.cwd(), "src", "posts");

const parsePost = (postPath: string): Post | undefined => {
  try {
    const file = fs.readFileSync(postPath, { encoding: "utf8" });
    const { content, data } = matter(file);
    const grayMatter = data as PostMatter;

    if (grayMatter.draft) {
      return;
    }

    const relativePath = path
      .relative(POSTS_PATH, postPath)
      .replace(/\\/g, "/")
      .replace(".mdx", "");

    return {
      ...grayMatter,
      tags: grayMatter.tags.filter(Boolean),
      date: dayjs(grayMatter.date).format("YYYY-MM-DD"),
      content,
      slug: relativePath,
      readingMinutes: Math.ceil(readingTime(content).minutes),
      wordCount: content.split(/\s+/gu).length,
    };
  } catch (e) {
    console.error(e);
  }
};

export const getAllPosts = () => {
  const postPaths: string[] = sync(`${POSTS_PATH}/**/*.mdx`);
  return postPaths.reduce<Post[]>((ac, postPath) => {
    const post = parsePost(postPath);
    if (!post) return ac;

    return [...ac, post];
  }, []);
};

type PostMatter = {
  title: string;
  description: string;
  tags: string[];
  draft?: boolean;
  date: string;
};

type Post = PostMatter & {
  slug: string;
  content: string;
  readingMinutes: number;
  wordCount: number;
};
