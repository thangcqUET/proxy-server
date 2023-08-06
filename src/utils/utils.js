const convertArrayRequestQuery = (query) => {
  return query?.split(',') || null;
};

const escapeValue = (name) => {
  return name?.replace(/"/g, '\\"') || ''
};
module.exports = {
  convertArrayRequestQuery,
  escapeValue,
}