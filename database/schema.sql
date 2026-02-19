-- 1. Create a table for Public User Profiles (Global)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    username TEXT UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Create Workspaces table
CREATE TABLE IF NOT EXISTS public.workspaces (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Create Workspace Members table (The true "game" stats of a user in a specific workspace)
CREATE TABLE IF NOT EXISTS public.workspace_members (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    workspace_id UUID REFERENCES public.workspaces(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    role TEXT DEFAULT 'member' CHECK (role IN ('owner', 'admin', 'member')),
    xp INTEGER DEFAULT 0,
    level INTEGER DEFAULT 1,
    coins INTEGER DEFAULT 0,
    streak_days INTEGER DEFAULT 0,
    chests_available INTEGER DEFAULT 0,
    chests_opened INTEGER DEFAULT 0,
    last_active_date DATE,
    joined_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(workspace_id, user_id)
);

-- 4. Create Tasks table
CREATE TABLE IF NOT EXISTS public.tasks (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    workspace_id UUID REFERENCES public.workspaces(id) ON DELETE CASCADE,
    created_by UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    assigned_to UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    title TEXT NOT NULL,
    description TEXT,
    category TEXT DEFAULT 'daily' CHECK (category IN ('daily', 'weekly', 'goal', 'event')),
    difficulty TEXT DEFAULT 'medium' CHECK (difficulty IN ('easy', 'medium', 'hard', 'epic')),
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed')),
    base_xp INTEGER DEFAULT 10,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    completed_at TIMESTAMP WITH TIME ZONE
);

-- 5. Items Dictionary (Global Catalog of available items/cosmetics)
CREATE TABLE IF NOT EXISTS public.items (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    rarity TEXT DEFAULT 'common' CHECK (rarity IN ('common', 'uncommon', 'rare', 'epic', 'legendary', 'mythic')),
    type TEXT DEFAULT 'cosmetic' CHECK (type IN ('cosmetic', 'consumable', 'title', 'theme')),
    image_url TEXT
);

-- 6. Player Inventory (What items a user has)
CREATE TABLE IF NOT EXISTS public.inventories (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    item_id UUID REFERENCES public.items(id) ON DELETE CASCADE,
    quantity INTEGER DEFAULT 1,
    acquired_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(user_id, item_id)
);

-- === ROW LEVEL SECURITY (RLS) ===

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workspaces ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workspace_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inventories ENABLE ROW LEVEL SECURITY;

-- Profiles: Anyone can read, but only the user can update their own profile.
CREATE POLICY "Public profiles are viewable by everyone." ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can insert their own profile." ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can update own profile." ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Helper function to avoid infinite recursion on workspace_members RLS
CREATE OR REPLACE FUNCTION public.get_my_workspaces()
RETURNS SETOF uuid AS $$
  SELECT workspace_id FROM public.workspace_members WHERE user_id = auth.uid();
$$ LANGUAGE sql SECURITY DEFINER;

-- Workspaces: Users can only see workspaces they are a member of
CREATE POLICY "Users can view their workspaces" ON public.workspaces FOR SELECT USING (
    id IN (SELECT public.get_my_workspaces())
);
CREATE POLICY "Users can create workspaces" ON public.workspaces FOR INSERT WITH CHECK (true);

-- Workspace Members: Users can view members of their workspaces
CREATE POLICY "Users can view members of their workspaces" ON public.workspace_members FOR SELECT USING (
    workspace_id IN (SELECT public.get_my_workspaces())
);
-- Allow users to join a workspace
CREATE POLICY "Users can insert themselves into workspaces" ON public.workspace_members FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Tasks: Users can view and update tasks in their workspaces
CREATE POLICY "Users can view tasks in their workspaces" ON public.tasks FOR SELECT USING (
    workspace_id IN (SELECT public.get_my_workspaces())
);
CREATE POLICY "Users can insert tasks in their workspaces" ON public.tasks FOR INSERT WITH CHECK (
    workspace_id IN (SELECT public.get_my_workspaces())
);
CREATE POLICY "Users can update tasks in their workspaces" ON public.tasks FOR UPDATE USING (
    workspace_id IN (SELECT public.get_my_workspaces())
);
CREATE POLICY "Users can delete tasks in their workspaces" ON public.tasks FOR DELETE USING (
    workspace_id IN (SELECT public.get_my_workspaces())
);

-- Items: Catalog is public
CREATE POLICY "Items are viewable by everyone" ON public.items FOR SELECT USING (true);

-- Inventory: Users can only see and update their own inventory
CREATE POLICY "Users can view their own inventory" ON public.inventories FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update their own inventory" ON public.inventories FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert into their own inventory" ON public.inventories FOR INSERT WITH CHECK (auth.uid() = user_id);

-- === TRIGGERS ===
-- Trigger to automatically create a profile when a new user signs up in Supabase Auth
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, username)
  VALUES (new.id, new.email);
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- === PHASE 2 ===

-- 7. Economy Transactions
CREATE TABLE IF NOT EXISTS public.transactions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    workspace_id UUID REFERENCES public.workspaces(id) ON DELETE CASCADE,
    amount INTEGER NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('earned', 'spent', 'reward')),
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 8. Black Market / Shop
CREATE TABLE IF NOT EXISTS public.shop (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    item_id UUID REFERENCES public.items(id) ON DELETE CASCADE,
    price INTEGER NOT NULL,
    stock INTEGER DEFAULT -1,
    available_until TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shop ENABLE ROW LEVEL SECURITY;

-- Transactions: Users can view their own transactions
CREATE POLICY "Users can view their own transactions" ON public.transactions FOR SELECT USING (auth.uid() = user_id);
-- No manual insert policy for transactions, only the backend can insert using Service Role.

-- Shop: Anyone can view the shop items
CREATE POLICY "Shop is viewable by everyone" ON public.shop FOR SELECT USING (true);
-- No manual insert/update policy for shop, only backend Service Role.
