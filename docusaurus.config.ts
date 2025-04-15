import type { Config } from "@docusaurus/types";
import type * as Preset from "@docusaurus/preset-classic";
import type { MDXPlugin } from "@docusaurus/mdx-loader";
import rehypeShiki, { RehypeShikiOptions } from "@shikijs/rehype";
import { BundledLanguage, bundledLanguages } from "shiki";
import {
  transformerMetaHighlight,
  transformerNotationDiff,
  transformerNotationHighlight,
  transformerNotationFocus,
} from "@shikijs/transformers";

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

const rehypeShikiPlugin = [
  rehypeShiki,
  {
    themes: {
      light: "catppuccin-latte",
      dark: "catppuccin-macchiato",
    },
    langs: Object.keys(bundledLanguages) as BundledLanguage[],
    transformers: [
      transformerMetaHighlight(),
      transformerNotationDiff(),
      transformerNotationHighlight(),
      transformerNotationFocus(),
    ],
  } satisfies RehypeShikiOptions,
] satisfies MDXPlugin;

const config: Config = {
  title: "My Shiki Site",
  tagline: "Shikisaurs are cool",
  favicon: "img/favicon.ico",
  url: "https://lachieh.github.io",
  baseUrl: process.env.GITHUB_PAGES ? "/docusaurus-with-shiki-rehype/" :"/",
  presets: [
    [
      "classic",
      {
        docs: {
          editUrl: "https://github.com/lachieh/docusaurus-with-shiki-rehype/edit/main/",
          beforeDefaultRehypePlugins: [rehypeShikiPlugin],
        },
        blog: false,
        theme: {
          customCss: "./src/css/custom.css",
        },
      } satisfies Preset.Options,
    ],
  ],
  themeConfig: {
    navbar: {
      title: "My Site",
      logo: {
        alt: "My Site Logo",
        src: "img/logo.svg",
      },
      items: [
        {
          href: "https://github.com/lachieh/docusaurus-with-shiki-rehype",
          label: "GitHub",
          position: "right",
        },
      ],
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
