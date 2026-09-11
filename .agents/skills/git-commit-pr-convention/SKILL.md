---
name: git-commit-pr-convention
description: Complete Git commit message, branch naming, pull request (PR) workflow, and code review standard for SellDesk frontend. Enforces Conventional Commits 1.0, SellDesk domain scopes, automated PR checklists, and clean Git history. Use whenever committing code, creating branches, drafting PRs, or reviewing changes.
---

# 🌿 Git Commit & PR Convention Skill (SellDesk Frontend)

A clean Git history is essential for high-velocity software engineering. Whether working solo or in a growing engineering team, strict Git conventions ensure:

1. **Instant Context:** Anyone can read `git log` and immediately understand what changed and why.
2. **Effortless Bug Tracking:** Makes `git bisect` fast and painless when diagnosing regressions.
3. **Automated Changelogs & Releases:** Semantic release tooling can automatically bump versions and generate release notes.
4. **Frictionless Code Reviews:** PRs are well-structured, self-contained, and accompanied by a rigorous verification checklist.

---

## 1. Conventional Commits 1.0 Specification

Every commit message in SellDesk MUST follow the Conventional Commits format:

```text
<type>(<scope>): <short imperative description>

[optional body: explanation of why the change was made]

[optional footer(s): BREAKING CHANGE: ... or Closes #issue]
```

### Allowed Types

| Type       | When to Use                                       | Example                                                                   |
| :--------- | :------------------------------------------------ | :------------------------------------------------------------------------ |
| `feat`     | A new user-facing feature or page                 | `feat(storefront): add product JSON-LD structured data`                   |
| `fix`      | A bug fix in production or development code       | `fix(tenant): prevent cross-store cache leak on store switch`             |
| `refactor` | Code refactoring with zero change in behavior     | `refactor(api-client): decouple axios interceptors into separate modules` |
| `perf`     | Performance improvement (LCP, bundle, queries)    | `perf(storefront): prioritize above-the-fold hero banner image`           |
| `test`     | Adding or updating unit/integration tests         | `test(products): add integration test for ProductForm Zod validation`     |
| `style`    | Formatting, whitespace, semicolon, no code change | `style(dashboard): format order table layout with Tailwind classes`       |
| `docs`     | Documentation, README, or SKILL.md updates        | `docs(skills): add multi-tenant isolation and security guide`             |
| `chore`    | Build scripts, tooling, package.json, configs     | `chore(deps): update @tanstack/react-query to v5.102`                     |
| `revert`   | Reverting a previous commit                       | `revert: "feat(checkout): enable fast checkout modal"`                    |
| `ci`       | CI/CD pipeline, GitHub actions, deployment config | `ci(github): add automated vitest and eslint verification workflow`       |

---

## 2. SellDesk Domain Scopes

Scopes provide domain context. Always choose a scope that reflects the affected area:

### A. Surface Scopes

- `admin`: Platform Super Admin (`src/app/(admin)`)
- `dashboard`: Merchant Store Dashboard (`src/app/(dashboard)`)
- `storefront`: Public customer storefront (`src/app/(storefront)`)
- `marketing`: Public marketing site (`src/app/(marketing)`)
- `auth`: Authentication and login flows (`src/app/(auth)`)

### B. Feature Domain Scopes

- `products`: Product catalog, variants, attributes
- `orders`: Order processing, order items, status tracking
- `categories`: Category tree and filters
- `brands`: Brand management
- `coupons`: Discount and coupon validation
- `customers`: Customer accounts and profiles
- `delivery`: Delivery charges, courier configs
- `billing`: Platform subscriptions, merchant billing ledgers
- `staff`: Store staff management and RBAC roles
- `cms`: Sliders, banners, popups, pages, faqs

### C. Infrastructure / Core Scopes

- `tenant`: Multi-tenant resolution, store switching, domain resolver
- `api-client`: Centralized Axios client, interceptors, tokens
- `middleware`: Next.js edge routing and header rewrite
- `cache`: TanStack Query cache, Redis synchronization
- `seo`: Metadata generation, sitemaps, robots.txt
- `ui`: Shared UI primitives (shadcn, buttons, modals)
- `deps`: Package upgrades

---

## 3. Commit Message Rules & Examples

### The Golden Rules:

1. **Use Imperative Mood:** Write `"add"`, NOT `"added"` or `"adding"`. Write `"fix"`, NOT `"fixed"` or `"fixes"`.
2. **Lowercase Subject:** Start description with a lowercase letter.
3. **No Trailing Period:** Do not put a period (`.`) at the end of the subject.
4. **Length Constraint:** Keep the subject line under 72 characters.

### Good vs Bad Commit Messages:

```text
❌ BAD: fixed stuff
❌ BAD: updated orders
❌ BAD: WIP: working on storefront checkout
❌ BAD: feat: Added Product SEO Metadata.

✅ GOOD: feat(storefront): generate dynamic OpenGraph metadata for product page
✅ GOOD: fix(tenant): enforce x-store-id header on all dashboard API requests
✅ GOOD: refactor(products): split monolithic product table into sub-components
✅ GOOD: perf(images): add responsive sizes attribute to storefront product card
✅ GOOD: test(auth): add unit tests for RoleGuard role permission checks
```

---

## 4. Branch Naming Standard

Create feature branches using this naming pattern:

```text
<category>/<scope>-<kebab-case-description>
```

### Allowed Branch Categories:

- `feature/` : New feature work
- `fix/` : Bug fix
- `refactor/` : Code refactoring without behavior change
- `perf/` : Performance optimization
- `hotfix/` : Urgent production fix
- `chore/` : Tooling or dependency maintenance

### Examples:

- `feature/storefront-seo-metadata`
- `feature/dashboard-product-form-variants`
- `fix/tenant-cache-cross-contamination`
- `refactor/api-client-interceptor-headers`
- `perf/storefront-lcp-hero-banner`
- `hotfix/checkout-coupon-infinite-loop`

---

## 5. Pull Request (PR) Standard & Template

When opening a Pull Request, use this standard markdown structure:

```markdown
## 📌 Summary of Changes

A concise 2-3 sentence overview of what this PR introduces and why.

## 🛠️ Key Architectural Decisions

- What technical approach was taken?
- Any new features, hooks, or API endpoints introduced?

## 🛡️ Multi-Tenant & Security Verification

- [ ] No client-side tenant filtering: server-side query filtering confirmed.
- [ ] Header `x-store-id` is properly attached to all tenant-scoped calls.
- [ ] TanStack Query keys are isolated with `['store', storeId, ...]`.
- [ ] Guard components (`StoreGuard`, `RoleGuard`, `AdminGuard`) protect routes.

## 🚀 SEO & Performance Verification (Storefront only)

- [ ] `generateMetadata()` implemented with dynamic title, description, and OG image.
- [ ] Next.js `Image` component used with `sizes` and `priority` on LCP element.
- [ ] No Cumulative Layout Shift (CLS): aspect-ratio wrapper applied.

## 🧪 Testing & Quality Checklist

- [ ] Vitest unit/integration tests added or updated.
- [ ] `pnpm lint` runs clean with 0 errors.
- [ ] `pnpm build` succeeds without type errors.

## 📸 Screenshots / Video Walkthrough

_(Attach desktop & mobile screenshots or loom recording here)_
```

---

## 6. Git Hygiene & Workflow Discipline

1. **Atomic Commits:** Each commit should represent a single logical unit of work. Don't bundle a product bugfix, a CSS tweak, and an unrelated package upgrade into one commit.
2. **Rebase Before Merge:** Keep git history linear:
   ```bash
   git checkout feature/my-feature
   git fetch origin
   git rebase origin/main
   ```
3. **No Dead or Debug Code:** Never commit `console.log`, commented-out code blocks, or temporary scratch files.
4. **Squash & Merge for Clean Main History:** When merging a PR with multiple intermediate commits, squash into a clean conventional commit.
