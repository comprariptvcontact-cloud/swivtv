import { BlogPost } from "./blogPosts";
import { DE_KW_BLOG_POSTS } from "./deKeywordBlogPosts";
import { SEO_BLOG_POSTS } from "./seoBlogPosts";
import { DE_OFFER_POSTS } from "./deOfferPost";
import { SWIV_LAUNCH_POSTS } from "./swivLaunchPosts";

export const ALL_POSTS: BlogPost[] = [...DE_KW_BLOG_POSTS, ...DE_OFFER_POSTS, ...SWIV_LAUNCH_POSTS, ...SEO_BLOG_POSTS].sort((a, b) =>
  b.dateISO.localeCompare(a.dateISO)
);

export function getPostBySlug(slug: string): BlogPost | undefined {
  return ALL_POSTS.find(p => p.slug === slug);
}
