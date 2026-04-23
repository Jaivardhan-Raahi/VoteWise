# 🗳️ VoteWise — Intelligent Voter Alignment Platform

> A modern, AI-enhanced civic tool that helps users discover which candidate truly aligns with their beliefs — based on **data, not bias**.

---

## 🚀 Problem

Most voters:

* don’t understand candidate policies
* rely on bias, media, or popularity
* vote without clarity

👉 Result: **misinformed decisions**

---

## 💡 Solution

VoteWise solves this using:

* 📊 **Structured issue-based survey**
* ⚖️ **Weighted alignment scoring system**
* 🤖 **AI-powered explanation (Google Gemini)**

👉 Instead of telling users *who is winning*
👉 It shows *who aligns with YOU*

---

## 🧠 How It Works

1. User answers policy-based questions (0–10 scale)
2. System calculates alignment using weighted scoring
3. Top 3 candidates are matched
4. Gemini AI explains **WHY** the match exists

---

## ✨ Key Features

* 🔍 Objective candidate matching
* 📊 Weighted scoring engine (tested & validated)
* 🤖 AI-generated reasoning (Gemini API)
* 💾 Persistent progress (Zustand + localStorage)
* 🎯 Clean, minimal UX (no clutter, no bias)

---

## 🧪 Tech Stack

* **Frontend**: Next.js 15 (App Router)
* **State Management**: Zustand
* **Validation**: Zod
* **AI Integration**: Google Gemini API
* **Styling**: Tailwind CSS
* **Testing**: Vitest

---

## 🔐 Privacy First

* No user data is stored on servers
* All calculations happen locally
* Only AI explanation uses external API

---

## ⚡ Demo Flow

1. Start survey
2. Answer questions
3. View top matches
4. Read AI explanation

---

## 🧠 Why This Is Different

Most tools:

* show popularity
* show trends

VoteWise:
👉 shows **alignment based on YOUR values**

---

## 📈 Future Scope

* Real election data integration
* Multi-region support
* Candidate comparison view
* Blind matching mode

---

## 🏁 Run Locally

```bash
npm install
npm run dev
```

---

## 🔑 Environment Setup

Create `.env.local`:

```env
GOOGLE_GENERATIVE_AI_API_KEY=your_api_key
```

---

## 🧪 Run Tests

```bash
npm run test
```

---

## 🏆 Ideathon Focus Areas Covered

* ✅ Code Quality
* ✅ Security
* ✅ Efficiency
* ✅ Testing
* ✅ Accessibility
* ✅ Google Services (Gemini AI)

---

## 👨‍💻 Author

Built with focus on **clarity, objectivity, and impact**

---

## 📌 Final Note

> Voting should be based on understanding — not influence.

VoteWise makes that possible.
