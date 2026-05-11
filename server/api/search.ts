export default defineEventHandler(async (event) => {
  const { q } = getQuery(event);
  if (!q) return [];
  const query = q.toString().toLowerCase();

  const w = await queryCollection(event, "writing")
    .all()
    .catch(() => []);
  const c = await queryCollection(event, "ctf")
    .all()
    .catch(() => []);
  const i = await queryCollection(event, "infrastructure")
    .all()
    .catch(() => []);
  const p = await queryCollection(event, "projects")
    .all()
    .catch(() => []);

  const allPosts = [...w, ...c, ...i, ...p].filter(Boolean);

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
