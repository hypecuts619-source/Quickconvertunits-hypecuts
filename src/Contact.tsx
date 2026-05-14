import { ArrowLeft, Send } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useState } from 'react';

export default function Contact() {
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
  };

  return (
    <div className="min-h-screen text-neutral-900 dark:text-neutral-100 font-sans p-6 md:p-12">
      <div className="max-w-3xl mx-auto bg-white dark:bg-[#111111] rounded-3xl shadow-[0_8px_30px_rgba(0,0,0,0.04)] dark:shadow-none border border-neutral-100 dark:border-neutral-800 p-8 md:p-16">
        <Link to="/" className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 font-medium text-sm transition-colors mb-10 text-neutral-800 dark:text-neutral-200">
          <ArrowLeft className="w-4 h-4" /> Back to Converter
        </Link>
        
        <h1 className="text-4xl md:text-5xl font-semibold mb-8 text-neutral-900 dark:text-white tracking-tight">Contact Us</h1>
        
        <div className="space-y-8 text-neutral-600 dark:text-neutral-400 leading-relaxed text-[15px] md:text-base font-light">
          <p className="text-lg">
            Have a question, feedback, or a feature request? We'd love to hear from you.
          </p>

          <div className="grid md:grid-cols-2 gap-12 mt-8">
            <section>
              <h2 className="text-xl font-medium mb-4 text-neutral-800 dark:text-neutral-200">Get In Touch</h2>
              <p>
                For general inquiries, support, or partnership opportunities, you can use the form or email us directly at:
              </p>
              <p className="mt-4 mb-8">
                <a href="mailto:support@quickconvertunits.com" className="font-medium text-primary-600 dark:text-primary-400 hover:underline">support@quickconvertunits.com</a>
              </p>
              
              <h2 className="text-xl font-medium mb-4 text-neutral-800 dark:text-neutral-200">Technical Support</h2>
              <p>
                If you found a bug or an inaccurate conversion, please include the specific units and values you were trying to convert so our engineering team can investigate immediately.
              </p>
            </section>

            <section className="bg-neutral-50 dark:bg-neutral-900 rounded-2xl p-6 border border-neutral-100 dark:border-neutral-800">
              {isSubmitted ? (
                <div className="flex flex-col items-center justify-center h-full text-center py-8">
                  <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-full flex items-center justify-center mb-4">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-neutral-900 dark:text-neutral-100 mb-2">Message Sent!</h3>
                  <p className="text-sm text-neutral-500">Thank you for reaching out. We'll get back to you as soon as possible.</p>
                  <button 
                    onClick={() => setIsSubmitted(false)}
                    className="mt-6 text-sm text-primary-600 dark:text-primary-400 font-medium hover:underline"
                  >
                    Send another message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">Name</label>
                    <input 
                      type="text" 
                      id="name" 
                      required
                      className="w-full bg-white dark:bg-[#1a1a1a] border border-neutral-200 dark:border-neutral-800 rounded-xl px-4 py-2.5 outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-shadow text-neutral-900 dark:text-neutral-100"
                      placeholder="Your name"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">Email</label>
                    <input 
                      type="email" 
                      id="email" 
                      required
                      className="w-full bg-white dark:bg-[#1a1a1a] border border-neutral-200 dark:border-neutral-800 rounded-xl px-4 py-2.5 outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-shadow text-neutral-900 dark:text-neutral-100"
                      placeholder="you@example.com"
                    />
                  </div>
                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">Message</label>
                    <textarea 
                      id="message" 
                      required
                      rows={4}
                      className="w-full bg-white dark:bg-[#1a1a1a] border border-neutral-200 dark:border-neutral-800 rounded-xl px-4 py-2.5 outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-shadow text-neutral-900 dark:text-neutral-100 resize-none"
                      placeholder="How can we help?"
                    ></textarea>
                  </div>
                  <button 
                    type="submit"
                    className="w-full bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-xl px-4 py-3 flex items-center justify-center gap-2 transition-colors mt-2"
                  >
                    Send Message
                    <Send className="w-4 h-4" />
                  </button>
                </form>
              )}
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
