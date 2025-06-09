import React from "react";
import { EditableContent } from "simple-text-editor-rcl";
import { segmenter } from "../../utils/segmenter";

const UsfmEditor = (props) => {
  const { content, options, components, handlers, decorators, sectionIndex } = props;

  const defaultProps = {
    components: {
      sectionHeading: ({ content, show, ...props }) => (
        <div className='heading' {...props}>
          {show ? (
            ""
          ) : (
            <>
              <span className='expand'>{">"} </span>
              <span className='content'>{content.replace(/^\n+/, "").split("\n")[0]}</span>
            </>
          )}
        </div>
      ),
      block: ({ content, verbose, ..._props }) => (
        <>
          <div className='block' {..._props} style={{ width: "100%" }} />
        </>
      ),
    },
    parsers: {
      section: (_content) =>
        segmenter({ content: _content, regex: /(^|\\c +\d+)(\n|.)+?(\n|$)?(?=(\\c +\d+|$))/g }),
      block: (_content) =>
        segmenter({ content: _content, regex: /(^|\\[cspv])(\n|.)+?(\n|$)?(?=(\\[cspv]|$))/g }),
    },
    joiners: {
      section: "",
      block: "",
    },
    decorators: {},
  };

  const _props = {
    content,
    options,
    components: { ...defaultProps.components, ...components },
    parsers: defaultProps.parsers,
    joiners: defaultProps.joiners,
    decorators: { ...decorators },
    handlers,
    sectionIndex,
  };

  return (
    <usfm>
      <EditableContent {..._props} />
    </usfm>
  );
};

export default UsfmEditor;
