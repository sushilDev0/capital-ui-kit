import { generateCode } from "../src/codegen";

const layout = {
  sections: [
    { component: "CurrencyCounter", props: { value: 125000.5, label: "Total Balance", trendPercentage: 12.5 } },
    { component: "PrivacyBadge", props: { value: "1234567890123456", label: "Credit Card", revealable: true } },
    { component: "DebouncedSearch", props: { delay: 400 } },
    { component: "NotAComponent", props: {} },
  ],
};

const result = generateCode(layout);
if (result.ok) {
  console.log(result.code);
  console.log("dependencies:", result.dependencies);
  console.log("requires:", result.requires);
  console.log("skipped:", result.skipped);
} else {
  console.error(result.error);
}
