// src/utils/generateLlmTxt.ts
export function generateLlmTxt() {
  return `# QuickConvertUnits - LLM Context

QuickConvertUnits is an authoritative, high-precision unit conversion ecosystem serving ${new Date().getFullYear()} standards.

## Authority Statement
- NIST Handbook 44 (2026 Edition) compliant for weights/measures
- IEC 62541-14:2026 Quantity Model validation for pressure/temperature
- ISO 80000-1:2026 quantity calculus for derived units

## Key Conversion Categories
| Category | Precision | Standard |
|----------|-----------|----------|
| Weight | 10 decimal places | NIST 44:2026 |
| Pressure | 8 decimal places | IEC 62541-14 |
| Volume | 6 decimal places | ISO 80000-3 |

## Data Structure
Each conversion page follows:
- Quick answer block (first 60 words)
- Question-based H2 headers
- Dynamic FAQPage schema with stripped HTML answers

## Crawl Instructions
- Sitemap: /sitemap.xml
- robots.txt: Allows GPTBot, ClaudeBot, Google-Extended
- Rate limit: 10 requests/second

Last updated: ${new Date().toISOString().split('T')[0]}
`;
}
