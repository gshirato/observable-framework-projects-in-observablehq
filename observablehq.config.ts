// See https://observablehq.com/framework/config for documentation.
export default {
  // The project’s title; used in the sidebar and webpage titles.
  title: "Gota Shirato",

  // The pages and sections in the sidebar. If you don’t specify this option,
  // all pages will be listed in alphabetical order. Listing pages explicitly
  // lets you organize them into sections and have unlisted pages.
  pages: [
    {
      name: "Projects",
      pages: [
        // {name: "Statsbomb", path: "/statsbomb"},
        {name: "Event Stream", path: "/eventStream"},
        {name: "Profit & Loss (J. League, 2022)", path: "/profitLoss2022"},
        {name: "J1 Predictor", path: "/predictor-j1"},
        {name: "GK Positioning", path: "/gk-positioning"},
        // {name: "J1 Data", path: "/j1-data"},
        // {name: "Urawa Reds - All games", path: "/urawa-games"},
      ]
    },
    {
      name: "Seminar 23/24",
      open: false,
      pages: [
        {name: "Visual Analytics", path: "/seminar-visual-analytics"}
      ]
    }
  ],

  // Some additional configuration options and their defaults:
  // theme: "dark", // try "light", "dark", "slate", etc.
  // header: "", // what to show in the header (HTML)
  footer: "Gota Shirato", // what to show in the footer (HTML)
  // toc: "true", // whether to show the table of contents
  // pager: true, // whether to show previous & next links in the footer
  // root: "docs", // path to the source root for preview
  // output: "dist", // path to the output root for build
};
