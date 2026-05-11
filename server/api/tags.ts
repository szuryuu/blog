export default defineEventHandler(async (event) => {
  const { limit } = getQuery(event);
  const collections = ["writing", "ctf", "infrastructure", "projects"];

  const results = await Promise.all(
    collections.map((col) =>
      queryCollection(event, col as any)
        .all()
        .catch(() => []),
    ),
  );

  const allPosts = results.flat().filter(Boolean);
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
