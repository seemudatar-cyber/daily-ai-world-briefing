-- sql/cron_schedule.sql
-- Supabase pg_cron job that calls the daily-brief Edge Function once per day.

-- Prereqs (run once per project):
-- create extension if not exists pg_cron with schema extensions;
-- create extension if not exists pg_net with schema extensions;

select
  cron.schedule(
    'daily_ai_world_brief',
    -- Cron syntax: minute hour day-of-month month day-of-week (UTC).
    -- Example below = 15:30 UTC every day (~7:30 am Pacific).
    '30 15 * * *',
    $$
    select
      net.http_post(
        url := 'https://YOUR_PROJECT_REF.supabase.co/functions/v1/daily-brief',
        headers := jsonb_build_object(
          'Content-Type', 'application/json',
          'apikey', 'YOUR_ANON_KEY',
          'Authorization', 'Bearer YOUR_ANON_KEY'
        ),
        body := jsonb_build_object('triggered_at', now())
      );
    $$
  );
