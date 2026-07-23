# Supabase setup — one-time manual steps

These steps run inside the Supabase dashboard for your project. Do them once, in order.

## 1. Run the schema

1. Open your project at [supabase.com](https://supabase.com/dashboard).
2. Left sidebar → **SQL Editor** → **New query**.
3. Open [`migrations/0001_init.sql`](migrations/0001_init.sql), copy its entire contents, paste into the editor.
4. Click **Run**.

This creates all five tables (products, categories, journal_posts, testimonials, enquiries), locks them down with Row Level Security, and creates a public `media` storage bucket for photos.

## 2. Turn off public sign-up

This is important — without it, anyone could create an account and get admin access.

1. Left sidebar → **Authentication** → **Providers** → **Email**.
2. Turn **off** "Allow new users to sign up".
3. Save.

## 3. Create your one admin account

1. Left sidebar → **Authentication** → **Users** → **Add user** → **Create new user**.
2. Enter the email and password you'll use to log into `/admin` on the live site.
3. Leave "Auto Confirm User" checked so you don't need to click an email link.

## 4. Get your API credentials

1. Left sidebar → **Project Settings** (gear icon) → **API**.
2. Copy the **Project URL** and the **anon / public** key.
3. Send both to me — I'll add them to the project.

Never share the **service_role** key — it's not needed for this project, and it bypasses every security rule above.
