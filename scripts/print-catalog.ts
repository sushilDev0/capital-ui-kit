import { catalog, promptCatalog } from "../src/catalog";

console.log(JSON.stringify(catalog, null, 2));
console.log(Object.keys(promptCatalog[0])); // [ 'name', 'description', 'props' ]
