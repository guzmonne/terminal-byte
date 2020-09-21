function getQueryParameters() {
  var search = location.search.substring(1);
  if (search === '') return {};
  const query = {...window.DEFAULTS, ...JSON.parse('{"' + decodeURI(search).replace(/"/g, '\\"').replace(/&/g, '","').replace(/=/g,'":"') + '"}') };
  if (typeof query.size === 'string') query.size = parseInt(query.size, 10);
  if (typeof query.minSize === 'string') query.size = parseInt(query.size, 10);
  if (typeof query.maxSize === 'string') query.size = parseInt(query.size, 10);
  return query;
}

export default getQueryParameters;