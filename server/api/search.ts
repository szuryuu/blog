export default defineEventHandler(async (event) => {
  const { q } = getQuery(event);
  if (!q) return [];
  const query = q.toString().toLowerCase();

  const collections = ["writing", "ctf", "infrastructure", "projects"];
  const promises = collections.map((col) =>
    queryCollection(col)
      .all()
      .catch(() => []),
  );
  const results = await Promise.all(promises);
  const allPosts = results.flat().filter(Boolean);

  return allPosts
    .filter((post) => {
      const matchTitle = post.title?.toLowerCase().includes(query);
      const matchDesc = post.description?.toLowerCase().includes(query);
      const matchTags = post.tags?.some((tag) =>
        tag.toLowerCase().includes(query),
      );
      const matchTech = post.tech?.some((tech) =>
        tech.toLowerCase().includes(query),
      );

      return matchTitle || matchDesc || matchTags || matchTech;
    })
    .slice(0, 10);
});
