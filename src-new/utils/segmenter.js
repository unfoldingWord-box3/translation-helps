export const segmenter = ({ content, regex }) => {
  let segments = [content];
  segments = [];
  var match = regex.exec(content);

  while (match !== null) {
    // console.log(`match(${regex}): `, match[0]);
    const segment = match[0];
    segments = [...segments, segment];
    match = regex.exec(content);
  }
  return segments;
};
