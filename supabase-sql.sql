create table if not exists public.books (
  id uuid default uuid_generate_v4() primary key,
  slug text unique not null,
  title text not null,
  author text not null,
  category text not null,
  cover_url text,
  cover_gradient text[],
  key_points_count integer default 6,
  duration_min integer,
  insights_count integer default 3,
  description text,
  "order" integer default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()),
  updated_at timestamp with time zone default timezone('utc'::text, now())
);

alter table public.books enable row level security;

create table if not exists public.chapters (
  id uuid default uuid_generate_v4() primary key,
  book_id uuid references public.books(id) on delete cascade not null,
  title text not null,
  summary text,
  takeaway text,
  "order" integer default 0,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

alter table public.chapters enable row level security;

create table if not exists public.insights (
  id uuid default uuid_generate_v4() primary key,
  book_id uuid references public.books(id) on delete cascade not null,
  title text not null,
  content text not null,
  "order" integer default 0,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

alter table public.insights enable row level security;

create index if not exists idx_chapters_book_id on public.chapters(book_id);
create index if not exists idx_insights_book_id on public.insights(book_id);

insert into public.books (slug, title, author, category, cover_url, cover_gradient, key_points_count, duration_min, insights_count, description, "order") values
('zero-to-one', 'Zero to One', 'Peter Thiel with Blake Masters', 'business', '/covers/zero-to-one.jpg', ARRAY['#1B3A6B', '#2F5FF6'], 6, 18, 3, 'Notes on startups, or how to build the future -- Thiel''s contrarian case that real progress comes from creating something new, not copying what works.', 1);

insert into public.books (slug, title, author, category, cover_url, cover_gradient, key_points_count, duration_min, insights_count, description, "order") values
('rework', 'Rework', 'Jason Fried & David Heinemeier Hansson', 'business', '/covers/rework.jpg', ARRAY['#F5B301', '#FF8A3D'], 6, 16, 3, 'The anti-startup playbook from the founders of Basecamp -- why planning is guessing, meetings are toxic, and small profitable businesses beat funded gambles.', 2);

insert into public.books (slug, title, author, category, cover_url, cover_gradient, key_points_count, duration_min, insights_count, description, "order") values
('start-with-why', 'Start With Why', 'Simon Sinek', 'business', '/covers/start-with-why.jpg', ARRAY['#0EA5E9', '#22D3EE'], 6, 17, 3, 'Great leaders and organizations start with purpose. Sinek''s Golden Circle explains why some inspire loyalty while others rely on manipulation.', 3);

insert into public.books (slug, title, author, category, cover_url, cover_gradient, key_points_count, duration_min, insights_count, description, "order") values
('tiny-habits', 'Tiny Habits', 'BJ Fogg', 'productivity', '/covers/tiny-habits.jpg', ARRAY['#35C48B', '#2DB6A3'], 6, 15, 3, 'Stanford behavior scientist BJ Fogg shows how to change your life by starting absurdly small -- no willpower required.', 4);

insert into public.books (slug, title, author, category, cover_url, cover_gradient, key_points_count, duration_min, insights_count, description, "order") values
('intelligent-investor', 'The Intelligent Investor', 'Benjamin Graham', 'money', '/covers/intelligent-investor.jpg', ARRAY['#92400E', '#F59E0B'], 6, 20, 3, 'The value-investing bible -- Graham''s timeless philosophy of margin of safety, Mr. Market, and temperament over technique.', 5);

insert into public.books (slug, title, author, category, cover_url, cover_gradient, key_points_count, duration_min, insights_count, description, "order") values
('diamonds-in-the-dust', 'Diamonds in the Dust', 'Saurabh Mukherjea, Rakshit Ranjan & Salil Desai', 'money', '/covers/diamonds-in-the-dust.jpg', ARRAY['#334155', '#94A3B8'], 6, 19, 3, 'Consistent compounding for extraordinary wealth creation -- Marcellus''s system for finding clean-account, cash-rich Indian franchises and holding them for decades.', 6);

insert into public.books (slug, title, author, category, cover_url, cover_gradient, key_points_count, duration_min, insights_count, description, "order") values
('principles-changing-world-order', 'Principles for Dealing with the Changing World Order', 'Ray Dalio', 'money', '/covers/principles-changing-world-order.jpg', ARRAY['#7C2D12', '#DC8C4A'], 6, 22, 3, 'Dalio studies 500 years of empires to model how nations rise and fall -- debt cycles, internal conflict, and great-power rivalry shaping everything.', 7);

insert into public.books (slug, title, author, category, cover_url, cover_gradient, key_points_count, duration_min, insights_count, description, "order") values
('the-big-short', 'The Big Short', 'Michael Lewis', 'personalities', '/covers/the-big-short.jpg', ARRAY['#111827', '#374151'], 6, 21, 3, 'Inside the Doomsday Machine -- the true story of the misfits who read subprime''s fine print, bet against the housing bubble, and won billions.', 8);

insert into public.books (slug, title, author, category, cover_url, cover_gradient, key_points_count, duration_min, insights_count, description, "order") values
('business-adventures', 'Business Adventures', 'John Brooks', 'business', '/covers/business-adventures.jpg', ARRAY['#166534', '#65A30D'], 6, 24, 3, 'Twelve classic tales from Wall Street -- the Edsel, the 1962 flash crash, Xerox, Piggly Wiggly -- proving markets never change, only their costumes.', 9);

insert into public.books (slug, title, author, category, cover_url, cover_gradient, key_points_count, duration_min, insights_count, description, "order") values
('strategy-beyond-hockey-stick', 'Strategy Beyond the Hockey Stick', 'Chris Bradley, Martin Hirt & Sven Smit', 'business', '/covers/strategy-beyond-hockey-stick.jpg', ARRAY['#1E40AF', '#38BDF8'], 6, 23, 3, 'McKinsey''s data study of 2,393 companies reveals why most strategic plans show hockey sticks that never happen -- and the big moves that actually shift the odds.', 10);

insert into public.books (slug, title, author, category, cover_url, cover_gradient, key_points_count, duration_min, insights_count, description, "order") values
('capital-allocators', 'Capital Allocators', 'Ted Seides', 'money', '/covers/capital-allocators.jpg', ARRAY['#312E81', '#818CF8'], 6, 18, 3, 'How the world''s elite money managers lead and invest -- alignment, process, sizing, and relationships distilled from hundreds of top-manager interviews.', 11);

insert into public.books (slug, title, author, category, cover_url, cover_gradient, key_points_count, duration_min, insights_count, description, "order") values
('mckinsey-mind', 'The McKinsey Mind', 'Ethan M. Rasiel & Paul N. Friga', 'productivity', '/covers/mckinsey-mind.jpg', ARRAY['#1F2937', '#6B7280'], 6, 17, 3, 'The problem-solving tools of the world''s top strategic consulting firm -- MECE structuring, ruthless prioritization, and answer-first communication.', 12);

insert into public.books (slug, title, author, category, cover_url, cover_gradient, key_points_count, duration_min, insights_count, description, "order") values
('confessions-advertising-man', 'Confessions of an Advertising Man', 'David Ogilvy', 'marketing', '/covers/confessions-advertising-man.jpg', ARRAY['#7F1D1D', '#EF4444'], 6, 16, 3, 'The advertising legend''s candid manual -- research before inspiration, brand image as long-term capital, headlines that sell, and leadership without politics.', 13);

insert into public.books (slug, title, author, category, cover_url, cover_gradient, key_points_count, duration_min, insights_count, description, "order") values
('adweek-copywriting-handbook', 'The Adweek Copywriting Handbook', 'Joseph Sugarman', 'marketing', '/covers/adweek-copywriting-handbook.jpg', ARRAY['#0C4A6E', '#0EA5E9'], 6, 15, 3, 'Direct-marketing master Joseph Sugarman teaches copy that pulls readers sentence by sentence toward the sale -- emotion first, proof second, offer third.', 14);

insert into public.books (slug, title, author, category, cover_url, cover_gradient, key_points_count, duration_min, insights_count, description, "order") values
('22-immutable-laws-marketing', 'The 22 Immutable Laws of Marketing', 'Al Ries & Jack Trout', 'marketing', '/covers/22-immutable-laws-marketing.jpg', ARRAY['#78350F', '#F97316'], 6, 14, 3, 'Violate them at your own risk -- Ries and Trout''s ruthless laws about perception, focus, line extension, and why being first beats being better.', 15);

insert into public.books (slug, title, author, category, cover_url, cover_gradient, key_points_count, duration_min, insights_count, description, "order") values
('bhagavad-gita', 'Bhagavad Gita', 'Swami Mukundananda (trans.)', 'spirituality', '/covers/bhagavad-gita.jpg', ARRAY['#B45309', '#FBBF24'], 6, 25, 3, 'The Song of God -- Krishna''s battlefield counsel to Arjuna on action without attachment, the eternal self, and mastery of the restless mind.', 16);