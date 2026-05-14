import { Link } from 'react-router-dom';
import { blogPosts } from '../lib/blogPosts';

export function HomepageBlogHub() {
  const topPosts = blogPosts.slice(0, 5); // Show latest 5

  return (
    <div className="mt-16 bg-white dark:bg-[#111111] rounded-3xl p-8 md:p-10 shadow-[0_8px_30px_rgba(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.4)] border border-neutral-100 dark:border-neutral-800">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-100">Latest Measurement Guides</h2>
        <Link to="/blog" className="text-sm font-medium text-primary-600 dark:text-primary-400 hover:underline">View all posts →</Link>
      </div>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {topPosts.map(post => (
          <Link key={post.slug} to={`/blog/${post.slug}`} className="group block bg-neutral-50 dark:bg-[#1a1a1a] rounded-2xl p-6 border border-neutral-100 dark:border-neutral-800 hover:border-primary-500/30 dark:hover:border-primary-500/30 transition-all hover:shadow-md">
            <div className="text-xs font-medium text-neutral-400 mb-3">{post.date} · {post.readTime}</div>
            <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-2 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors leading-tight">
              {post.title}
            </h3>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 line-clamp-3 leading-relaxed">
              {post.excerpt}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
