-- Add count_num_posts column to users table for daily post generation tracking
alter table public.users
add column if not exists count_num_posts integer default 0;
