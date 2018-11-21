import React from 'react';
import FileManager from './FileManager';

import fileTree from './fileTree';

const FileManagerContainer = (props) =>
  <FileManager
    {...props}
    fileTree={fileTree}
  />

export default FileManagerContainer;
