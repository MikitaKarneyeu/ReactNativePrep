Web accessibility (a11y) is the practice of designing and developing websites and web applications that can be used by everyone, including people with disabilities. This includes people with visual, auditory, motor, cognitive, and neurological disabilities, as well as temporary disabilities (broken arm), situational limitations (bright sunlight), and aging-related changes.

**Types of disabilities to consider:**

1. **Visual** — Blindness, low vision, color blindness, cataracts
2. **Auditory** — Deafness, hard of hearing
3. **Motor** — Inability to use a mouse, limited fine motor control, paralysis
4. **Cognitive** — Dyslexia, ADHD, autism, memory impairments, learning disabilities
5. **Speech** — Difficulty speaking (for voice-controlled interfaces)

**Why accessibility is important:**

1. **Legal requirements** — Many countries have laws requiring digital accessibility:
   - ADA (Americans with Disabilities Act) — US
   - EAA (European Accessibility Act) — EU
   - AODA (Accessibility for Ontarians with Disabilities Act) — Canada
   - Section 508 — US federal agencies

2. **Market reach** — Over 1 billion people worldwide have some form of disability. Making your site accessible expands your potential audience.

3. **Better UX for everyone** — Accessibility improvements benefit all users:
   - Captions help in noisy environments
   - Keyboard navigation helps power users
   - Clear structure helps mobile users
   - Good contrast helps in bright sunlight

4. **SEO benefits** — Accessible sites tend to rank better:
   - Semantic HTML is better understood by search engines
   - Alt text helps image search
   - Proper heading structure improves content understanding
   - Transcripts and captions improve content indexability

5. **Corporate responsibility** — Inclusive design demonstrates social responsibility

**Core principles (POUR):**

The Web Content Accessibility Guidelines (WCAG) are organized around four principles:

1. **Perceivable** — Information must be presentable in ways users can perceive
   - Text alternatives for images
   - Captions for videos
   - Sufficient color contrast
   - Content adaptable to different presentations

2. **Operable** — Interface must be operable by all users
   - Keyboard accessible
   - Enough time to read content
   - No content that causes seizures
   - Clear navigation

3. **Understandable** — Information and UI must be understandable
   - Readable text
   - Predictable behavior
   - Input assistance (error messages, labels)

4. **Robust** — Content must be robust enough for diverse user agents
   - Valid HTML
   - Compatible with assistive technologies

**Quick accessibility wins:**

```html
<!-- Use semantic HTML -->
<button>Submit</button>  <!-- ✅ -->
<div onclick="submit()">Submit</div>  <!-- ❌ -->

<!-- Add alt text to images -->
<img src="chart.png" alt="Revenue increased 50% from Q1 to Q4">  <!-- ✅ -->
<img src="chart.png">  <!-- ❌ -->

<!-- Ensure sufficient contrast -->
/* 4.5:1 for normal text, 3:1 for large text */
color: #333; background: #fff;  <!-- ✅ ratio: 12.6:1 -->
color: #999; background: #fff;  <!-- ❌ ratio: 2.8:1 -->

<!-- Label form inputs -->
<label for="email">Email</label>
<input id="email" type="email">  <!-- ✅ -->
<input type="email" placeholder="Email">  <!-- ❌ -->

<!-- Use proper heading hierarchy -->
<h1>Title</h1>
<h2>Section</h2>
<h3>Subsection</h3>  <!-- ✅ -->
```

Accessibility is not a feature to add at the end — it should be a fundamental consideration throughout the design and development process.
