# Lead API — специфікація для CRM

Контракт між сайтом **sense-house.com** і CRM для приймання заявок.
Сторона сайту вже реалізована ([src/lib/lead-adapter.ts](../src/lib/lead-adapter.ts));
цей документ описує, що має реалізувати CRM.

## Загальна схема

```
Браузер → POST /api/lead (сайт, Next.js) → POST {LEAD_API_URL} (CRM)
```

Секрети (`LEAD_API_KEY`, `LEAD_API_SECRET`) зберігаються лише в змінних
середовища сервера сайту й **ніколи не потрапляють у браузер**. Підпис
формується на сервері сайту.

## Що потрібно від вас після реалізації

Надішліть три значення (я додам їх у env сайту):

| Змінна | Що це | Рекомендація |
|---|---|---|
| `LEAD_API_URL` | Повний URL ендпоінта | Тільки **HTTPS**, напр. `https://crm.example.com/api/site-leads` |
| `LEAD_API_KEY` | Ідентифікаційний токен | Випадкові ≥32 байти (напр. `openssl rand -hex 32`) |
| `LEAD_API_SECRET` | Секрет для HMAC-підпису | Окремий від key, теж ≥32 байти |

---

## Запит, який надсилає сайт

```
POST {LEAD_API_URL}
Content-Type: application/json
Authorization: Bearer {LEAD_API_KEY}
X-Timestamp: 1789305600                 ← unix-час (секунди) формування запиту
X-Idempotency-Key: 5f0c…-uuid-v4        ← унікальний ключ цієї заявки
X-Signature: sha256={hex}               ← HMAC-підпис (див. нижче)
```

Тіло (UTF-8 JSON):

```json
{
  "source": "sense-house.com",
  "submittedAt": "2026-07-24T18:00:00.000Z",
  "lead": {
    "name": "Імʼя клієнта",
    "phone": "+380 73 198 49 18",
    "objectType": "Приватний будинок",
    "area": "180",
    "stage": "Є дизайн-проєкт",
    "comment": "Текст коментаря",
    "contactMethod": "Telegram"
  }
}
```

Поля `area`, `stage`, `comment`, `contactMethod` можуть бути порожніми
рядками. Обмеження довжин (сайт обрізає сам): name ≤ 200, phone ≤ 100,
objectType ≤ 100, area ≤ 50, stage ≤ 100, contactMethod ≤ 50, comment ≤ 2000.

### Формула підпису

```
X-Signature = "sha256=" + hex( HMAC_SHA256( LEAD_API_SECRET,
                  "{X-Timestamp}.{X-Idempotency-Key}.{сирий_байтовий_body}" ) )
```

Підписується **сирий body** (байти як отримані), а не перепарсений JSON —
інакше підпис не зійдеться через порядок ключів/пробіли.

---

## Що має зробити CRM при отриманні (по порядку)

1. **Тільки HTTPS.** HTTP-запити не приймати (TLS — це шифрування в дорозі).
2. **Перевірити `Authorization`.** `Bearer {LEAD_API_KEY}` — порівняння
   константним часом (`hash_equals` / `timingSafeEqual`). Ні — `401`.
3. **Перевірити `X-Timestamp`.** Допустиме відхилення від поточного часу
   **±300 секунд**. Поза вікном — `401`. (Захист від replay-атак.)
4. **Перевірити підпис.** Обчислити HMAC за формулою вище й порівняти з
   `X-Signature` константним часом. Не збігся — `401`.
   ⚠️ Читайте сирий body до JSON-парсингу.
5. **Перевірити `X-Idempotency-Key`.** Якщо такий ключ уже оброблявся
   (зберігайте ≥24 год) — **не створювати дубль**, відповісти `409` або
   `200` з id наявної заявки. (Сайт повторює запит при збої мережі —
   ключ гарантує, що заявка не задвоїться.)
6. **Провалідувати тіло.** `lead.name`, `lead.phone`, `lead.objectType`
   непорожні; довжини в межах лімітів. Ні — `422` (сайт не ретраїть 4xx).
7. **Rate limit.** Рекомендовано ≥60 запитів/хв на ключ — цього вистачить
   із великим запасом; перевищення — `429` (сайт зробить одну повторну
   спробу після паузи).
8. Зберегти заявку й відповісти:

```json
HTTP 201
{ "ok": true, "id": "внутрішній-id-заявки" }
```

### Коди відповідей (контракт)

| Код | Значення | Реакція сайту |
|---|---|---|
| `200` / `201` | Прийнято | Користувач бачить «Заявку отримано» |
| `409` | Дубль idempotency key | Теж успіх (заявка вже є) |
| `401` / `403` | Ключ/підпис/timestamp невалідні | Помилка користувачу, **без** повтору |
| `422` | Невалідне тіло | Помилка користувачу, без повтору |
| `429` | Забагато запитів | Одна повторна спроба через ~0,8 с |
| `5xx` | Збій CRM | Одна повторна спроба через ~0,8 с |

Таймаут сайту — **10 секунд** на спробу. Відповідайте швидко: збереження в
чергу/БД, а важку обробку (нотифікації менеджерам тощо) робіть асинхронно.

---

## Приклад перевірки (Node.js / Express)

```js
const crypto = require("node:crypto");

app.post("/api/site-leads", express.raw({ type: "application/json" }), (req, res) => {
  const auth = req.get("authorization") ?? "";
  const ts = req.get("x-timestamp") ?? "";
  const idem = req.get("x-idempotency-key") ?? "";
  const sig = req.get("x-signature") ?? "";

  // 1. API key (константний час)
  const expectedAuth = `Bearer ${process.env.LEAD_API_KEY}`;
  if (auth.length !== expectedAuth.length ||
      !crypto.timingSafeEqual(Buffer.from(auth), Buffer.from(expectedAuth)))
    return res.status(401).json({ ok: false });

  // 2. Вікно часу ±300 с
  if (Math.abs(Date.now() / 1000 - Number(ts)) > 300)
    return res.status(401).json({ ok: false });

  // 3. Підпис по сирому body
  const expected = "sha256=" + crypto
    .createHmac("sha256", process.env.LEAD_API_SECRET)
    .update(`${ts}.${idem}.`).update(req.body)   // req.body — Buffer!
    .digest("hex");
  if (sig.length !== expected.length ||
      !crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expected)))
    return res.status(401).json({ ok: false });

  // 4. Idempotency (приклад: таблиця processed_keys, TTL 24h)
  // if (alreadyProcessed(idem)) return res.status(409).json({ ok: true });

  const payload = JSON.parse(req.body.toString("utf8"));
  // 5. валідація → 6. збереження → відповідь
  res.status(201).json({ ok: true, id: "..." });
});
```

Аналог на PHP: `hash_hmac('sha256', "$ts.$idem.$rawBody", $secret)` +
`hash_equals()`; сирий body — `file_get_contents('php://input')`.

## Рекомендації безпеки на боці CRM

- Зберігайте `LEAD_API_SECRET` у секрет-сховищі/env, не в коді й не в БД
  відкритим текстом.
- Логуйте факт запиту (час, IP, результат перевірок) **без** повного тіла —
  у тілі персональні дані (імʼя, телефон).
- Персональні дані заявок у БД — за вашою політикою: окремий доступ,
  шифрування диска/поля за можливості, регулярні бекапи.
- Передбачте ротацію ключів: підтримуйте одночасно два валідні ключі
  (старий + новий) на час перемикання, потім старий вимикайте.
- За бажання додайте IP-allowlist на IP хостингу сайту (уточните після
  деплою; на Vercel IP динамічні — тоді покладайтеся на підпис, цього
  достатньо).

## Як протестувати до підключення сайту

```bash
BODY='{"source":"sense-house.com","submittedAt":"2026-07-24T18:00:00.000Z","lead":{"name":"Тест","phone":"+380731984918","objectType":"Приватний будинок","area":"","stage":"","comment":"тест","contactMethod":""}}'
TS=$(date +%s)
IDEM=$(uuidgen | tr 'A-Z' 'a-z')
SIG=$(printf '%s.%s.%s' "$TS" "$IDEM" "$BODY" | openssl dgst -sha256 -hmac "$LEAD_API_SECRET" | awk '{print $2}')

curl -i -X POST "$LEAD_API_URL" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $LEAD_API_KEY" \
  -H "X-Timestamp: $TS" \
  -H "X-Idempotency-Key: $IDEM" \
  -H "X-Signature: sha256=$SIG" \
  --data-binary "$BODY"
```

Очікувано: `201` на перший запит, `409` (або `200`) на повтор із тим самим
`X-Idempotency-Key`, `401` — якщо зіпсувати підпис або timestamp.
