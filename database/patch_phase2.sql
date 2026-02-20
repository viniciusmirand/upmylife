-- QuestForge Phase 2 Database Patch (Run this in the Supabase SQL Editor)

-- 1. Add missing Gamification Columns to workspace_members
ALTER TABLE public.workspace_members
    ADD COLUMN IF NOT EXISTS coins INTEGER DEFAULT 0,
    ADD COLUMN IF NOT EXISTS streak_days INTEGER DEFAULT 0,
    ADD COLUMN IF NOT EXISTS chests_available INTEGER DEFAULT 0,
    ADD COLUMN IF NOT EXISTS chests_opened INTEGER DEFAULT 0,
    ADD COLUMN IF NOT EXISTS last_active_date DATE;

-- 2. Create the Transactions Table for the Economy
CREATE TABLE IF NOT EXISTS public.transactions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    workspace_id UUID REFERENCES public.workspaces(id) ON DELETE CASCADE,
    amount INTEGER NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('earned', 'spent', 'reward')),
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Create the Shop/Black Market Table
CREATE TABLE IF NOT EXISTS public.shop (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    item_id UUID REFERENCES public.items(id) ON DELETE CASCADE,
    price INTEGER NOT NULL,
    stock INTEGER DEFAULT -1,
    available_until TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Set row level security (RLS) for the new tables
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shop ENABLE ROW LEVEL SECURITY;

-- Transactions: Users can view their own transactions
CREATE POLICY "Users can view their own transactions" ON public.transactions FOR SELECT USING (auth.uid() = user_id);

-- Shop: Anyone can view the shop items
CREATE POLICY "Shop is viewable by everyone" ON public.shop FOR SELECT USING (true);
