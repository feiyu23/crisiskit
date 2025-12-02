# CrisisKit Lite 🚨

> **10-second crisis data collection with AI triage**
> Share a link. Collect needs. Export to Google Sheets.
> Born from real disaster. Built for communities.

[Live Demo](https://sos.sparkbeacon.org) • [Design Philosophy](./pages/DesignNotes.tsx) • [Quick Start](#quick-start) • [Setup Guide](./SETUP.md)

---

## 🔥 The Story

In late 2025, during a major residential fire in Hong Kong, thousands of people scrambled for information, safety updates, and help. While official channels were slow, **ordinary citizens self-organized** using improvised tools:

- Google Forms & Sheets
- WhatsApp broadcasts
- Telegram groups
- Crowdsourced location notes
- Volunteers manually verifying each submission

The tools were fragmented and messy—**but they worked far better than expected**.

> **Because in a crisis, speed beats perfection.**

What stood out wasn't the sophistication, but the **incredible resilience of low-tech, human-centered systems**:

✅ No installation required
✅ Worked across all devices
✅ Everyone already knew how to use them
✅ Updates synchronized instantly
✅ Volunteers could step in without training

**CrisisKit Lite is a tribute to that spirit.** It's not trying to replace official emergency platforms. It's trying to **amplify what communities are already doing**.

---

## 🎯 What CrisisKit Does

**CrisisKit is the bridge between affected people and volunteer teams:**

```
Affected People → CrisisKit Form → AI Triage → Google Sheets → Volunteers
```

### Why Not Just Use Google Forms + Sheets?

**Google Forms**:
- ❌ Takes 15+ minutes to set up
- ❌ Poor mobile UX
- ❌ No AI triage
- ❌ No duplicate detection
- ❌ No urgency-based sorting

**CrisisKit**:
- ✅ **10 seconds** to create
- ✅ Mobile-optimized (SOS location button, large tap targets)
- ✅ **AI auto-classifies** urgency
- ✅ Duplicate detection
- ✅ Auto-sorts by urgency
- ✅ **One-click export to Google Sheets** for volunteer collaboration

---

## ✨ Features

### 🎯 **For Crisis Organizers**

- **10-Second Form Creation** - No account, no setup, just create and share
- **AI-Powered Triage** - Gemini AI classifies Critical/Moderate/Low urgency
- **Smart Duplicate Detection** - Prevents spam, tracks updates
- **Region/District Selection** - Pre-configured location dropdowns (Hong Kong, LA, etc.)
- **Real-Time Dashboard** - Color-coded urgency, status tracking, filtering
- **Visual Statistics & Charts** - Urgency distribution, region heatmaps, timeline trends
- **Real-Time Google Sheets Sync** - Auto-sync new submissions to your Sheet via webhook
- **One-Click Google Sheets Export** - Copy-paste ready for team collaboration
- **Data Portability** - Import/export JSON backups

### 👥 **For Affected People**

- **Mobile-First Design** - Large buttons, clear labels, works on any phone
- **SOS Location Button** - One-tap GPS + Google Maps link
- **Minimal Friction** - Only essential fields (Name, Contact, Location, Needs)
- **No Login Required** - Submit help requests immediately
- **Privacy-Conscious** - Data stays with community organizers

---

## 🚀 Quick Start

### Option 1: Try the Demo

Visit our [live demo](#) to create your first crisis form in under 30 seconds.

### Option 2: Run Locally

```bash
# Clone the repository
git clone https://github.com/sparksverse/crisiskit-lite.git
cd crisiskit-lite

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Option 3: Deploy to Cloudflare Pages

1. Fork this repository
2. Connect to Cloudflare Pages
3. Build command: `npm run build`
4. Output directory: `dist`
5. Done! ✅

---

## 🛠️ Configuration

### Storage Options

**In-Memory (Default)** - Uses localStorage, perfect for demos:
```env
VITE_STORAGE_MODE=memory
```

**Google Sheets Backend** - For real crisis coordination:
```env
VITE_STORAGE_MODE=sheets
VITE_GOOGLE_SHEETS_SPREADSHEET_ID=your_spreadsheet_id
VITE_GOOGLE_SERVICE_ACCOUNT_EMAIL=your_service_account@project.iam.gserviceaccount.com
VITE_GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n..."
```

See [.env.example](.env.example) for full configuration template.

### Google Sheets Auto-Sync (Recommended)

**For real-time automatic syncing to Google Sheets:**

1. Create a new Google Sheet
2. Go to **Extensions** → **Apps Script**
3. Paste the webhook script (provided in the CrisisKit dashboard)
4. Deploy as **Web App** (Execute as: Me, Access: Anyone)
5. Copy the webhook URL
6. In CrisisKit dashboard, click **"Auto-Sync Setup"** and paste the URL
7. Done! ✅ New submissions will automatically appear in your Sheet

**Benefits:**
- Zero manual copy-paste
- Data appears instantly in Google Sheets
- Color-coded by urgency (Red/Yellow/White)
- Perfect for volunteer teams already using Sheets

### Google Sheets Backend (Advanced)

**For storing all data in Google Sheets (not just syncing):**

1. Create a Google Cloud project
2. Enable Google Sheets API
3. Create a Service Account and download credentials
4. Create a spreadsheet with two sheets: `Incidents` and `Submissions`
5. Share the spreadsheet with your service account email
6. Add environment variables

📖 [Detailed setup guide](#google-sheets-setup-guide)

### AI Classification

**Gemini AI (Recommended):**
```env
VITE_GEMINI_API_KEY=your_gemini_api_key
```
Get your API key from [Google AI Studio](https://makersuite.google.com/app/apikey).

**Fallback Heuristics:**
If Gemini is unavailable, keyword-based classification automatically kicks in.

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

## 📖 Use Cases

### ✅ **Perfect For:**

- **Natural disasters**: Fires, floods, earthquakes
- **Community emergencies**: Power outages, water crises
- **Evacuation coordination**: Shelter needs, transportation
- **Rapid needs assessment**: Food, medical supplies, safety
- **Neighborhood mutual aid**: Volunteer coordination

### ⚠️ **Not Suitable For:**

- **Official government emergency response** (use certified systems)
- **Medical triage** (requires professional medical oversight)
- **Long-term case management** (use dedicated CRM systems)

---

## 🤝 Contributing

We welcome contributions from the community! Whether you're fixing bugs, adding features, or improving documentation, your help makes CrisisKit better for everyone.

**Ways to contribute:**

- 🐛 Report bugs or suggest features via [Issues](https://github.com/sparksverse/crisiskit-lite/issues)
- 📝 Improve documentation
- 🌍 Add translations
- 🔧 Submit pull requests

See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

---

## 🌍 Roadmap

**v1.0** (Current)
- [x] 1-click incident creation
- [x] AI urgency classification
- [x] Visual statistics dashboard with charts
- [x] CSV export
- [x] Google Sheets auto-sync webhook
- [x] Google Sheets backend
- [x] Mobile-responsive design
- [x] Region/District location selection

**v2.0** (Planned)
- [ ] Form customization (add custom fields)
- [ ] Multi-language support
- [ ] SMS integration
- [ ] Offline-first PWA mode
- [ ] Volunteer dispatch coordination
- [ ] Real-time updates (WebSocket)
- [ ] Map visualization of submissions

---

## 📜 License

MIT © [Sparksverse](https://www.sparksverse.com)

This project is open-source and free to use for any purpose, including commercial projects. See [LICENSE](LICENSE) for details.

---

## 💡 Philosophy

> "People don't wait for perfect systems. In a crisis, they build the systems they need with the tools they have."

CrisisKit Lite stands with that philosophy. It embraces **low-tech resilience, speed, human intuition, and community coordination**.

If it helps even one community organize faster in the next emergency, this project will have fulfilled its purpose.

---

## 🙏 Acknowledgments

Inspired by grassroots responders during the 2024 Hong Kong fire who coordinated thousands of people using nothing but Google Sheets, WhatsApp, and incredible human compassion.

---

## 📞 Support & Community

- **GitHub Issues**: Bug reports and feature requests
- **Discussions**: Community Q&A and ideas
- **Email**: [hello@sparksverse.com](mailto:hello@sparksverse.com)
- **Website**: [https://www.sparksverse.com](https://www.sparksverse.com)

---

<p align="center">
  <strong>Built with ❤️ by <a href="https://www.sparksverse.com">Sparksverse</a></strong><br>
  <em>Tech for communities, by communities</em>
</p>
