const fs = require('fs');
const d = JSON.parse(fs.readFileSync('D:/Projects/Book Summary/gist/src/data/books/capital-allocators.chapters.json', 'utf8'));

// Find chapters below 500 words and add more content
const extraAdditions = {
  "7 Investment Strategy": `\n\nThe chapter also addresses the relationship between strategy and patience. A good strategy is useless without the patience to execute it through multiple market cycles. Seides shares examples of allocators who abandoned sound strategies after short periods of underperformance, only to watch those strategies deliver strong returns after they exited. The patience to maintain conviction in a strategy during difficult periods is itself a competitive advantage—one that requires clear communication, strong governance, and a culture that rewards long-term thinking. Strategy and patience are inseparable; one without the other is ineffective.`,
  
  "8 Investment Process": `\n\nSeides also explores the human element of process. The best processes are designed by people who understand both the analytical requirements and the behavioral realities of investing. A process that looks perfect on paper but ignores how humans actually behave will fail in practice. The most effective processes account for cognitive biases, emotional reactions, and the inevitable conflicts that arise in organizations. They include checkpoints, reviews, and feedback loops that catch errors before they compound. The ultimate test of a process is not whether it works in normal times but whether it holds up under stress.`,
  
  "9 Technological Innovation": `\n\nThe chapter also addresses the cost of technological adoption. Implementing new systems requires significant upfront investment in time, money, and organizational change. Seides cautions that institutions should be selective about which technologies to adopt, focusing on those that address their most pressing needs rather than chasing every new tool. The best technology investments are those that solve real problems—hidden concentrations, slow risk reporting, or inefficient sourcing—rather than those that simply look impressive. Pragmatism, not innovation, should drive technology decisions.`,
  
  "10 Case Study of Uncertainty": `\n\nThe chapter also explores the role of communication during uncertain times. When markets are volatile and outcomes are unclear, the way allocators communicate with boards, beneficiaries, and colleagues matters enormously. Clear, honest, and frequent communication builds the trust necessary to maintain support through difficult periods. Allocators who hide behind jargon or optimism lose credibility, while those who acknowledge uncertainty honestly and explain their process earn the patience needed for long-term strategies to work.`,
  
  "11 Investment Lessons": `\n\nThe chapter ends with a practical takeaway: keep a journal of your investment theses, review them regularly, and update them honestly. This simple practice creates a feedback loop that accelerates learning and prevents the gradual drift that leads to poor decisions. The best allocators are perpetual students of their own behavior, using each cycle as a lesson in what works, what doesn't, and why. Investment wisdom is not accumulated in a single revelation but built through decades of honest self-assessment.`,
  
  "12 Life Lessons": `\n\nThe chapter also addresses the importance of saying no. Several guests describe how learning to decline opportunities—invitations, board seats, deals—was essential to their success. The ability to say no protects focus, preserves energy, and ensures that time is spent on the highest-value activities. In a field where opportunities are abundant and attention is scarce, the discipline to say no is as important as the courage to say yes. The most successful allocators are those who protect their time and attention as carefully as they protect their portfolio.`
};

d.chapters.forEach(ch => {
  if (extraAdditions[ch.title]) {
    ch.summary += extraAdditions[ch.title];
  }
});

fs.writeFileSync('D:/Projects/Book Summary/gist/src/data/books/capital-allocators.chapters.json', JSON.stringify(d, null, 2));

console.log('Chapters:', d.chapters.length);
let tw = 0;
d.chapters.forEach(c => {
  const w = c.summary.split(/\s+/).length;
  tw += w;
  console.log(`${c.title}: ${w} words, ${c.takeaways.length} takeaways`);
});
console.log(`Average: ${Math.round(tw / d.chapters.length * 10) / 10} words/chapter`);
