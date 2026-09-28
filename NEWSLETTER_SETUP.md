# AUVD News — Setup Guide

This guide is for you, the person who publishes the news. It explains how to
set the newsletter up **once**, and then how to publish news afterwards without
opening any dashboard.

**How it works, in one paragraph:** visitors subscribe through the "Stay
Connected" form in the footer. Their address goes into a Brevo list for the
topic and language they picked. When you publish news, you add an item to
`src/data/news.json` and push to GitHub. Vercel rebuilds the site, GitHub
Actions notices the deployment finished, and a script emails your new item to
exactly the people who asked for that topic — once, and never twice.

Nothing here needs a database, a server you maintain, or a Brevo login after
the initial setup.

---

## Part A — Things only you can do (one time)

### 1. Create a free Brevo account

1. Go to <https://www.brevo.com> and click **Sign up**. The free plan is enough
   to get started.
2. Verify your email address, then log in.
3. Go to **Account → Senders & Domains → SMTP & API** and add the address you
   want to send from (for example `news@yourdomain.org`).
4. Click the verification email Brevo sends you to finish confirming it.
   **You cannot send anything until this is done.**
5. Go to **Account → Sender information** and fill in the organization's
   postal address. Marketing emails are legally required to show a real
   physical address, and Brevo will not send without it.

### 2. Create a Brevo API key

1. Go to **SMTP & API → API Keys**.
2. Click **Generate a new API key**.
3. Give it a name such as `auvd-website`.
4. **Copy the key immediately** — Brevo shows it only once. Keep it somewhere
   safe; you will paste it into Vercel in step 4. Do not put it in the code.

### 3. Create a double opt-in template and note its ID

A "double opt-in" means Brevo emails the visitor a confirmation link first.
Nobody is added to your list until they click that link. This is the
anti-spam, legally-safer option, and it is what keeps your sending reputation
good.

1. Go to **Automation → Templates**, then **Create template → Design your own**.
2. Choose the **HTML** content type.
3. Write your email. Here is the exact text to use — the English paragraph
   first, then the French paragraph. Both visitors get the same email, so they
   can pick the language they read:

   > **Subject:** Please confirm your AUVD news subscription / Merci de confirmer votre abonnement aux actualités d'AUVD
   >
   > Hello,
   >
   > Thank you for subscribing to news from Art and Unity for Vulnerable
   > Development (AUVD). Please confirm your subscription by clicking the link
   > below. You will only receive news about the programs you chose.
   >
   > Bonjour,
   >
   > Merci de vous être abonné aux actualités d'Art et Unité pour le
   > Développement des Personnes Vulnérables (AUVD). Veuillez confirmer votre
   > abonnement en cliquant sur le lien ci-dessous. Vous ne recevrez que les
   > nouvelles concernant les programmes que vous avez choisis.
   >
   > Click here to confirm: <a href="**{{ params.DOIurl }}**">Confirm my subscription / Confirmer mon abonnement</a>

4. **Save the template, then save and send it to yourself** as a test. When the
   test arrives, check the link works.
5. Look at the template's URL or details panel and **note the numeric ID**
   (a small whole number). You need it in step 4.

### 4. Add the environment variables in Vercel

1. Open your project on <https://vercel.com>.
2. Go to **Settings → Environment Variables**.
3. Add these three, for the **Production** environment:

   | Name | Value |
   | --- | --- |
   | `BREVO_API_KEY` | the key you copied in step 2 |
   | `BREVO_DOI_TEMPLATE_ID` | the template number from step 3 (digits only) |
   | `SITE_URL` | your public site address, e.g. `https://auvd.org` — **no trailing slash** |

   Never start any of these names with `VITE_`. Vite would then publish them
   to every visitor in the page source.
4. Click **Save**, then go to **Deployments** and re-deploy the latest commit
   (⋯ menu → **Redeploy**) so the variables take effect.

### 5. Add the secret and variables in GitHub

1. Open your repository on GitHub → **Settings → Secrets and variables →
   Actions**.
2. On the **Secrets** tab, add:
   - `BREVO_API_KEY` — the same key as before.
3. On the **Variables** tab, add:
   - `SITE_URL` — your public site address, no trailing slash.
   - `BREVO_SENDER_EMAIL` — the address you verified in Brevo (step 1).
   - `BREVO_SENDER_NAME` — for example `AUVD News`.
4. Click **Save** for each one.

### 6. Check the name of your production environment in Vercel

The automatic sending only runs for a deployment Vercel calls **Production**.

1. In Vercel, open **Settings → Environments**.
2. Confirm your production environment is named exactly `Production`.
3. If it has a different name, either rename it, or open
   `.github/workflows/send-news-emails.yml` and change `Production` on the
   line that reads `github.event.deployment.environment == 'Production'`.

The first run prints the actual value it received in the log
(`environment: ...`), so you can confirm this from the first run rather than
guessing.

---

## Part B — How to publish news (every time)

1. Put the picture in **`public/news/`** (create the folder if it is missing).
   Use a `.jpg`, `.png` or `.webp`. Reference it as `/news/your-file.jpg`.
2. Open **`src/data/news.json`** and add your new item to the `items` array:

   ```json
   {
     "id": "2026-09-violin-lessons",
     "topic": "music",
     "date": "2026-09-15",
     "image": "/news/violin-lessons.jpg",
     "imageAlt": { "en": "A student learning the violin", "fr": "Une élève qui apprend le violon" },
     "title": { "en": "Twenty students begin violin lessons", "fr": "Vingt élèves commencent les cours de violon" },
     "body": {
       "en": ["First paragraph.", "Second paragraph."],
       "fr": ["Premier paragraphe.", "Deuxième paragraphe."]
     }
   }
   ```

3. Run the checks:

   ```
   npm run news:check
   ```

   It tells you if an id is duplicated, a topic is misspelled, a translation
   is missing, a date is wrong, or the image is not in `public/`.
4. Commit and push to GitHub.
5. Vercel deploys. When the deployment reports **success**, GitHub Actions
   emails the new item. That is all — there is nothing to click.

### Rules that protect you from mistakes

- **An `id` is permanent.** Never change or reuse one. The script remembers
  what it has already emailed by reading the ids out of the names of the
  campaigns it created. If you reuse an id, the second story is never sent.
- **Editing an existing item never re-sends it.** That is on purpose, so a
  typo fix does not spam your subscribers.
- **To send something again, publish a NEW item with a NEW id.**
- **`"notify": false` shows the item on the website but never emails it.**
  Use this for anything you are not ready to announce by email.
- **Keep both languages.** A missing French title or body fails
  `npm run news:check`. The site falls back to English, but the check exists
  to stop that happening by accident.
- **First push sends nothing.** Every item that ships with this feature is
  `"notify": false`, so your first deployment cannot email anyone.

### Checking a newsletter email before it goes to real people

You can build the emails without sending them:

```
npm run news:dry-run
```

This writes what the emails would look like into the `email-previews/` folder
as `.html` and `.txt` files. Double-click an `.html` file to open it in your
browser. This folder is ignored by Git, so previews are never committed.


---

## Part C — Testing, step by step

Do these in order. They are the same steps the feature was built against.

**a. The first push must send nothing.** Push the feature and watch the
GitHub Actions run. The log should say every item is `notify: false` and that
there is nothing to do. If an email arrives at this point, stop and check
`news.json`.

**b. Subscribe yourself.** Open your live site → `/news`, scroll to the
footer, type your real email address, tick **Music Program**, and submit. You
should see *"Almost done! Check your inbox…"*. Open the confirmation email and
click the link. You are now subscribed to the English music list. (Check the
spam folder if it does not arrive within a few minutes.)

**c. Publish a real item.** Add a new music item to `news.json` — this time
with no `"notify": false` — with a **new** id, put its image in
`public/news/`, run `npm run news:check`, commit and push. After Vercel
finishes, check your inbox and the spam folder, and open the
**Actions → Send news emails** run to read the summary table.

**d. Check the links.** In the received email, confirm that **Read more on our
website** jumps to the story, that **Donate today** opens `/donate`, and that
**Unsubscribe** works. Unsubscribing uses Brevo's standard link; the message
must keep it or the email can be treated as spam.

**e. Repeat in French.** Switch the site to French, subscribe again choosing
**Programme musique**, confirm, then publish another music item. The French
list and the French email are separate, so this is a genuinely separate test.

If the Action fails, open the run and read the log. The most common causes are
a typo in a variable name, or the environment not being named `Production`.

---

## Part D — Limits worth knowing

**Brevo free plan**
- **300 emails per day.** The script prints a warning if one run would go over
  that. Brevo simply stops sending the surplus that day; the rest still go.
  Note this is per day across *all* your Brevo sending, not just this site.
- Brevo adds its own small logo to free-plan marketing emails. This is normal
  and is not something the code can remove.
- Free-plan contact lists are capped too (a few hundred contacts).

**Vercel free plan**
- Serverless functions have a daily execution allowance. A signup is a very
  small amount of work, so a normal newsletter list will not come close to it.
- Preview deployments do **not** send email. Only production does. You can
  therefore test the site freely on a preview branch.

**Google and Yahoo sender rules**
- Bulk senders must support one-click unsubscribe. Brevo adds the required
  header automatically; the visible unsubscribe link in the footer of every
  email is the other half of that requirement, which is why the template
  always includes it.

---

## Where things are

| What | Where |
| --- | --- |
| The news itself | `src/data/news.json` |
| The `/news` page | `src/Pages/News.jsx` and `src/Pages/News.css` |
| The signup form | the footer, `src/components/Footer.jsx` |
| The function that receives signups | `api/subscribe.js` |
| The script that sends the emails | `scripts/send-news-emails.mjs` |
| The data checker | `scripts/validate-news.mjs` |
| The automation | `.github/workflows/send-news-emails.yml` |
| News pictures | `public/news/` |
| Email previews (not committed) | `email-previews/` |

**Local testing note:** `npm run dev` starts only the website, so
`/api/subscribe` will not answer. To exercise the signup function on your own
machine, install the Vercel CLI once with `npm i -g vercel`, then run
`vercel dev` in the project folder and use the address it prints. The
newsletter emails themselves are only ever sent by GitHub Actions, never from
your laptop.

