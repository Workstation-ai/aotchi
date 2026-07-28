# AOTCHI Hackathon Roadmap

> **Status**: Living document — operational roadmap for hackathon execution
> **Last updated**: Chapter 3 (The Deployment)

---

## 1. Hackathon Phases

```
Phase 1: PoC Validation (Week 1)
    │
    ├── Day 1-2: CLI → Web bridge
    ├── Day 3: Agent creation on web
    ├── Day 4: Agent deployment on-chain
    └── Day 5: Demo video + social post
    
Phase 2: Landing & Social (Week 2)
    │
    ├── Day 1-2: Landing page polish
    ├── Day 3: Social content creation
    ├── Day 4: Community outreach
    └── Day 5: Feedback collection
    
Phase 3: SDK MVP (Week 3-4)
    │
    ├── Week 3: Core SDK + Cloudflare API
    └── Week 4: First external user
```

---

## 2. Phase 1: PoC Validation (Week 1)

**Goal**: Prove AOTCHI works end-to-end on web.

### Day 1-2: CLI → Web Bridge

- [ ] Set up Cloudflare project (D1 + Workers)
- [ ] Set up Supabase Auth (OAuth login)
- [ ] Create D1 schema (agents, wallets, ledger)
- [ ] Build Workers API: POST /agents, GET /agents, POST /agents/:id/deploy
- [ ] Vite + React app shell with auth

### Day 3: Agent Creation on Web

- [ ] "Create Agent" form (name, skill, network)
- [ ] POST /agents → D1 + wallet generation
- [ ] Agent list dashboard

### Day 4: Agent Deployment on-Chain

- [ ] POST /agents/:id/deploy → ERC-8004 registration
- [ ] Agent status with txHash, scanUrl
- [ ] 8004scan verification

### Day 5: Demo Video + Social Post

- [ ] Record 60-second demo video
- [ ] Post on Twitter/X: "AOTCHI — create an on-chain agent in one click"
- [ ] Post in BNB Chain Discord
- [ ] Post in relevant crypto/AI communities

---

## 3. Phase 2: Landing & Social (Week 2)

**Goal**: Build buzz and collect early users.

### Day 1-2: Landing Page Polish

- [ ] Update web/index.html with real demo
- [ ] Add "Create Your Agent" CTA
- [ ] Add live ticker with real agent count
- [ ] Add 8004scan embed showing marcus-aurelius

### Day 3: Social Content Creation

- [ ] Thread: "What is AOTCHI?" (philosophy + tech)
- [ ] Thread: "How to create an on-chain agent in 30 seconds"
- [ ] Meme: The Ledger Soul (cyberpunk aesthetic)
- [ ] Infographic: ERC-8004 + ERC-8183 + x402 stack

### Day 4: Community Outreach

- [ ] BNB Chain ecosystem: Discord, Telegram
- [ ] AI agent communities: Twitter, Reddit
- [ ] Crypto developer communities: ETHGlobal, DevDAO
- [ ] Hackathon platforms: Devpost, MLH

### Day 5: Feedback Collection

- [ ] Survey: "What skill would you give your agent?"
- [ ] Survey: "Would you pay for an autonomous trading agent?"
- [ ] Collect email waitlist

---

## 4. Phase 3: SDK MVP (Week 3-4)

**Goal**: Ship publishable SDK.

### Week 3: Core SDK

- [ ] `@aotchi/sdk` package (npm)
- [ ] Agent class (create, deploy, status, list)
- [ ] Identity module (ERC-8004)
- [ ] Cloudflare adapter (D1 + Workers)
- [ ] Documentation (ASRS + SDK reference)

### Week 4: First External User

- [ ] Publish SDK to npm
- [ ] Tutorial: "Create your first AOTCHI agent"
- [ ] GitHub repo with README, examples, contributing guide
- [ ] First external user creates agent

---

## 5. Social Media Content Calendar

### Week 1

| Day | Platform | Content |
|-----|----------|---------|
| Mon | Twitter/X | Teaser: "Something is awakening on BSC" |
| Tue | Twitter/X | Thread: "The Origin" — philosophy of AOTCHI |
| Wed | Discord | "We deployed an on-chain agent. Here's how." |
| Thu | Twitter/X | Demo video: 60s agent creation |
| Fri | Reddit | r/CryptoTechnology: "Autonomous agents on BSC" |

### Week 2

| Day | Platform | Content |
|-----|----------|---------|
| Mon | Twitter/X | "AOTCHI is live. Create your agent." |
| Tue | LinkedIn | "The future of AI agents is on-chain" |
| Wed | Twitter/X | Infographic: ERC-8004 + 8183 + x402 |
| Thu | Discord | AMA: "Ask us anything about AOTCHI" |
| Fri | Twitter/X | Meme: "The Ledger Soul" |

### Week 3-4

| Day | Platform | Content |
|-----|----------|---------|
| Mon | Twitter/X | "Our SDK is open source" |
| Tue | Dev.to | Tutorial: "Build an on-chain agent with AOTCHI" |
| Wed | Twitter/X | "First external user created an agent!" |
| Thu | Reddit | r/ethdev: "ERC-8004 agent identity on BSC" |
| Fri | Twitter/X | Recap: "2 weeks of AOTCHI" |

---

## 6. Materials Needed

### Visual

- [ ] Landing page (web/index.html) ✅
- [ ] Logo variations (light, dark, icon)
- [ ] Social media templates
- [ ] Infographic: AOTCHI stack
- [ ] Demo video (60s)
- [ ] GIF: Agent creation flow

### Written

- [ ] Manifesto (Chapter 1) ✅
- [ ] SDK documentation
- [ ] Tutorial: "Create your first agent"
- [ ] Blog post: "Why on-chain agents matter"
- [ ] Twitter threads (3-5)

### Technical

- [ ] Working web app (PoC)
- [ ] Published SDK (@aotchi/sdk)
- [ ] GitHub repo
- [ ] npm package

---

## 7. Success Metrics

| Metric | Week 1 | Week 2 | Week 4 |
|--------|--------|--------|--------|
| Agents created (web) | 1 | 5 | 20 |
| GitHub stars | 0 | 10 | 50 |
| Twitter followers | 0 | 100 | 500 |
| npm downloads | 0 | 0 | 100 |
| Email waitlist | 0 | 50 | 200 |

---

## 8. Hackathon Targets

| Hackathon | Deadline | Category | Fit |
|-----------|----------|----------|-----|
| BNB Chain Hackathon | TBD | AI/Agents | ⭐⭐⭐ Perfect |
| ETHGlobal | TBD | Infrastructure | ⭐⭐ Good |
| MLH Hackathon | TBD | Open Source | ⭐⭐ Good |
| Devpost | Rolling | Various | ⭐⭐ Good |

---

## 9. Risk Mitigation

| Risk | Impact | Mitigation |
|------|--------|------------|
| Cloudflare free tier limits | Medium | Monitor usage, upgrade to $5/mo if needed |
| BNB Agent SDK Python dependency | Low | Wrap in subprocess, plan TS reimplementation |
| No external users | Medium | Focus on community outreach, Discord engagement |
| Demo fails during presentation | High | Test 3x before posting, have backup screenshots |
