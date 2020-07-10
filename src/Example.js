import React from 'react';
import {
  Bible
} from 'unfoldingWord';

function Component() {

  const context = {
    organization: "str",
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
