import fs from "fs";
import path from "path";
import matter from "gray-matter";
import readingTime from "reading-time";

const postsDirectory = path.join(process.cwd(), "content/blog");

export interface BlogPostMeta {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  category: string;
  tags: string[];
  coverImage: string;
  readingTime: string;
}

export function getPostSlugs() {
  if (!fs.existsSync(postsDirectory)) return [];
  return fs.readdirSync(postsDirectory).filter(file => file.endsWith('.mdx'));
}

export function getPostBySlug(slug: string) {
  const realSlug = slug.replace(/\.mdx$/, "");
  const fullPath = path.join(postsDirectory, `${realSlug}.mdx`);
  
  if (!fs.existsSync(fullPath)) return null;

  const fileContents = fs.readFileSync(fullPath, "utf8");
  const { data, content } = matter(fileContents);
  const stats = readingTime(content);

  return {
    slug: realSlug,
    meta: {
      ...data,
      slug: realSlug,
      readingTime: stats.text,
    } as BlogPostMeta,
    content,
  };
}

export function getAllPosts() {
  const slugs = getPostSlugs();
  const posts = slugs
    .map((slug) => getPostBySlug(slug))
    .filter((post) => post !== null)
    .sort((post1, post2) => (post1!.meta.date > post2!.meta.date ? -1 : 1));
  return posts;
}

export function getPostsByCategory(category: string) {
  const allPosts = getAllPosts();
  return allPosts.filter((post) => post?.meta.category.toLowerCase() === category.toLowerCase());
}

export function searchPosts(query: string) {
  const allPosts = getAllPosts();
  const q = query.toLowerCase();
  
  return allPosts.filter((post) => {
    if (!post) return false;
    const { title, excerpt, category, tags } = post.meta;
    return (
      title.toLowerCase().includes(q) ||
      excerpt.toLowerCase().includes(q) ||
      category.toLowerCase().includes(q) ||
      tags.some(t => t.toLowerCase().includes(q))
    );
  }).map(post => post!.meta);
}
