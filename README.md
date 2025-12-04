# Daily AI + World News Briefing (Supabase + OpenAI + Resend)

This project automates a daily briefing combining AI updates and world news. It uses Supabase Edge Functions, pg_cron, OpenAI, and Resend to fetch updates and send an email summarizing the top AI developments and key US/global stories. The system runs entirely in the cloud with no servers to manage.

## Overview

1. A pg_cron job triggers an Edge Function.
2. The Edge Function calls OpenAI with a prompt for AI and news sections.
3. The function sends the combined briefing via Resend to an email address.

## Tech Stack

- **Supabase**: Edge Functions, pg_cron, pg_net
- **OpenAI API**: Chat Completions endpoint
- **Resend**: Email API
- **TypeScript**: Function implementation

Refer to other files in this repo for the function code, SQL schedule, and environment variables example.
