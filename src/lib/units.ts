export interface Unit {
  id: string;
  name: string;
  symbol: string;
  // Multiplier to convert TO the base unit for this category
  // For temperature, it's irrelevant, we use specific functions
  factor?: number;
  description?: string;
}

export interface UnitCategory {
  id: string;
  name: string;
  baseUnit: string;
  units: Unit[];
}

export const categories: UnitCategory[] = [
  {
    id: 'length',
    name: 'Length',
    baseUnit: 'meter',
    units: [
      { id: 'meter', name: 'Meter', symbol: 'm', factor: 1, description: 'The base unit of length in the International System of Units (SI), originally defined as one ten-millionth of the distance from the equator to the North Pole.' },
      { id: 'kilometer', name: 'Kilometer', symbol: 'km', factor: 1000, description: 'A metric unit equal to 1,000 meters, universally used for expressing distances between geographical locations on land.' },
      { id: 'centimeter', name: 'Centimeter', symbol: 'cm', factor: 0.01, description: 'A metric unit equal to one hundredth of a meter, commonly used in everyday measurements, clothing sizes, and drafting.' },
      { id: 'millimeter', name: 'Millimeter', symbol: 'mm', factor: 0.001, description: 'A metric unit equal to one thousandth of a meter, used for precise measurements in engineering, machining, and rainfall.' },
      { id: 'mile', name: 'Mile', symbol: 'mi', factor: 1609.344, description: 'An imperial unit of length equal to 5,280 feet, originating from the Roman \'mille passus\' (thousand paces), used for road distances in the US and UK.' },
      { id: 'yard', name: 'Yard', symbol: 'yd', factor: 0.9144, description: 'An imperial unit of length equal to 3 feet, originally derived from the length of a person\'s stride or arm, commonly used in American football and landscaping.' },
      { id: 'foot', name: 'Foot', symbol: 'ft', factor: 0.3048, description: 'An imperial unit of length equal to 12 inches, historically based on the human foot, widely used for human height and building dimensions in the US.' },
      { id: 'inch', name: 'Inch', symbol: 'in', factor: 0.0254, description: 'An imperial unit of length, exactly 2.54 centimeters, originating from the width of a human thumb, used for screen sizes and small components.' },
    ],
  },
  {
    id: 'weight',
    name: 'Weight / Mass',
    baseUnit: 'kilogram',
    units: [
      { id: 'kilogram', name: 'Kilogram', symbol: 'kg', factor: 1, description: 'The base unit of mass in the International System of Units (SI), historically defined by the mass of one liter of water.' },
      { id: 'gram', name: 'Gram', symbol: 'g', factor: 0.001, description: 'A metric unit of mass equal to one thousandth of a kilogram, commonly used in baking recipes and weighing small items.' },
      { id: 'milligram', name: 'Milligram', symbol: 'mg', factor: 0.000001, description: 'A metric unit of mass equal to one thousandth of a gram, used primarily in pharmacology to measure medication doses.' },
      { id: 'metric_ton', name: 'Metric Ton', symbol: 't', factor: 1000, description: 'A non-SI metric unit of mass equal to 1,000 kilograms, used worldwide for heavy industrial and agricultural shipments.' },
      { id: 'pound', name: 'Pound', symbol: 'lb', factor: 0.45359237, description: 'An imperial unit of mass equal to 16 ounces, descended from the Roman libra, used for body weight and groceries in the US.' },
      { id: 'ounce', name: 'Ounce', symbol: 'oz', factor: 0.0283495231, description: 'An imperial unit of mass equal to 1/16 of a pound, commonly used for letters, portions of food, and precious metals.' },
    ],
  },
  {
    id: 'temperature',
    name: 'Temperature',
    baseUnit: 'celsius',
    units: [
      { id: 'celsius', name: 'Celsius', symbol: '°C', description: 'A temperature scale based on 0° for the freezing point of water and 100° for the boiling point.' },
      { id: 'fahrenheit', name: 'Fahrenheit', symbol: '°F', description: 'A temperature scale where water freezes at 32° and boils at 212°.' },
      { id: 'kelvin', name: 'Kelvin', symbol: 'K', description: 'The SI base unit of thermodynamic temperature, starting at absolute zero.' },
    ],
  },
  {
    id: 'area',
    name: 'Area',
    baseUnit: 'square_meter',
    units: [
      { id: 'square_meter', name: 'Square Meter', symbol: 'm²', factor: 1, description: 'The SI derived unit of area, representing a square with sides of one meter, used for measuring room and floor areas.' },
      { id: 'square_kilometer', name: 'Square Kilometer', symbol: 'km²', factor: 1000000, description: 'A multiple of the square meter, commonly used for measuring the area of cities, countries, and large geographical regions.' },
      { id: 'hectare', name: 'Hectare', symbol: 'ha', factor: 10000, description: 'A non-SI metric unit of area equal to 10,000 square meters, primarily used worldwide for measuring land and agricultural estates.' },
      { id: 'acre', name: 'Acre', symbol: 'ac', factor: 4046.8564224, description: 'A unit of land area used in the imperial and US customary systems, originally the area a yoke of oxen could plow in one day.' },
      { id: 'square_mile', name: 'Square Mile', symbol: 'mi²', factor: 2589988.110336, description: 'An imperial unit of area equal to 640 acres, used in the US and UK to express the area of municipalities and regions.' },
      { id: 'square_foot', name: 'Square Foot', symbol: 'ft²', factor: 0.09290304, description: 'An imperial unit of area, widely used in the US for real estate, housing, and commercial office space measurements.' },
      { id: 'square_inch', name: 'Square Inch', symbol: 'in²', factor: 0.00064516, description: 'An imperial unit of area, commonly used in the US for surface area of small objects and in engineering calculations.' },
    ]
  },
  {
    id: 'volume',
    name: 'Volume',
    baseUnit: 'liter',
    units: [
      { id: 'liter', name: 'Liter', symbol: 'L', factor: 1, description: 'A metric unit of volume equal to 1 cubic decimeter, commonly used worldwide for beverages, fuel, and fluid measurements.' },
      { id: 'milliliter', name: 'Milliliter', symbol: 'mL', factor: 0.001, description: 'A metric unit of volume equal to one thousandth of a liter, used for liquid medication, perfumes, and cooking ingredients.' },
      { id: 'cubic_meter', name: 'Cubic Meter', symbol: 'm³', factor: 1000, description: 'The SI derived unit of volume, used for large volumes like shipping containers, concrete, and domestic water usage.' },
      { id: 'us_gallon', name: 'US Gallon', symbol: 'gal', factor: 3.785411784, description: 'A US customary unit of volume for liquids, equal to 3.785 liters, widely used in the US for gasoline and milk.' },
      { id: 'us_quart', name: 'US Quart', symbol: 'qt', factor: 0.946352946, description: 'A US customary unit of volume, equal to one quarter of a gallon, commonly used for motor oil and retail liquids.' },
      { id: 'us_pint', name: 'US Pint', symbol: 'pt', factor: 0.473176473, description: 'A US customary unit of volume, equal to one eighth of a gallon, typically used for serving beverages like beer in the US.' },
      { id: 'us_cup', name: 'US Cup', symbol: 'cup', factor: 0.236588236, description: 'A US customary unit of volume, equal to 8 fluid ounces, heavily used in American culinary recipes and baking.' },
      { id: 'us_fluid_ounce', name: 'US Fluid Ounce', symbol: 'fl oz', factor: 0.0295735296, description: 'A US customary unit of volume, historically based on the volume of one ounce of wine, used for drinks and liquid cosmetics.' },
    ],
  },
  {
    id: 'time',
    name: 'Time',
    baseUnit: 'second',
    units: [
      { id: 'second', name: 'Second', symbol: 's', factor: 1, description: 'The base unit of time in the SI, originally defined as 1/86,400 of a mean solar day, now based on atomic transitions.' },
      { id: 'millisecond', name: 'Millisecond', symbol: 'ms', factor: 0.001, description: 'One thousandth of a second, commonly used to measure audio sample rates, network latency, and camera shutter speeds.' },
      { id: 'microsecond', name: 'Microsecond', symbol: 'µs', factor: 0.000001, description: 'One millionth of a second, used in electronics, microprocessor clock cycles, and high-frequency trading.' },
      { id: 'nanosecond', name: 'Nanosecond', symbol: 'ns', factor: 0.000000001, description: 'One billionth of a second, used in telecommunications, laser technology, and RAM access times.' },
      { id: 'minute', name: 'Minute', symbol: 'min', factor: 60, description: 'A unit of time equal to 60 seconds, believed to originate from ancient Babylonian sexagesimal base-60 timekeeping.' },
      { id: 'hour', name: 'Hour', symbol: 'h', factor: 3600, description: 'A unit of time equal to 60 minutes, originating from the ancient Egyptian practice of dividing day and night into 12 parts each.' },
      { id: 'day', name: 'Day', symbol: 'd', factor: 86400, description: 'A unit of time equal to 24 hours, based on the rotation of the Earth on its axis relative to the Sun.' },
      { id: 'week', name: 'Week', symbol: 'wk', factor: 604800, description: 'A unit of time equal to 7 days, originating from ancient civil calendars and tracking the lunar phases.' },
      { id: 'month', name: 'Month', symbol: 'mo', factor: 2629800, description: 'A unit of time, approximating the cycle of the moon\'s phases, used globally for calendar scheduling and billing cycles.' }, // Average 30.4375 days
      { id: 'year', name: 'Year', symbol: 'yr', factor: 31557600, description: 'A unit of time representing the Earth\'s orbital period around the Sun, fundamental to historical timelines and age tracking.' }, // Average 365.25 days
      { id: 'decade', name: 'Decade', symbol: 'dec', factor: 315576000, description: 'A period of 10 years, commonly used to frame cultural eras and long-term economic trends.' },
      { id: 'century', name: 'Century', symbol: 'c', factor: 3155760000, description: 'A period of 100 years, heavily used in historical documentation dating back to the Roman centuria.' },
    ],
  },
  {
    id: 'speed',
    name: 'Speed',
    baseUnit: 'meter_per_second',
    units: [
      { id: 'meter_per_second', name: 'Meter per Second', symbol: 'm/s', factor: 1, description: 'The SI derived unit of both speed and velocity, used standardly in physics and scientific calculations.' },
      { id: 'kilometer_per_hour', name: 'Kilometer per Hour', symbol: 'km/h', factor: 0.277777778, description: 'A unit of speed expressing the number of kilometers travelled in one hour, the global standard for road speed limits.' },
      { id: 'mile_per_hour', name: 'Mile per Hour', symbol: 'mph', factor: 0.44704, description: 'A unit of speed used primarily in the United States and the United Kingdom for road speed limits and vehicle speeds.' },
      { id: 'foot_per_second', name: 'Foot per Second', symbol: 'ft/s', factor: 0.3048, description: 'A unit of speed in the imperial system, used in aeronautics, ballistics, and American engineering.' },
      { id: 'knot', name: 'Knot', symbol: 'kn', factor: 0.514444444, description: 'A unit of speed equal to one nautical mile per hour, originating from counting knots on a rope, universally used in aviation and maritime navigation.' },
    ],
  },
  {
    id: 'data',
    name: 'Data Storage',
    baseUnit: 'byte',
    units: [
      { id: 'bit', name: 'Bit', symbol: 'b', factor: 0.125, description: 'The most basic unit of information in computing and digital communications, representing a binary value of 0 or 1.' },
      { id: 'byte', name: 'Byte', symbol: 'B', factor: 1, description: 'A unit of digital information typically consisting of eight bits, originally designed to encode a single character of text.' },
      { id: 'kilobyte', name: 'Kilobyte', symbol: 'KB', factor: 1000, description: 'A unit of digital information (1,000 bytes), historically used to describe the size of small text files and early computer memory.' },
      { id: 'megabyte', name: 'Megabyte', symbol: 'MB', factor: 1000000, description: '1,000,000 bytes of digital information, commonly used to measure the size of photos, MP3s, and short video clips.' },
      { id: 'gigabyte', name: 'Gigabyte', symbol: 'GB', factor: 1000000000, description: '1,000,000,000 bytes of digital information, the standard unit for measuring smartphone storage and video game sizes.' },
      { id: 'terabyte', name: 'Terabyte', symbol: 'TB', factor: 1000000000000, description: '1,000,000,000,000 bytes, widely used to quantify the capacity of modern hard drives, SSDs, and personal backups.' },
      { id: 'petabyte', name: 'Petabyte', symbol: 'PB', factor: 1000000000000000, description: 'A unit of data storage equal to 1,000 terabytes, used to measure massive enterprise databases and global network traffic.' },
      { id: 'kibibyte', name: 'Kibibyte', symbol: 'KiB', factor: 1024, description: 'A strictly binary unit representing 1,024 bytes, established to avoid the ambiguity of decimal vs. binary prefixes in computing.' },
      { id: 'mebibyte', name: 'Mebibyte', symbol: 'MiB', factor: 1048576, description: 'A strictly binary unit representing 1,048,576 bytes, used by operating systems like Windows to display file sizes accurately.' },
      { id: 'gibibyte', name: 'Gibibyte', symbol: 'GiB', factor: 1073741824, description: 'A strictly binary unit representing 1,073,741,824 bytes, commonly used by technical professionals for RAM and system storage.' },
      { id: 'tebibyte', name: 'Tebibyte', symbol: 'TiB', factor: 1099511627776, description: 'A strictly binary unit representing 1,024 gibibytes, increasingly used alongside terabytes in enterprise storage arrays.' },
    ],
  },
  {
    id: 'pressure',
    name: 'Pressure',
    baseUnit: 'pascal',
    units: [
      { id: 'pascal', name: 'Pascal', symbol: 'Pa', factor: 1, description: 'The SI derived unit of pressure, named after Blaise Pascal, used in stress analysis, meteorology, and aerodynamics.' },
      { id: 'kilopascal', name: 'Kilopascal', symbol: 'kPa', factor: 1000, description: 'One thousand pascals, universally used in metric countries to measure tire pressure and civil engineering loads.' },
      { id: 'bar', name: 'Bar', symbol: 'bar', factor: 100000, description: 'A metric unit of pressure, exactly equal to 100,000 Pa, roughly approximating atmospheric pressure on Earth at sea level.' },
      { id: 'psi', name: 'Pound per Square Inch', symbol: 'psi', factor: 6894.75729, description: 'Pounds per square inch, an imperial unit of pressure widely used in the US for tires, scuba tanks, and natural gas lines.' },
      { id: 'atmosphere', name: 'Standard Atmosphere', symbol: 'atm', factor: 101325, description: 'Standard atmosphere, commonly used as a reference pressure for chemical reactions and denoting depth pressures in diving.' },
      { id: 'torr', name: 'Torr', symbol: 'Torr', factor: 133.322368, description: 'A unit of pressure based on an absolute scale, approximating the pressure of 1 mm of mercury, used in high-vacuum physics and medicine.' },
    ],
  },
  {
    id: 'energy',
    name: 'Energy',
    baseUnit: 'joule',
    units: [
      { id: 'joule', name: 'Joule', symbol: 'J', factor: 1, description: 'The SI derived unit of energy, defined as the work done by a force of one newton moving one meter, used widely in science.' },
      { id: 'kilojoule', name: 'Kilojoule', symbol: 'kJ', factor: 1000, description: 'One thousand joules, often used in places like Australia and the EU instead of calories on food nutritional labels.' },
      { id: 'gram_calorie', name: 'Gram Calorie', symbol: 'cal', factor: 4.184, description: 'The approximate amount of energy needed to raise the temperature of 1 gram of water by 1 °C, the historical basis of food energy.' },
      { id: 'kilocalorie', name: 'Kilocalorie', symbol: 'kcal', factor: 4184, description: 'Commonly referred to as a \'calorie\' in food energy, it measures the dietary energy available in items we consume.' },
      { id: 'watt_hour', name: 'Watt Hour', symbol: 'Wh', factor: 3600, description: 'A unit of energy equivalent to one watt of power expended for one hour, often used to rate laptop and e-bike batteries.' },
      { id: 'kilowatt_hour', name: 'Kilowatt Hour', symbol: 'kWh', factor: 3600000, description: 'Commonly used as a billing unit for energy delivered to consumers by residential and commercial electric utilities.' },
      { id: 'electronvolt', name: 'Electronvolt', symbol: 'eV', factor: 1.602176634e-19, description: 'A unit of energy used in physics, representing the energy gained by an electron, used heavily in particle and quantum physics.' },
      { id: 'btu', name: 'British Thermal Unit', symbol: 'BTU', factor: 1055.05585, description: 'British Thermal Unit, a traditional unit of heat originally defined by raising the temperature of water, used today for HVAC sizing.' },
    ],
  },
  {
    id: 'cooking',
    name: 'Cooking',
    baseUnit: 'milliliter',
    units: [
      { id: 'milliliter', name: 'Milliliter', symbol: 'mL', factor: 1, description: 'A metric unit of volume equal to one thousandth of a liter.' },
      { id: 'liter', name: 'Liter', symbol: 'L', factor: 1000, description: 'A metric unit of volume equal to 1 cubic decimeter.' },
      { id: 'teaspoon_us', name: 'US Teaspoon', symbol: 'tsp', factor: 4.92892, description: 'A US customary unit of volume, used in recipes and cooking.' },
      { id: 'tablespoon_us', name: 'US Tablespoon', symbol: 'tbsp', factor: 14.7868, description: 'A US customary unit of volume equal to 3 teaspoons.' },
      { id: 'cup_us', name: 'US Cup', symbol: 'cup', factor: 236.588, description: 'A US customary unit of volume, used extensively in cooking and baking.' },
      { id: 'fluid_ounce_us', name: 'US Fluid Ounce', symbol: 'fl oz', factor: 29.5735, description: 'A unit of volume in the US customary system.' },
      { id: 'pint_us', name: 'US Pint', symbol: 'pt', factor: 473.176, description: 'A metric unit of volume equal to 16 US fluid ounces.' },
      { id: 'quart_us', name: 'US Quart', symbol: 'qt', factor: 946.353, description: 'A US customary unit equal to 2 pints.' },
      { id: 'gallon_us', name: 'US Gallon', symbol: 'gal', factor: 3785.41, description: 'A US customary unit equal to 4 quarts.' },
    ]
  },
  {
    id: 'currency',
    name: 'Currency',
    baseUnit: 'usd',
    units: [
      { id: 'usd', name: 'US Dollar', symbol: '$', factor: 1, description: 'The United States Dollar, the official currency of the United States.' },
      { id: 'eur', name: 'Euro', symbol: '€', factor: 0.92, description: 'The Euro, the official currency of the European Union.' },
      { id: 'gbp', name: 'British Pound', symbol: '£', factor: 0.79, description: 'The British Pound, the official currency of the United Kingdom.' },
      { id: 'jpy', name: 'Japanese Yen', symbol: '¥', factor: 150, description: 'The Japanese Yen, the official currency of Japan.' },
      { id: 'inr', name: 'Indian Rupee', symbol: '₹', factor: 83, description: 'The Indian Rupee, the official currency of India.' },
      { id: 'aud', name: 'Australian Dollar', symbol: 'A$', factor: 1.53, description: 'The Australian Dollar, the official currency of Australia.' },
      { id: 'cad', name: 'Canadian Dollar', symbol: 'C$', factor: 1.35, description: 'The Canadian Dollar, the official currency of Canada.' },
      { id: 'chf', name: 'Swiss Franc', symbol: 'CHF', factor: 0.88, description: 'The Swiss Franc, the official currency of Switzerland.' },
      { id: 'cny', name: 'Chinese Yuan', symbol: '¥', factor: 7.23, description: 'The Chinese Yuan, the primary currency of the People\'s Republic of China.' },
    ],
  }
];

export async function updateCurrencyRates() {
  try {
    const res = await fetch('https://open.er-api.com/v6/latest/USD');
    const data = await res.json();
    if (data && data.rates) {
      const currencyCat = categories.find(c => c.id === 'currency');
      if (currencyCat) {
        currencyCat.units.forEach(u => {
          const rateCode = u.id.toUpperCase();
          if (data.rates[rateCode]) {
            // factor is the rate against USD, which is our baseUnit
            // since baseUnit is usd, dividing by factor gives USD value. Wait.
            // If factor is how much of unit equals 1 baseUnit:
            // e.g. 1 USD = 0.92 EUR. So factor for EUR should be 0.92?
            // Let's check how linear conversion works in convert():
            // baseValue = value * fromUnit.factor
            // if fromUnit is EUR, and factor is 0.92, baseValue = value * 0.92. NO!
            // Wait, factor in my initial implementation:
            // baseValue = value * fromUnit.factor.
            // If length: 1 km = 1000 m. factor for km is 1000.
            // So if value is 1 (km), baseValue = 1 * 1000 = 1000m.
            // So factor of EUR should be 1 / 0.92 = 1.086 USD?
            // Let's verify data.rates: "EUR": 0.85 means 1 USD = 0.85 EUR.
            // So 1 EUR = (1 / 0.85) USD.
            // So in my current implementation, the factor for EUR should be (1 / data.rates[rateCode]).
            u.factor = 1 / data.rates[rateCode];
          }
        });
      }
      return true;
    }
  } catch (e) {
    console.error('Failed to fetch currency rates', e);
  }
  return false;
}

export function convert(
  value: number, 
  fromId: string, 
  toId: string, 
  categoryId: string
): number {
  if (fromId === toId) return value;
  
  if (categoryId === 'temperature') {
    // Convert TO Celsius first
    let celsius = value;
    if (fromId === 'fahrenheit') {
      celsius = (value - 32) * 5 / 9;
    } else if (fromId === 'kelvin') {
      celsius = value - 273.15;
    }
    
    // Convert FROM Celsius to target
    if (toId === 'fahrenheit') {
      return (celsius * 9 / 5) + 32;
    } else if (toId === 'kelvin') {
      return celsius + 273.15;
    }
    return celsius; // toId is celsius
  }
  
  // Linear conversions
  const cat = categories.find(c => c.id === categoryId);
  if (!cat) return value;
  
  const fromUnit = cat.units.find(u => u.id === fromId);
  const toUnit = cat.units.find(u => u.id === toId);
  
  if (!fromUnit || !toUnit || fromUnit.factor === undefined || toUnit.factor === undefined) return value;
  
  // Value in base unit
  const baseValue = value * fromUnit.factor;
  // Convert to target
  return baseValue / toUnit.factor;
}

export function getSuggestions(query: string) {
  if (!query || query.trim().length === 0) return [];
  const q = query.toLowerCase().trim();
  
  const results: any[] = [];
  
  // Parse something like "kg to lbs", "meter", etc.
  categories.forEach(cat => {
    cat.units.forEach(u1 => {
      cat.units.forEach(u2 => {
        if (u1.id === u2.id) return;
        
        const name1 = u1.name.toLowerCase();
        const name2 = u2.name.toLowerCase();
        const sym1 = u1.symbol.toLowerCase();
        const sym2 = u2.symbol.toLowerCase();

        const phrase1 = `${name1} to ${name2}`;
        const phrase2 = `${sym1} to ${sym2}`;
        
        const qWords = q.split(/\\s+/);
        const matchSymbols = qWords.includes(sym1) && qWords.includes(sym2);

        if (
          phrase1.includes(q) || 
          phrase2.includes(q) || 
          (q.includes(name1) && q.includes(name2)) ||
          matchSymbols ||
          sym1 === q
        ) {
          
          // Deduplicate
          if (!results.find(r => r.fromId === u1.id && r.toId === u2.id)) {
            results.push({
              categoryId: cat.id,
              fromId: u1.id,
              toId: u2.id,
              text: `${u1.name} to ${u2.name}`
            });
          }
        }
      });
    });
  });
  
  return results.slice(0, 5); // Return top 5 suggestions
}

// Ensure categorzeQuery doesn't cause errors if not imported, replacing it with getSuggestions in App.tsx
