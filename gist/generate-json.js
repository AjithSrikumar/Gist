const fs = require('fs');
const path = require('path');

const EXTRACTED_DIR = 'D:\\Projects\\Book Summary\\extracted-books';
const OUTPUT_DIR = 'D:\\Projects\\Book Summary\\gist\\src\\data\\books';

// Book metadata mapping from filename to proper book info
const BOOK_METADATA = {
  'against_all_odds_gopalakrishnan,_s._kris_&_dayasin': {
    id: 'against-all-odds',
    title: 'Against All Odds: The IT Story of India',
    authors: ['Kris Gopalakrishnan', 'N. Dayasindhu', 'Krishnan Narayanan'],
    aboutAuthor: 'Kris Gopalakrishnan is a co-founder of Infosys and former CEO. N. Dayasindhu and Krishnan Narayanan are technology historians at ITiHAASA. Together they document the six-decade history of India\'s IT revolution through hundreds of interviews with industry pioneers.'
  },
  'charles_t._munger,_peter_d._kaufman_(editor)_-_poor_charlie\'s_almanack__the_essential_wit_and_wisdom_of_charles_t._munger_(2023,_stripe_press)_-_libgen.li': {
    id: 'poor-charlies-almanack',
    title: 'Poor Charlie\'s Almanack: The Essential Wit and Wisdom of Charles T. Munger',
    authors: ['Charles T. Munger', 'Peter D. Kaufman (editor)'],
    aboutAuthor: 'Charlie Munger was Warren Buffett\'s longtime partner at Berkshire Hathaway and a multidisciplinary thinker. This almanack, edited by Peter Kaufman, compiles his speeches, essays, and mental models for worldly wisdom.'
  },
  'einstein_walter_isaacson': {
    id: 'einstein',
    title: 'Einstein: His Life and Universe',
    authors: ['Walter Isaacson'],
    aboutAuthor: 'Walter Isaacson is a biographer who has written definitive lives of Steve Jobs, Leonardo da Vinci, Benjamin Franklin, and Henry Kissinger. His Einstein biography draws on newly released personal letters to reveal the human behind the genius.'
  },
  'expectations_investing_michael_j._mauboussin': {
    id: 'expectations-investing',
    title: 'Expectations Investing: Reading Stock Prices for Better Returns',
    authors: ['Michael J. Mauboussin', 'Alfred Rappaport'],
    aboutAuthor: 'Michael Mauboussin is Head of Consilient Research at Counterpoint Global and a leading thinker on valuation, decision-making, and mental models. Alfred Rappaport pioneered shareholder value theory. Together they reframe investing around market expectations.'
  },
  'gregory_zuckerman_-_the_man_who_solved_the_market__how_jim_simons_launched_the_quant_revolution_(2019,_portfolio)_-_libgen.li': {
    id: 'the-man-who-solved-the-market',
    title: 'The Man Who Solved the Market: How Jim Simons Launched the Quant Revolution',
    authors: ['Gregory Zuckerman'],
    aboutAuthor: 'Gregory Zuckerman is a Special Writer at The Wall Street Journal and author of The Greatest Trade Ever. He spent years interviewing Jim Simons and Renaissance insiders to tell the untold story of the world\'s most successful quant fund.'
  },
  'leonardo_da_vinci_isaacson,_walter': {
    id: 'leonardo-da-vinci',
    title: 'Leonardo da Vinci',
    authors: ['Walter Isaacson'],
    aboutAuthor: 'Walter Isaacson connects Leonardo\'s art to his science, showing how his curiosity across disciplines—anatomy, optics, hydraulics, theater—fueled creative genius. Based on 7,200 pages of notebooks.'
  },
  'mastering_the_market_cycle_howard_marks': {
    id: 'mastering-the-market-cycle',
    title: 'Mastering the Market Cycle: Getting the Odds on Your Side',
    authors: ['Howard Marks'],
    aboutAuthor: 'Howard Marks is co-chairman of Oaktree Capital Management, famous for his memos on market cycles, risk, and investor psychology. This book codifies his framework for recognizing where we are in any cycle.'
  },
  'richer,_wiser,_happier_how_the_worlds_greatest_investors_win_in_markets_and_life_by_william_green': {
    id: 'richer-wiser-happier',
    title: 'Richer, Wiser, Happier: How the World\'s Greatest Investors Win in Markets and Life',
    authors: ['William Green'],
    aboutAuthor: 'William Green has written for The New Yorker, Time, and Forbes. He spent years interviewing investing legends—Munger, Pabrai, Spier, Greenblatt, Miller—to distill their wisdom on wealth, wisdom, and wellbeing.'
  },
  'rupal_j._bhansali_-_non-consensus_investing__being_right_when_everyone_else_is_wrong_(2019,_columbia_university_press)_-_libgen.li': {
    id: 'non-consensus-investing',
    title: 'Non-Consensus Investing: Being Right When Everyone Else Is Wrong',
    authors: ['Rupal J. Bhansali'],
    aboutAuthor: 'Rupal Bhansali is CIO and Portfolio Manager at Ariel Investments, managing international and global strategies. She advocates for contrarian, non-consensus thinking to find value where others aren\'t looking.'
  },
  'sizing_people_up___a_veteran_fbi_agent\'s_user_manual_for_behavior_prediction-_dreeke,_robin__stauth,_cameron_-': {
    id: 'sizing-people-up',
    title: 'Sizing People Up: A Veteran FBI Agent\'s User Manual for Behavior Prediction',
    authors: ['Robin Dreeke', 'Cameron Stauth'],
    aboutAuthor: 'Robin Dreeke ran the FBI\'s Behavioral Analysis Program. He translates counterintelligence techniques into a practical system for reading people, building trust, and predicting behavior in any setting.'
  },
  'super_thinking_the_big_book_of_mental_models_(2019,_portfolio)': {
    id: 'super-thinking',
    title: 'Super Thinking: The Big Book of Mental Models',
    authors: ['Gabriel Weinberg', 'Lauren McCann'],
    aboutAuthor: 'Gabriel Weinberg is CEO of DuckDuckGo; Lauren McCann is a statistician. Together they catalog 300+ mental models from physics, psychology, economics, and biology to upgrade decision-making.'
  },
  'the_big_bull_of_dalal_street_-neil_borate__aprajita_sharma__aditya_kondawar_-_(2023,_penguin_random_house_india_private_limited)_-_libgen.li': {
    id: 'the-big-bull-of-dalal-street',
    title: 'The Big Bull of Dalal Street: The Story of Rakesh Jhunjhunwala',
    authors: ['Neil Borate', 'Aprajita Sharma', 'Aditya Kondawar'],
    aboutAuthor: 'Three financial journalists chronicle the life of Rakesh Jhunjhunwala, India\'s "Warren Buffett," from a ₹5,000 start to a ₹46,000 crore portfolio, revealing his contrarian bets and market philosophy.'
  },
  'the_business_of_venture_capital__the_art_of_raising_a_fund,_structuring_investments,_portfolio_management,_and_exits_(mahendra_ramsinghani)': {
    id: 'the-business-of-venture-capital',
    title: 'The Business of Venture Capital: The Art of Raising a Fund, Structuring Investments, Portfolio Management, and Exits',
    authors: ['Mahendra Ramsinghani'],
    aboutAuthor: 'Mahendra Ramsinghani is a venture capitalist and author who has managed funds and advised LPs. This comprehensive guide covers the full VC lifecycle from fundraising to exits, used in MBA programs worldwide.'
  },
  'the_tatas_how_a_family_built_a_business_and_a_nati': {
    id: 'the-tatas',
    title: 'The Tatas: How a Family Built a Business and a Nation',
    authors: ['Girish Kuber'],
    aboutAuthor: 'Girish Kuber, editor of Loksatta, traces the Tata family\'s journey from a small trading firm to a global conglomerate that built institutions, cities, and modern India—while keeping philanthropy at its core.'
  },
  'the_unusual_billionaires_(saurabh_mukherjea)': {
    id: 'the-unusual-billionaires',
    title: 'The Unusual Billionaires',
    authors: ['Saurabh Mukherjea'],
    aboutAuthor: 'Saurabh Mukherjea is founder of Marcellus Investment Managers and author of Coffee Can Investing. He profiles seven Indian companies that delivered 15%+ ROCE for a decade, revealing the "greatness" formula.'
  },
  'vijay_malik_-_peaceful_investing_-_a_simple_guide_(2015)': {
    id: 'peaceful-investing',
    title: 'Peaceful Investing: A Simple Guide',
    authors: ['Vijay Malik'],
    aboutAuthor: 'Vijay Malik is a SEBI-registered investment advisor who advocates a simple, low-stress approach: buy quality businesses at reasonable prices, hold long-term, and ignore market noise.'
  },
  'warren_buffet_inside_the_ultimate_money_mind_by_robert_g._hagstrom': {
    id: 'warren-buffett-inside-the-ultimate-money-mind',
    title: 'Warren Buffett: Inside the Ultimate Money Mind',
    authors: ['Robert G. Hagstrom'],
    aboutAuthor: 'Robert Hagstrom is Senior Portfolio Manager at EquityCompass and author of The Warren Buffett Way. He explores Buffett\'s mental models, psychological edge, and the "money mind" that drives superior capital allocation.'
  },
  'what_my_mba_did_not_teach_me_about_money_sandeep_s': {
    id: 'what-my-mba-did-not-teach-me',
    title: 'What My MBA Did Not Teach Me About Money',
    authors: ['Sandeep S.'],
    aboutAuthor: 'Sandeep S. shares practical financial wisdom missing from business school curricula—personal finance, investing psychology, and wealth-building frameworks for real life, not theory.'
  },
  'william_o\'neil_-_how_to_make_money_in_stocks__a_winning_system_in_good_times_and_bad,_fourth_edition_(2009,_mcgraw-hill_education)': {
    id: 'how-to-make-money-in-stocks',
    title: 'How to Make Money in Stocks: A Winning System in Good Times and Bad',
    authors: ['William J. O\'Neil'],
    aboutAuthor: 'William O\'Neil founded Investor\'s Business Daily and created the CAN SLIM system. His growth-investing methodology combines fundamental and technical analysis to find winning stocks before they break out.'
  },
  'william_oneil,_matthew_galgani,_amy_smith_-_how_to_make_money_in_stocks_trilogy_(2013,_mcgraw-hill)_-_libgen.li': {
    id: 'how-to-make-money-in-stocks-trilogy',
    title: 'How to Make Money in Stocks Trilogy',
    authors: ['William J. O\'Neil', 'Matthew Galgani', 'Amy Smith'],
    aboutAuthor: 'The trilogy expands on CAN SLIM with advanced chart patterns, portfolio management, and real trade examples from O\'Neil, Galgani (IBD publisher), and Smith (IBD research).'
  },
  'charles_t._munger,_peter_d._kaufman_(editor)_-_poor_charlie’s_almanack__the_essential_wit_and_wisdom_of_charles_t._munger_(2023,_stripe_press)_-_libgen.li': {
    id: 'poor-charlies-almanack',
    title: 'Poor Charlie\'s Almanack: The Essential Wit and Wisdom of Charles T. Munger',
    authors: ['Charles T. Munger', 'Peter D. Kaufman (editor)'],
    aboutAuthor: 'Charlie Munger was Warren Buffett\'s longtime partner at Berkshire Hathaway and a multidisciplinary thinker. This almanack, edited by Peter Kaufman, compiles his speeches, essays, and mental models for worldly wisdom.'
  },
  'sizing_people_up___a_veteran_fbi_agent’s_user_manual_for_behavior_prediction-_dreeke,_robin__stauth,_cameron_-': {
    id: 'sizing-people-up',
    title: 'Sizing People Up: A Veteran FBI Agent\'s User Manual for Behavior Prediction',
    authors: ['Robin Dreeke', 'Cameron Stauth'],
    aboutAuthor: 'Robin Dreeke ran the FBI\'s Behavioral Analysis Program. He translates counterintelligence techniques into a practical system for reading people, building trust, and predicting behavior in any setting.'
  },
  'vijay_malik_-_peaceful_investing_–_a_simple_guide_(2015)': {
    id: 'peaceful-investing',
    title: 'Peaceful Investing: A Simple Guide',
    authors: ['Vijay Malik'],
    aboutAuthor: 'Vijay Malik is a SEBI-registered investment advisor who advocates a simple, low-stress approach: buy quality businesses at reasonable prices, hold long-term, and ignore market noise.'
  }
};

function sanitizeId(name) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
}

function extractTableOfContents(text) {
  // Look for table of contents in the text
  const tocRegex = /(?:contents|table of contents)[\s\S]{0,500}?((?:\d+\.\s+[^\n]+\n)+)/gi;
  const matches = text.match(tocRegex);
  if (matches && matches[1]) {
    return matches[1].trim().split('\n')
      .map(l => l.trim())
      .filter(l => l.match(/^\d+\.\s+/))
      .map(l => l.replace(/^\d+\.\s*/, '').trim());
  }
  return [];
}

function extractChaptersFromEpub(text) {
  // Parse epub chapters from the === CHAPTER markers
  const chapters = [];
  const regex = /=== CHAPTER\s+(\d+):\s*([^=]+)===/g;
  let match;
  const chapterStarts = [];
  
  while ((match = regex.exec(text)) !== null) {
    chapterStarts.push({
      num: parseInt(match[1]),
      title: match[2].trim(),
      startIndex: match.index,
      matchLength: match[0].length
    });
  }
  
  // Extract content between chapter markers
  for (let i = 0; i < chapterStarts.length; i++) {
    const ch = chapterStarts[i];
    const start = ch.startIndex + ch.matchLength;
    const end = i + 1 < chapterStarts.length ? chapterStarts[i + 1].startIndex : text.length;
    const content = text.slice(start, end).trim();
    
    // Try to extract a better title from the content
    let title = ch.title;
    if (title === 'Untitled' || title === 'Title page' || title === 'Contents' || title === 'Dedication' || title === 'Advance Praise for the Book') {
      // Look for chapter heading in content
      const headingMatch = content.match(/<h[1-3][^>]*class="[^"]*brandinghead[^"]*"[^>]*>([^<]+)<\/h[1-3]>\s*<h[1-3][^>]*class="[^"]*brandingheadclosedtitle[^"]*"[^>]*>([^<]+)<\/h[1-3]>/);
      if (headingMatch) {
        title = `${headingMatch[1].trim()} ${headingMatch[2].trim()}`;
      } else {
        const singleMatch = content.match(/<h[1-3][^>]*class="[^"]*brandingheadclosedtitle[^"]*"[^>]*>([^<]+)<\/h[1-3]>/);
        if (singleMatch) {
          title = singleMatch[1].trim();
        } else {
          const h2Match = content.match(/<h2[^>]*>([^<]+)<\/h2>/);
          if (h2Match) {
            title = h2Match[1].trim();
          }
        }
      }
    }
    
    // Clean HTML tags from content for readability
    const cleanContent = content
      .replace(/<[^>]+>/g, ' ')
      .replace(/&[a-z]+;/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
    
    if (cleanContent.length > 500) { // Only keep substantial chapters
      chapters.push({ title, content: cleanContent, num: ch.num });
    }
  }
  
  return chapters;
}

function extractChaptersFromPdf(text) {
  // For PDF, use table of contents or page-based heuristics
  const toc = extractTableOfContents(text);
  if (toc.length > 0) {
    return toc.map((title, i) => ({ title, content: '', num: i + 1 }));
  }
  
  // Fallback: split by major headings
  const chapters = [];
  const lines = text.split('\n');
  let currentChapter = { title: 'Introduction', content: '', num: 1 };
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    // Detect chapter headings
    if (line.match(/^(chapter|part)\s+\d+/i) || 
        line.match(/^\d+\.\s+[A-Z][a-z]/) ||
        (line.length > 15 && line.length < 80 && line === line.toUpperCase() && line.split(' ').length > 2)) {
      if (currentChapter.content.trim().length > 500) {
        chapters.push(currentChapter);
      }
      currentChapter = { title: line, content: '', num: chapters.length + 1 };
    } else {
      currentChapter.content += line + '\n';
    }
  }
  if (currentChapter.content.trim().length > 500) {
    chapters.push(currentChapter);
  }
  
  return chapters.length > 1 ? chapters : [{ title: 'Full Text', content: text, num: 1 }];
}

function generateChapterSummary(chapter, bookTitle) {
  // This is a placeholder - in reality, you'd use an LLM to generate the summary
  // For now, return a template that indicates what needs to be filled
  const wordCount = Math.floor(chapter.content.split(/\s+/).length);
  return {
    title: chapter.title,
    summary: `[CHAPTER SUMMARY NEEDED - ${wordCount} words available] ${chapter.title} from ${bookTitle}. This chapter covers... [Detailed 500+ word summary with anecdotes, illustrations, and key concepts from the chapter text goes here.]`,
    takeaway: `Key insight from ${chapter.title}`,
    takeaways: [
      `First key takeaway from ${chapter.title}`,
      `Second key takeaway from ${chapter.title}`,
      `Third key takeaway from ${chapter.title}`
    ]
  };
}

function generateBookJson(bookKey, chapters) {
  const meta = BOOK_METADATA[bookKey];
  if (!meta) return null;
  
  // Generate key points from first few chapters
  const points = chapters.slice(0, 6).map(ch => ({
    heading: ch.title.length > 60 ? ch.title.substring(0, 57) + '...' : ch.title,
    body: ch.content.substring(0, 300) + '...'
  }));
  
  // Generate insights from notable content
  const insights = [
    `Key insight from ${meta.title}`,
    `Notable anecdote or framework from the book`,
    `Practical application for readers`
  ];
  
  return {
    id: meta.id,
    aboutAuthor: meta.aboutAuthor,
    points,
    insights,
    conclusion: `Conclusion for ${meta.title} - synthesizes the main themes and leaves the reader with a lasting insight.`
  };
}

async function processAllBooks() {
  const files = fs.readdirSync(EXTRACTED_DIR);
  const bookFiles = files.filter(f => f.endsWith('.txt'));
  
  console.log(`Processing ${bookFiles.length} books...`);
  
  for (const file of bookFiles) {
    const bookKey = file.replace('.txt', '');
    const meta = BOOK_METADATA[bookKey];
    
    if (!meta) {
      console.log(`Skipping ${file} - no metadata`);
      continue;
    }
    
    // Skip existing books
    const existingBook = path.join(OUTPUT_DIR, `${meta.id}.json`);
    const existingChapters = path.join(OUTPUT_DIR, `${meta.id}.chapters.json`);
    if (fs.existsSync(existingBook) && fs.existsSync(existingChapters)) {
      console.log(`Skipping ${meta.id} - already exists`);
      continue;
    }
    
    console.log(`Processing: ${meta.title}`);
    
    const text = fs.readFileSync(path.join(EXTRACTED_DIR, file), 'utf-8');
    
    // Determine if epub or PDF based on content
    const isEpub = text.includes('=== CHAPTER');
    let chapters = isEpub ? extractChaptersFromEpub(text) : extractChaptersFromPdf(text);
    
    console.log(`  Found ${chapters.length} chapters`);
    
    // Generate book JSON
    const bookJson = generateBookJson(bookKey, chapters);
    if (bookJson) {
      fs.writeFileSync(existingBook, JSON.stringify(bookJson, null, 2));
      console.log(`  Created ${meta.id}.json`);
    }
    
    // Generate chapters JSON
    const chapterObjects = chapters.map(ch => generateChapterSummary(ch, meta.title));
    const chaptersJson = { chapters: chapterObjects };
    fs.writeFileSync(existingChapters, JSON.stringify(chaptersJson, null, 2));
    console.log(`  Created ${meta.id}.chapters.json`);
  }
  
  console.log('Done!');
}

processAllBooks().catch(console.error);