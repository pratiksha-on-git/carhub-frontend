import { useEffect } from "react";

interface SEOProps {
  title?: string;
  description?: string;
  ogImage?: string;
}

export function useSEO({ title, description, ogImage }: SEOProps) {
  useEffect(() => {
    if (title) document.title = title;
    const setMeta = (selector: string, attr: string, key: string, val: string, content: string) => {
      let el = document.head.querySelector<HTMLMetaElement>(selector);
      if (!el) {
        el = document.createElement("meta");
        el.setAttribute(key, val);
        document.head.appendChild(el);
      }
      el.setAttribute(attr, content);
    };
    if (description) {
      setMeta('meta[name="description"]', "content", "name", "description", description);
      setMeta('meta[property="og:description"]', "content", "property", "og:description", description);
    }
    if (title) setMeta('meta[property="og:title"]', "content", "property", "og:title", title);
    if (ogImage) setMeta('meta[property="og:image"]', "content", "property", "og:image", ogImage);
  }, [title, description, ogImage]);
}
