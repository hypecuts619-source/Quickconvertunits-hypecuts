import React from 'react';

interface Props {
  valFrom: string;
  valTo: string;
  unitFrom: any;
  unitTo: any;
  category: string;
}

export function DynamicContext({ valFrom, valTo, unitFrom, unitTo, category }: Props) {
  const numValue = parseFloat(valFrom);
  
  if (isNaN(numValue) || numValue <= 0) return null;

  let didYouKnow = "";
  
  if (category === "weight") {
    if (unitFrom.id === "kg" || unitFrom.id === "kilogram") {
      if (numValue >= 1 && numValue <= 3) didYouKnow = `For context, ${numValue} ${unitFrom.name.toLowerCase()} is roughly the weight of a standard laptop or a large textbook.`;
      else if (numValue > 3 && numValue <= 6) didYouKnow = `For context, ${numValue} ${unitFrom.name.toLowerCase()} is about the weight of a domestic cat.`;
      else if (numValue > 6 && numValue <= 12) didYouKnow = `For context, ${numValue} ${unitFrom.name.toLowerCase()} is around the weight of a medium-sized dog or a car tire.`;
      else if (numValue > 12 && numValue <= 25) didYouKnow = `For context, ${numValue} ${unitFrom.name.toLowerCase()} is comparable to a large bag of dog food or a microwave oven.`;
      else if (numValue > 25 && numValue <= 80) didYouKnow = `For context, ${numValue} ${unitFrom.name.toLowerCase()} is approximately the weight of a human adult.`;
    } else if (unitFrom.id === "lb" || unitFrom.id === "pound") {
      if (numValue >= 2 && numValue <= 6) didYouKnow = `For context, ${numValue} ${unitFrom.name.toLowerCase()} is roughly the weight of a standard laptop or a large textbook.`;
      else if (numValue > 6 && numValue <= 13) didYouKnow = `For context, ${numValue} ${unitFrom.name.toLowerCase()} is about the weight of a domestic cat.`;
      else if (numValue > 13 && numValue <= 26) didYouKnow = `For context, ${numValue} ${unitFrom.name.toLowerCase()} is around the weight of a medium-sized dog or a car tire.`;
      else if (numValue > 26 && numValue <= 60) didYouKnow = `For context, ${numValue} ${unitFrom.name.toLowerCase()} is comparable to a large bag of dog food or a microwave oven.`;
      else if (numValue > 60 && numValue <= 200) didYouKnow = `For context, ${numValue} ${unitFrom.name.toLowerCase()} is approximately the weight of a human adult.`;
    }
  } else if (category === "length" || category === "distance") {
    if (unitFrom.id === "km" || unitFrom.id === "kilometer") {
      if (numValue === 5) didYouKnow = `For context, a 5k run is a standard distance for charity events and takes an average runner about 30-40 minutes to complete.`;
      else if (numValue === 10) didYouKnow = `For context, 10 kilometers is a popular long-distance running event, equivalent to 6.2 miles.`;
      else if (numValue === 42 || numValue === 42.195) didYouKnow = `For context, ${numValue} kilometers is the official distance of a full marathon.`;
    } else if (unitFrom.id === "mile" || unitFrom.id === "mi") {
       if (numValue === 3.1) didYouKnow = `For context, 3.1 miles is roughly equivalent to a 5-kilometer run.`;
       else if (numValue === 13.1) didYouKnow = `For context, 13.1 miles is the official distance of a half marathon.`;
       else if (numValue === 26.2) didYouKnow = `For context, 26.2 miles is the official distance of a full marathon.`;
    } else if (unitFrom.id === "meter" || unitFrom.id === "m") {
      if (numValue >= 1 && numValue <= 2) didYouKnow = `For context, ${numValue} ${unitFrom.name.toLowerCase()} is about the height of an average adult human or a standard door width.`;
      else if (numValue > 2 && numValue <= 5) didYouKnow = `For context, ${numValue} ${unitFrom.name.toLowerCase()} is roughly the length of a typical passenger car.`;
    }
  } else if (category === "temperature") {
     if (unitFrom.id === "celsius" || unitFrom.id === "c") {
       if (numValue === 0) didYouKnow = `0 degrees Celsius is the freezing point of water at sea level.`;
       else if (numValue === 100) didYouKnow = `100 degrees Celsius is the boiling point of water.`;
       else if (numValue >= 36 && numValue <= 38) didYouKnow = `This is approximately the normal body temperature for a human.`;
       else if (numValue >= 20 && numValue <= 25) didYouKnow = `This is generally considered a comfortable room temperature.`;
     } else if (unitFrom.id === "fahrenheit" || unitFrom.id === "f") {
       if (numValue === 32) didYouKnow = `32 degrees Fahrenheit is the freezing point of water.`;
       else if (numValue === 212) didYouKnow = `212 degrees Fahrenheit is the boiling point of water at standard atmospheric pressure.`;
       else if (numValue >= 97 && numValue <= 99) didYouKnow = `This is approximately the normal human body temperature.`;
       else if (numValue >= 68 && numValue <= 77) didYouKnow = `This is generally considered a comfortable room temperature setting.`;
     }
  }

  const isBigger = parseFloat(valFrom) > parseFloat(valTo) ? "Yes" : "No";

  return (
    <div className="mb-12 p-8 rounded-3xl bg-neutral-50 dark:bg-neutral-800/30 border border-neutral-100 dark:border-neutral-800 shadow-sm transition-colors">
      <h3 className="text-xl font-semibold mb-4 tracking-tight text-neutral-900 dark:text-neutral-100">Did You Know?</h3>
      {didYouKnow ? (
        <p className="font-light text-neutral-700 dark:text-neutral-300 leading-relaxed max-w-3xl mb-6">
          {didYouKnow} By converting {valFrom} {unitFrom.name.toLowerCase()} to {unitTo.name.toLowerCase()}, we find it equals exactly {valTo} {unitTo.name.toLowerCase()}.
        </p>
      ) : (
        <p className="font-light text-neutral-700 dark:text-neutral-300 leading-relaxed max-w-3xl mb-6">
          Converting {valFrom} {unitFrom.name.toLowerCase()} to {unitTo.name.toLowerCase()} is a common mathematical operation. Exactly {valFrom} {unitFrom.name.toLowerCase()} equals {valTo} {unitTo.name.toLowerCase()}. This quick reference allows you to understand the scale of {valFrom} {unitFrom.name.toLowerCase()} in {unitTo.name.toLowerCase()}.
        </p>
      )}

      <div className="mt-8">
        <h4 className="text-lg font-medium mb-4 text-neutral-900 dark:text-neutral-100">Frequently Asked Questions</h4>
        <dl className="space-y-4 font-light text-neutral-600 dark:text-neutral-400">
          <div>
            <dt className="font-medium text-neutral-800 dark:text-neutral-200 mb-1">Is {valFrom} {unitFrom.name.toLowerCase()} greater than {parseFloat(valFrom)} {unitTo.name.toLowerCase()}?</dt>
            <dd>{isBigger}, {valFrom} {unitFrom.name.toLowerCase()} ({valTo} {unitTo.name.toLowerCase()}) is {parseFloat(valFrom) > parseFloat(valTo) ? "greater" : "less"} than {parseFloat(valFrom)} {unitTo.name.toLowerCase()}.</dd>
          </div>
          <div>
            <dt className="font-medium text-neutral-800 dark:text-neutral-200 mb-1">How do you calculate {valFrom} {unitFrom.name} into {unitTo.name}?</dt>
            <dd>You multiply the value in {unitFrom.name.toLowerCase()} by the conversion factor. Alternatively, you can use our instant {unitFrom.name.toLowerCase()} to {unitTo.name.toLowerCase()} calculator.</dd>
          </div>
        </dl>
      </div>
    </div>
  );
}
