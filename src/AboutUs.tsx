import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function AboutUs() {
  return (
    <div className="min-h-screen text-neutral-900 dark:text-neutral-100 font-sans p-6 md:p-12">
      <div className="max-w-3xl mx-auto bg-white dark:bg-[#111111] rounded-3xl shadow-[0_8px_30px_rgba(0,0,0,0.04)] dark:shadow-none border border-neutral-100 dark:border-neutral-800 p-8 md:p-16">
        <Link to="/" className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 font-medium text-sm transition-colors mb-10 text-neutral-800 dark:text-neutral-200">
          <ArrowLeft className="w-4 h-4" /> Back to Converter
        </Link>
        
        <h1 className="text-4xl font-semibold mb-8 text-neutral-900 dark:text-white tracking-tight">About Us</h1>
        
        <div className="space-y-8 text-neutral-600 dark:text-neutral-400 leading-relaxed text-sm md:text-base font-light">
          <p>
            QuickConvert (<strong className="font-medium text-neutral-900 dark:text-neutral-200">quickconvertunits.com</strong>) was built to be the fastest, most reliable, and easiest-to-use unit conversion tool on the web.
          </p>

          <section>
            <h2 className="text-xl font-medium mb-4 text-neutral-800 dark:text-neutral-200">Our Mission</h2>
            <p>
              We believe that simple utilities shouldn't be bloated with unnecessary pop-ups, slow loading times, or confusing interfaces. Our goal was to create a tool that gets straight to the point: giving you accurate conversions as quickly as possible.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-medium mb-4 text-neutral-800 dark:text-neutral-200">Why Choose Us?</h2>
            <ul className="list-disc pl-5 space-y-3">
              <li><strong className="font-medium text-neutral-900 dark:text-neutral-200">Speed:</strong> Built with modern web technologies for instant results as you type.</li>
              <li><strong className="font-medium text-neutral-900 dark:text-neutral-200">Privacy:</strong> All standard unit conversions happen securely on your device. We don't track the numbers you input.</li>
              <li><strong className="font-medium text-neutral-900 dark:text-neutral-200">Ease of Use:</strong> Clean, minimalist interface optimized for both desktop and mobile devices.</li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
}
