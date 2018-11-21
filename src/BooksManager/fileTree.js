export const fileTree = [
  {
    name: "checking",
    type: "directory",
  },
  {
    name: "intro",
    type: "directory",
  },
  {
    name: "process",
    type: "directory",
  },
  {
    name: "translate",
    type: "directory",
    selected: true,
    children: [
      {
        name: "...",
        type: "directory",
      },
      {
        name: "figs-merism",
        type: "directory",
      },
      {
        name: "figs-metaphor",
        type: "directory",
        selected: true,
        children: [
          {
            name: "01.md",
            type: "file",
            selected: true,
          },
          {
            name: "sub-title.md",
            type: "file",
          },
          {
            name: "title.md",
            type: "file",
          },
        ],
      },
      {
        name: "figs-metonymy",
        type: "directory",
      },
      {
        name: "....",
        type: "directory",
      },
    ],
  },
  {
    name: ".gitignore",
    type: "file",
  },
  {
    name: "LICENSE.md",
    type: "file",
  },
  {
    name: "README.md",
    type: "file",
  },
  {
    name: "manifest.yaml",
    type: "file",
  },
  {
    name: "media.yaml",
    type: "file",
  }
];

export default fileTree;
