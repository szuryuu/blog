export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const colsParam = query.collections as string;
  const tagFilter = query.tag
    ? decodeURIComponent(query.tag as string).toLowerCase()
    : null;

  if (!colsParam) return [];
  const collections = colsParam.split(",");

  let fetchedPosts: any[] = [];

  const promises = collections.map((col) =>
    queryCollection(event, col as any)
      .all()
      .catch(() => []),
  );

  const results = await Promise.all(promises);
  fetchedPosts = results.flat().filter(Boolean);

  if (
    collections.length === 1 &&
    (collections[0] === "projects" || collections[0] === "project")
  ) {
    fetchedPosts = fetchedPosts.sort(
      (a, b) => (a.order || 99) - (b.order || 99),
    );
  } else {
    fetchedPosts = fetchedPosts.sort((a, b) => {
      const dateA = a.date
        ? new Date(a.date).getTime()
        : a.year
          ? new Date(`${a.year}-12-31`).getTime()
          : 0;
      const dateB = b.date
        ? new Date(b.date).getTime()
        : b.year
          ? new Date(`${b.year}-12-31`).getTime()
          : 0;

      if (dateB !== dateA) return dateB - dateA;
      return (a.order || 99) - (b.order || 99);
    });
  }

  if (tagFilter && tagFilter !== "all") {
    fetchedPosts = fetchedPosts.filter((post) => {
      const t: string[] = [];
      if (Array.isArray(post.tags)) t.push(...post.tags);
      if (Array.isArray(post.tech)) t.push(...post.tech);
      return t.some((x) => String(x).toLowerCase() === tagFilter);
    });
  }

  return fetchedPosts;
});
