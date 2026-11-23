# Qasthra Security Notes (Supabase)

Last updated: 2026-11-24. No secret values are stored in this file.
Items marked **[confirm]** were not verified by me. Check them in the dashboard.

## 1. Setup at a glance

| Item | Value |
|---|---|
| Project | Qasthra (main, production) |
| Project ref | hwffsxhonbymzwomhoyd |
| Plan | Free |
| Front end | Static site (html, css, js), Supabase client with the publishable key |
| Login door | Edge Function `sign-in`, version 6, ACTIVE, verify_jwt on (the only way to sign in or create an account) |
| Human check | Cloudflare Turnstile, verified inside the Edge Function |
| Native Supabase CAPTCHA | Off (the Edge Function does it) |
| Email confirmation | Off (accounts use a hidden address `qasthra+USERNAME@gmail.com`) |

## 2. How sign-in and sign-up work

1. The page sends email, password and a Turnstile token to the `sign-in` function.
2. The function checks the Turnstile token and returns a **pass** (valid 10 minutes, only for the IP that solved it).
3. IP limits: 40 tries per 5 minutes per IP. Sign-ups: 5 per hour per IP.
4. **Sign-in:** each try is counted first. Five wrong tries lock that account for 15 minutes. Each wrong guess adds a pause (0.4 s, 0.8 s, 1.6 s, 3.2 s, 4 s). A correct login clears the count.
5. **Sign-up:** the function checks the email shape, password length (8 to 72), the recovery email domain and the allowed profile fields. It creates the user with the admin API, then signs them in.
6. The real visitor IP is forwarded to Supabase Auth (`sb-forwarded-for`, secret key only) so rate limits apply per visitor, not to the whole site.

Secret and setting names the function reads: `SUPABASE_URL`, `SUPABASE_PUBLISHABLE_KEYS`, `SUPABASE_SECRET_KEYS`, `TURNSTILE_SECRET`. Never paste their values anywhere.

## 3. Dashboard settings

| Setting | Wanted value | Status |
|---|---|---|
| Authentication > Rate Limits > IP address forwarding | On | Confirmed by you |
| Sign-ups and sign-ins rate limit | 10 requests / 5 min per IP | Confirmed by you (was 30) |
| Allow new users to sign up | Off (accounts are made only by the function) | Turned off by you. Sign-up through the site still needs a test. |
| Email confirmation | Off | Confirmed |
| Native CAPTCHA protection | Off | Confirmed |

Other rate limits (as screenshotted): emails 2/h, SMS 30/h, token refresh 150 per 5 min, token verifications 30 per 5 min, anonymous sign-ins 30/h, Web3 30 per 5 min.

Order matters: forwarding on first, then lower the limit. Otherwise every visitor shares the function's IP and the whole site is capped.

## 4. Database tables (all have Row Level Security on)

| Table | Purpose | Visitor access |
|---|---|---|
| `contact_messages` | Contact form | Insert only |
| `support_suggestions` | Support form | Insert only |
| `profiles` | User profile | Signed-in user reads and updates only their own row |
| `sites` | Site list | Rule says anyone can read, but no read permission is granted, so reads fail (to fix) |
| `login_attempts` | Wrong-password counter | None (function only) |
| `rate_hits` | IP and username-check counters | None (function only) |
| `worlds_open` | Saved worlds | Rule limits rows to the signed-in owner (`auth.uid() = user_id`), but no table permissions are granted yet and it has 0 rows |

The older `script.js` I was given uses `worlds_saved` and `worlds_history`. Neither exists in the database. The real table is `worlds_open`, which has no grants, so saving worlds through the database cannot work until grants are added **[confirm which script.js is live]**.

Column permissions (verified 2026-11-24):
- `contact_messages`: visitors may insert only name, email, phone, message.
- `support_suggestions`: visitors may insert only name, email, phone, kind, link, message.
- `profiles`: signed-in users read their own row; they may change only `avatar_url` and `display_name`.
- Leftover `maintain`, `references`, `trigger` and `truncate` powers were revoked from `login_attempts`, `sites` and `worlds_open`.

## 5. Rules on the forms (database side)

- Email: at most 120 characters, and must end in gmail.com, yahoo.com, outlook.com, hotmail.com, icloud.com or proton.me.
- Message: 5 to 1000 characters. Name: 1 to 60 characters. Neither may contain `< > { } [ ] ` ``.
- Phone: `+` optional, then 7 to 20 digits, spaces or dashes.
- Support link: must start with `https://github.com/`. Support kind: one of 12 fixed values.
- These rules apply to new rows only (`NOT VALID`).
- Spam guard trigger on both tables: 60 rows per minute in total, 5 per email per 10 minutes.

## 6. Database functions

| Function | Notes |
|---|---|
| `login_fail(email)` | Counts a wrong try, 15-minute window, deletes rows older than a day. Server only. |
| `rate_hit(key, limit, seconds)` | Generic counter. Server only. |
| `username_exists(u)` | Public. Limited to 10 per minute per IP and 200 per minute overall. |
| `bump_site(site_id)` | Public. Adds one to a site's search count. Low risk, anyone can inflate it. |
| `guard_insert`, `handle_new_user`, `touch_profile` | Triggers. Public execute removed. |

## 7. What the page itself blocks (script.js)

- Contact, support and sign-up email: only the allowed domains, and you cannot type another one.
- Phone: digits and a leading `+` only, 8 to 15 digits, auto-formatted.
- Name: letters, spaces, `'` `.` `-`. GitHub link: locked to `https://github.com/`.
- Message and sign-up text fields: `< > { } [ ] ` ` and control characters are stripped while typing.
- The Send button stays disabled until the form is valid, and there is no red error text.
- These checks are for convenience. The database rules are the real protection.

## 8. Known gaps

1. Direct password guessing against Supabase's own login is still possible on the Free plan. It is slowed by IP limits only. A lock for every attempt needs the Teams plan (password verification hook).
2. A stranger can lock one username for 15 minutes with five wrong tries.
3. `bump_site` can be spammed. `username_exists` can still be used to guess usernames slowly.
4. CORS on the function is open (`*`). It is not a security boundary, but you can narrow it to your site's address.
5. The visitor IP comes from request headers. If Supabase changes them, IP limits get weaker but account locks still work.
6. The recovery email and phone are saved as typed. They are not verified.

## 9. Rollback

- Function broke: paste your saved copy of the old `index.ts` and press Deploy updates.
- Everyone gets blocked: set the sign-ups and sign-ins limit back to 30 and check that IP forwarding is on.
- Database rules too strict: `alter table public.contact_messages drop constraint contact_messages_chars_check;` (same for `support_suggestions`).

## 10. Checks you can run (SQL Editor, read-only)

```sql
-- policies
select tablename, policyname, cmd, roles from pg_policies where schemaname = 'public';
-- RLS on everywhere
select tablename, rowsecurity from pg_tables where schemaname = 'public';
-- who can run what
select routine_name, grantee from information_schema.routine_privileges
  where routine_schema = 'public' and grantee in ('anon', 'authenticated', 'PUBLIC');
-- recent counters
select key, count(*) from public.rate_hits group by key order by 2 desc limit 10;
select * from public.login_attempts order by first_fail desc limit 10;
```

## 11. When you change things

- Add an email domain: edit it in three places: `DOMAINS` in script.js, the two email rules in the database, and the function's recovery email list.
- Change the lock time: edit `WIN` in the function and the `15 minutes` in `login_fail`. They must match.
- Never put the secret key, the Turnstile secret or any password in script.js, the repo or chat.

## 12. Security Advisor findings (verified 2026-11-24)

| Finding | Meaning | Action |
|---|---|---|
| RLS Enabled No Policy | `login_attempts` and `rate_hits` have no policy on purpose. Only the server function reaches them. | None |
| Public / Signed-in can run a SECURITY DEFINER function | `username_exists` is meant to be public and is rate limited. `bump_site` is public and can be spammed. | Accepted, low risk |
| Leaked Password Protection Disabled | Supabase's check against known leaked passwords. It needs a paid plan. | Not available on Free. The function requires 8 or more characters. |

## 13. Still to verify

- Test a new sign-up through the site now that sign-ups are off. It should still work, because the function creates accounts.
- Test the sign-in and sign-up flow end to end once (right password, wrong password, new account).
- Whether `sites` reads and world saving work on the live site, and which table names the live `script.js` uses. `sites` has a read rule but no read permission, and `worlds_open` has no permissions yet.
