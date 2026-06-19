import { useSEO } from "@/utils/seo";
interface Props { title?: string; description?: string; ogImage?: string; }
export function SEO(props: Props) { useSEO(props); return null; }
