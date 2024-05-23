// See https://observablehq.com/framework/config for documentation.
export default {
  // The project’s title; used in the sidebar and webpage titles.
  title: "Gota Shirato",

  // The pages and sections in the sidebar. If you don’t specify this option,
  // all pages will be listed in alphabetical order. Listing pages explicitly
  // lets you organize them into sections and have unlisted pages.
  pages: [
    {
      name: "Research projects",
      pages: [
        {name: "Small multiples", path: "/data_investigation/pages/small_multiples"},
      ]
    },
    {
      name: "Personal Projects",
      pages: [
        // {name: "Statsbomb", path: "/statsbomb"},
        {name: "Football events", path: "/statsbomb/pages/eventStream"},
        {name: "Profit & Loss (J. League, 2022)", path: "/profit-loss/pages/profitLoss2022"},
        {name: "Profit & Loss (J. League, 2023)", path: "/profit-loss/pages/profitLoss2023"},
        {name: "J1 League Predictor", path: "/predictor-j1/pages/predictor-j1"},
        {name: "GK Viz", path: "/gk-positioning/pages/gk-positioning"},
      ]
    },
    // {
    //   name: "Concast",
    //   pages: [
    //     {name: "Concast", path: "/concast/pages/main"},
    //   ]
    // },
    {
      name: "Seminar 23/24",
      open: false,
      pages: [
        {name: "Visual Analytics", path: "/seminar-visual-analytics/pages/seminar-visual-analytics"}
      ]
    },
    {
      name: "Visual Analytics - Motivating Example (WIP)",
      open: false,
      pages: [
        {name: "Introduction", path: "visual-analytics/pages/introduction"},
        {name: "Data", path: "visual-analytics/pages/football/data"},
        {name: "Passes", path: "visual-analytics/pages/football/passes"},
        {name: "Leading to shots", path: "visual-analytics/pages/football/leading-to-shots"},
        {name: "Visual Variables", path: "visual-analytics/pages/theory/visual-variables"},
      ]
    },
    {
      name: "Two Decades, Two Invincibles (WIP)",
      open: false,
      pages: [
        {name: "Introduction", path: "statsbomb/pages/blogs/two-decades-two-invincibles/leverkusen"},
      ]
    }

  ],

  // Some additional configuration options and their defaults:
  // theme: "dark", // try "light", "dark", "slate", etc.
  // header: "", // what to show in the header (HTML)
  footer: "Gota Shirato", // what to show in the footer (HTML)
  // toc: "true", // whether to show the table of contents
  // pager: true, // whether to show previous & next links in the footer
  root: "src", // path to the source root for preview
  // output: "dist", // path to the output root for build
};
