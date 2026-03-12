# 📚 SRB Motor Documentation Index

Dokumentasi lengkap untuk SRB Motor project - Laravel 12 + React 19 + Inertia.js

---

## 📖 Files Overview

### **For AI Agent & Developers**

| File                                   | Purpose                                                                       | Audience              |
| -------------------------------------- | ----------------------------------------------------------------------------- | --------------------- |
| **[AGENT.md](AGENT.md)**               | 🤖 AI Agent customization, project context, workflow rules, anti-patterns     | AI Agents, Team Leads |
| **[INSTRUCTIONS.md](INSTRUCTIONS.md)** | 📝 Code style, naming conventions, patterns, testing approach, best practices | All Developers        |

### **For Understanding Project**

| File                                       | Purpose                                                                     | Audience         |
| ------------------------------------------ | --------------------------------------------------------------------------- | ---------------- |
| **[ARCHITECTURE.md](ARCHITECTURE.md)**     | 🏗️ Overall system architecture, layer breakdown, data flow                  | All              |
| **[BUSINESS_LOGIC.md](BUSINESS_LOGIC.md)** | 💼 Business rules, credit workflow, domain logic                            | Product, Backend |
| **[CREDIT_FLOW.md](CREDIT_FLOW.md)**       | 🔄 Complete credit approval workflow (8 stages), user journeys, transitions | All (Critical!)  |
| **[DATABASE.md](DATABASE.md)**             | 🗄️ Database schema, tables, relationships, migrations                       | Backend, DBA     |
| **[DESIGN_SYSTEM.md](DESIGN_SYSTEM.md)**   | 🎨 UI components, colors, typography, spacing                               | Frontend, Design |

---

## 🚀 Quick Navigation

### **Starting a New Feature?**

1. Read [ARCHITECTURE.md](ARCHITECTURE.md) - understand overall structure
2. Read [INSTRUCTIONS.md](INSTRUCTIONS.md) - know coding standards
3. Check [CREDIT_FLOW.md](CREDIT_FLOW.md) if feature related to credit

### **Fixing a Bug?**

1. Check [AGENT.md](AGENT.md) - common pitfalls section
2. Read [INSTRUCTIONS.md](INSTRUCTIONS.md#-testing) - test-first approach
3. Check relevant flow doc (CREDIT_FLOW, ARCHITECTURE, etc)

### **Code Review?**

Use [INSTRUCTIONS.md](INSTRUCTIONS.md#-code-review-checklist) checklist

### **Understanding Workflow?**

Start with [CREDIT_FLOW.md](CREDIT_FLOW.md) - complete 8-stage workflow with examples

### **New to Project?**

1. [ARCHITECTURE.md](ARCHITECTURE.md)
2. [BUSINESS_LOGIC.md](BUSINESS_LOGIC.md)
3. [CREDIT_FLOW.md](CREDIT_FLOW.md)
4. [INSTRUCTIONS.md](INSTRUCTIONS.md)

---

## 🔑 Key Principles

From [AGENT.md](AGENT.md):

- ✅ Workflow status must be sequential (no skipping stages)
- ✅ Document verification before transitions
- ✅ Clear validation messages
- ❌ Never auto-transition without explicit action

From [INSTRUCTIONS.md](INSTRUCTIONS.md):

- 🚨 **Component max 150 lines** - split automatically
- 🧪 **Test-first bug fixing** - write test before fix
- 📏 **Separate UI from logic** - hooks for state/logic
- 🎨 **Consistent styling** - CoreUI + Tailwind patterns

---

## 📋 Documentation Status

| Doc               | Status    | Last Updated | Maintainer   |
| ----------------- | --------- | ------------ | ------------ |
| AGENT.md          | 🟢 Active | Mar 12, 2026 | Dev Team     |
| INSTRUCTIONS.md   | 🟢 Active | Mar 12, 2026 | Dev Team     |
| ARCHITECTURE.md   | 🟢 Active | Mar 12, 2026 | Arch Team    |
| BUSINESS_LOGIC.md | 🟢 Active | Mar 12, 2026 | Product      |
| CREDIT_FLOW.md    | 🟢 Active | Mar 12, 2026 | Dev Team     |
| DATABASE.md       | 🟢 Active | Mar 12, 2026 | Backend Team |
| DESIGN_SYSTEM.md  | 🟢 Active | Mar 12, 2026 | Design Team  |

---

## 💡 Pro Tips

1. **Keep docs updated** - Outdated docs is worse than no docs
2. **Use CREDIT_FLOW.md as truth** - Any workflow questions? Check here first
3. **Follow INSTRUCTIONS.md strictly** - Code quality compounds over time
4. **Update AGENT.md when pattern changes** - Keeps AI accurate
5. **Reference docs in code comments** - Link to relevant sections

---

## 🔗 External Resources

- Laravel Docs: https://laravel.com/docs
- React Docs: https://react.dev
- Inertia.js: https://inertiajs.com
- CoreUI React: https://coreui.io/react/

---

**Last Updated**: March 12, 2026  
**Project**: SRB Motor Dealer Platform  
**Status**: 🟢 Documentation Complete & Organized
