export const DEFAULT_META = {
  meta: [
    { charset: "utf-8" },
    { name: "viewport", content: "width=device-width, initial-scale=1" },
    { hid: "description", name: "description", content: "" },
    { name: "format-detection", content: "telephone=no" },
    { name: "msapplication-TileColor", content: "#da532c" },
    { name: "theme-color", content: "#ffffff" },
  ],
  link: [
    {
      rel: "icon",
      type: "image/x-icon",
      href: `${process.env.YB_FAVICON_DIR || ""}/favicon.ico`,
    },
    {
      rel: "apple-touch-icon",
      sizes: "180x180",
      href: `${process.env.YB_FAVICON_DIR || ""}/apple-touch-icon.png`,
    },
    {
      rel: "icon",
      type: "image/png",
      sizes: "32x32",
      href: `${process.env.YB_FAVICON_DIR || ""}/favicon-32x32.png`,
    },
    {
      rel: "icon",
      type: "image/png",
      sizes: "16x16",
      href: `${process.env.YB_FAVICON_DIR || ""}/favicon-16x16.png`,
    },
    {
      rel: "manifest",
      href: `${process.env.YB_FAVICON_DIR || ""}/site.webmanifest`,
    },
    {
      rel: "mask-icon",
      href: `${process.env.YB_FAVICON_DIR || ""}/safari-pinned-tab.svg`,
      color: "#5bbad5",
    },
  ],
};
