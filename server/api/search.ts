export default defineEventHandler(async (event) => {
  const { q } = getQuery(event);
  if (!q) return [];
  const query = q.toString().toLowerCase();
  const collections = ["writing", "ctf", "infrastructure", "projects"];

  const results = await Promise.all(
    collections.map((col) =>
      queryCollection(event, col as any)
        .all()
        .catch(() => []),
    ),
  );

  const allPosts = results.flat().filter(Boolean);

  return allPosts
    .filter((post) => {
      const matchTitle = post.title?.toLowerCase().includes(query);
      const matchDesc = post.description?.toLowerCase().includes(query);
      const matchTags =
        Array.isArray(post.tags) &&
        post.tags.some((tag: string) => tag.toLowerCase().includes(query));
      const matchTech =
        Array.isArray(post.tech) &&
        post.tech.some((tech: string) => tech.toLowerCase().includes(query));

      return matchTitle || matchDesc || matchTags || matchTech;
    })
    .slice(0, 10);
});
