import * as gitApi from '../../gitApi';
import youtubeIds from './youtubeIds';

export const framesFromStory = ({storyMarkdown}) => {
  let frames = {};
  storyMarkdown.split(/\s*?\n\s*?\n\s*?[!]/)
  .forEach((frameMarkdown, index) => {
    frames[index] = frameData({frameMarkdown});
  });
  return frames;
}

export const frameData = ({frameMarkdown}) => {
  let data = {};
  const imageRegexp = /\((http.*?\.jpg).*?\)/;
  if (imageRegexp.test(frameMarkdown)) {
    const [match, image] = imageRegexp.exec(frameMarkdown);
    if (match) {/* not used, this bypasses linter warning */}
    data.image = image;
  }
  data.text = frameMarkdown.replace(/\s*\[.*?\]\(.*?\)\s*/,'').trim();
  return data;
}

export async function fetchStory({username, languageId, storyId}) {
  const repository = gitApi.resourceRepositories({languageId}).obs;
  const numberPadded = (storyId < 10) ? `0${storyId}` : `${storyId}`;
  const path = `content/${numberPadded}.md`;
  const storyMarkdown = await gitApi.getFile({username, repository, path});
  const frames = framesFromStory({storyMarkdown});
  return frames;
};

export async function fetchOpenBibleStories({username, languageId}) {
  const storyIds = [...Array(51).keys()].splice(1);
  let stories = {};
  const promises = storyIds.map(storyId =>
    fetchStory({username, languageId, storyId})
  );
  const storyArray = await Promise.all(promises);
  storyIds.forEach((storyId, index) => {
    stories[storyId] = storyArray[index];
  });
  return stories;
};

export const youtubeId = ({storyKey}) => {
  return youtubeIds[storyKey - 1];
};
