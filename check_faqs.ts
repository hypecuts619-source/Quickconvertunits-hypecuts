import { blogPosts } from './src/lib/blogPosts.ts';

let allFaqs: any[] = [];
blogPosts.forEach(post => {
  if ((post as any).faqSchema && (post as any).faqSchema.mainEntity) {
    (post as any).faqSchema.mainEntity.forEach((faq: any) => {
      allFaqs.push({
        post: post.slug,
        question: faq.name,
        answer: faq.acceptedAnswer.text
      });
    });
  }
});

let questionCounts: Record<string, any[]> = {};
allFaqs.forEach(f => {
  if (!f.question) return;
  let q = f.question.trim().toLowerCase();
  if(!questionCounts[q]) questionCounts[q] = [];
  questionCounts[q].push(f);
});

console.log("Duplicate questions:");
Object.keys(questionCounts).forEach(q => {
  if(questionCounts[q].length > 1) {
    console.log(`Question: "${q}" found in: \n  ` + questionCounts[q].map(f => f.post).join('\n  '));
  }
});
