import { Link } from 'react-router-dom';
import { ArrowLeft, BookOpen, ArrowRight } from 'lucide-react';

const mockPosts = [
  {
    slug: 'how-to-convert-celsius-to-fahrenheit-easily',
    title: 'How to Convert Celsius to Fahrenheit Easily',
    excerpt: 'Learn the simple formula and mental math tricks to quickly convert Celsius to Fahrenheit for your travels or cooking needs.',
    date: 'May 1, 2026',
    readTime: '3 min read'
  },
  {
    slug: 'km-to-miles-conversion-guide',
    title: 'Kilometers to Miles (km to miles) Complete Guide',
    excerpt: 'Everything you need to know about converting km to miles. Learn the exact 1.609 km to mile conversion ratio, perfect for runners and road trips.',
    date: 'April 30, 2026',
    readTime: '4 min read'
  },
  {
    slug: 'cm-to-inches-conversion-tips',
    title: 'Centimeters to Inches (cm to in) Made Easy',
    excerpt: 'Find out the exact conversion factor from cm to inches (cm to in calculation) and grab quick reference charts for measuring clothing and furniture.',
    date: 'April 29, 2026',
    readTime: '3 min read'
  },
  {
    slug: 'understanding-metric-vs-imperial-systems',
    title: 'Understanding Metric vs. Imperial Systems',
    excerpt: 'A deep dive into why different parts of the world use different measurement systems, and the history behind them.',
    date: 'April 28, 2026',
    readTime: '5 min read'
  },
  {
    slug: 'liters-to-gallons-conversion',
    title: 'Liters to Gallons Volume Conversion Explained',
    excerpt: 'Converting liters to gallons can be tricky because of the US and UK gallon differences. Let us dive into the conversion rates and formulas.',
    date: 'April 27, 2026',
    readTime: '4 min read'
  },
  {
    slug: 'kilograms-to-pounds-weight-conversion-guide',
    title: 'Kilograms to Pounds: The Ultimate Weight Conversion Guide',
    excerpt: 'Everything you need to know about converting kg to lbs, including common milestones and fitness tracking tips.',
    date: 'April 25, 2026',
    readTime: '4 min read'
  }
];

export default function Blog() {
  return (
    <div className="min-h-screen text-neutral-900 dark:text-neutral-100 font-sans p-6 md:p-12">
      <div className="max-w-4xl mx-auto">
        <header className="mb-12 border-b border-neutral-200 dark:border-neutral-800 pb-10">
          <Link to="/" className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-neutral-100 dark:bg-[#1a1a1a] hover:bg-neutral-200 dark:hover:bg-[#222] font-medium text-sm transition-colors mb-8 text-neutral-800 dark:text-neutral-200 border border-transparent dark:border-neutral-800">
            <ArrowLeft className="w-4 h-4" /> Back to Converter
          </Link>
          <div className="flex items-center gap-4 mb-5">
            <div className="p-3 bg-primary-100 dark:bg-primary-900/30 rounded-2xl text-primary-600 dark:text-primary-400">
              <BookOpen className="w-8 h-8" />
            </div>
            <h1 className="text-4xl md:text-5xl font-semibold tracking-tight text-neutral-900 dark:text-white">Conversion Guides</h1>
          </div>
          <p className="text-lg text-neutral-500 dark:text-neutral-400 font-light max-w-2xl leading-relaxed">
            Articles, tutorials, and insights to help you understand measurements, formulas, and conversions across the globe.
          </p>
        </header>

        <div className="grid gap-6">
          {mockPosts.map((post) => (
            <Link key={post.slug} to={`/blog/${post.slug}`} className="group block bg-white dark:bg-[#111111] p-6 md:p-8 rounded-3xl border border-neutral-100 dark:border-neutral-800 shadow-[0_4px_20px_rgba(0,0,0,0.02)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)] dark:shadow-none transition-all duration-300">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex-1">
                  <div className="flex items-center gap-3 text-xs font-medium text-neutral-400 dark:text-neutral-500 mb-3 uppercase tracking-wider">
                    <span>{post.date}</span>
                    <span>&bull;</span>
                    <span>{post.readTime}</span>
                  </div>
                  <h2 className="text-2xl font-semibold mb-3 tracking-tight group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">{post.title}</h2>
                  <p className="text-neutral-600 dark:text-neutral-400 font-light leading-relaxed">{post.excerpt}</p>
                </div>
                <div className="hidden md:flex items-center justify-center shrink-0 w-12 h-12 rounded-full bg-neutral-50 dark:bg-[#1a1a1a] text-neutral-400 group-hover:bg-primary-50 dark:group-hover:bg-primary-900/20 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-all">
                  <ArrowRight className="w-5 h-5" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
