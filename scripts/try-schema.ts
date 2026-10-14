import { currencyCounterSchema } from "../src/components/CurrencyCounter/schema";

console.log(currencyCounterSchema.safeParse({ value: 5000, currency: "RUPEES" }).success); // false
console.log(currencyCounterSchema.safeParse({ value: 5000 }).data); // adds INR, en-IN, dark