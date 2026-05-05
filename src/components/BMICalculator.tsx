import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";

export function BMICalculator() {
  const { t } = useTranslation();
  
  const [system, setSystem] = useState<"metric" | "imperial">("metric");
  
  const [cm, setCm] = useState("175");
  const [kg, setKg] = useState("70");
  
  const [ft, setFt] = useState("5");
  const [inVal, setInVal] = useState("9");
  const [lbs, setLbs] = useState("154");
  
  const [bmi, setBmi] = useState<number | null>(null);

  useEffect(() => {
    let calculatedBmi = 0;
    
    if (system === "metric") {
      const heightInMeters = parseFloat(cm) / 100;
      const weightInKg = parseFloat(kg);
      if (heightInMeters > 0 && weightInKg > 0) {
        calculatedBmi = weightInKg / (heightInMeters * heightInMeters);
      }
    } else {
      const heightInInches = (parseFloat(ft) * 12) + (parseFloat(inVal) || 0);
      const weightInLbs = parseFloat(lbs);
      if (heightInInches > 0 && weightInLbs > 0) {
        calculatedBmi = (weightInLbs / (heightInInches * heightInInches)) * 703;
      }
    }
    
    if (calculatedBmi > 0 && calculatedBmi < 100) {
      setBmi(calculatedBmi);
    } else {
      setBmi(null);
    }
  }, [system, cm, kg, ft, inVal, lbs]);

  const getBmiCategory = (bmi: number) => {
    if (bmi < 18.5) return { label: "Underweight", color: "text-blue-500", barColor: "bg-blue-500", range: [0, 18.5] };
    if (bmi < 25) return { label: "Normal weight", color: "text-green-500", barColor: "bg-green-500", range: [18.5, 25] };
    if (bmi < 30) return { label: "Overweight", color: "text-yellow-500", barColor: "bg-yellow-500", range: [25, 30] };
    return { label: "Obesity", color: "text-red-500", barColor: "bg-red-500", range: [30, 100] };
  };

  const category = bmi ? getBmiCategory(bmi) : null;

  return (
    <motion.div
      layout
      className="bg-white dark:bg-[#111111] p-6 md:p-10 rounded-[2.5rem] shadow-[0_8px_40px_rgba(0,0,0,0.04)] dark:shadow-none border border-neutral-100 dark:border-neutral-800 relative z-10 mx-auto max-w-4xl w-full mb-10"
    >
      <div className="flex flex-col md:flex-row gap-8 items-start">
        {/* Input Form */}
        <div className="w-full md:w-1/2 flex flex-col gap-6">
          <div className="flex bg-neutral-100 dark:bg-neutral-800 p-1 rounded-full w-full">
            <button
              className={`flex-1 py-2 text-sm font-medium rounded-full transition-colors ${system === "metric" ? "bg-white dark:bg-neutral-900 shadow-sm text-neutral-900 dark:text-neutral-100" : "text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100"}`}
              onClick={() => setSystem("metric")}
            >
              Metric
            </button>
            <button
              className={`flex-1 py-2 text-sm font-medium rounded-full transition-colors ${system === "imperial" ? "bg-white dark:bg-neutral-900 shadow-sm text-neutral-900 dark:text-neutral-100" : "text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100"}`}
              onClick={() => setSystem("imperial")}
            >
              Imperial
            </button>
          </div>

          {system === "metric" ? (
            <>
              <div>
                <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2 block">Height (cm)</label>
                <input
                  type="number"
                  value={cm}
                  onChange={(e) => setCm(e.target.value)}
                  className="w-full bg-neutral-50 dark:bg-[#161616] border border-neutral-200 dark:border-neutral-800 rounded-2xl px-4 py-3 text-lg focus:ring-2 focus:ring-primary-500/50 outline-none transition-all dark:text-white"
                  placeholder="e.g. 175"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2 block">Weight (kg)</label>
                <input
                  type="number"
                  value={kg}
                  onChange={(e) => setKg(e.target.value)}
                  className="w-full bg-neutral-50 dark:bg-[#161616] border border-neutral-200 dark:border-neutral-800 rounded-2xl px-4 py-3 text-lg focus:ring-2 focus:ring-primary-500/50 outline-none transition-all dark:text-white"
                  placeholder="e.g. 70"
                />
              </div>
            </>
          ) : (
            <>
              <div>
                <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2 block">Height</label>
                <div className="flex gap-4">
                  <div className="flex-1 relative">
                    <input
                      type="number"
                      value={ft}
                      onChange={(e) => setFt(e.target.value)}
                      className="w-full bg-neutral-50 dark:bg-[#161616] border border-neutral-200 dark:border-neutral-800 rounded-2xl px-4 py-3 text-lg focus:ring-2 focus:ring-primary-500/50 outline-none transition-all dark:text-white"
                      placeholder="ft"
                    />
                    <span className="absolute right-4 top-3.5 text-neutral-400">ft</span>
                  </div>
                  <div className="flex-1 relative">
                    <input
                      type="number"
                      value={inVal}
                      onChange={(e) => setInVal(e.target.value)}
                      className="w-full bg-neutral-50 dark:bg-[#161616] border border-neutral-200 dark:border-neutral-800 rounded-2xl px-4 py-3 text-lg focus:ring-2 focus:ring-primary-500/50 outline-none transition-all dark:text-white"
                      placeholder="in"
                    />
                    <span className="absolute right-4 top-3.5 text-neutral-400">in</span>
                  </div>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2 block">Weight (lbs)</label>
                <input
                  type="number"
                  value={lbs}
                  onChange={(e) => setLbs(e.target.value)}
                  className="w-full bg-neutral-50 dark:bg-[#161616] border border-neutral-200 dark:border-neutral-800 rounded-2xl px-4 py-3 text-lg focus:ring-2 focus:ring-primary-500/50 outline-none transition-all dark:text-white"
                  placeholder="e.g. 154"
                />
              </div>
            </>
          )}
        </div>

        {/* Result Area */}
        <div className="w-full md:w-1/2 flex flex-col items-center justify-center bg-neutral-50 dark:bg-[#161616] rounded-3xl p-8 border border-neutral-100 dark:border-neutral-800 min-h-[300px]">
          {bmi !== null && category ? (
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }} 
              animate={{ scale: 1, opacity: 1 }} 
              className="text-center w-full"
            >
              <div className="text-5xl md:text-6xl font-bold tracking-tight text-neutral-900 dark:text-white mb-2">
                {bmi.toFixed(1)}
              </div>
              <div className={`text-xl font-medium ${category.color} mb-8`}>
                {category.label}
              </div>
              
              {/* BMI Scale Visual */}
              <div className="w-full">
                <div className="flex justify-between text-xs text-neutral-500 dark:text-neutral-400 mb-1 px-1">
                  <span>15</span>
                  <span>18.5</span>
                  <span>25</span>
                  <span>30</span>
                  <span>40+</span>
                </div>
                <div className="relative h-4 rounded-full bg-neutral-200 dark:bg-neutral-800 overflow-hidden flex">
                  <div className="h-full bg-blue-500" style={{ width: "24%" }}></div>
                  <div className="h-full bg-green-500" style={{ width: "26%" }}></div>
                  <div className="h-full bg-yellow-500" style={{ width: "20%" }}></div>
                  <div className="h-full bg-red-500" style={{ width: "30%" }}></div>
                  
                  {/* Indicator Marker */}
                  <div 
                    className="absolute top-0 bottom-0 w-1 bg-neutral-900 dark:bg-white z-10 transition-all duration-500 ease-out" 
                    style={{ left: `clamp(5%, ${(bmi - 15) / 25 * 100}%, 95%)` }}
                  ></div>
                </div>
              </div>
            </motion.div>
          ) : (
            <div className="text-center text-neutral-400 dark:text-neutral-500">
              <p>Enter your height and weight to calculate your BMI.</p>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
