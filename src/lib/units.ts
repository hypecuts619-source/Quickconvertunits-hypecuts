export interface Unit {
  id: string;
  name: string;
  symbol: string;
  // Multiplier to convert TO the base unit for this category
  // For temperature, it's irrelevant, we use specific functions
  factor?: number;
  description?: string;
  popularity?: number; // 1-100 score for SEO prioritisation
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
      { id: 'meter', name: 'Meter', symbol: 'm', factor: 1, popularity: 95, description: 'The base unit of length in the International System of Units (SI), originally defined as one ten-millionth of the distance from the equator to the North Pole.' },
      { id: 'kilometer', name: 'Kilometer', symbol: 'km', factor: 1000, popularity: 90, description: 'A metric unit equal to 1,000 meters, universally used for expressing distances between geographical locations on land.' },
      { id: 'centimeter', name: 'Centimeter', symbol: 'cm', factor: 0.01, popularity: 85, description: 'A metric unit equal to one hundredth of a meter, commonly used in everyday measurements, clothing sizes, and drafting.' },
      { id: 'millimeter', name: 'Millimeter', symbol: 'mm', factor: 0.001, popularity: 80, description: 'A metric unit equal to one thousandth of a meter, used for precise measurements in engineering, machining, and rainfall.' },
      { id: 'mile', name: 'Mile', symbol: 'mi', factor: 1609.344, popularity: 95, description: 'An imperial unit of length equal to 5,280 feet, originating from the Roman \'mille passus\' (thousand paces), used for road distances in the US and UK.' },
      { id: 'yard', name: 'Yard', symbol: 'yd', factor: 0.9144, popularity: 70, description: 'An imperial unit of length equal to 3 feet, originally derived from the length of a person\'s stride or arm, commonly used in American football and landscaping.' },
      { id: 'foot', name: 'Foot', symbol: 'ft', factor: 0.3048, popularity: 90, description: 'An imperial unit of length equal to 12 inches, historically based on the human foot, widely used for human height and building dimensions in the US.' },
      { id: 'inch', name: 'Inch', symbol: 'in', factor: 0.0254, popularity: 98, description: 'An imperial unit of length, exactly 2.54 centimeters, originating from the width of a human thumb, used for screen sizes and small components.' },
    ],
  },
  {
    id: 'weight',
    name: 'Weight / Mass',
    baseUnit: 'kilogram',
    units: [
      { id: 'kilogram', name: 'Kilogram', symbol: 'kg', factor: 1, popularity: 98, description: 'The base unit of mass in the International System of Units (SI), historically defined by the mass of one liter of water.' },
      { id: 'gram', name: 'Gram', symbol: 'g', factor: 0.001, popularity: 95, description: 'A metric unit of mass equal to one thousandth of a kilogram, commonly used in baking recipes and weighing small items.' },
      { id: 'milligram', name: 'Milligram', symbol: 'mg', factor: 0.000001, popularity: 75, description: 'A metric unit of mass equal to one thousandth of a gram, used primarily in pharmacology to measure medication doses.' },
      { id: 'metric_ton', name: 'Metric Ton', symbol: 't', factor: 1000, popularity: 80, description: 'A non-SI metric unit of mass equal to 1,000 kilograms, used worldwide for heavy industrial and agricultural shipments.' },
      { id: 'pound', name: 'Pound', symbol: 'lb', factor: 0.45359237, popularity: 98, description: 'An imperial unit of mass equal to 16 ounces, descended from the Roman libra, used for body weight and groceries in the US.' },
      { id: 'ounce', name: 'Ounce', symbol: 'oz', factor: 0.0283495231, popularity: 90, description: 'An imperial unit of mass equal to 1/16 of a pound, commonly used for letters, portions of food, and precious metals.' },
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
      { id: 'tablespoon_us', name: 'US Tablespoon', symbol: 'tbsp', factor: 0.0147867648, description: 'A US customary unit of volume equal to 3 teaspoons.' },
      { id: 'teaspoon_us', name: 'US Teaspoon', symbol: 'tsp', factor: 0.0049289216, description: 'A US customary unit of volume, used in recipes and cooking.' },
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
      { id: 'atm', name: 'Standard Atmosphere (Short)', symbol: 'atm', factor: 101325, description: 'Standard atmosphere abbreviation.' },
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
    name: 'Cooking Ingredients',
    baseUnit: 'gram',
    units: [
      { id: 'gram', name: 'Gram', symbol: 'g', factor: 1, description: 'A metric unit of mass, the standard for professional baking and cooking.' },
      { id: 'ounce', name: 'Ounce', symbol: 'oz', factor: 28.3495, description: 'An imperial unit of mass widely used in US recipes.' },
      { id: 'cup_water', name: 'Cup (Water/Milk)', symbol: 'c', factor: 236.588, description: '1 US liquid cup of water or milk weighs roughly 236 grams.' },
      { id: 'cup_flour_ap', name: 'Cup (All-Purpose Flour)', symbol: 'c', factor: 120, description: '1 US cup of properly spooned and leveled all-purpose flour weighs 120 grams.' },
      { id: 'cup_flour_bread', name: 'Cup (Bread Flour)', symbol: 'c', factor: 127, description: '1 US cup of bread flour weighs slightly more than all-purpose at 127 grams.' },
      { id: 'cup_sugar_granulated', name: 'Cup (Granulated Sugar)', symbol: 'c', factor: 200, description: '1 US cup of standard granulated white sugar weighs 200 grams.' },
      { id: 'cup_sugar_brown', name: 'Cup (Packed Brown Sugar)', symbol: 'c', factor: 213, description: '1 US cup of tightly packed brown sugar weighs 213 grams.' },
      { id: 'cup_sugar_powdered', name: 'Cup (Powdered Sugar)', symbol: 'c', factor: 113, description: '1 US cup of powdered or confectioner\'s sugar is very light, weighing 113 grams.' },
      { id: 'cup_butter', name: 'Cup (Butter / 2 Sticks)', symbol: 'c', factor: 227, description: '1 US cup of butter weighs 227 grams. This is exactly two standard US sticks of butter.' },
      { id: 'tbsp_butter', name: 'Tablespoon (Butter)', symbol: 'tbsp', factor: 14.18, description: '1 tablespoon of butter weighs approximately 14.2 grams.' },
      { id: 'cup_cocoa', name: 'Cup (Cocoa Powder)', symbol: 'c', factor: 100, description: '1 US cup of unsweetened cocoa powder weighs 100 grams.' },
      { id: 'cup_honey', name: 'Cup (Honey / Syrup)', symbol: 'c', factor: 340, description: 'Dense liquids like honey or maple syrup are incredibly heavy, weighing 340 grams per cup.' }
    ]
  },
  {
    id: 'currency',
    name: 'Currency',
    baseUnit: 'usd',
    units: [
      { id: 'usd', name: 'US Dollar', symbol: '$', factor: 1, description: 'The United States Dollar, the official currency of the United States and the world\'s primary reserve currency.' },
      { id: 'eur', name: 'Euro', symbol: '€', factor: 0.92, description: 'The Euro, the official currency of 20 of the 27 member states of the European Union, making it the second most traded currency globally.' },
      { id: 'gbp', name: 'British Pound', symbol: '£', factor: 0.79, description: 'The British Pound Sterling, the official currency of the United Kingdom and its territories, and one of the oldest currencies still in use.' },
      { id: 'jpy', name: 'Japanese Yen', symbol: '¥', factor: 150, description: 'The Japanese Yen, the official currency of Japan, serving as a major reserve currency and widely traded in foreign exchange markets.' },
      { id: 'inr', name: 'Indian Rupee', symbol: '₹', factor: 83, description: 'The Indian Rupee, the official currency of India, regulated by the Reserve Bank of India and used across the Indian subcontinent.' },
      { id: 'aud', name: 'Australian Dollar', symbol: 'A$', factor: 1.53, description: 'The Australian Dollar, the official currency of Australia and its territories, popular among traders due to Australia\'s rich natural resources.' },
      { id: 'cad', name: 'Canadian Dollar', symbol: 'C$', factor: 1.35, description: 'The Canadian Dollar, the official currency of Canada, often referred to as the \'Loonie\' and heavily influenced by commodity prices.' },
      { id: 'chf', name: 'Swiss Franc', symbol: 'CHF', factor: 0.88, description: 'The Swiss Franc, the official currency of Switzerland and Liechtenstein, widely considered a safe-haven asset by investors.' },
      { id: 'cny', name: 'Chinese Yuan', symbol: '¥', factor: 7.23, description: 'The Chinese Yuan (Renminbi), the primary currency of the People\'s Republic of China, playing an increasingly important role in global trade.' },
      { id: 'mxn', name: 'Mexican Peso', symbol: '$', factor: 17.0, description: 'The Mexican Peso, the official currency of Mexico and the most traded currency in Latin America.' },
      { id: 'brl', name: 'Brazilian Real', symbol: 'R$', factor: 5.0, description: 'The Brazilian Real, the official currency of Brazil, the largest economy in South America.' },
      { id: 'zar', name: 'South African Rand', symbol: 'R', factor: 18.5, description: 'The South African Rand, the official currency of South Africa and the Common Monetary Area.' },
      { id: 'rub', name: 'Russian Ruble', symbol: '₽', factor: 90.0, description: 'The Russian Ruble, the official currency of the Russian Federation and one of the world\'s oldest currencies.' },
      { id: 'sgd', name: 'Singapore Dollar', symbol: 'S$', factor: 1.35, description: 'The Singapore Dollar, the official currency of Singapore, known for its stability and strong financial ecosystem.' },
      { id: 'hkd', name: 'Hong Kong Dollar', symbol: 'HK$', factor: 7.8, description: 'The Hong Kong Dollar, the official currency of Hong Kong, pegged to the US Dollar to maintain financial stability.' },
      { id: 'nzd', name: 'New Zealand Dollar', symbol: 'NZ$', factor: 1.6, description: 'The New Zealand Dollar, the official currency of New Zealand, often called the \'Kiwi\' and popular in forex trading.' },
      { id: 'sek', name: 'Swedish Krona', symbol: 'kr', factor: 10.5, description: 'The Swedish Krona, the official currency of Sweden, functioning as a free-floating currency.' },
      { id: 'krw', name: 'South Korean Won', symbol: '₩', factor: 1300.0, description: 'The South Korean Won, the official currency of South Korea, issued by the Bank of Korea.' },
      { id: 'aed', name: 'UAE Dirham', symbol: 'د.إ', factor: 3.67, description: 'The United Arab Emirates Dirham, the official currency of the UAE, pegged to the US Dollar.' },
      { id: 'btc', name: 'Bitcoin', symbol: 'BTC', factor: 1 / 65000, description: 'Bitcoin, the first and most widely recognized cryptocurrency.' },
      { id: 'eth', name: 'Ethereum', symbol: 'ETH', factor: 1 / 3500, description: 'Ethereum, a decentralized, open-source blockchain with smart contract functionality.' },
      { id: 'sol', name: 'Solana', symbol: 'SOL', factor: 1 / 150, description: 'Solana, a high-performance blockchain supporting builders around the world creating crypto apps that scale today.' },
    ],
  },
  {
    id: 'power',
    name: 'Power',
    baseUnit: 'watt',
    units: [
      { id: 'watt', name: 'Watt', symbol: 'W', factor: 1, description: 'The SI unit of power, equivalent to one joule per second, used to specify the rate at which electrical energy is dissipated.' },
      { id: 'kilowatt', name: 'Kilowatt', symbol: 'kW', factor: 1000, description: 'One thousand watts, typically used to express the output power of engines and the power consumption of electric motors.' },
      { id: 'megawatt', name: 'Megawatt', symbol: 'MW', factor: 1000000, description: 'One million watts, commonly used to measure the output of power plants or the power consumption of large facilities.' },
      { id: 'horsepower', name: 'Horsepower (Mechanical)', symbol: 'hp', factor: 745.699872, description: 'A unit of power denoting the rate at which work is done, famously established by James Watt to compare steam engines with draft horses.' },
      { id: 'metric_horsepower', name: 'Metric Horsepower', symbol: 'PS', factor: 735.49875, description: 'The metric equivalent of horsepower, defined as the power required to raise a mass of 75 kilograms against Earth\'s gravity over one meter in one second.' },
      { id: 'btu_per_hour', name: 'BTU per Hour', symbol: 'BTU/h', factor: 0.293071, description: 'A unit of power typically used in the heating and air conditioning industry.' }
    ],
  },
  {
    id: 'angle',
    name: 'Angle',
    baseUnit: 'degree',
    units: [
      { id: 'degree', name: 'Degree', symbol: '°', factor: 1, description: 'A measurement of a plane angle, representing 1/360 of a full rotation.' },
      { id: 'radian', name: 'Radian', symbol: 'rad', factor: 57.295779513, description: 'The SI unit for measuring angles, defined such that an angle of one radian subtends an arc of length equal to the radius.' },
      { id: 'gradian', name: 'Gradian', symbol: 'grad', factor: 0.9, description: 'A unit of measurement of an angle, equivalent to 1/400 of a turn or 9/10 of a degree, used in surveying.' },
      { id: 'arcminute', name: 'Arcminute', symbol: '\'', factor: 0.0166666667, description: 'A unit of angular measurement equal to 1/60 of one degree.' },
      { id: 'arcsecond', name: 'Arcsecond', symbol: '"', factor: 0.000277777778, description: 'A unit of angular measurement equal to 1/60 of an arcminute or 1/3600 of a degree, used in astronomy.' }
    ],
  },
  {
    id: 'fuel',
    name: 'Fuel Economy',
    baseUnit: 'km_per_liter',
    units: [
      { id: 'km_per_liter', name: 'Kilometers per Liter', symbol: 'km/L', factor: 1, description: 'The distance in kilometers that a vehicle can travel on one liter of fuel.' },
      { id: 'miles_per_gallon', name: 'Miles per Gallon (US)', symbol: 'mpg', factor: 0.425143707, description: 'A measure of how far a vehicle can travel on one US gallon of fuel.' },
      { id: 'miles_per_gallon_uk', name: 'Miles per Gallon (UK)', symbol: 'mpg (UK)', factor: 0.35400619, description: 'A measure of how far a vehicle can travel on one imperial gallon of fuel.' },
      { id: 'liters_per_100km', name: 'Liters per 100km', symbol: 'L/100km', factor: 1, description: 'A common metric for fuel consumption representing how many liters are needed for 100km.' }
    ]
  },
  {
    id: 'frequency',
    name: 'Frequency',
    baseUnit: 'hertz',
    units: [
      { id: 'hertz', name: 'Hertz', symbol: 'Hz', factor: 1, description: 'The SI unit of frequency, defined as one cycle per second, named after Heinrich Hertz.' },
      { id: 'kilohertz', name: 'Kilohertz', symbol: 'kHz', factor: 1000, description: 'One thousand cycles per second, used in radio broadcasting and audio frequencies.' },
      { id: 'megahertz', name: 'Megahertz', symbol: 'MHz', factor: 1000000, description: 'One million cycles per second, used for FM radio, television, and microprocessors.' },
      { id: 'gigahertz', name: 'Gigahertz', symbol: 'GHz', factor: 1000000000, description: 'One billion cycles per second, used in satellite communications, radar, and computer CPUs.' },
    ],
  },
  {
    id: 'time_zone',
    name: 'Time Zone',
    baseUnit: 'utc',
    units: [] // Special case for UI
  },
  {
    id: 'bmi',
    name: 'BMI Calculator',
    baseUnit: 'bmi',
     units: [] // Special case for UI
  },
  {
    id: 'typography',
    name: 'Typography',
    baseUnit: 'pixel',
    units: [
      { id: 'pixel', name: 'Pixel', symbol: 'px', factor: 1, description: 'A base design unit for web interfaces.' },
      { id: 'point', name: 'Point', symbol: 'pt', factor: 1.3333333333, description: 'Traditional typographic measurement (72 pt = 1 inch).' },
      { id: 'em', name: 'Em', symbol: 'em', factor: 16, description: 'Relative unit for font sizing. Usually 1em = 16px.' },
      { id: 'rem', name: 'Rem', symbol: 'rem', factor: 16, description: 'Root em, widely used in modern CSS.' },
      { id: 'inch', name: 'Inch', symbol: 'in', factor: 96, description: 'Standard CSS inch (1in = 96px).' },
      { id: 'centimeter', name: 'Centimeter', symbol: 'cm', factor: 37.795275591, description: 'Standard CSS centimeter (1cm = 96px / 2.54).' }
    ]
  },
  {
    id: 'data_rate',
    name: 'Data Transfer Rate',
    baseUnit: 'bps',
    units: [
      { id: 'bps', name: 'Bit per second', symbol: 'bps', factor: 1, description: 'The fundamental unit of data transfer rate.' },
      { id: 'kbps', name: 'Kilobit per second', symbol: 'Kbps', factor: 1000, description: 'One thousand bits per second, used to measure audio bitrate and slow connections.' },
      { id: 'mbps', name: 'Megabit per second', symbol: 'Mbps', factor: 1000000, description: 'One million bits per second, the standard metric for consumer internet connection speeds.' },
      { id: 'gbps', name: 'Gigabit per second', symbol: 'Gbps', factor: 1000000000, description: 'One billion bits per second, used to measure high-speed enterprise networks and fiber optics.' },
      { id: 'Bps', name: 'Byte per second', symbol: 'B/s', factor: 8, description: 'Eight bits per second.' },
      { id: 'KBps', name: 'Kilobyte per second', symbol: 'KB/s', factor: 8000, description: 'Eight thousand bits per second, often used by download managers to display transfer rates.' },
      { id: 'MBps', name: 'Megabyte per second', symbol: 'MB/s', factor: 8000000, description: 'Eight million bits per second, commonly used to describe file transfer speeds on local networks and SSDs.' },
      { id: 'GBps', name: 'Gigabyte per second', symbol: 'GB/s', factor: 8000000000, description: 'Eight billion bits per second, measured in very high-speed internal bus transfers or massive data centers.' }
    ]
  },
  {
    id: 'torque',
    name: 'Torque',
    baseUnit: 'newton_meter',
    units: [
      { id: 'newton_meter', name: 'Newton-meter', symbol: 'N·m', factor: 1, description: 'The SI unit for torque, representing a force of one newton applied perpendicularly to a moment arm one meter long.' },
      { id: 'pound_foot', name: 'Pound-foot', symbol: 'lb·ft', factor: 1.3558179483, description: 'An imperial unit of torque, famously used to quantify and market the rotational force of automotive engines.' },
      { id: 'pound_inch', name: 'Pound-inch', symbol: 'lb·in', factor: 0.112984829, description: 'An imperial unit of torque used to measure smaller forces, such as the tightening specification of small bolts.' },
      { id: 'kilogram_meter', name: 'Kilogram-meter', symbol: 'kg·m', factor: 9.80665, description: 'A metric (though non-SI) unit of torque equivalent to the force of one kilogram in Earth\'s gravity at a distance of one meter.' }
    ]
  },
  {
    id: 'force',
    name: 'Force',
    baseUnit: 'newton',
    units: [
      { id: 'newton', name: 'Newton', symbol: 'N', factor: 1, description: 'The SI unit of force.' },
      { id: 'pound_force', name: 'Pound-force', symbol: 'lbf', factor: 4.44822, description: 'An imperial unit of force.' },
      { id: 'kilogram_force', name: 'Kilogram-force', symbol: 'kgf', factor: 9.80665, description: 'A metric (non-SI) unit of force.' }
    ]
  },
  {
    id: 'density',
    name: 'Density',
    baseUnit: 'kg_per_cubic_meter',
    units: [
      { id: 'kg_per_cubic_meter', name: 'Kilogram/Cubic Meter', symbol: 'kg/m³', factor: 1, description: 'The SI unit of density.' },
      { id: 'g_per_cubic_centimeter', name: 'Gram/Cubic Centimeter', symbol: 'g/cm³', factor: 1000, description: 'A common metric unit of density.' },
      { id: 'lb_per_cubic_foot', name: 'Pound/Cubic Foot', symbol: 'lb/ft³', factor: 16.01846, description: 'An imperial unit of density.' },
      { id: 'lb_per_gallon_us', name: 'Pound/US Gallon', symbol: 'lb/gal', factor: 119.8264, description: 'Commonly used to express the density of liquids in the US.' }
    ]
  },
  {
    id: 'blood_sugar',
    name: 'Blood Sugar',
    baseUnit: 'mg_dl',
    units: [
      { id: 'mg_dl', name: 'Milligrams per Deciliter', symbol: 'mg/dL', factor: 1, description: 'Standard unit for measuring blood glucose levels in the US.' },
      { id: 'mmol_l', name: 'Millimoles per Liter', symbol: 'mmol/L', factor: 18.0182, description: 'Standard unit for measuring blood glucose levels in the UK, Canada, and Australia.' },
    ]
  },
  {
    id: 'pace',
    name: 'Pace',
    baseUnit: 'min_per_km',
    units: [
      { id: 'min_per_km', name: 'Minutes per Kilometer', symbol: 'min/km', factor: 1, description: 'Pace measured in minutes to complete one kilometer.' },
      { id: 'min_per_mile', name: 'Minutes per Mile', symbol: 'min/mi', factor: 0.621371192, description: 'Pace measured in minutes to complete one mile.' }
    ]
  },
  {
    id: 'illuminance',
    name: 'Illuminance',
    baseUnit: 'lux',
    units: [
      { id: 'lux', name: 'Lux', symbol: 'lx', factor: 1, description: 'The SI derived unit of illuminance, representing lumens per square meter.' },
      { id: 'foot_candle', name: 'Foot-candle', symbol: 'fc', factor: 10.7639, description: 'A non-SI unit of illuminance widely used in the US for lighting layouts.' }
    ]
  }
];

export async function updateCurrencyRates() {
  try {
    let currencyData: any = null;
    let cryptoData: any = null;
    
    // Attempt remote fetch
    try {
      const res = await fetch('https://open.er-api.com/v6/latest/USD');
      currencyData = await res.json();
      if (currencyData && currencyData.rates && typeof window !== "undefined") {
        localStorage.setItem('cached_currency_rates', JSON.stringify(currencyData));
      }
    } catch (e) {
      console.warn("Offline or fetch failed for currency rates. Using cache if available.");
      if (typeof window !== "undefined") {
        const cached = localStorage.getItem('cached_currency_rates');
        if (cached) currencyData = JSON.parse(cached);
      }
    }

    try {
      const cryptoRes = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,solana&vs_currencies=usd');
      cryptoData = await cryptoRes.json();
      if (cryptoData && typeof window !== "undefined") {
        localStorage.setItem('cached_crypto_rates', JSON.stringify(cryptoData));
      }
    } catch (e) {
      console.warn("Offline or fetch failed for crypto rates. Using cache if available.");
      if (typeof window !== "undefined") {
        const cached = localStorage.getItem('cached_crypto_rates');
        if (cached) cryptoData = JSON.parse(cached);
      }
    }

    if (currencyData && currencyData.rates) {
      const currencyCat = categories.find(c => c.id === 'currency');
      if (currencyCat) {
        currencyCat.units.forEach(u => {
          const rateCode = u.id.toUpperCase();
          if (currencyData.rates[rateCode]) {
            u.factor = 1 / currencyData.rates[rateCode];
          }
        });
        
        if (cryptoData) {
          const updateCrypto = (id: string, coinGeckoId: string) => {
            const u = currencyCat.units.find(x => x.id === id);
            if (u && cryptoData[coinGeckoId] && cryptoData[coinGeckoId].usd) {
              u.factor = cryptoData[coinGeckoId].usd;
            }
          };
          updateCrypto('btc', 'bitcoin');
          updateCrypto('eth', 'ethereum');
          updateCrypto('sol', 'solana');
        }
      }
      return true;
    }
  } catch (e) {
    console.error('Failed to update currency rates', e);
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
  
  const cat = categories.find(c => c.id === categoryId);

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
  
  if (categoryId === 'fuel') {
    // Convert TO km_per_liter first (our base unit)
    let kpl = value;
    if (fromId === 'liters_per_100km') {
      kpl = value === 0 ? 0 : 100 / value;
    } else {
      const fromUnit = cat?.units.find(u => u.id === fromId);
      if (fromUnit) kpl = value * fromUnit.factor;
    }

    // Convert FROM km_per_liter to target
    if (toId === 'liters_per_100km') {
      return kpl === 0 ? 0 : 100 / kpl;
    } else {
      const toUnit = cat?.units.find(u => u.id === toId);
      if (toUnit) return kpl / toUnit.factor;
    }
  }

  // Linear conversions
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
  const qWords = q.split(/\s+/).map(w => w.replace(/s$/, '')); // simple de-pluralize
  
  const results: any[] = [];
  
  // 1. Check for specific Time Zone keywords
  if (
    'time zone'.includes(q) || 
    'timezone'.includes(q) || 
    'converter'.includes(q) ||
    (q.includes('time') && q.includes('zone'))
  ) {
    results.push({
      categoryId: 'time_zone',
      fromId: 'time_zone',
      toId: 'time_zone',
      text: `Time Zone Converter`
    });
  }

  // 2. Exact category match
  const catMatch = categories.find(c => 
    c.name.toLowerCase() === q || 
    c.name.toLowerCase().replace(/\s+/g, '') === q
  );

  if (catMatch && catMatch.id !== 'time_zone') {
    results.push({
      categoryId: catMatch.id,
      fromId: catMatch.units[0]?.id || "",
      toId: catMatch.units[1]?.id || catMatch.units[0]?.id || "",
      text: `${catMatch.name} Converter`
    });
  }
  
  // 3. Match pairs
  categories.forEach(cat => {
    if (cat.id === 'time_zone') return;

    cat.units.forEach(u1 => {
      cat.units.forEach(u2 => {
        if (u1.id === u2.id) return;
        
        const name1 = u1.name.toLowerCase();
        const name2 = u2.name.toLowerCase();
        const sym1 = u1.symbol.toLowerCase();
        const sym2 = u2.symbol.toLowerCase();

        const phrase1 = `${name1} to ${name2}`;
        const phrase2 = `${sym1} to ${sym2}`;
        
        const matchSymbols = qWords.length > 1 && qWords.includes(sym1.replace(/s$/, '')) && qWords.includes(sym2.replace(/s$/, ''));
        const matchNames = qWords.length > 1 && qWords.includes(name1.replace(/s$/, '')) && qWords.includes(name2.replace(/s$/, ''));

        if (
          phrase1 === q ||
          phrase2 === q ||
          phrase1.includes(q) || 
          phrase2.includes(q) || 
          (qWords.length > 1 && q.includes(name1) && q.includes(name2)) ||
          matchSymbols ||
          matchNames ||
          (q.length > 1 && (name1.startsWith(q) || sym1 === q))
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
  
  // 4. Fallback: single unit matches
  categories.forEach(cat => {
    if (results.length >= 10) return;
    cat.units.forEach(u => {
      if (results.length >= 10) return;
      const name = u.name.toLowerCase();
      const sym = u.symbol.toLowerCase();
      
      const isMatch = name.includes(q) || 
                      sym === q || 
                      (q.length > 1 && name.startsWith(q)) ||
                      (q.length > 2 && q.startsWith(name)) ||
                      qWords.some(w => name.includes(w) || sym === w || name.startsWith(w));

      if (isMatch) {
         const other = cat.units.find(ou => ou.id !== u.id) || u;
         const matchName = u.name.toLowerCase();
         if (!results.find(r => r.fromId === u.id || (r.text && r.text.toLowerCase().includes(matchName)))) {
            results.push({
              categoryId: cat.id,
              fromId: u.id,
              toId: other.id,
              text: `${u.name} Converter`
            });
         }
      }
    });
  });
  
  return results.slice(0, 8); // Return top 8 suggestions
}

// Ensure categorzeQuery doesn't cause errors if not imported, replacing it with getSuggestions in App.tsx

export const categoryBridges: Record<string, { categoryId: string, fromId: string, toId: string }[]> = {
  'length': [{ categoryId: 'area', fromId: 'square_meter', toId: 'square_foot' }],
  'weight': [{ categoryId: 'cooking', fromId: 'gram', toId: 'cup_flour_ap' }],
  'volume': [{ categoryId: 'cooking', fromId: 'milliliter', toId: 'us_cup' }],
  'area': [{ categoryId: 'length', fromId: 'meter', toId: 'foot' }],
  'speed': [{ categoryId: 'time', fromId: 'hour', toId: 'minute' }],
  'data': [{ categoryId: 'data_rate', fromId: 'mbps', toId: 'kbps' }],
  'cooking': [{ categoryId: 'weight', fromId: 'gram', toId: 'pound' }],
  'currency': [{ categoryId: 'data', fromId: 'megabyte', toId: 'gigabyte' }], // High overlap in tech/fin
  'energy': [{ categoryId: 'power', fromId: 'watt', toId: 'kilowatt' }],
  'power': [{ categoryId: 'energy', fromId: 'joule', toId: 'watt_hour' }]
};

export const generateLattice = (
  fromId: string, 
  toId: string, 
  categoryId: string
): { fromId: string, toId: string, categoryId: string, text: string }[] => {
  const lattice: { fromId: string, toId: string, categoryId: string, text: string }[] = [];
  const cat = categories.find(c => c.id === categoryId);
  if (!cat) return [];

  const fromUnit = cat.units.find(u => u.id === fromId);
  const toUnit = cat.units.find(u => u.id === toId);
  if (!fromUnit || !toUnit) return [];

  // 1. Find the Inverse Pair
  lattice.push({
    fromId: toId,
    toId: fromId,
    categoryId: categoryId,
    text: `${toUnit.name} to ${fromUnit.name}`
  });

  // 2. Find siblings in the same category (sort by popularity, exclude current pair)
  const siblings = cat.units
    .filter(u => u.id !== fromId && u.id !== toId)
    .sort((a, b) => (b.popularity || 0) - (a.popularity || 0))
    .slice(0, 4);

  siblings.forEach(s => {
    // Alternate linking from -> sibling and sibling -> to
    lattice.push({
      fromId: fromId,
      toId: s.id,
      categoryId: categoryId,
      text: `${fromUnit.name} to ${s.name}`
    });
  });

  // 3. Find one "Bridge" to a related category
  const bridges = categoryBridges[categoryId];
  if (bridges && bridges.length > 0) {
    const bridge = bridges[0];
    const bridgeCat = categories.find(c => c.id === bridge.categoryId);
    const bf = bridgeCat?.units.find(u => u.id === bridge.fromId);
    const bt = bridgeCat?.units.find(u => u.id === bridge.toId);
    if (bf && bt) {
      lattice.push({
        fromId: bridge.fromId,
        toId: bridge.toId,
        categoryId: bridge.categoryId,
        text: `${bf.name} to ${bt.name} (${bridgeCat?.name || ''})`
      });
    }
  }

  // Ensure we have unique pairs and limit to 6-8
  return lattice.slice(0, 7);
};

export function formatNumber(num: number): string {
  if (Number.isNaN(num)) return "0";
  if (num === 0) return "0";
  
  const absNum = Math.abs(num);
  if (absNum < 1e-6 || absNum >= 1e12) {
    return num.toExponential(6).replace(/\.?0+e/, 'e');
  }

  const str = Number.isInteger(num) ? num.toString() : parseFloat(num.toFixed(8)).toString();
  const parts = str.split(".");
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return parts.join(".");
}

export const getSEOUrlPath = (fromId: string, toId: string) => {
  if (fromId === 'inch' && toId === 'pixel') return 'inches-to-pixels';
  if (fromId === 'pixel' && toId === 'inch') return 'pixels-to-inches';
  if (fromId === 'meter' && toId === 'foot') return 'meters-to-feet';
  if (fromId === 'foot' && toId === 'meter') return 'feet-to-meters';
  if (fromId === 'kilometer' && toId === 'mile') return 'km-to-miles';
  if (fromId === 'mile' && toId === 'kilometer') return 'miles-to-km';
  if (fromId === 'inch' && toId === 'centimeter') return 'inches-to-cm';
  if (fromId === 'centimeter' && toId === 'inch') return 'cm-to-inches';
  if (fromId === 'millimeter' && toId === 'inch') return 'mm-to-inches';

  if (fromId === 'kilogram' && toId === 'pound') return 'kg-to-lbs';
  if (fromId === 'pound' && toId === 'kilogram') return 'lbs-to-kg';
  if (fromId === 'gram' && toId === 'ounce') return 'grams-to-ounces';
  if (fromId === 'ounce' && toId === 'gram') return 'ounces-to-grams';
  if (fromId === 'metric_ton' && toId === 'pound') return 'tons-to-pounds';
  
  if (fromId === 'celsius' && toId === 'fahrenheit') return 'celsius-to-fahrenheit';
  if (fromId === 'fahrenheit' && toId === 'celsius') return 'fahrenheit-to-celsius';
  if (fromId === 'celsius' && toId === 'kelvin') return 'celsius-to-kelvin';
  if (fromId === 'kelvin' && toId === 'celsius') return 'kelvin-to-celsius';
  
  if (fromId === 'liter' && toId === 'us_gallon') return 'liters-to-gallons';
  if (fromId === 'us_gallon' && toId === 'liter') return 'gallons-to-liters';
  if (fromId === 'us_cup' && toId === 'milliliter') return 'cups-to-ml';
  if (fromId === 'milliliter' && toId === 'us_cup') return 'ml-to-cups';
  if (fromId === 'us_fluid_ounce' && toId === 'milliliter') return 'fl-oz-to-ml';
  
  if (fromId === 'mile_per_hour' && toId === 'kilometer_per_hour') return 'mph-to-kph';
  if (fromId === 'kilometer_per_hour' && toId === 'mile_per_hour') return 'kph-to-mph';
  if (fromId === 'knot' && toId === 'mile_per_hour') return 'knots-to-mph';
  if (fromId === 'meter_per_second' && toId === 'kilometer_per_hour') return 'meters-per-second-to-kph';

  if (fromId === 'acre' && toId === 'square_meter') return 'acres-to-square-meters';
  if (fromId === 'square_meter' && toId === 'acre') return 'square-meters-to-acres';
  if (fromId === 'square_foot' && toId === 'square_meter') return 'square-feet-to-square-meters';
  if (fromId === 'hectare' && toId === 'acre') return 'hectares-to-acres';
  if (fromId === 'acre' && toId === 'hectare') return 'acres-to-hectares';

  if (fromId === 'hour' && toId === 'minute') return 'hours-to-minutes';
  if (fromId === 'minute' && toId === 'second') return 'minutes-to-seconds';
  if (fromId === 'day' && toId === 'hour') return 'days-to-hours';
  if (fromId === 'week' && toId === 'day') return 'weeks-to-days';

  if (fromId === 'megabyte' && toId === 'gigabyte') return 'mb-to-gb';
  if (fromId === 'gigabyte' && toId === 'terabyte') return 'gb-to-tb';
  if (fromId === 'bit' && toId === 'byte') return 'bits-to-bytes';

  if (fromId === 'miles_per_gallon' && toId === 'km_per_liter') return 'mpg-to-kml';
  if (fromId === 'km_per_liter' && toId === 'miles_per_gallon') return 'kml-to-mpg';

  if (fromId === 'joule' && toId === 'gram_calorie') return 'joules-to-calories';
  if (fromId === 'gram_calorie' && toId === 'joule') return 'calories-to-joules';
  if (fromId === 'kilowatt_hour' && toId === 'joule') return 'kwh-to-joules';

  if (fromId === 'bar' && toId === 'psi') return 'bar-to-psi';
  if (fromId === 'psi' && toId === 'bar') return 'psi-to-bar';
  if (fromId === 'atmosphere' && toId === 'psi') return 'atmospheres-to-psi';

  if (fromId === 'degree' && toId === 'radian') return 'degrees-to-radians';
  if (fromId === 'radian' && toId === 'degree') return 'radians-to-degrees';

  if (fromId === 'usd' && toId === 'eur') return 'usd-to-eur';
  if (fromId === 'eur' && toId === 'usd') return 'eur-to-usd';
  if (fromId === 'usd' && toId === 'gbp') return 'usd-to-gbp';
  if (fromId === 'gbp' && toId === 'usd') return 'gbp-to-usd';
  if (fromId === 'usd' && toId === 'inr') return 'usd-to-inr';

  if (fromId === 'est' && toId === 'utc') return 'est-to-utc';
  if (fromId === 'pst' && toId === 'est') return 'pst-to-est';
  
  return `${fromId}-to-${toId}`;
};

export const getUnitIdsFromPath = (path: string) => {
  if (path === 'time-zone-converter') return ['time_zone', 'time_zone'];
  if (path === 'est-to-utc' || path === 'pst-to-est') return ['time_zone', 'time_zone'];
  
  if (path === 'inches-to-pixels') return ['inch', 'pixel'];
  if (path === 'pixels-to-inches') return ['pixel', 'inch'];
  if (path === 'meters-to-feet') return ['meter', 'foot'];
  if (path === 'feet-to-meters') return ['foot', 'meter'];
  if (path === 'km-to-miles') return ['kilometer', 'mile'];
  if (path === 'miles-to-km') return ['mile', 'kilometer'];
  if (path === 'inches-to-cm') return ['inch', 'centimeter'];
  if (path === 'cm-to-inches') return ['centimeter', 'inch'];
  if (path === 'mm-to-inches') return ['millimeter', 'inch'];

  if (path === 'teaspoons-to-fluid-ounces') return ['teaspoon_us', 'us_fluid_ounce'];
  if (path === 'fluid-ounces-to-teaspoons') return ['us_fluid_ounce', 'teaspoon_us'];
  if (path === 'teaspoon-to-fluid-ounce') return ['teaspoon_us', 'us_fluid_ounce'];
  if (path === 'fluid-ounce-to-teaspoon') return ['us_fluid_ounce', 'teaspoon_us'];
  
  if (path === 'kg-to-lbs') return ['kilogram', 'pound'];
  if (path === 'lbs-to-kg') return ['pound', 'kilogram'];
  if (path === 'grams-to-ounces') return ['gram', 'ounce'];
  if (path === 'ounces-to-grams') return ['ounce', 'gram'];
  if (path === 'gram-to-ounce') return ['gram', 'ounce'];
  if (path === 'ounce-to-gram') return ['ounce', 'gram'];
  if (path === 'tons-to-pounds') return ['metric_ton', 'pound'];

  if (path === 'celsius-to-fahrenheit') return ['celsius', 'fahrenheit'];
  if (path === 'fahrenheit-to-celsius') return ['fahrenheit', 'celsius'];
  if (path === 'celsius-to-kelvin') return ['celsius', 'kelvin'];
  if (path === 'kelvin-to-celsius') return ['kelvin', 'celsius'];

  if (path === 'liters-to-gallons') return ['liter', 'us_gallon'];
  if (path === 'gallons-to-liters') return ['us_gallon', 'liter'];
  if (path === 'cups-to-ml') return ['us_cup', 'milliliter'];
  if (path === 'ml-to-cups') return ['milliliter', 'us_cup'];
  if (path === 'fl-oz-to-ml') return ['us_fluid_ounce', 'milliliter'];

  if (path === 'mph-to-kph') return ['mile_per_hour', 'kilometer_per_hour'];
  if (path === 'kph-to-mph') return ['kilometer_per_hour', 'mile_per_hour'];
  if (path === 'knots-to-mph') return ['knot', 'mile_per_hour'];
  if (path === 'meters-per-second-to-kph') return ['meter_per_second', 'kilometer_per_hour'];

  if (path === 'acres-to-square-meters') return ['acre', 'square_meter'];
  if (path === 'square-meters-to-acres') return ['square_meter', 'acre'];
  if (path === 'square-feet-to-square-meters') return ['square_foot', 'square_meter'];
  if (path === 'hectares-to-acres') return ['hectare', 'acre'];
  if (path === 'acres-to-hectares') return ['acre', 'hectare'];

  if (path === 'hours-to-minutes') return ['hour', 'minute'];
  if (path === 'minutes-to-seconds') return ['minute', 'second'];
  if (path === 'days-to-hours') return ['day', 'hour'];
  if (path === 'weeks-to-days') return ['week', 'day'];

  if (path === 'mb-to-gb') return ['megabyte', 'gigabyte'];
  if (path === 'gb-to-tb') return ['gigabyte', 'terabyte'];
  if (path === 'bits-to-bytes') return ['bit', 'byte'];

  if (path === 'mpg-to-kml') return ['miles_per_gallon', 'km_per_liter'];
  if (path === 'kml-to-mpg') return ['km_per_liter', 'miles_per_gallon'];

  if (path === 'joules-to-calories') return ['joule', 'gram_calorie'];
  if (path === 'calories-to-joules') return ['gram_calorie', 'joule'];
  if (path === 'kwh-to-joules') return ['kilowatt_hour', 'joule'];

  if (path === 'bar-to-psi') return ['bar', 'psi'];
  if (path === 'psi-to-bar') return ['psi', 'bar'];
  if (path === 'atmospheres-to-psi') return ['atmosphere', 'psi'];

  if (path === 'degrees-to-radians') return ['degree', 'radian'];
  if (path === 'radians-to-degrees') return ['radian', 'degree'];

  if (path === 'usd-to-eur') return ['usd', 'eur'];
  if (path === 'eur-to-usd') return ['eur', 'usd'];
  if (path === 'usd-to-gbp') return ['usd', 'gbp'];
  if (path === 'gbp-to-usd') return ['gbp', 'usd'];
  if (path === 'usd-to-inr') return ['usd', 'inr'];

  return path.split('-to-');
};

export const getCanonicalUnitId = (alias: string): string => {
  const map: Record<string, string> = {
    'lbs': 'pound', 'lb': 'pound', 'pounds': 'pound', 'pound': 'pound',
    'libras': 'pound', 'libra': 'pound', 'livres': 'pound', 'livre': 'pound', 'pfund': 'pound',
    'kg': 'kilogram', 'kgs': 'kilogram', 'kilograms': 'kilogram', 'kilogram': 'kilogram',
    'kilogramos': 'kilogram', 'kilogrammes': 'kilogram', 'kilogramm': 'kilogram',
    'g': 'gram', 'gs': 'gram', 'grams': 'gram', 'gram': 'gram', 'gramos': 'gram', 'gramm': 'gram',
    'oz': 'ounce', 'ozs': 'ounce', 'ounces': 'ounce', 'ounce': 'ounce', 'onzas': 'ounce', 'unzen': 'ounce',
    'm': 'meter', 'meters': 'meter', 'meter': 'meter', 'metros': 'meter', 'metres': 'meter',
    'ft': 'foot', 'feet': 'foot', 'foot': 'foot', 'pies': 'foot', 'pie': 'foot', 'pieds': 'foot', 'pied': 'foot', 'fuss': 'foot',
    'inch': 'inch', 'inches': 'inch', 'in': 'inch', 'pulgadas': 'inch', 'pulgada': 'inch', 'pouces': 'inch', 'pouce': 'inch', 'zoll': 'inch',
    'cm': 'centimeter', 'cms': 'centimeter', 'centimeters': 'centimeter', 'centimeter': 'centimeter',
    'centimetros': 'centimeter', 'centimetres': 'centimeter', 'zentimeter': 'centimeter',
    'mm': 'millimeter', 'mms': 'millimeter', 'millimeters': 'millimeter', 'millimeter': 'millimeter',
    'milimetros': 'millimeter', 'millimetres': 'millimeter',
    'km': 'kilometer', 'kms': 'kilometer', 'kilometers': 'kilometer', 'kilometer': 'kilometer',
    'kilometros': 'kilometer', 'kilometres': 'kilometer',
    'mile': 'mile', 'miles': 'mile', 'mi': 'mile', 'millas': 'mile', 'milla': 'mile', 'milles': 'mile', 'meilen': 'mile',
    'yard': 'yard', 'yards': 'yard', 'yd': 'yard', 'yardas': 'yard',
    'ton': 'metric_ton', 'tons': 'metric_ton', 'metric_ton': 'metric_ton', 'toneladas': 'metric_ton',
    'celsius': 'celsius', 'c': 'celsius',
    'fahrenheit': 'fahrenheit', 'f': 'fahrenheit',
    'kelvin': 'kelvin', 'k': 'kelvin',
    'liter': 'liter', 'liters': 'liter', 'l': 'liter', 'litros': 'liter', 'litres': 'liter',
    'us_gallon': 'us_gallon', 'gallon': 'us_gallon', 'gallons': 'us_gallon', 'gal': 'us_gallon', 'galones': 'us_gallon',
    'us_cup': 'us_cup', 'cup': 'us_cup', 'cups': 'us_cup', 'tazas': 'us_cup', 'taza': 'us_cup',
    'milliliter': 'milliliter', 'milliliters': 'milliliter', 'ml': 'milliliter',
    'us_fluid_ounce': 'us_fluid_ounce', 'fluid_ounce': 'us_fluid_ounce', 'fluid_ounces': 'us_fluid_ounce', 'fl_oz': 'us_fluid_ounce',
    'teaspoon_us': 'teaspoon_us', 'teaspoon': 'teaspoon_us', 'teaspoons': 'teaspoon_us', 'tsp': 'teaspoon_us',
    'tablespoon_us': 'tablespoon_us', 'tablespoon': 'tablespoon_us', 'tablespoons': 'tablespoon_us', 'tbsp': 'tablespoon_us',
    'mile_per_hour': 'mile_per_hour', 'mph': 'mile_per_hour',
    'kilometer_per_hour': 'kilometer_per_hour', 'kph': 'kilometer_per_hour',
    'meter_per_second': 'meter_per_second', 'mps': 'meter_per_second',
    'knot': 'knot', 'knots': 'knot',
    'acre': 'acre', 'acres': 'acre',
    'square_meter': 'square_meter', 'square_meters': 'square_meter', 'sq_m': 'square_meter', 'metros_cuadrados': 'square_meter',
    'square_foot': 'square_foot', 'square_feet': 'square_foot', 'sq_ft': 'square_foot', 'pies_cuadrados': 'square_foot',
    'hectare': 'hectare', 'hectares': 'hectare', 'ha': 'hectare',
    'hour': 'hour', 'hours': 'hour', 'hr': 'hour', 'hrs': 'hour', 'horas': 'hour', 'heures': 'hour', 'stunden': 'hour',
    'minute': 'minute', 'minutes': 'minute', 'min': 'minute', 'mins': 'minute', 'minutos': 'minute', 'minuten': 'minute',
    'second': 'second', 'seconds': 'second', 'sec': 'second', 'secs': 'second', 'segundos': 'second', 'sekunden': 'second',
    'day': 'day', 'days': 'day', 'dias': 'day', 'jours': 'day', 'tage': 'day',
    'week': 'week', 'weeks': 'week', 'semanas': 'week', 'semaines': 'week', 'wochen': 'week',
    'megabyte': 'megabyte', 'megabytes': 'megabyte', 'mb': 'megabyte',
    'gigabyte': 'gigabyte', 'gigabytes': 'gigabyte', 'gb': 'gigabyte',
    'terabyte': 'terabyte', 'terabytes': 'terabyte', 'tb': 'terabyte',
    'bit': 'bit', 'bits': 'bit',
    'byte': 'byte', 'bytes': 'byte',
    'pixel': 'pixel', 'pixels': 'pixel', 'px': 'pixel',
    'miles_per_gallon': 'miles_per_gallon', 'mpg': 'miles_per_gallon',
    'km_per_liter': 'km_per_liter', 'kml': 'km_per_liter',
    'joule': 'joule', 'joules': 'joule', 'j': 'joule',
    'gram_calorie': 'gram_calorie', 'calorie': 'gram_calorie', 'calories': 'gram_calorie', 'cal': 'gram_calorie',
    'kilowatt_hour': 'kilowatt_hour', 'kwh': 'kilowatt_hour',
    'bar': 'bar', 'psi': 'psi',
    'atmosphere': 'atmosphere', 'atm': 'atmosphere', 'atmospheres': 'atmosphere',
    'degree': 'degree', 'degrees': 'degree', 'deg': 'degree',
    'radian': 'radian', 'radians': 'radian', 'rad': 'radian',
    'usd': 'usd', 'eur': 'eur', 'gbp': 'gbp', 'inr': 'inr', 'aud': 'aud', 'cad': 'cad', 'chf': 'chf', 'cny': 'cny', 'mxn': 'mxn', 'brl': 'brl', 'zar': 'zar', 'rub': 'rub', 'sgd': 'sgd', 'hkd': 'hkd', 'nzd': 'nzd', 'sek': 'sek', 'krw': 'krw', 'aed': 'aed',
    'est': 'est', 'pst': 'pst', 'utc': 'utc',
    'point': 'point', 'em': 'em', 'rem': 'rem', 'pixel': 'pixel',
    'degree': 'degree', 'arcsecond': 'arcsecond'
  };
  
  const normalized = alias.toLowerCase().replace(/-/g, '_');
  return map[normalized] || normalized;
};

export const getParsedParamsFromPath = (path: string): { val: string | null, from: string | null, to: string | null } => {
  const matchWithVal = path.match(/^convert-([\d.]+)-(.+)-(?:to|a|en|zu)-(.+)$/i);
  if (matchWithVal) {
    const rawFrom = getCanonicalUnitId(matchWithVal[2]);
    const rawTo = getCanonicalUnitId(matchWithVal[3]);
    const parts = getUnitIdsFromPath(`${rawFrom}-to-${rawTo}`);
    if (parts.length === 2 && parts[0] === parts[0].toLowerCase()) {
      return { val: matchWithVal[1], from: parts[0], to: parts[1] };
    }
    return { val: matchWithVal[1], from: rawFrom, to: rawTo };
  }
  
  const matchWithoutVal = path.match(/^(.+)-(?:to|a|en|zu)-(.+)$/i);
  if (matchWithoutVal && !path.includes('blog')) {
    const rawFrom = getCanonicalUnitId(matchWithoutVal[1]);
    const rawTo = getCanonicalUnitId(matchWithoutVal[2]);
    const parts = getUnitIdsFromPath(`${rawFrom}-to-${rawTo}`);
    if (parts.length === 2 && parts[0] === parts[0].toLowerCase()) {
      return { val: null, from: parts[0], to: parts[1] };
    }
    return { val: null, from: rawFrom, to: rawTo };
  }

  return { val: null, from: null, to: null };
};
