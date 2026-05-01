import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Contact() {
  return (
    <div className="min-h-screen text-neutral-900 dark:text-neutral-100 font-sans p-6 md:p-12">
      <div className="max-w-3xl mx-auto bg-white dark:bg-[#111111] rounded-3xl shadow-[0_8px_30px_rgba(0,0,0,0.04)] dark:shadow-none border border-neutral-100 dark:border-neutral-800 p-8 md:p-16">
        <Link to="/" className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 font-medium text-sm transition-colors mb-10 text-neutral-800 dark:text-neutral-200">
          <ArrowLeft className="w-4 h-4" /> Back to Converter
        </Link>
        
        <h1 className="text-4xl font-semibold mb-8 text-neutral-900 dark:text-white tracking-tight">Contact Us</h1>
        
        <div className="space-y-8 text-neutral-600 dark:text-neutral-400 leading-relaxed text-sm md:text-base font-light">
          <p>
            Have a question, feedback, or a feature request? We'd love to hear from you.
          </p>

          <section>
            <h2 className="text-xl font-medium mb-4 text-neutral-800 dark:text-neutral-200">Get In Touch</h2>
            <p>
              For general inquiries, support, or partnership opportunities, you can email us at:
            </p>
            <p className="mt-4">
              <a href="mailto:support@quickconvertunits.com" className="font-medium text-primary-600 dark:text-primary-400 hover:underline">support@quickconvertunits.com</a>
            </p>
          </section>

          <section>
            <h2 className="text-xl font-medium mb-4 text-neutral-800 dark:text-neutral-200">Technical Support</h2>
            <p>
              If you found a bug or an inaccurate conversion, please include the specific units and values you were trying to convert so our team can investigate immediately.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
