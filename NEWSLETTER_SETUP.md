# AUVD News — Setup Guide (Resend)

This guide is for you, the person who publishes the news. It explains how to
set the newsletter up **once**, and then how to publish news afterwards without
opening any dashboard.

**How it works, in one paragraph:** visitors subscribe through the "Stay
Connected" form in the footer. Their address is saved as a Resend contact, and
they are opted in to the Resend *Topic* for each box they ticked. When you
publish news, you add an item to `src/data/news.json` and push to GitHub.
Vercel rebuilds the site, GitHub Actions notices the deployment finished, and a
script emails your new item to exactly the people who asked for that topic —
once, and never twice.

There is **no confirmation email**. Someone who fills in the form and presses
Submit is subscribed immediately. Every email carries an unsubscribe link that
Resend manages for you.

Nothing here needs a database, a server you maintain, or a Resend login after
the initial setup.

---

## Part A — Things only you can do (one time)

### 1. Create a free Resend account

1. Go to <https://resend.com> and click **Sign Up**. The free plan (3,000
   emails a month, 100 a day) is enough to get started.
2. Verify your email address, then log in.

### 2. Add and verify your sending domain

Resend will only send from a domain you have proved you own. This is the step
that decides whether your mail lands in the inbox or in spam.

1. Go to **Domains** in the Resend dashboard and click **Add Domain**.
2. Enter your domain — for example `yourdomain.org`. (Not the `https://` and
   not a path.)
3. Resend shows you the exact DNS records to create. **Copy the values from
   the Resend dashboard** — they are generated per account, and the exact host,
   name and value are not something to guess at or copy from this document.
   You will normally be asked for some combination of:
   - a **TXT** record (domain verification / SPF)
   - a **CNAME** record or two (DKIM)
   - an **MX** record (if Resend asks you to route mail for the subdomain)
4. Create those records at your DNS host (GoDaddy, Namecheap, Cloudflare, your
   registrar's panel — wherever your domain's DNS is managed).
5. Back in Resend, the domain moves to **Verified**. This can take a few
   minutes, occasionally up to an hour while DNS propagates.

**You cannot send anything until this shows Verified.**

You can test before finishing: Resend lets you send to your own address using
`onboarding@resend.dev` as the sender, which needs no domain at all. That is a
good way to check the wording while you sort the DNS out.

### 3. Create a Resend API key

1. Go to **API Keys** in the Resend dashboard.
2. Click **Create API Key**.
3. Name it something like `auvd-website`, with **Full access**. (The newsletter
   scripts also create topics, segments and broadcasts, so read-only or
   sending-only access is not enough.)
4. **Copy the key immediately** — Resend shows it only once. It starts with
   `re_`. Keep it somewhere safe; you will paste it into Vercel and GitHub in
   the next steps. Do not put it in the code and do not commit it.

### 4. Run the one-time setup script

This creates four Resend **Topics** (one per newsletter topic) and one
**Segment** called `AUVD News`, and writes their ids into
`src/data/resend-config.json`. It is safe to run twice.

1. Create a file called `.env.local` in the project root (create it if it does
   not exist) containing:

   ```
   RESEND_API_KEY=re_your-real-key-here
   ```

   `.env.local` is already ignored by `.gitignore` (the `*.local` rule), so the
   key is never committed. Double-check that before you continue.

2. Run:

   ```
   npm run news:setup
   ```


### 5. Set the environment variables in Vercel

1. Open your project in Vercel → **Settings** → **Environment Variables**.
2. Make sure the environment is set to **Production**.
3. Add all three:

   | Name | Value | Secret? |
   | --- | --- | --- |
   | `RESEND_API_KEY` | the `re_...` key you copied in step 3 | **Yes** |
   | `RESEND_FROM` | `AUVD News <news@yourdomain.org>` | No |
   | `SITE_URL` | your public site address, e.g. `https://auvd.org` — **no trailing slash** | No |

   `RESEND_FROM` must use an address on the domain you verified in step 2. The
   part before the angle brackets is the name subscribers see.
4. Click **Save** for each one, then **redeploy** the site so the new variables
   take effect. Editing a variable does not restart a running deployment.

> Never prefix any of these with `VITE_`. Anything named `VITE_*` is bundled
> into the JavaScript that every visitor downloads, which would publish your API
> key to the whole internet.

### 6. Set the environment variables in GitHub

The GitHub Action that sends the news runs separately from Vercel, so it needs
its own copy.

1. Open your repository on GitHub → **Settings** → **Secrets and variables** →
   **Actions**.
2. On the **Secrets** tab, add:
   - `RESEND_API_KEY` — the same key as before.
3. On the **Variables** tab, add:
   - `RESEND_FROM` — for example `AUVD News <news@yourdomain.org>`.
   - `SITE_URL` — your public site address, no trailing slash.
4. Click **Save** for each one.

You can check that the site sees its variables by opening
`https://yourdomain.org/api/health`. It prints `true` or `false` for each
variable and never prints their values. If something is `false`, that name is
missing or was added to the wrong environment. **Delete `api/health.js` once
everything works.**

---

## Part B — Publishing news (the part you do often)

### Add your article

Open `src/data/news.json` and add an object to the `items` array:

```json
{
  "id": "2026-09-community-music-grant",
  "topic": "music",
  "date": "2026-09-15",
  "image": "/news/my-photo.jpg",
  "imageAlt": {
    "en": "Children playing drums outdoors",
    "fr": "Des enfants jouant des batterie en plein air"
  },
  "title": {
    "en": "English title",
    "fr": "Titre en français"
  },
  "body": {
    "en": ["First paragraph.", "Second paragraph."],
    "fr": ["Premier paragraphe.", "Deuxième paragraphe."]
  },
  "notify": true
}
```

Field rules:

| Field | Rule |
| --- | --- |
| `id` | **Permanent and unique.** Never edit or reuse one. A changed id re-sends old news to people, and a duplicate id fails the check. |
| `topic` | One of `education`, `music`, `dance`, `vocational`. This decides who gets the email. |
| `date` | `YYYY-MM-DD`. |
| `image` | Optional. Must start with `/` and the file must exist in `public/`. |
| `imageAlt` | Required if you set an image, in both languages. |
| `title` / `body` | Required in **both** English and French. `body` is an array of paragraphs. |
| `notify` | `true` to email it, `false` to publish it on `/news` only. |

### Check it

```
npm run news:check
```

This fails on a duplicate id, an unknown topic, a missing translation, a bad
date, or a missing image. Run it before every push — it is the same check the
GitHub Action runs, so a mistake is caught before any real mail goes out.

### Preview the email without sending it

```
npm run news:dry-run
```

Writes the exact HTML of every email that would be sent into
`email-previews/`. Open those files in a browser to check the wording and
layout. **No email is sent and nothing is created in Resend.**

### Publish

```
git add src/data/news.json src/data/resend-config.json
git commit -m "Add news: <short description>"
git push
```


---

## Part C — Test plan (do this once, after setup)

1. **Subscribe with your real email address.** Go to the live site, scroll to
   the footer, enter your address, tick one topic, and press Submit. You should
   see *"You're subscribed! You'll receive news about your chosen topics."*
   immediately — there is no confirmation email to wait for.
2. **Check Resend.** In the dashboard, **Contacts** should list your address
   within a few seconds, with the topic you ticked showing as opted in.
3. **Subscribe to a second topic with the same address.** You should end up
   opted in to both — signing up again adds, it does not replace.
4. **Add a news item** for that topic with `"notify": true`, then
   `npm run news:check`, commit and push.
5. **Wait for the deploy** (a few minutes). Check the GitHub Actions tab to
   confirm the run went green and see the recipient count.
6. **Check your inbox — and your spam folder.** Confirm the email arrived, that
   **Read more** jumps to the story, and that **Donate today** opens `/donate`.
   If it is in spam, mark it as not spam: that tells Gmail the sender is
   legitimate and helps the next one land properly.
7. **Test the unsubscribe link.** Click **Unsubscribe** at the bottom of the
   email. Resend opens a preference page where you can turn off that one topic
   or everything. Resend then marks your contact as unsubscribed
   automatically — there is no list to update by hand.
8. **Confirm it is respected.** Submit the footer form again with the same
   address. The site will say you are subscribed, but nothing will be written
   in Resend: the code deliberately leaves a contact who unsubscribed alone
   rather than silently resubscribing them. To start receiving mail again, tick
   the box back on the Resend preference page.
9. **Confirm nothing is sent twice.** Push another unrelated commit, or re-run
   the Action manually. The script sees the earlier broadcast in Resend and
   reports that everything eligible has already been emailed.

---

## Part D — Limits and things worth knowing

**Resend free plan**
- **3,000 emails a month, 100 a day.** The script prints a warning if one run
  would go over either. Resend will start refusing the surplus; the rest still
  go out. This is per account, not per site.
- Check your current usage under **Usage** in the Resend dashboard.

**Language**
- Each broadcast contains the English version followed by the French version,
  each under its own heading. Resend segments can only be given filter
  conditions through the dashboard, not the API, so there is no way to build
  "Music **and** language = French" audiences automatically. One bilingual
  email is the trade-off that keeps the whole setup to a single script.
- If you would rather have separate language emails, create the segments by
  hand in the Resend dashboard and change the script to target them.

**Existing subscribers**
- The old Brevo list was **not** migrated. Resend contacts only appear once
  somebody submits the form. To import an existing list, use
  **Contacts → Import** in the Resend dashboard and tick the matching topics
  for the imported contacts.

**Unsubscribes**
- The unsubscribe link is required by law and by the Gmail and Yahoo one-click
  sender rules. It is a Resend placeholder in the email template, and Resend
  also adds the required header. The email must keep it, or the message can be
  treated as spam.

**Spam complaints**
- A newsletter sent to people who did not ask for it is the fastest way to
  damage the sending reputation. If you ever import an old list, only import
  people who opted in with you.

---

## Troubleshooting

| Symptom | Cause and fix |
| --- | --- |
| The form says "Something went wrong" | Open `https://yourdomain.org/api/health`. Any variable showing `false` is missing from Vercel for **Production**. Redeploy after changing it. |
| `api/health` shows all `true` but signups still fail | The log line names the failing step. `a topic id is missing` means `npm run news:setup` has not been run, or `src/data/resend-config.json` was not committed. |
| Signup works, no email is ever sent | Check the item has `"notify": true` and is not `false`. Then check the **Actions** tab for a failed run. |
| Every run says "Everything eligible has already been emailed" | Working as intended. Each item is emailed once. Publish a **new** item with a **new** id. |
| Emails land in spam | The domain is almost certainly not verified yet — check **Domains** in Resend. Also mark a received email as "not spam" so the next one is trusted. |
| A broadcast says 0 recipients | Nobody is opted in to that topic yet, so it is saved as a draft. The ids are still recorded, so that news will not be sent later to people who subscribe after the fact. |
| Resend rejects the key (401) | The key is wrong, revoked, or lacks access. Create a new one with full access. |

Vercel rebuilds and redeploys. When the production deployment reports success,
the GitHub Action runs on its own and emails your new item. You do not have to
press anything.

### See what the Action did

GitHub → your repository → the **Actions** tab → **Send news emails**. It can
also be run by hand from there, and a manual run defaults to a dry run — a real
send needs the **dry_run** checkbox ticked off.

3. It prints the ids it created. **Commit `src/data/resend-config.json`** —
   those ids are not secrets, and both the site and the email script read them
   from there.

> **Why Topics?** A Resend Topic is how Resend itself records "which topics did
> this person tick". Opting in is additive, so somebody who subscribes to Music
> and later ticks Dance ends up subscribed to both rather than losing Music.
> It also drives the preference page a contact sees after clicking unsubscribe.
>
> The four topics are created with their default set to **opt-out** on purpose.
> That means "only people who explicitly ticked this box", which is what the
> footer form does. If they were opt-in, the first broadcast would go to every
> contact in the account.
