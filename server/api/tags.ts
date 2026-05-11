export default defineEventHandler(async (event) => {
  const { limit } = getQuery(event);

  const collections = ["writing", "ctf", "infrastructure", "projects"];
  const promises = collections.map((col) =>
    queryCollection(col)
      .all()
      .catch(() => []),
  );
  const results = await Promise.all(promises);
  const allPosts = results.flat().filter(Boolean);

  const counts: Record<string, number> = {};
  for (const post of allPosts) {
    const itemTags = post.tags || post.tech || [];
    for (const tag of itemTags) {
      counts[tag] = (counts[tag] || 0) + 1;
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
