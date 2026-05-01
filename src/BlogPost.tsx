import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, Clock, Calendar } from 'lucide-react';
import { blogPosts } from './lib/blogPosts';

export default function BlogPost() {
  const { slug } = useParams();

  const post = blogPosts.find(p => p.slug === slug);
  const title = post?.title || slug?.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');

  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Post not found</h1>
          <Link to="/blog" className="text-primary-600 hover:underline">Return to blog</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen text-neutral-900 dark:text-neutral-100 font-sans p-6 md:p-12">
      {post.faqSchema && (
        <script 
          type="application/ld+json" 
          dangerouslySetInnerHTML={{ __html: JSON.stringify(post.faqSchema) }} 
        />
      )}
      <div className="max-w-3xl mx-auto">
        <Link to="/blog" className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-neutral-100 dark:bg-[#1a1a1a] hover:bg-neutral-200 dark:hover:bg-[#222] font-medium text-sm transition-colors mb-10 text-neutral-800 dark:text-neutral-200 border border-transparent dark:border-neutral-800">
          <ArrowLeft className="w-4 h-4" /> Back to Articles
        </Link>
        
        <article className="bg-white dark:bg-[#111111] rounded-3xl p-8 md:p-14 shadow-[0_8px_30px_rgba(0,0,0,0.04)] dark:shadow-none border border-neutral-100 dark:border-neutral-800">
          <header className="mb-10">
            <h1 className="text-3xl md:text-5xl font-semibold tracking-tight mb-6 text-neutral-900 dark:text-white leading-tight">
              {title || 'How to Convert Units Programmatically'}
            </h1>
            <div className="flex flex-wrap items-center gap-4 text-sm font-medium text-neutral-500 dark:text-neutral-400">
              <div className="flex items-center gap-1.5 border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-[#1a1a1a] px-3 py-1.5 rounded-full">
                <Calendar className="w-4 h-4" />
                {post.date}
              </div>
              <div className="flex items-center gap-1.5 border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-[#1a1a1a] px-3 py-1.5 rounded-full">
                <Clock className="w-4 h-4" />
                {post.readTime}
              </div>
            </div>
          </header>

          <div 
            className="prose prose-neutral dark:prose-invert prose-lg max-w-none font-light leading-relaxed prose-headings:font-semibold prose-headings:tracking-tight prose-a:text-primary-600 dark:prose-a:text-primary-400"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
            
          <div className="mt-12 p-8 bg-primary-50 dark:bg-primary-900/10 rounded-3xl border border-primary-100 dark:border-primary-900/30 text-center">
            <h3 className="text-xl font-semibold mb-3 text-primary-900 dark:text-primary-100 mt-0">Ready to convert?</h3>
            <p className="text-primary-800/80 dark:text-primary-200/80 font-light mb-6">Use our free, interactive calculator for instant results.</p>
            <Link to="/" className="inline-flex items-center justify-center px-6 py-3 rounded-full bg-primary-600 hover:bg-primary-700 text-white font-medium transition-colors">
              Go to Converter
            </Link>
          </div>
        </article>
      </div>
    </div>
  );
}
