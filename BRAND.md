# BRAND.md — Matson Studios Photography

## Purpose

This file defines brand voice, content strategy, and automation pipeline for Steven Matson's photography social media presence. Any AI generating content should read this file alongside `CONTEXT.md`.

---

## Brand Identity

- **Name:** Matson Studios (to be confirmed)
- **Portfolio:** [matson-studios.vercel.app](https://matson-studios.vercel.app)
- **Photographer:** Steven Matson, Jersey, Channel Islands
- **Niche:** Macro photography (spiders, small subjects), nature, film photography (street, abstract, travel)
- **Differentiator:** Not just aesthetic — scientifically informed. Steven studies biology and spider ecology. He can identify species, describe behaviour, and provide ecological context that most macro photographers can't.

---

## Brand Voice

### Principles
- **Minimal.** Let the images lead. Captions are concise, not overwrought.
- **Informed.** Include species ID, behaviour notes, or ecological context where relevant.
- **Not pretentious.** No art-speak. No "exploring the liminal space between nature and self."
- **Occasional personal context.** Jersey life, seasonal changes, the experience of finding subjects. Sparingly.
- **Technical when appropriate.** Gear, settings, film stock — when it adds value, not for the sake of it.

### Caption templates

**Macro/Spider — with species ID:**
```
[Species name] — [common name]. [One sentence about behaviour, habitat, or identification feature]. [Location context if relevant].

[Gear: camera, lens, settings if interesting]
```

**Macro/Spider — mood/minimal:**
```
[Short observational sentence]. [Optional second sentence].
```

**Film — with context:**
```
[Camera], [film stock]. [Location or subject]. [Optional mood/context sentence].
```

**Seasonal/Jersey:**
```
[Simple seasonal observation]. [Connection to photography or nature].
```

### Tone examples
- YES: "Amaurobius similis — lace web spider. Found under a brick in the garden. These build distinctive bluish-white webs and are one of the most common house spiders in the Channel Islands."
- YES: "First spider of the season. Spring is here."
- YES: "Nikon F2, Portra 400. Jersey harbour at dusk."
- YES: "Canon R7, 100mm macro. 1/200, f/8, ISO 400. 15-image focus stack."
- NO: "Through my lens, I seek to capture the fragile beauty that exists in the overlooked corners of our world."
- NO: "Nature is the ultimate artist and I am merely its humble student."

---

## Content Mix

| Category | Source | Ratio | Notes |
|----------|--------|-------|-------|
| Macro / Spider | Canon R7 digital | ~60% | Primary content. Species ID + ecological context when possible. |
| Nature | Canon R7 digital | ~10% | Landscapes, broader natural history |
| Film | Nikon F2 / Olympus mju II | ~20% | Street, abstract, travel. Different aesthetic. |
| Behind the scenes | Any | ~10% | Gear, setup, the process of finding subjects. Humanises the feed. |

---

## Hashtag Strategy

### Core (use on most posts)
```
#macrophotography #spiderphotography #naturephotography #wildlifephotography #jerseyci #channelislands
```

### Macro-specific
```
#macro_brilliance #macro_perfection #arachnid #spidersofinstagram #britishspiders #ukarachnology #invertebrates #arthropod #macroworld
```

### Film-specific
```
#filmphotography #35mm #shootfilm #analogphotography #filmisnotdead #portra400 #nikonf2 #olympusmjuii
```

### Nature/ecology
```
#biodiversity #ecology #naturalhistory #britishwildlife #islandlife #jerseynature
```

### Niche / community tags
```
#spideridentification #arachnology #citizenscience #sciencephotography #macronature
```

> Hashtag sets should be rotated and varied per post to avoid algorithm suppression. AI should select 15-20 relevant tags per post from the above pools, weighted by content category.

---

## Platform Strategy

### Primary: Instagram
- Visual-first platform, natural fit for photography
- Posting cadence: 3-5x per week (consistency > volume)
- Use carousel posts for focus stacks or series
- Reels for behind-the-scenes or process content (short, no talking required initially)
- Stories for casual/daily content that doesn't need to be permanent

### Secondary (future): Twitter/X
- Share standout shots with shorter captions
- Engage with science/ecology community
- Cross-post selectively, not everything

### Future consideration: Threads, Bluesky
- Low effort to cross-post. Set up when bandwidth allows.

---

## Content Pipeline

### Step 1: Photo selection (Steven)
Steven selects which photos to post. This is curation — his eye, his judgment. Cannot be automated.

### Step 2: Metadata retrieval (automated)
Pull metadata from `src/data/photos.js` for selected photos:
- Title, subject, category
- Lens, shutter, aperture, ISO, stack count
- File path for the image

### Step 3: Caption generation (AI)
Using the brand voice defined above + photo metadata:
- Generate caption matching the appropriate template
- Include species ID and ecological context for spider/macro shots (can reference external species databases or Steven's own knowledge)
- Keep it concise — 1-3 sentences max for feed posts

### Step 4: Hashtag selection (AI)
From the hashtag pools above:
- Select 15-20 tags relevant to the specific photo
- Weight toward content category (macro, film, nature)
- Rotate to avoid repetition across consecutive posts

### Step 5: Scheduling (automated)
Options (pick one):
- **Buffer API** — free tier supports 3 channels, 10 scheduled posts. Paid tier for more.
- **Later API** — similar functionality, visual calendar
- **Custom Node script** — use Instagram Graph API directly (requires Facebook developer app + Instagram Business account)
- **n8n / Make.com** — no-code automation platform, can chain steps together

### Step 6: Publishing
Posts go live on schedule. Steven reviews engagement and responds to comments personally (at least initially — this is the visibility practice).

---

## Automation Build Checklist

- [ ] Decide on scheduling tool (Buffer vs Later vs custom script)
- [ ] Set up Instagram Business account (required for API access)
- [ ] Connect scheduling tool to Instagram
- [ ] Build caption generation prompt template (using brand voice above)
- [ ] Build hashtag selection logic (weighted by category)
- [ ] Create a simple CLI or script: `select photos → generate captions + hashtags → schedule`
- [ ] Test pipeline with 5 posts before going live
- [ ] Define posting cadence and time slots

---

## Photo Data Reference

Photos live in `public/images/` with metadata in `src/data/photos.js`.

Digital photos have structured metadata:
```js
{ id, src, title, subject, category, lens, shutter, aperture, iso, stack }
```

Film photos have:
```js
{ id, src, title, year, format, aspect }
```

This structured data is the foundation of the automation — captions and hashtags can be generated directly from it.

---

## Open Questions

- [ ] Is "Matson Studios" the final brand name?
- [ ] Instagram handle — existing account or new?
- [ ] Does Steven want to show his face in content or keep it photo-focused?
- [ ] Print store — when and on what platform? (Etsy, own site, etc.)
- [ ] Film development — does he develop his own or send out?
- [ ] How much species ID detail in captions? (Light touch vs. educational paragraphs)
- [ ] Budget for scheduling tool? (Free tier may be sufficient initially)
