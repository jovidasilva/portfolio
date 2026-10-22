import type { MDXComponents } from "mdx/types";
import DemoIA from "@/components/DemoIA";

const components: MDXComponents = { DemoIA };

export function useMDXComponents(): MDXComponents {
  return components;
}
