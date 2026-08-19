import type { MetadataRoute } from "next";
import { site } from "@/config/site";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: site.url,
    },
    {
      url: new URL(site.businessPage.href, site.url).toString(),
    },
    ...site.servicePages.map((page) => ({
      url: new URL(page.href, site.url).toString(),
    })),
  ];
}
