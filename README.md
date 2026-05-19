# QuickConvert Units Repository

## 📦 What's inside this repository?

This repo provides:
- A **comprehensive unit conversion dataset** (JSON/CSV) – formulas, categories, and aliases.
- Code snippets for **JavaScript, Python, and PHP** to integrate conversions into your own projects.
- An **unofficial API wrapper** for our free conversion endpoint.

---

## 🚀 Quick Start – Use the Online Converter

No code needed? Just visit the live website:  
➡️ **[quickconvertunits.com](https://quickconvertunits.com)**

Convert between:
- Length (meters, feet, miles, km, …)
- Mass (kg, lb, oz, ton, …)
- Volume (liters, gallons, cups, …)
- Temperature (Celsius, Fahrenheit, Kelvin)
- Area, speed, time, data storage, and **50+ more categories**.

---

## 🔌 API Example (No API Key Required)

You can use our public endpoint to get conversions directly:

```bash
# Convert 5 kilometers to miles
curl "https://quickconvertunits.com/api/convert?from=km&to=miles&value=5"
```
Response:

```json
{
  "from": "km",
  "to": "miles",
  "value": 5,
  "result": 3.10686,
  "formula": "multiply by 0.621371"
}
```

Supported parameters:

`from` – source unit (e.g., kg, celsius, gal)

`to` – target unit

`value` – numeric amount

Rate limits: 100 requests/minute (free, no signup).

📊 Dataset – Unit Conversion Factors
If you prefer offline use, download our conversion dataset:

`conversions.json` – complete list of conversion factors and formulas.

`conversions.csv` – spreadsheet format.

Sample JSON entry:

```json
{
  "category": "Length",
  "base_unit": "meter",
  "units": {
    "meter": 1,
    "kilometer": 1000,
    "mile": 1609.34,
    "foot": 0.3048
  }
}
```

You can use this to build your own converter without calling any API.

💻 Code Examples

JavaScript (Node.js / Browser)
```javascript
async function convert(value, from, to) {
  const res = await fetch(`https://quickconvertunits.com/api/convert?from=${from}&to=${to}&value=${value}`);
  const data = await res.json();
  return data.result;
}

convert(10, 'km', 'miles').then(console.log); // 6.21371
```

Python
```python
import requests

def convert(value, from_unit, to_unit):
    url = f"https://quickconvertunits.com/api/convert?from={from_unit}&to={to_unit}&value={value}"
    return requests.get(url).json()['result']

print(convert(100, 'celsius', 'fahrenheit'))  # 212.0
```

PHP
```php
$result = file_get_contents('https://quickconvertunits.com/api/convert?from=kg&to=lb&value=10');
$data = json_decode($result, true);
echo $data['result']; // 22.0462
```

🤝 Contributing
Found a missing unit or an incorrect conversion factor?
We welcome pull requests! Please:

Fork the repo.

Update data/conversions.json with corrections.

Submit a pull request including your source/reference.

Alternatively, open an issue.

📄 License
MIT License – free for commercial and personal use.
Attribution is appreciated but not required.

🌐 Related Resources
Live Unit Converter – use it right now.

SWIFT Code Directory – find bank codes globally.

US Routing Number Lookup – check ABA routing numbers.
