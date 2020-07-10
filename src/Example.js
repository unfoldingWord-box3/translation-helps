import React from 'react';
import {
  Bible
} from 'unfoldingWord';

function Component() {

  const context = {
    username: "str",
    uid: '6221',
    languageId: "hi",
    resourceId: "ulb",
    reference: {
      bookId: "tit",
      chapter: 1,
    },
  };

  render() {
    return (
      <div>
        <Bible context={context} />
      </div>
    );
  }
}
