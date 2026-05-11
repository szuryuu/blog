export default defineEventHandler(async (event) => {
  const { limit } = getQuery(event);

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
  const counts: Record<string, number> = {};

  for (const post of allPosts) {
    const itemTags: string[] = [];
    if (Array.isArray(post.tags)) itemTags.push(...post.tags);
    if (Array.isArray(post.tech)) itemTags.push(...post.tech);

    for (const tag of itemTags) {
      if (tag) {
        counts[tag] = (counts[tag] || 0) + 1;
      }
    }
  }

  let tags = Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .map((t) => t[0]);

  if (limit) {
    tags = tags.slice(0, parseInt(limit as string, 10));
  }

  return tags;
});
