import {each} from 'async';

import * as ApplicationHelpers from '../../ApplicationHelpers';
import youtubeIds from './youtubeIds';

export const framesFromStory = (storyMarkdown) => {
  let frames = {};
  storyMarkdown.split(/\s*?\n\s*?\n\s*?[!]/)
  .forEach((frameMarkdown, index) => {
    frames[index] = frameData(frameMarkdown);
  });
  return frames;
}

export const frameData = (frameMarkdown) => {
  let data = {};
  const imageRegexp = /\((http.*?\.jpg).*?\)/;
  if (imageRegexp.test(frameMarkdown)) {
    const [match, image] = imageRegexp.exec(frameMarkdown);
    data.image = image;
  }
  data.text = frameMarkdown.replace(/\s*\[.*?\]\(.*?\)\s*/,'').trim();
  return data;
}

export const fetchStory = (username, languageId, storyId) => new Promise((resolve, reject) => {
  const repository = ApplicationHelpers.resourceRepositories(languageId).obs;
  const numberPadded = (storyId < 10) ? `0${storyId}` : `${storyId}`;
  let path = `content/${numberPadded}.md`;
  ApplicationHelpers.fetchFileFromServer(username, repository, path)
  .then(data => {
    const frames = framesFromStory(data);
    resolve(frames);
  }).catch(reject);
});

export const fetchOpenBibleStories = (username, languageId) => new Promise((resolve, reject) => {
  const storyIds = [...Array(51).keys()].splice(1);
  let stories = {};
  each(storyIds,
    (storyId, done) => {
      fetchStory(username, languageId, storyId)
      .then(frames => {
        stories[storyId] = frames;
        done();
      })
    },
    (error) => {
      resolve(stories);
    }
  );
});

export const youtubeId = (storyId) => {
  return youtubeIds[storyId - 1];
};
