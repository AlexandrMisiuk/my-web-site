# Content Data Layer (`src/data/`)

This directory contains the decoupled, strongly typed content data layer for Oleksandr Misiuk's portfolio website.

All personal profile information, navigation structures, project case studies, engineering principles, technology stacks, and biographical copy reside here as pure TypeScript modules.

---

## Key Principles & Design Decisions

1. **Zero JSX Content Coupling**: All text, links, and metadata are maintained strictly inside `src/data/`. UI components remain purely presentational and consume data via `@/data`.
2. **Compile-Time Type Safety**: Every data object implements a TypeScript interface exported from `src/data/types.ts`. Any missing required fields or type mismatches are caught at build time (`npm run typecheck`).
3. **Empty String Omission Pattern**: Unsupplied contact or social links use empty strings (`''`) with explicit `// TODO: replace` comments. UI components verify `Boolean(link)` before rendering buttons or anchor tags, preventing broken `#` links.
4. **Zero Cumulative Layout Shift (CLS)**: The `ProjectMedia` contract mandates explicit `width` and `height` properties so browser containers maintain precise aspect ratios before images or videos finish loading.
5. **Zero Runtime Overhead**: Data modules are static ES modules that bundle seamlessly with Vite, incurring zero API latency or JSON parsing cost.

---

## File Structure & Module Reference

| File              | Purpose                                                              | Key Exports                                                                                       |
| ----------------- | -------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------- |
| `types.ts`        | TypeScript interfaces and union types                                | `SiteProfile`, `NavItem`, `Project`, `ProjectStatus`, `ProjectMedia`, `Principle`, `AboutContent` |
| `site.ts`         | Personal identity, statement, status, and social links               | `siteProfile`                                                                                     |
| `navigation.ts`   | 5 indexed sections (`01`–`05`) and active section tracking IDs       | `navItems`, `SECTION_IDS`                                                                         |
| `projects.ts`     | Showcase projects (active product & enterprise platform placeholder) | `projects`                                                                                        |
| `principles.ts`   | 4 senior engineering principles & philosophy copy                    | `principles`                                                                                      |
| `technologies.ts` | 10 core frontend technologies and tools                              | `technologies`                                                                                    |
| `about.ts`        | Biographical prose paragraphs                                        | `aboutContent`                                                                                    |
| `index.ts`        | Barrel export consolidating all data modules and types               | All of the above                                                                                  |

---

## How-To Guides

### 1. Updating Personal Info & Social Links (`site.ts`)

Open `src/data/site.ts` to update personal bio details or replace placeholder links:

```typescript
export const siteProfile: SiteProfile = {
    name: 'Oleksandr Misiuk',
    role: 'Senior Frontend Engineer',
    statement: 'I build fast, thoughtful interfaces that people enjoy using.',
    status: 'Wrocław, Poland · open to new opportunities',
    links: {
        linkedin: 'https://linkedin.com/in/alexandr-misiuk',
        github: 'https://github.com/your-username', // Replace '' with your GitHub URL
        email: 'oleksandr@example.com', // Replace '' with your contact email
        cv: '/cv/Oleksandr_Misiuk_CV.pdf', // Place PDF in public/cv/ and set path
    },
};
```

> **Note**: If a link is left as `''`, consumer components will gracefully omit the corresponding button/action link from the UI.

---

### 2. Adding or Modifying Projects (`projects.ts`)

Open `src/data/projects.ts` to edit existing entries or add a new case study.

#### Adding a New Project Example:

```typescript
{
    id: 'zahara-workflow-automation',
    title: 'Zahara Approval Workflows',
    status: 'shipped',
    summary: 'Architected high-throughput invoice and purchase order approval workflows with optimistic UI updates.',
    technologies: ['React', 'TypeScript', 'Tailwind CSS', 'REST APIs'],
    media: {
        kind: 'image',
        src: '/projects/zahara-workflows.webp',
        alt: 'Zahara workflow automation interface preview',
        width: 1200,
        height: 750,
    },
    caseStudyUrl: '/work/zahara-workflows',
    externalUrl: 'https://example.com/demo',
    repoUrl: '',
}
```

#### Field Specifications:

- `id` _(string, required)_: Unique URL-safe identifier (e.g. `'zahara-invoicing'`).
- `title` _(string, required)_: Display title.
- `status` _(`'building' | 'shipped' | 'placeholder'`, required)_: Current development status.
- `summary` _(string, required)_: 1–2 sentence description of engineering challenges and impact.
- `technologies` _(readonly string[], required)_: Array of technology tags.
- `media` _(ProjectMedia, optional)_: Image/video preview. Requires `kind`, `src`, `alt`, `width`, and `height`.
- `caseStudyUrl` _(string, optional)_: Internal path or route to a full case study.
- `externalUrl` _(string, optional)_: Live product demo or production URL.
- `repoUrl` _(string, optional)_: Public repository URL.

---

### 3. Editing Engineering Principles (`principles.ts`)

Open `src/data/principles.ts` to update or reorder the 4 engineering tenets:

```typescript
export const principles: readonly Principle[] = [
    {
        id: 'product-first',
        title: 'Product first',
        body: 'Technology serves the user and the business...',
    },
    // ...
];
```

---

### 4. Updating Technologies (`technologies.ts`)

Open `src/data/technologies.ts` to add or modify technology tags rendered in the technologies section:

```typescript
export const technologies: readonly string[] = [
    'TypeScript',
    'React',
    'React Native',
    'Angular',
    'JavaScript',
    'HTML',
    'CSS',
    'RxJS',
    'REST APIs',
    'Git',
] as const;
```

---

### 5. Updating About Paragraphs (`about.ts`)

Open `src/data/about.ts` to modify biographical prose paragraphs:

```typescript
export const aboutContent: AboutContent = {
    paragraphs: [
        'Senior Frontend Engineer with deep experience architecting responsive, high-performance web applications...',
        'Focused on building accessible, resilient user interfaces with rigorous attention to typography...',
        'Experienced across the full development lifecycle...',
    ],
};
```

---

### 6. Modifying Navigation Anchors (`navigation.ts`)

The navigation items in `src/data/navigation.ts` define the indexed rail and mobile menu:

```typescript
export const navItems: readonly NavItem[] = [
    { id: 'work', label: 'Selected Work', index: '01' },
    { id: 'how-i-work', label: 'How I Work', index: '02' },
    { id: 'about', label: 'About', index: '03' },
    { id: 'technologies', label: 'Technologies', index: '04' },
    { id: 'contact', label: 'Contact', index: '05' },
] as const;

export const SECTION_IDS = ['hero', 'work', 'how-i-work', 'about', 'technologies', 'contact'] as const;
```

> **Important**: If you add a new section, ensure both `navItems` and `SECTION_IDS` are updated to keep scroll-spy tracking synchronized.

---

## Verification & Quality Gates

After modifying any data files, verify that all contracts and formatting pass:

```bash
npm run typecheck      # Verify TypeScript strict contracts (0 errors)
npm run lint           # Verify ESLint rules (0 errors, 0 warnings)
npm run format:check   # Verify Prettier code style
npm run build          # Verify production Vite build
```
