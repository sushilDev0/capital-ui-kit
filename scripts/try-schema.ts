import { currencyCounterSchema } from "../src/components/CurrencyCounter/schema";
import { groupDigits, maskValue } from "../src/components/PrivacyBadge/mask";
import {debouncedSearchSchema} from "../src/components/DebouncedSearch/schema";

console.log(currencyCounterSchema.safeParse({ value: 5000, currency: "RUPEES" }).success); // false
console.log(currencyCounterSchema.safeParse({ value: 5000 }).data); // adds INR, en-IN, dark

const g = groupDigits("1234567890123456");
console.log(maskValue(g, "last4", "•"));      // •••• •••• •••• 3456
console.log(maskValue(g, "first4", "•"));     // 1234 •••• •••• ••••
console.log(maskValue(g, "all", "•"));        // •••• •••• •••• ••••
console.log(maskValue("123", "last4", "•"));  // •••
console.log(maskValue("", "last4", "•") === ""); // true
console.log(debouncedSearchSchema.safeParse({}).data);
console.log(debouncedSearchSchema.safeParse({ delay: -5 }).success); // false