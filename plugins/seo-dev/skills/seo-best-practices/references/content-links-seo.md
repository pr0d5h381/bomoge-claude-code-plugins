# Content & Links SEO Reference

Content optimization and internal linking strategies.

## Heading Hierarchy

### Structure

Every page should have exactly one H1 matching the page topic:

```html
<h1>Main Page Title (one per page)</h1>
  <h2>Section 1</h2>
    <h3>Subsection 1.1</h3>
    <h3>Subsection 1.2</h3>
  <h2>Section 2</h2>
    <h3>Subsection 2.1</h3>
```

### Requirements

- **H1**: One per page, matches title tag topic
- **H2**: Major sections
- **H3-H6**: Subsections, don't skip levels

### Issues

| Issue | Severity | Fix |
|-------|----------|-----|
| Missing H1 | 🔴 | Add H1 tag |
| Multiple H1s | 🟡 | Keep only one H1 |
| Skipped heading levels | 🟡 | Use proper hierarchy |
| H1 doesn't match content | 🟡 | Align H1 with page topic |

## Content Optimization

### Length Guidelines

| Content Type | Minimum | Optimal |
|-------------|---------|---------|
| Blog posts | 500 words | 1,500-2,500 words |
| Product pages | 200 words | 500-1,000 words |
| Category pages | 100 words | 300-500 words |
| Landing pages | 300 words | 500-1,000 words |

### Keyword Usage

- Primary keyword in H1
- Primary keyword in first paragraph
- Keywords in subheadings (H2s)
- Natural keyword density (1-2%)
- Use variations and synonyms

### Readability

- Short paragraphs (3-4 sentences)
- Use bullet points and lists
- Include images/visuals
- Break up with subheadings
- Flesch Reading Ease: 60-70

## Internal Linking

### Benefits

- Distributes page authority
- Helps crawlers discover pages
- Improves user navigation
- Reduces bounce rate

### Best Practices

```html
<!-- Good: Descriptive anchor text -->
<a href="/seo-guide">complete SEO guide</a>

<!-- Bad: Generic anchor text -->
<a href="/seo-guide">click here</a>
<a href="/seo-guide">read more</a>
```

### Link Structure

- Link to related content
- Use breadcrumbs
- Create topic clusters
- Link from high-authority pages
- Ensure important pages are within 3 clicks from homepage

### Anchor Text

| Type | Example | Use |
|------|---------|-----|
| Exact match | "SEO guide" → SEO guide page | Sparingly |
| Partial match | "learn about SEO" → SEO guide | Preferred |
| Branded | "Moz's research" → Moz | When citing |
| Generic | "click here" → Any | Avoid |

## External Links

### Outbound Links

```html
<!-- External links should open in new tab -->
<a href="https://external.com" target="_blank" rel="noopener noreferrer">
  Source Name
</a>

<!-- Sponsored/paid links -->
<a href="https://partner.com" rel="sponsored">Partner</a>

<!-- User-generated content -->
<a href="https://user-link.com" rel="ugc nofollow">User Link</a>
```

### When to Use rel Attributes

| Attribute | Use Case |
|-----------|----------|
| `nofollow` | Don't pass SEO value |
| `sponsored` | Paid/affiliate links |
| `ugc` | User-generated content |
| `noopener` | Security for target="_blank" |

## Broken Links

### Detection

Regularly scan for:
- 404 errors
- Redirect chains
- Timeout links

### Fix Strategies

1. Update link to new URL
2. Remove if page no longer exists
3. Redirect old URL to relevant page

## Duplicate Content

### Causes

- www vs non-www
- HTTP vs HTTPS
- Trailing slashes
- URL parameters
- Pagination
- Printer-friendly versions

### Solutions

1. **Canonical tags**: Point to preferred version
2. **301 redirects**: Redirect duplicates
3. **Parameter handling**: Configure in Search Console
4. **Noindex**: For utility pages

```html
<!-- On duplicate page -->
<link rel="canonical" href="https://example.com/original-page">
```

## Content Issues Checklist

| Issue | Severity | Detection |
|-------|----------|-----------|
| Thin content (<200 words) | 🟡 | Word count check |
| Duplicate content | 🔴 | Same content on multiple URLs |
| Missing H1 | 🔴 | No H1 tag |
| Multiple H1s | 🟡 | Count H1 tags |
| Keyword stuffing | 🟡 | High keyword density |
| Generic anchor text | 🟢 | "click here", "read more" |
| Broken internal links | 🟡 | 404 responses |
| Orphan pages | 🟢 | No internal links to page |
| Deep pages | 🟢 | >3 clicks from homepage |

## Content Templates

### Blog Post Structure

```
H1: [Primary Keyword] - [Benefit/Hook]

Introduction (100-150 words)
- Hook the reader
- Introduce the problem
- Preview the solution

H2: [What/Why Section]
[Content]

H2: [How-To Section]
H3: Step 1
H3: Step 2
H3: Step 3

H2: [Additional Tips/Best Practices]
[Content with bullet points]

H2: [FAQ Section] (optional - good for featured snippets)
[FAQ schema opportunity]

Conclusion
- Summary
- Call to action
- Internal links to related content
```

### Product Page Structure

```
H1: [Product Name] - [Key Feature]

[Hero image with alt text]

[Short description - 50-100 words]

H2: Features
[Bullet list]

H2: Specifications
[Table]

H2: Customer Reviews
[Review schema opportunity]

H2: Related Products
[Internal links]
```
