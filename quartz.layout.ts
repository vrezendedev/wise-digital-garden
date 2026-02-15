import { PageLayout, SharedLayout } from "./quartz/cfg"
import * as Component from "./quartz/components"

export const left = [
  Component.Flex({
    components: [
      {
        Component: Component.PageTitle(),
        grow: true,
      },
      { Component: Component.Darkmode() },
    ],
  }),
  Component.MobileOnly(Component.Spacer()),
  Component.Search(),
  Component.Explorer({
    title: "Content",
    sortFn: (a, _) => {
      switch (a.displayName) {
        case "Projects":
          return 0
        case "Programming":
          return 1
        case "Life":
          return 2
        case "Games":
          return 3
        default:
          return 4
      }
    },
  }),
  Component.RecentNotes({
    limit: 4,
    title: "Recently Published",
    filter: (f) => !f.filePath?.includes("index"),
  }),
]

// components shared across all pages
export const sharedPageComponents: SharedLayout = {
  head: Component.Head(),
  header: [],
  afterBody: [],
  footer: Component.ConditionalRender({
    component: Component.Footer({
      footerText: `© ${new Date().getFullYear()} WISE SHEPHERD GAMES`,
      links: {},
    }),
    condition: (p) => p.fileData.filePath?.includes("Projects/Games") ?? false,
  }),
}

// components for pages that display a single page (e.g. a single note)
export const defaultContentPageLayout: PageLayout = {
  beforeBody: [
    Component.ContentMeta(),
    Component.ConditionalRender({
      component: Component.Breadcrumbs(),
      condition: (page) => page.fileData.slug !== "index",
    }),
    Component.ArticleTitle(),
    Component.TagList(),
  ],
  left: left,
  right: [Component.DesktopOnly(Component.TableOfContents()), Component.Backlinks()],
}

// components for pages that display lists of pages  (e.g. tags or folders)
export const defaultListPageLayout: PageLayout = {
  beforeBody: [Component.Breadcrumbs(), Component.ContentMeta()],
  left: left,
  right: [],
}
