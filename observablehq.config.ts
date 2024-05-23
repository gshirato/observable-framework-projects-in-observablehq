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
        {name: "Suspicious locations", path: "/data_investigation/pages/suspicious_locations"},
        {name: "Leverkusen", path: "/data_investigation/pages/leverkusen"},
      ]
    },
    {
      name: "Personal Projects",
      pages: [
        {name: "Football events", path: "/statsbomb/pages/eventStream"},
        {name: "Profit & Loss (J. League, 2022)", path: "/profit-loss/pages/profitLoss2022"},
        {name: "Profit & Loss (J. League, 2023)", path: "/profit-loss/pages/profitLoss2023"},
        {name: "J1 League Predictor", path: "/predictor-j1/pages/predictor-j1"},
        {name: "GK Viz", path: "/gk-positioning/pages/gk-positioning"},
        // {name: "Statsbomb", path: "/statsbomb/pages/statsbomb"},
        // {name: "Event recorder", path: "/statsbomb/pages/interactivePitch"},
        // {name: "J1-Data", path: "/j1-data/pages/j1-data"},
        // {name: "Urawa Reds", path: "/urawa-games/pages/urawa-games"},
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
        {name: "Visual Analytics", path: "/seminar-statsbomb/pages/seminars/visual-analytics/seminar-visual-analytics"}
      ]
    },
    {
      name: "Visual Analytics - Motivating Example (WIP)",
      open: false,
      pages: [
        {name: "Introduction", path: "statsbomb/pages/seminars/visual-analytics/introduction"},
        {name: "Data", path: "statsbomb/pages/seminars/visual-analytics/football/data"},
        {name: "Passes", path: "statsbomb/pages/seminars/visual-analytics/football/passes"},
        {name: "Leading to shots", path: "statsbomb/pages/seminars/visual-analytics/football/leading-to-shots"},
        {name: "Visual Variables", path: "statsbomb/pages/seminars/visual-analytics/theory/visual-variables"},
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
