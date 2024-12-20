const extractFilePathFromUrl = (attachmentUrl) => {
  const matches = attachmentUrl.match(/\/o\/(.*?)\?/);
  return matches ? decodeURIComponent(matches[1]) : null;
};

module.exports = { extractFilePathFromUrl };
