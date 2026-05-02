import React, { useState, useEffect } from 'react';
import { format, formatInTimeZone, toDate } from 'date-fns-tz';

const MAIN_TIMEZONES = [
  { id: 'UTC', name: 'UTC/GMT', label: 'Coordinated Universal Time (UTC)' },
  { id: 'America/New_York', name: 'EST/EDT', label: 'New York (Eastern Time)' },
  { id: 'America/Chicago', name: 'CST/CDT', label: 'Chicago (Central Time)' },
  { id: 'America/Denver', name: 'MST/MDT', label: 'Denver (Mountain Time)' },
  { id: 'America/Los_Angeles', name: 'PST/PDT', label: 'Los Angeles (Pacific Time)' },
  { id: 'Europe/London', name: 'GMT/BST', label: 'London (UK Time)' },
  { id: 'Europe/Paris', name: 'CET/CEST', label: 'Paris/Berlin (Central Europe)' },
  { id: 'Asia/Kolkata', name: 'IST', label: 'India Standard Time' },
  { id: 'Asia/Tokyo', name: 'JST', label: 'Tokyo (Japan)' },
  { id: 'Asia/Singapore', name: 'SGT', label: 'Singapore' },
  { id: 'Australia/Sydney', name: 'AEST/AEDT', label: 'Sydney (Eastern Australia)' },
];

export function TimeZoneConverter() {
  const [fromTz, setFromTz] = useState('America/New_York');
  const [toTz, setToTz] = useState('Asia/Kolkata');
  
  // Use a string format for easy input "YYYY-MM-DDTHH:MM"
  const [dateTime, setDateTime] = useState(() => {
    // Current local time formatted for standard datetime-local input
    const now = new Date();
    // we just use the local time values to populate the input
    const y = now.getFullYear();
    const m = String(now.getMonth() + 1).padStart(2, '0');
    const d = String(now.getDate()).padStart(2, '0');
    const h = String(now.getHours()).padStart(2, '0');
    const min = String(now.getMinutes()).padStart(2, '0');
    return `${y}-${m}-${d}T${h}:${min}`;
  });

  const [convertedTime, setConvertedTime] = useState('');

  // When inputs change, convert time
  useEffect(() => {
    if (!dateTime || !fromTz || !toTz) {
      setConvertedTime('');
      return;
    }
    
    try {
      // Create a date object interpreting the input string in the FROM timezone
      // Basically "The user typed this local time in the fromTz"
      const dateInFromTz = toDate(dateTime, { timeZone: fromTz });
      
      // Convert it to the TO timezone and format
      const formatted = formatInTimeZone(dateInFromTz, toTz, "EEEE, MMMM d, yyyy 'at' h:mm a (zzzz)");
      setConvertedTime(formatted);
    } catch (e) {
      setConvertedTime('Invalid date or time');
    }
  }, [dateTime, fromTz, toTz]);

  return (
    <div className="bg-white dark:bg-[#111111] p-6 md:p-10 rounded-[2.5rem] shadow-[0_8px_40px_rgba(0,0,0,0.04)] dark:shadow-none border border-neutral-100 dark:border-neutral-800 relative z-10 overflow-hidden">
      <div className="flex flex-col gap-8 relative">
        <div className="flex flex-col md:flex-row gap-4 md:gap-8">
          {/* FROM */}
          <div className="flex-1 w-full bg-neutral-50/50 dark:bg-[#161616] rounded-3xl p-6 border border-neutral-100 dark:border-neutral-800 focus-within:border-primary-500 transition-all group">
            <label className="text-[10px] uppercase tracking-widest text-neutral-400 font-semibold mb-3 block">From Time Zone</label>
            <select 
              value={fromTz} 
              onChange={(e) => setFromTz(e.target.value)}
              className="w-full bg-white dark:bg-black border border-neutral-200 dark:border-neutral-700 rounded-xl px-4 py-3 text-sm font-medium mb-4 outline-none focus:ring-2 focus:ring-primary-500"
            >
              {MAIN_TIMEZONES.map(tz => (
                <option key={tz.id} value={tz.id}>{tz.label}</option>
              ))}
            </select>
            
            <label className="text-[10px] uppercase tracking-widest text-neutral-400 font-semibold mb-3 block mt-4">Local Date & Time</label>
            <input 
              type="datetime-local" 
              value={dateTime}
              onChange={(e) => setDateTime(e.target.value)}
              className="w-full bg-transparent text-xl font-medium outline-none text-neutral-900 dark:text-white"
            />
          </div>

          {/* Icon */}
          <div className="hidden md:flex flex-col justify-center items-center -mx-4 z-10">
            <div className="w-12 h-12 bg-white dark:bg-black rounded-full shadow-lg border border-neutral-100 dark:border-neutral-800 flex items-center justify-center text-primary-500 hidden md:flex">
              →
            </div>
          </div>

          {/* TO */}
          <div className="flex-1 w-full bg-primary-50/50 dark:bg-primary-900/10 rounded-3xl p-6 border border-primary-100 dark:border-primary-900/30 transition-all">
            <label className="text-[10px] uppercase tracking-widest text-primary-600 dark:text-primary-400 font-semibold mb-3 block">To Time Zone</label>
            <select 
              value={toTz} 
              onChange={(e) => setToTz(e.target.value)}
              className="w-full bg-white dark:bg-black border border-neutral-200 dark:border-neutral-700 rounded-xl px-4 py-3 text-sm font-medium mb-4 outline-none focus:ring-2 focus:ring-primary-500"
            >
              {MAIN_TIMEZONES.map(tz => (
                <option key={tz.id} value={tz.id}>{tz.label}</option>
              ))}
            </select>

            <label className="text-[10px] uppercase tracking-widest text-primary-600 dark:text-primary-400 font-semibold mb-3 block mt-4">Converted Date & Time</label>
            <div className="w-full bg-transparent text-xl font-bold text-primary-600 dark:text-primary-400 outline-none leading-tight min-h-[60px] flex items-center">
              {convertedTime || "..."}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
