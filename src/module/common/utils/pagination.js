const getLimitAndOffset = (page, size) => {
  const limit = Number(size) ? size : 5;
  let offset;

  if (page <= 1 || !Number(page)) {
    offset = 0;
  } else {
    offset = (page - 1) * limit;
  }

  return { limit, offset };
};

const paginate = (data, page, limit) => {
  const { count, rows: results } = data;
  const currentPage = page ? Number(page) : 1;
  const totalPages = Math.ceil(count / limit);

  return { results, count, totalPages, currentPage };
};

module.exports = { getLimitAndOffset, paginate };
