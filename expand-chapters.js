const fs = require('fs');
const d = JSON.parse(fs.readFileSync('D:/Projects/Book Summary/gist/src/data/books/capital-allocators.chapters.json', 'utf8'));

const additions = [
  // Introduction
  `\n\nThe introduction also explores the role of trust in allocator relationships. Seides observes that the best allocator-manager partnerships are built on trust that takes years to develop but can be destroyed in a single incident. Trust is earned through consistency, transparency, and the willingness to admit mistakes. This theme of trust recurs throughout the book—in interviews, negotiations, governance, and every other dimension of the allocator's craft. The introduction establishes trust as the foundation upon which all other skills are built.`,

  // 1 Interviewing
  `\n\nThe chapter concludes with a meditation on the long-term consequences of interview quality. Every manager selection, every hire, every peer relationship begins with an interview. The compounding effect of interviewing well—or poorly—over a career is enormous. Allocators who master the interview process build stronger teams, select better managers, and create cultures of candor. Those who neglect it populate their organizations with people who look good on paper but underperform in practice. The interview is the first filter in a long chain of decisions, and its quality determines the quality of everything that follows.`,

  // 2 Decision-Making
  `\n\nSeides closes the chapter with a powerful observation: the best decision-makers are not those who are right most often, but those who are wrong least expensively. This distinction captures the essence of probabilistic thinking—it is not about predicting outcomes but about managing the consequences of being wrong. The allocators who compound wealth over decades are not the ones who made the most brilliant calls; they are the ones who avoided catastrophic mistakes and maintained the discipline to stay invested through uncertainty. Decision quality compounds just as returns do, and the difference between good and great decision-making becomes visible only over long time horizons.`,

  // 3 Negotiations
  `\n\nThe chapter also addresses the emotional dimension of negotiation. Even the best-prepared negotiators feel anxiety, doubt, and the temptation to concede too quickly. Seides shares that several guests described developing personal rituals to manage negotiation anxiety—reviewing their walk-away point, reminding themselves of their alternatives, and mentally rehearsing the conversation. The best negotiators are not emotionless; they have learned to manage their emotions rather than be managed by them. This self-awareness in high-pressure situations is itself a competitive advantage that extends well beyond the negotiation table.`,

  // 4 Leadership
  `\n\nThe chapter closes with a reflection on the loneliness of leadership. CIOs who run investment organizations describe the isolation of making unpopular decisions, bearing responsibility for outcomes they cannot fully control, and maintaining composure when markets create panic. The best leaders find ways to manage this loneliness—through peer networks, mentors, or personal practices that sustain their energy and perspective. Leadership is not a position; it is a practice that demands continuous self-renewal.`,

  // 5 Management
  `\n\nSeides emphasizes that management, unlike leadership, can be systematized and taught. While leadership requires personality and self-awareness, management requires process and discipline. The best managers create systems that run without them—hiring processes that筛选 candidates rigorously, performance review systems that provide honest feedback, and project management frameworks that ensure accountability. The compounding effect of good management is a team that operates with increasing autonomy, freeing the leader to focus on the strategic questions that only they can answer.`,

  // 6 Governance
  `\n\nThe chapter also explores the evolving nature of governance as institutions grow. Small institutions often have informal governance that works because everyone knows everyone; as they scale, that informality becomes a liability. The transition from informal to formal governance is one of the most challenging passages in an institution's life, and the best boards navigate it by adding structure while preserving the trust and informality that made the organization effective in the first place. The chapter provides practical guidance for managing this transition without losing the cultural strengths that drove early success.`,

  // 7 Investment Strategy
  `\n\nSeides concludes the chapter with a warning about strategy drift—the gradual abandonment of a strategy in response to short-term underperformance. Strategy drift is one of the most common and costly mistakes in investing, because it leads to buying high and selling low. The antidote is a clear written strategy, regular review against that strategy, and the discipline to maintain conviction during periods of underperformance. The best allocators treat their strategy as a contract with themselves and their beneficiaries—one that should be honored through cycles, not abandoned when results disappoint.`,

  // 8 Investment Process
  `\n\nThe chapter closes by connecting process to culture. The best investment processes are not imposed from above; they emerge from a culture that values rigor, transparency, and continuous improvement. Process without culture is compliance—people follow the steps without understanding why. Culture without process is chaos—people understand the values but lack the discipline to apply them consistently. The best allocators build both simultaneously, creating organizations where good process is a natural expression of a strong culture rather than an external constraint.`,

  // 9 Technological Innovation
  `\n\nSeides ends with a forward-looking perspective on the allocator's relationship with technology. As data becomes more abundant and analytical tools more powerful, the temptation to over-rely on technology will grow. The allocators who navigate this temptation successfully will be those who remember that technology is a tool for human judgment, not a substitute for it. The best technology implementations are invisible—they enhance the allocator's existing process without requiring the allocator to become a technologist. The goal is not to adopt every new tool but to integrate the right tools into a process that remains fundamentally human.`,

  // 10 Case Study of Uncertainty
  `\n\nThe chapter's final insight is about the relationship between uncertainty and humility. The allocators who perform best over the long term are not those who predict the future correctly but those who maintain the humility to recognize that the future is inherently unpredictable. This humility leads to better risk management, more realistic planning, and a willingness to maintain diversified portfolios even when concentrated bets look tempting. The case study demonstrates that uncertainty is not a problem to be solved but a condition to be managed—and the best managers are those who embrace this reality rather than fighting it.`,

  // 11 Investment Lessons
  `\n\nThe chapter concludes by returning to the theme of temperament. In a field that celebrates intellectual brilliance, the most successful investors are often those with the most ordinary intellects but the most extraordinary temperaments. They maintain discipline when others panic, curiosity when others become complacent, and patience when others grow restless. These qualities cannot be taught in a classroom or learned from a textbook; they are developed through experience, reflection, and the honest confrontation of one's own limitations. The ultimate investment lesson is that the market rewards character more than intelligence.`,

  // 12 Life Lessons
  `\n\nThe chapter closes with a reflection on legacy. The guests who have retired or are approaching retirement consistently emphasize that legacy is not about assets under management or investment returns—it is about the people they developed, the institutions they strengthened, and the communities they served. This perspective is both humbling and inspiring: it reminds us that the ultimate purpose of capital allocation is not wealth creation but human flourishing. The best allocators measure their success not by the size of their portfolio but by the impact of their work on the lives of others.`,

  // 13 The Top 10
  `\n\nSeides closes the book by returning to the central insight that ties everything together: the best allocators are students of human behavior. Whether they are interviewing a manager, negotiating a fee, leading a team, or governing an institution, they are applying the same fundamental skills—curiosity, humility, discipline, and empathy. These skills are not specific to investing; they are the skills of effective human interaction in any context. The book's ultimate lesson is that capital allocation is a human endeavor, and success depends not on models or algorithms but on the quality of human judgment and the character of the people who exercise it.`
];

d.chapters.forEach((ch, i) => {
  ch.summary += additions[i];
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
