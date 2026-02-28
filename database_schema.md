```markdown
# تصميم مخطط قاعدة بيانات Firestore لـ AI Market Intelligence

بناءً على المتطلبات المقدمة، سيتم تحديث وتوسيع مخطط قاعدة بيانات Firestore الحالي في مشروع Ahmed Trader لدعم ميزات AI Market Intelligence الجديدة. نظراً لأن Firestore هي قاعدة بيانات NoSQL، فإن مفهوم 'الجداول' سيترجم إلى 'مجموعات' (Collections)، وسيتم تمثيل 'العلاقات' (Foreign Keys) بتخزين معرفات المستندات ذات الصلة.

## المجموعات المقترحة (Proposed Collections):

### 1. `assets` Collection
تخزن معلومات الأصول المالية التي يتم تتبعها.

| الحقل (Field) | النوع (Type) | الوصف (Description) |
|---------------|---------------|---------------------|
| `id`          | String (UUID) | معرف فريد للأصل (مثل BTCUSDT, EURUSD) |
| `symbol`      | String        | رمز الأصل (مثل BTC, EUR) |
| `type`        | String        | String        | نوع الأصل (crypto, forex, commodity) |

### 2. `news_articles` Collection
تخزن المقالات الإخبارية المالية التي تم جلبها.

| الحقل (Field)      | النوع (Type) | الوصف (Description) |
|-------------------|---------------|---------------------|
| `id`              | String (UUID) | معرف فريد للمقالة (hash of URL) |
| `asset_id`        | String        | معرف الأصل المرتبط (FK إلى `assets.id`) |
| `title`           | String        | عنوان المقالة |
| `source`          | String        | مصدر المقالة (مثل Reuters, CoinDesk) |
| `published_at`    | Timestamp     | تاريخ ووقت النشر |
| `raw_text`        | String        | النص الكامل للمقالة |
| `created_at`      | Timestamp     | تاريخ ووقت إضافة المقالة إلى القاعدة |

### 3. `sentiment_scores` Collection
تخزن نتائج تحليل المشاعر لكل مقالة إخبارية.

| الحقل (Field)         | النوع (Type) | الوصف (Description) |
|----------------------|---------------|---------------------|
| `article_id`         | String        | معرف المقالة المرتبطة (FK إلى `news_articles.id`) |
| `sentiment_score`    | Number (Float)| درجة المشاعر (-1.0 إلى +1.0) |
| `sentiment_label`    | String        | تصنيف المشاعر (Bullish/Bearish/Neutral) |
| `confidence_percent` | Number (Float)| نسبة الثقة في تحليل المشاعر |
| `key_phrases`        | Array         | الكلمات المفتاحية المؤثرة (JSON array) |

### 4. `impact_predictions` Collection
تخزن تنبؤات التأثير لكل مقالة إخبارية.

| الحقل (Field)          | النوع (Type) | الوصف (Description) |
|-----------------------|---------------|---------------------|
| `article_id`          | String        | معرف المقالة المرتبطة (FK إلى `news_articles.id`) |
| `expected_move_percent`| Number (Float)| النسبة المئوية المتوقعة للحركة |
| `timeframe_hours`     | Number        | الإطار الزمني للتنبؤ بالساعات (1, 4, 24) |
| `volatility_level`    | String        | مستوى التقلب (Low/Medium/High) |
| `confidence_percent`  | Number (Float)| نسبة الثقة في التنبؤ |

### 5. `price_snapshots` Collection
تخزن لقطات الأسعار الدقيقة للأصول.

| الحقل (Field) | النوع (Type) | الوصف (Description) |
|---------------|---------------|---------------------|
| `asset_id`    | String        | معرف الأصل المرتبط (FK إلى `assets.id`) |
| `price`       | Number (Float)| السعر في لحظة اللقطة |
| `timestamp`   | Timestamp     | تاريخ ووقت اللقطة (بدقة دقيقة واحدة) |

### 6. `historical_outcomes` Collection
تخزن النتائج التاريخية لحركة الأسعار بعد نشر المقالات.

| الحقل (Field) | النوع (Type) | الوصف (Description) |
|---------------|---------------|---------------------|
| `article_id`  | String        | معرف المقالة المرتبطة (FK إلى `news_articles.id`) |
| `move_1h`     | Number (Float)| حركة السعر بعد ساعة واحدة |
| `move_4h`     | Number (Float)| حركة السعر بعد 4 ساعات |
| `move_24h`    | Number (Float)| حركة السعر بعد 24 ساعة |

### 7. `user_alerts` Collection
تخزن التنبيهات المخصصة التي أنشأها المستخدمون.

| الحقل (Field)       | النوع (Type) | الوصف (Description) |
|--------------------|---------------|---------------------|
| `id`               | String (UUID) | معرف فريد للتنبيه |
| `user_id`          | String        | معرف المستخدم (FK إلى `users` collection) |
| `asset_id`         | String        | معرف الأصل المرتبط (FK إلى `assets.id`) |
| `condition_type`   | String        | نوع الشرط (sentiment_score, predicted_move, etc.) |
| `threshold_value`  | Number/String | قيمة العتبة للشرط |
| `created_at`       | Timestamp     | تاريخ ووقت إنشاء التنبيه |
| `status`           | String        | حالة التنبيه (active, triggered, inactive) |

### 8. `subscriptions` Collection
تخزن معلومات اشتراكات المستخدمين.

| الحقل (Field) | النوع (Type) | الوصف (Description) |
|---------------|---------------|---------------------|
| `user_id`     | String        | معرف المستخدم (FK إلى `users` collection) |
| `tier`        | String        | مستوى الاشتراك (Free, Pro, Premium) |
| `expires_at`  | Timestamp     | تاريخ انتهاء الاشتراك |

## ملاحظات حول تطبيق Firestore:
*   **معرفات المستندات (Document IDs):** سيتم استخدام `id` كمعرف للمستند في Firestore لكل مجموعة حيث يكون معرفاً فريداً. بالنسبة لـ `news_articles.id`، سيتم توليده كـ hash من URL لضمان التفرد.
*   **العلاقات (Relationships):** سيتم التعامل مع العلاقات عن طريق تخزين معرف المستند (ID) للمجموعة المرتبطة، مما يسمح بالاستعلامات المتداخلة (nested queries) أو الاستعلامات المنفصلة حسب الحاجة.
*   **الفهرسة (Indexing):** سيتطلب تطبيق هذه المجموعات تعريف فهارس مناسبة في Firestore لتحسين أداء الاستعلامات، خاصةً تلك التي تتضمن `where` clauses أو `orderBy`.
*   **التحقق من الصحة (Validation):** سيتم تطبيق قواعد التحقق من الصحة على مستوى الخادم (Server-side validation) لضمان تكامل البيانات قبل كتابتها في Firestore.

هذا المخطط يوفر أساساً قوياً لتطوير ميزات AI Market Intelligence المطلوبة، مع الاستفادة من مرونة وقابلية توسع Firestore.
```
