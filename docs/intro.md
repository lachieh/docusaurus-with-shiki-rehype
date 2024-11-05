---
sidebar_position: 1
---

# Docusaurus + Shiki

This demo covers what is needed to get Shiki running as the code formatter instead of Prisma

## Basic Installation

### Install Dependencies

Install the Shiki Rehype plugin:

```shell
npm i @shikijs/rehype shiki
```

### Add the plugin to your docusaurus config

You will need to add the plugin and its configwherever you have the docs and blog plugins enabled. This is typically through the default preset, but you may have more instances than this. It should be added to the `beforeDefaultRehypePlugins` array.

```ts
import rehypeShiki, { RehypeShikiOptions } from "@shikijs/rehype";
import { bundledLanguages, type BundledLanguage } from "shiki";

const config: Config = {
  // ...
  presets: [
    [
      "classic",
      {
        docs: {
          // ...
          beforeDefaultRehypePlugins: [ // [!code focus]
            [ // [!code focus]
              rehypeShiki, // [!code focus]
              { // [!code focus]
                theme: "catppuccin-latte", // [!code focus]
                langs: ["js", "ts", "jsx", "tsx" /* other languages */], // [!code focus]
                // alternatively, you can activate all bundled languages: // [!code focus]
                // langs: Object.keys(bundledLanguages) as BundledLanguage[] // [!code focus]
              } satisfies RehypeShikiOptions, // [!code focus]
            ], // [!code focus]
          ], // [!code focus]
        },
        blog: {
          // same as above
        },
      },
    ],
  ],
  // ...
};
```

## Dark/Light Theme

By default, Shiki only uses 1 theme but makes it simple to enable a dark/light theme.

### Adjust the plugin config to enable light/dark themes

```ts
[
  rehypeShiki,
  {
    theme: "catppuccin-latte", // [!code --]
    themes: {  // [!code ++]
      light: "catppuccin-latte", // [!code ++]
      dark: "catppuccin-macchiato" // [!code ++]
    }, // [!code ++]
    langs: Object.keys(bundledLanguages) as BundledLanguage[]
  } satisfies RehypeShikiOptions,
],
```

### Add the CSS to your site

Shiki uses css variables attached to each element to swap themes. You will need to add some styles to your site CSS so that they toggle when switching the docusaurus theme.

```css
[data-theme="dark"] pre {
  color: var(--shiki-dark) !important;
  background-color: var(--shiki-dark-bg) !important;
}
[data-theme="dark"] pre span {
  color: var(--shiki-dark) !important;
}
```

### Swizzle some components

Since `@shiki/rehype` will handle parsing the code from the markdown, we don't need to replace the MDXComponents with the `@theme` versions. This means we need to swizzle the Code and Pre components to just return their original elements:

#### Code Component

Swizzle the component:

```bash
npx docusaurus swizzle @docusaurus/theme-classic MDXComponents/Code --typescript --eject
```

Edit the file `src/theme/MDXComponents/Code.tsx`

```tsx
import type { ComponentProps } from "react";
import React from "react";
import CodeInline from "@theme/CodeInline";
import type { Props } from "@theme/MDXComponents/Code";

function shouldBeInline(props: Props) {
  return (
    // empty code blocks have no props.children,
    // see https://github.com/facebook/docusaurus/pull/9704
    typeof props.children !== "undefined" &&
    React.Children.toArray(props.children).every(
      (el) => typeof el === "string" && !el.includes("\n")
    )
  );
}

function CodeBlock(props: ComponentProps<"code">): JSX.Element { // [!code highlight]
  return <code {...props} />; // [!code highlight]
} // [!code highlight]

export default function MDXCode(props): JSX.Element {
  return shouldBeInline(props) ? (
    <CodeInline {...props} />
  ) : (
    <CodeBlock {...props} />
  );
}
```

#### Pre Component

Swizzle the component:

```bash
npx docusaurus swizzle @docusaurus/theme-classic MDXComponents/Pre --typescript --eject
```

Edit the file `src/theme/MDXComponents/Pre.tsx`:

```tsx
import React, { type ReactNode } from "react";
import type { Props } from "@theme/MDXComponents/Pre";

export default function MDXPre(props: Props): ReactNode | undefined {
  return <pre {...props} />;
}
```

## Conclusion

This example is already using Shiki. You can refer to the [`docusaurus.config.ts` config](https://github.com/lachieh/docusaurus-with-shiki-rehype/blob/main/docusaurus.config.ts) in the site source repo for a more complete example including shiki transformers and related styles.
