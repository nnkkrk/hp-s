import blogData from "./blogData.json";

export async function GET() {

  const posts = blogData.posts;

  // ---- TOP ARTICLES (Top 3 posts with highest views) ----
  const topArticles = [...posts]
    .sort((a, b) => b.views - a.views)
    .slice(0, 3);

  // ---- RANDOM FEATURE POST ----
  const featured = posts[Math.floor(Math.random() * posts.length)];

  // ---- LATEST BLOGS (latest 3 by date) ----
  const latestBlogs = [...posts]
    .sort((a, b) => new Date(String(b.date)).getTime() - new Date(String(a.date)).getTime())
    .slice(0, 3);

  const data = {
    categories: blogData.categories,
    topArticles,
    featured,
    latestBlogs
  };

  return Response.json(data);
}
