import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function TermsOfService() {
  return (
    <div className="min-h-screen text-neutral-900 dark:text-neutral-100 font-sans p-6 md:p-12">
      <div className="max-w-3xl mx-auto bg-white dark:bg-[#111111] rounded-3xl shadow-[0_8px_30px_rgba(0,0,0,0.04)] dark:shadow-none border border-neutral-100 dark:border-neutral-800 p-8 md:p-16">
        <Link to="/" className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 font-medium text-sm transition-colors mb-10 text-neutral-800 dark:text-neutral-200">
          <ArrowLeft className="w-4 h-4" /> Back to Converter
        </Link>
        
        <h1 className="text-4xl font-semibold mb-8 text-neutral-900 dark:text-white tracking-tight">Terms of Service</h1>
        
        <div className="space-y-8 text-neutral-600 dark:text-neutral-400 leading-relaxed text-sm md:text-base font-light">
          <p>
            <strong className="font-medium text-neutral-900 dark:text-neutral-200">Last Updated: {new Date().toLocaleDateString()}</strong>
          </p>

          <p>
            Welcome to QuickConvert (<strong className="font-medium text-neutral-900 dark:text-neutral-200">quickconvertunits.com</strong>). By accessing or using our website, you agree to be bound by these Terms of Service.
          </p>

          <section>
            <h2 className="text-xl font-medium mb-4 text-neutral-800 dark:text-neutral-200">1. Acceptance of Terms</h2>
            <p>
              By accessing and using this website, you accept and agree to be bound by the terms and provision of this agreement.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-medium mb-4 text-neutral-800 dark:text-neutral-200">2. Description of Service</h2>
            <p>
              QuickConvert is a free online unit conversion tool. We provide various calculators and unit conversion utilities. We do not guarantee the accuracy of any conversions and are not responsible for any issues arising from their use.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-medium mb-4 text-neutral-800 dark:text-neutral-200">3. Disclaimer of Warranties</h2>
            <p>
              All materials and services on this website are provided "as is" and "as available" without warranty of any kind, whether express or implied.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-medium mb-4 text-neutral-800 dark:text-neutral-200">4. Limitation of Liability</h2>
            <p>
              In no event shall QuickConvert or its affiliates be liable for any indirect, incidental, special, or consequential damages arising out of or in connection with your use of the website.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-medium mb-4 text-neutral-800 dark:text-neutral-200">5. User Conduct</h2>
            <p>
              You agree to use our website only for lawful purposes. You are prohibited from using the site to engage in any activity that could damage, disable, or impair our servers or networks.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-medium mb-4 text-neutral-800 dark:text-neutral-200">6. Intellectual Property</h2>
            <p>
              The content, features, and functionality of this website are owned by QuickConvert and are protected by international copyright, trademark, and other intellectual property laws.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-medium mb-4 text-neutral-800 dark:text-neutral-200">7. Governing Law</h2>
            <p>
              These Terms shall be governed and construed in accordance with the laws of your jurisdiction, without regard to its conflict of law provisions.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-medium mb-4 text-neutral-800 dark:text-neutral-200">8. Changes to Terms</h2>
            <p>
              We reserve the right, at our sole discretion, to modify or replace these Terms at any time. By continuing to access or use our website after those revisions become effective, you agree to be bound by the revised terms.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
