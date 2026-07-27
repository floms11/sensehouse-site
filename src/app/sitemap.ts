import type { MetadataRoute } from "next";
import { site } from "@/config/site";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: site.url,
    },
    ...site.servicePages.map((page) => ({
      url: new URL(page.href, site.url).toString(),
    })),
  ];
}
