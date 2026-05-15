import { Star } from "lucide-react";

export const TrustSignals = () => {
  const reviews = [
    { quote: "The fastest converter I've ever used. The live validation saves me so much time trying to figure out if I typed the right unit.", name: "Sarah K.", role: "Architect", rating: 5 },
    { quote: "Finally, a converter that actually works offline on my phone. The PWA is a lifesaver when I'm out on a construction site with no signal.", name: "Mike T.", role: "Civil Engineer", rating: 5 },
    { quote: "No confusing ads covering the buttons, straight to the point. The compare feature is exactly what I needed for my physics homework.", name: "Emily R.", role: "Student", rating: 5 },
    { quote: "It’s so accurate and simple. I use it constantly for recipes when converting volumes and weights from global cooking sites.", name: "James L.", role: "Chef", rating: 5 },
    { quote: "I love that when I share the URL with colleagues, it keeps the exact units we're talking about. Extremely useful for quick engineering chats.", name: "David P.", role: "Mechanical Engineer", rating: 5 },
    { quote: "The dark mode is beautiful and doesn't hurt my eyes during late-night study sessions. A fantastic little conversion tool.", name: "Alicia C.", role: "Undergraduate", rating: 5 },
    { quote: "It remembers what I used last so I don't have to keep selecting 'Kilometers to Miles' every single time I open the app.", name: "Robert J.", role: "Logistics Manager", rating: 5 },
    { quote: "No fluff, just works. Extremely responsive and the UI is incredibly intuitive. The best unit converter I've found so far.", name: "Maria V.", role: "UX Designer", rating: 5 }
  ];

  return (
    <div className="mt-16 mb-12 px-4 md:px-0 min-h-[500px]">
      <div className="flex flex-col items-center text-center mb-8">
        <h3 className="text-3xl font-semibold tracking-tight mb-3">Trusted by Professionals</h3>
        <p className="text-neutral-500 dark:text-neutral-400 text-lg">Join thousands of users relying on our fast, accurate conversions everyday.</p>
        <div className="flex items-center justify-center gap-1 mt-4">
          {[...Array(5)].map((_, i) => <Star key={i} className="w-5 h-5 text-amber-500 fill-amber-500" />)}
        </div>
      </div>
      
      <div className="w-[100vw] relative left-[50%] -translate-x-1/2 overflow-hidden pb-8 pt-4" style={{ maskImage: 'linear-gradient(to right, transparent, black 5%, black 95%, transparent)', WebkitMaskImage: 'linear-gradient(to right, transparent, black 5%, black 95%, transparent)' }}>
        <div className="flex gap-6 w-max animate-scroll-x hover:[animation-play-state:paused]">
          {[...reviews, ...reviews].map((review, i) => (
            <div key={i} className="shrink-0 w-[85vw] md:w-[350px] flex flex-col p-8 rounded-3xl bg-white dark:bg-[#111111] shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-neutral-100 dark:border-neutral-800 dark:shadow-none h-auto transition-transform hover:-translate-y-1 duration-300">
              <div className="flex items-center gap-1 mb-4">
                {[...Array(review.rating)].map((_, j) => <Star key={j} className="w-4 h-4 text-amber-500 fill-amber-500" />)}
              </div>
              <p className="text-neutral-600 dark:text-neutral-400 text-sm md:text-base leading-relaxed font-light mb-6 flex-grow">"{review.quote}"</p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center text-primary-600 dark:text-primary-400 font-semibold uppercase text-sm border-2 border-white dark:border-neutral-800 shadow-sm">{review.name.charAt(0)}</div>
                <div>
                  <div className="font-semibold text-sm text-neutral-900 dark:text-white leading-tight mb-0.5">{review.name}</div>
                  <div className="text-xs text-neutral-500 font-medium">{review.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <style>{`
        @keyframes scroll-x {
          0% { transform: translateX(0); }
          100% { transform: translateX(calc(-50% - 12px)); }
        }
        .animate-scroll-x {
          animation: scroll-x 40s linear infinite;
        }
      `}</style>
    </div>
  );
};
