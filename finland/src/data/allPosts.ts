import { BlogPost } from "./blogPosts";
import { SEO_BLOG_POSTS } from "./seoBlogPosts";
import { SWIV_LAUNCH_POSTS } from "./swivLaunchPosts";

export const ALL_POSTS: BlogPost[] = [...SWIV_LAUNCH_POSTS, ...SEO_BLOG_POSTS].sort((a, b) =>
  b.dateISO.localeCompare(a.dateISO)
);

export function getPostBySlug(slug: string): BlogPost | undefined {
  return ALL_POSTS.find(p => p.slug === slug);
}
