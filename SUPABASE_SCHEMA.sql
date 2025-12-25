-- Create transactions table
create table transactions (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users(id) not null,
  type varchar(20) not null check (type in ('income', 'expense', 'transfer')),
  category varchar(50) not null,
  amount decimal(10,2) not null,
  description text,
  date timestamp with time zone default now(),
  from_wallet_id uuid,
  to_wallet_id uuid,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Create budgets table
create table budgets (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users(id) not null,
  category varchar(50) not null,
  limit_amount decimal(10,2) not null,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Create wallets table
create table wallets (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users(id) not null,
  name varchar(100) not null,
  type varchar(50) not null,
  balance decimal(10,2) default 0,
  initial_balance decimal(10,2) default 0,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Create indexes for better performance
create index idx_transactions_user_id on transactions(user_id);
create index idx_transactions_date on transactions(date);
create index idx_budgets_user_id on budgets(user_id);
create index idx_wallets_user_id on wallets(user_id);

-- Set up Row Level Security (RLS)
alter table transactions enable row level security;
alter table budgets enable row level security;
alter table wallets enable row level security;

-- Create policies
create policy "Users can view their own transactions" on transactions
  for select using (auth.uid() = user_id);

create policy "Users can insert their own transactions" on transactions
  for insert with check (auth.uid() = user_id);

create policy "Users can update their own transactions" on transactions
  for update using (auth.uid() = user_id);

create policy "Users can delete their own transactions" on transactions
  for delete using (auth.uid() = user_id);

create policy "Users can view their own budgets" on budgets
  for select using (auth.uid() = user_id);

create policy "Users can insert their own budgets" on budgets
  for insert with check (auth.uid() = user_id);

create policy "Users can update their own budgets" on budgets
  for update using (auth.uid() = user_id);

create policy "Users can delete their own budgets" on budgets
  for delete using (auth.uid() = user_id);

create policy "Users can view their own wallets" on wallets
  for select using (auth.uid() = user_id);

create policy "Users can insert their own wallets" on wallets
  for insert with check (auth.uid() = user_id);

create policy "Users can update their own wallets" on wallets
  for update using (auth.uid() = user_id);

create policy "Users can delete their own wallets" on wallets
  for delete using (auth.uid() = user_id);