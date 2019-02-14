import React from 'react';
import {
  Bible
} from 'unfoldingWord';

function Component() {

  const context = {
    username: "str",
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
