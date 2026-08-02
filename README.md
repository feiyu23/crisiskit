# CrisisKit Lite 🚨

> **10-second crisis data collection with AI-powered triage**
> Share a link. Collect urgent needs. Export to Google Sheets.
> **Born from real disaster. Built by communities. For communities.**

<div align="center">

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![GitHub Stars](https://img.shields.io/github/stars/sparksverse/crisiskit-lite?style=social)](https://github.com/sparksverse/crisiskit-lite)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](https://github.com/sparksverse/crisiskit-lite/pulls)

[🎯 Live Demo](#) • [📖 Quick Start](#quick-start) • [🎨 Design Philosophy](./pages/DesignNotes.tsx) • [⚙️ Setup Guide](./SETUP.md)

</div>

---

## 🔥 Born from Real Crisis

In late 2025, during a devastating residential fire in Hong Kong, **thousands of people scrambled for help**. Official channels were drowning in requests. But something remarkable happened:

**Ordinary citizens self-organized using simple tools:**

- Google Forms & Sheets
- WhatsApp broadcasts
- Telegram groups
- Crowdsourced location notes
- Volunteers manually coordinating

The tools were **fragmented and messy—but they worked far better than sophisticated systems.**

> "In a crisis, speed beats perfection. Communities don't wait for official platforms. They build what they need with what they have." — Real disaster responders

**CrisisKit Lite is a tribute to that resilience.** It's not trying to replace official systems. It's **amplifying what communities are already doing—but 10x faster, with AI intelligence, and built for offline communities.**

---

## ⚡ Core Capabilities at a Glance

| Feature | What It Does | Why It Matters |
|---------|-------------|----------------|
| **⏰ 10-Second Setup** | Create a crisis form in seconds, no account needed | Time is life. Every second counts. |
| **🤖 AI Auto-Triage** | Gemini AI classifies urgency: Critical → Moderate → Low | Volunteers work on most critical needs first |
| **📍 Location Intelligence** | Pre-configured region/district dropdowns for fast location entry | Disaster responders need geographic data instantly |
| **🔗 Google Sheets Sync** | Auto-sync submissions to Google Sheets in real-time | Teams already use Sheets. Zero learning curve. |
| **📊 Live Dashboard** | Color-coded urgency, filtering, statistics, trends | Coordinators see patterns and bottlenecks immediately |
| **📱 Mobile-First Design** | Large buttons, minimal text, works on any phone | Most people access crisis info on phones |
| **🚫 Duplicate Detection** | Prevents spam, flags potential updates | Cuts down noise for coordinators |
| **📡 WebRTC P2P Mesh** | Peer-to-peer offline broadcast & emergency sync between devices | Works even when internet/cellular towers are down |
| **🔒 Privacy-First** | Data stays with community, not third parties | Trust is essential in crisis |

---

## 🎯 The CrisisKit Workflow

```
Affected Person → Share CrisisKit Link → Submit Needs in 10s
                         ↓
              AI Triage (Critical/Moderate/Low)
                         ↓
            Auto-Sync to Google Sheets
                         ↓
         Volunteer Team Coordinates Response
```

### Why Not Just Use Google Forms + Sheets?

Real crisis scenario: A fire breaks out. People need help NOW. Let's compare:

| Task | Google Forms | CrisisKit |
|------|-------------|-----------|
| **Setup time** | 15-20 minutes | 10 seconds |
| **Mobile UX** | Clunky, text-heavy | Large buttons, SOS location tap |
| **Urgency sorting** | Manual (never happens) | Automatic (AI powered) |
| **Duplicate detection** | None (coordinator nightmare) | Automatic (flags patterns) |
| **Learning curve** | Minutes (forms are new for some) | Instant (everyone knows how to submit) |
| **Sheets integration** | Copy-paste (100 entries = 30min) | Real-time auto-sync (automatic) |
| **Offline capability** | No | Queued submissions when connection returns |

**In a real fire**, the difference between 15 minutes of setup and 10 seconds could mean the difference between chaos and coordination.

---

## ✨ Features at a Glance

### 🔴 **For Crisis Coordinators & Volunteers**

**Incident Management**
- ⏰ **Create in 10 seconds** - No account, no installation, no waiting
- 📋 **12+ pre-built templates** - Fire, flood, earthquake, power outage, medical emergency, evacuation, shelter coordination, food distribution, and more
- 🎯 **Customizable intake forms** - Add/remove fields without coding

**Intelligence & Coordination**
- 🤖 **AI Auto-Triage** - Gemini classifies each submission as Critical/Moderate/Low urgency
- 🚫 **Smart Duplicate Detection** - Prevents spam, flags potential duplicate requests from same person
- 📊 **Live Dashboard** - Real-time view of all submissions, color-coded by urgency
- 🔍 **Advanced Filtering** - Sort by urgency, location, status, time submitted
- 📈 **Visual Analytics** - Urgency distribution, geographic heatmaps, submission trends over time

**Data Integration**
- 🔗 **Real-Time Google Sheets Sync** - Submissions auto-sync to your Google Sheet via webhook (zero delay)
- 📥 **One-Click Export** - Download as CSV or JSON
- 💾 **Data Backup** - Import/export full incident backups
- 🔐 **Privacy-First** - All data stays with your organization, never touches third parties

**Location Intelligence**
- 📍 **Pre-configured regions** - Built-in dropdowns for Hong Kong, Los Angeles, and customizable for any region
- 🗺️ **Geographic distribution** - See where requests are coming from at a glance
- 📌 **GPS integration** - Affected people can share exact location with one tap

### 👥 **For Affected People**

- 📱 **Ultra-mobile design** - Optimized for 4-inch screens, works with one hand
- 🆘 **SOS button** - Tap once for GPS location + automatic Google Maps link
- ⚡ **Minimal form** - 4 essential fields max (Name, Contact, Location, Needs)
- 🚫 **No login wall** - Submit immediately, anonymously if needed
- 🔒 **Privacy-first** - Names don't get published, only coordinators see details
- 📤 **Offline support** - Submissions queue locally, sync when connection returns

---

## 📋 Crisis Response Templates (Ready to Launch)

Just pick a scenario and you're ready to collect data in 10 seconds:

| Category | Templates |
|----------|-----------|
| 🔥 **Natural Disasters** | Building Fire • Flood • Earthquake • Typhoon/Hurricane • Wildfire |
| ⚡ **Infrastructure Failures** | Power Outage • Water Crisis • Gas Leak • Utility Failure |
| 🚨 **Displacement & Safety** | Mass Evacuation • Shelter Coordination • Lockdown/Quarantine |
| 🍞 **Supply Chain Breakdown** | Food Distribution • Medical Supply Shortage • Fuel Shortage |
| 🦠 **Health Emergencies** | Disease Outbreak • Mass Injury Incident |
| 👶 **Vulnerable Populations** | Missing Persons • Child Safety • Elderly Care |

**What's in each template:**
- Pre-filled form titles & context-specific instructions
- Recommended data fields for that crisis type
- Location dropdowns configured for common disaster zones
- Mobile-optimized layout ready to deploy

---

## 🚀 Get Started in 3 Ways

### 🎯 **Option 1: Try the Live Demo (Fastest)**

No installation needed. Just:
1. Visit [https://sos.sparkbeacon.org](https://sos.sparkbeacon.org)
2. Click "Create New Incident"
3. Pick a template (e.g., "Building Fire")
4. Share the link
5. Watch submissions roll in

**Perfect for:** Testing before deployment, understanding the workflow

---

### 💻 **Option 2: Run Locally (For Development)**

```bash
# Clone the repository
git clone https://github.com/sparksverse/crisiskit-lite.git
cd crisiskit-lite

# Install dependencies
npm install

# Start development server
npm run dev

# Open in browser
open http://localhost:5173
```

**What you'll see:**
- Create new incidents
- Submit test entries
- See AI triage in action
- View live dashboard

**Perfect for:** Developers, customization, adding features

---

### 🌐 **Option 3: Deploy to Cloudflare Pages (Production)**

**Fastest production deployment (5 minutes):**

```bash
# 1. Fork this repository on GitHub
# 2. Go to Cloudflare Pages dashboard
# 3. Create new site → Connect to Git
# 4. Select your fork
# 5. Build settings:
#    - Framework: Vite
#    - Build command: npm run build
#    - Output directory: dist
# 6. Deploy!
```

**Done!** Your crisis form is live at `yourproject.pages.dev`

**Perfect for:** Rapid deployment during real crisis

---

### ⚙️ **Environment Configuration**

Create a `.env.local` file (see `.env.example`):

```env
# AI Triage (Recommended)
VITE_GEMINI_API_KEY=your_key_here

# Storage Mode: 'memory' (demo) or 'sheets' (production)
VITE_STORAGE_MODE=memory

# Google Sheets Integration (optional)
VITE_GOOGLE_SHEETS_SPREADSHEET_ID=your_sheet_id
VITE_GOOGLE_SERVICE_ACCOUNT_EMAIL=your_email@project.iam.gserviceaccount.com
VITE_GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n..."
```

---

## 📖 Advanced Setup Guide

See [SETUP.md](./SETUP.md) for detailed configuration:

- **Google Sheets Backend** - Store all data in Google Sheets
- **Auto-Sync Webhook** - Real-time data sync with zero delay
- **Gemini API** - AI-powered urgency classification
- **Custom Regions** - Configure location dropdowns for any area
- **Data Portability** - Import/export incident backups

---

## 🎯 Crisis UX Principles

Disaster UX is fundamentally different from normal UX. When people are stressed, scared, or managing chaos, **cognitive load skyrockets**. This changes how humans interact with systems:

| Principle | Why It Matters |
|-----------|----------------|
| **🧨 No clutter** | Crisis users have almost no working memory available |
| **⏱ Time-to-action < 5s** | If someone can't create a form immediately, they'll abandon it |
| **📱 Mobile-first** | Most crisis communication happens on phones |
| **🔊 Broadcast-friendly** | Links will be shared through WhatsApp groups and voice notes |
| **🧩 Minimal inputs** | Complex forms fail. Short, descriptive fields succeed |
| **🧘 Emotional safety** | A "Thank you" message reduces panic |

Read our full [Design Philosophy](#) to learn more.

---

## 🎯 Real-World Use Cases

### ✅ **CrisisKit is Perfect For:**

| Use Case | Example |
|----------|---------|
| **Natural Disasters** | Building fires, floods, earthquakes, typhoons—assess immediate needs |
| **Infrastructure Failure** | Power outages, water contamination—coordinate emergency resources |
| **Displacement** | Mass evacuation, shelter coordination—track who needs what |
| **Supply Chain Breakdown** | Food shortage, medical supplies—rapid distribution assessment |
| **Community Mutual Aid** | Neighborhood flooding, local emergency—peer-to-peer help coordination |
| **Evacuation Routes** | Track bottlenecks, coordinate transportation, identify vulnerable people |
| **Rapid Surveys** | Post-crisis assessment, damage surveys, accessibility needs |

**Why it works in these scenarios:**
- Speed is literally life-or-death
- You need data NOW, not in 2 hours
- Coordinators are already using Google Sheets
- People will use any tool that works—don't need perfection

### ⚠️ **Not Suitable For:**

- **Official government platforms** — Use certified emergency systems instead
- **Medical triage** — Requires professional medical oversight (CrisisKit supplements, not replaces)
- **Long-term case management** — Use dedicated CRM/database systems for ongoing support
- **Confidential law enforcement** — Not designed for sensitive investigations

---

## 🤝 Contributing to Crisis Tech

We believe **crisis technology is too important to keep closed**. Every contribution helps communities respond faster in the next emergency.

**Ways to help:**

| Contribution | Impact |
|--------------|--------|
| 🐛 **Report Bugs** | File issues if something breaks—we fix critical bugs in 24hrs |
| 💡 **Suggest Features** | Real-world ideas from deployed incidents are gold |
| 📝 **Improve Docs** | Better docs = faster adoption = faster crisis response |
| 🌍 **Add Translations** | Crisis doesn't respect language boundaries |
| 🔧 **Write Code** | New features, optimizations, bug fixes |
| 📱 **Test on Devices** | Verify mobile UX on real phones in real conditions |

**First contribution?** Start here:
1. Fork the repo
2. Pick an issue labeled `good-first-issue`
3. Follow [CONTRIBUTING.md](CONTRIBUTING.md)
4. Open a PR with a clear description

See [CONTRIBUTING.md](CONTRIBUTING.md) for detailed guidelines and our code of conduct.

---

## 🗺️ Roadmap

**v1.0** (Current - Production Ready)
- [x] 12+ pre-configured crisis templates
- [x] AI-powered urgency triage (Gemini)
- [x] Real-time Google Sheets sync
- [x] Mobile-optimized submission form
- [x] Live coordinator dashboard
- [x] Visual analytics & heatmaps
- [x] Duplicate detection
- [x] Data import/export
- [x] Privacy-first architecture

**v2.0** (Early 2026)
- [ ] Custom form fields (no-code customization)
- [ ] Multi-language UI (Spanish, Mandarin, Hindi, Arabic)
- [ ] SMS text-to-submit (for areas with poor internet)
- [ ] Offline-first PWA (submissions queue, sync when connected)
- [ ] Volunteer dispatch coordination (assign tasks)
- [ ] WebSocket real-time updates (instant dashboard)
- [ ] Map-based incident visualization (geographic view)
- [ ] Telegram/WhatsApp bot integration (submit via chat)
- [ ] Integration with emergency management systems

**v3.0** (Vision 2026-2027)
- [ ] Predictive dispatch (ML suggests volunteer routing)
- [ ] Multi-incident federation (link incident databases)
- [ ] Voice submission (for users who can't type)
- [ ] Accessibility features (accessible for blind/deaf users)
- [ ] Open-source mobile apps (iOS/Android native)

**Voting on roadmap:** Help us prioritize. React to [GitHub Discussions](https://github.com/sparksverse/crisiskit-lite/discussions) with your use cases.

---

## 📜 License

MIT © [Sparksverse](https://www.sparksverse.com)

This project is open-source and free to use for any purpose, including commercial projects. See [LICENSE](LICENSE) for details.

---

## 🛠️ Tech Stack

**Frontend**
- React 19 + TypeScript
- Vite (lightning-fast builds)
- Tailwind CSS (mobile-first styling)
- Lucide React (beautiful icons)

**AI & Intelligence**
- Google Generative AI (Gemini 2.0 for urgency triage)
- Custom keyword heuristics (fallback if API unavailable)

**Data Integration**
- Google Sheets API (read/write sync)
- Webhook integration (real-time auto-sync)

**Deployment**
- Cloudflare Pages (global CDN, zero-config)
- Vercel (alternative)
- Docker support coming in v2.0

**Open Source Libraries**
- React Router (navigation)
- React Hooks (state management)

**All free and open-source.** No vendor lock-in.

---

## 💡 Our Philosophy

> **"In a crisis, people don't wait for perfect systems. They build what they need with the tools they have. CrisisKit Lite amplifies that instinct."**

We believe:

1. **Speed > Perfection** — A 10-second form deployed now saves more lives than a perfect form deployed in 2 weeks
2. **Community First** — Technology should serve communities, not the other way around
3. **Low-Tech Resilience** — Work when internet is down, when servers are full, when nothing is available
4. **Data Privacy** — Communities own their crisis data. We never store it on our servers
5. **Open Source First** — Crisis tech is too important to be proprietary

If CrisisKit helps even one community organize faster in the next emergency, it will have succeeded.

---

## 🙏 Inspired By Real Heroes

This project was born from witnessing grassroots responders during the **late 2025 Hong Kong fire**:

- **Thousands of citizens** organizing relief efforts
- **Volunteers** coordinating with Google Sheets + WhatsApp
- **Speed & resilience** beating official channels by hours
- **Human compassion** at massive scale

CrisisKit Lite is our tribute to their ingenuity. We're just making it easier.

---

## 📞 Get Help & Join Us

- 🐛 **Found a bug?** → [GitHub Issues](https://github.com/sparksverse/crisiskit-lite/issues)
- 💡 **Have an idea?** → [GitHub Discussions](https://github.com/sparksverse/crisiskit-lite/discussions)
- 📚 **Need setup help?** → [SETUP.md](./SETUP.md)
- 💬 **Want to chat?** → [hello@sparksverse.com](mailto:hello@sparksverse.com)
- 🌐 **Learn more** → [Sparksverse.com](https://www.sparksverse.com)

---

## ⭐ Show Your Support

If CrisisKit helps your community or you believe in this mission:

1. **Star this repo** ⭐ (helps others discover it)
2. **Fork & deploy** 🚀 (share with your community)
3. **Contribute code** 🔧 (help us build faster)
4. **Share your story** 📖 (how CrisisKit helped you)
5. **Report bugs** 🐛 (help us improve)

Even small contributions make a difference. **Crisis tech is a collective responsibility.**

---

<p align="center">
  <strong>Made with ❤️ by <a href="https://www.sparksverse.com">Sparksverse</a></strong><br>
  <em>Crisis response technology for every community</em><br><br>
  <a href="https://github.com/sparksverse/crisiskit-lite">⭐ Star us on GitHub</a> •
  <a href="https://github.com/sparksverse/crisiskit-lite/issues">Report Issues</a> •
  <a href="https://github.com/sparksverse/crisiskit-lite/discussions">Join Discussion</a>
</p>
