import React from 'react';
import { Link, useParams, useNavigate, MemoryRouter } from 'react-router-dom';
import { ArrowLeft, Clock, Calendar, User } from 'lucide-react';
import { blogPosts } from './lib/blogPosts';
import App from './App';
import { Helmet } from 'react-helmet-async';

export default function BlogPost() {
  const { slug } = useParams();
  const navigate = useNavigate();

  const post = blogPosts.find(p => p.slug === slug);
  const title = post?.title || slug?.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  const currentIndex = blogPosts.findIndex(p => p.slug === slug);
  
  const suggestions = blogPosts.length > 2 ? [
    blogPosts[(currentIndex + 1) % blogPosts.length],
    blogPosts[(currentIndex + 2) % blogPosts.length]
  ].filter(Boolean) : [];

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

  const handleContentClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement;
    const anchor = target.closest('a');
    if (anchor) {
      const href = anchor.getAttribute('href');
      if (href && href.startsWith('/')) {
        e.preventDefault();
        navigate(href);
        window.scrollTo(0, 0);
      }
    }
  };

  const canonicalUrl = `https://quickconvertunits.com/blog/${post.slug}`;

  return (
    <div className="min-h-screen text-neutral-900 dark:text-neutral-100 font-sans p-6 md:p-12">
      <Helmet>
        <title>{post.title} | QuickConvert Blog</title>
        <meta name="description" content={post.excerpt} />
        <link rel="canonical" href={canonicalUrl} />
        {post.faqSchema && (
          <script type="application/ld+json" data-rh="true">
            {JSON.stringify({
              "@context": "https://schema.org",
              "@graph": [
                {
                  ...post.faqSchema,
                  "@id": `${canonicalUrl}#faq`
                },
                {
                  "@type": "BlogPosting",
                  "@id": `${canonicalUrl}#post`,
                  "headline": post.title,
                  "description": post.excerpt,
                  "datePublished": post.date,
                  "author": post.author ? { "@type": "Person", "name": post.author } : { "@type": "Organization", "name": "QuickConvert" }
                }
              ]
            })}
          </script>
        )}
      </Helmet>
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
              {post.author && (
                <div className="flex items-center gap-1.5 border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-[#1a1a1a] px-3 py-1.5 rounded-full">
                  <User className="w-4 h-4" />
                  {post.author}
                </div>
              )}
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

          <div className="content-wrapper">
            {post.content.split(/(\{\{WIDGET:[^}]+\}\})/g).map((part, index) => {
              if (part.startsWith('{{WIDGET:')) {
                const route = part.replace('{{WIDGET:', '').replace('}}', '');
                return (
                  <div key={index} className="my-10 rounded-[2.5rem] overflow-hidden -mx-4 md:mx-0 relative">
                    <MemoryRouter initialEntries={[`/${route}?embed=true`]}>
                      <App />
                    </MemoryRouter>
                  </div>
                );
              }
              return (
                <div 
                  key={index}
                  className="prose prose-neutral dark:prose-invert prose-lg max-w-none font-light leading-relaxed prose-headings:font-semibold prose-headings:tracking-tight prose-a:text-primary-600 dark:prose-a:text-primary-400"
                  dangerouslySetInnerHTML={{ __html: part }}
                  onClick={handleContentClick}
                />
              );
            })}
          </div>
            
          <div className="mt-12 p-8 bg-primary-50 dark:bg-primary-900/10 rounded-3xl border border-primary-100 dark:border-primary-900/30 text-center">
            <h3 className="text-xl font-semibold mb-3 text-primary-900 dark:text-primary-100 mt-0">Ready to convert?</h3>
            <p className="text-primary-800/80 dark:text-primary-200/80 font-light mb-6">Use our free, interactive calculator for instant results.</p>
            <Link to="/" className="inline-flex items-center justify-center px-6 py-3 rounded-full bg-primary-600 hover:bg-primary-700 text-white font-medium transition-colors">
              Go to Converter
            </Link>
          </div>
        </article>

        {suggestions.length > 0 && (
          <div className="mt-16">
            <h3 className="text-2xl font-semibold tracking-tight mb-8 text-neutral-900 dark:text-white">Related Articles</h3>
            <div className="grid gap-6 md:grid-cols-2">
              {suggestions.map((suggestion, index) => (
                <Link
                  key={index}
                  to={`/blog/${suggestion.slug}`}
                  className="group flex flex-col p-8 bg-white dark:bg-[#111111] rounded-[2.5rem] shadow-[0_8px_30px_rgba(0,0,0,0.04)] dark:shadow-none border border-neutral-100 dark:border-neutral-800 hover:border-primary-200 dark:hover:border-primary-900/50 transition-all duration-300"
                >
                  <div className="flex items-center gap-2 text-xs font-medium text-neutral-400 dark:text-neutral-500 mb-4 uppercase tracking-wider">
                    {suggestion.author && (
                      <>
                        <span className="text-primary-600 dark:text-primary-400 font-semibold">{suggestion.author}</span>
                        <span>&bull;</span>
                      </>
                    )}
                    <span>{suggestion.date}</span>
                    <span>&bull;</span>
                    <span>{suggestion.readTime}</span>
                  </div>
                  <h4 className="text-xl font-semibold tracking-tight text-neutral-900 dark:text-white mb-3 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                    {suggestion.title}
                  </h4>
                  <p className="text-neutral-500 dark:text-neutral-400 text-sm line-clamp-2 leading-relaxed">
                    {suggestion.excerpt}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
