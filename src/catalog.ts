import {z} from "zod";
import { componentMeta } from "./meta";


export const catalog = Object.entries(componentMeta).map(([name, meta]) => ({
    name,
    description: meta.description,
    dependencies: meta.dependencies ?? [],
    runtimeProps: meta.runtimeProps ?? [],
    requires: meta.requires ?? [],
  props: z.toJSONSchema(meta.schema, { io: "input" }),
}));


export const promptCatalog = catalog.map(({ name, description, props }) => ({
  name,
  description,
  props,
}));