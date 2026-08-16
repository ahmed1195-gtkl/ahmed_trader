const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../ahmed_trader/src/data/academy/academyData.js');
let code = fs.readFileSync(filePath, 'utf8');

// Replace ASCII diagrams in code blocks with clean formatted bullet lists / text
code = code.replace(/```text\n\[ ■ المحور 1 \][\s\S]*?```/g, '> **مسار التعلم:** المحور 1 من أصل 14 محوراً تعليمياً متكاملاً.');

code = code.replace(/```\n\s+\[ الأصول المالية العالمية \][\s\S]*?```/g, '- **فئات الأصول المالية العالمية 5:** 1. الفوركس (EUR/USD) | 2. الأسهم (AAPL/MSFT) | 3. السلع (XAUUSD/OIL) | 4. العملات الرقمية (BTC/ETH) | 5. السندات (US10Y)');

code = code.replace(/```\n\[ دورة السيولة العالمية اليومية — بالتوقيت العالمي UTC \][\s\S]*?```/g, '- **دورة السيولة العالمية (UTC):**\n  - **جلسة سيدني:** 22:00 - 07:00 UTC\n  - **جلسة طوكيو:** 00:00 - 09:00 UTC\n  - **جلسة لندن:** 08:00 - 17:00 UTC (الأعلى سيولة)\n  - **جلسة نيويورك:** 13:00 - 22:00 UTC\n  - **ذروة التداخل (لندن + نيويورك):** 13:00 - 17:00 UTC');

fs.writeFileSync(filePath, code, 'utf8');
console.log('Successfully cleaned ASCII diagrams in academyData.js');
