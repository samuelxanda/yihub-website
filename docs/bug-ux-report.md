# Bug & UX Audit — Youth Innovators Hub

This report is based on a code review of the current repo.

## ✅ Bugs (Functional Issues)

1. **Sticker rotation breaks for negative rotates**  
   - **File:** `components/Sticker.tsx`  
   - **Issue:** Inline `--tw-rotate` calculation always produces a positive degree. Classes like `-rotate-6` would render as positive rotation.  
   - **Impact:** Incorrect visual rotation when negative rotate classes are used.

2. **Broken Tailwind class in Sticker**  
   - **File:** `components/Sticker.tsx`  
   - **Issue:** `tracking-widesm:shadow-[...]` is missing a space, so both classes are invalid.  
   - **Impact:** Missing `tracking-wide` and `sm:shadow-*` styles.

3. **Project submission verification persists across events**  
   - **File:** `pages/ProjectSubmissionPage.tsx`  
   - **Issue:** `verified` and `teamLeadEmail` are not reset when `eventSlug` changes.  
   - **Impact:** User can submit to a new event without re‑verification.

4. **Submission closed state persists across events**  
   - **File:** `pages/ProjectSubmissionPage.tsx`  
   - **Issue:** `submissionClosed` is only set to `true` and never reset to `false` when loading a new event.  
   - **Impact:** Users may see “Submissions Closed” on open events.

5. **Airtable filterByFormula input not escaped**  
   - **Files:**  
     - `netlify/functions/event-projects.ts`  
     - `netlify/functions/project.ts`  
     - `netlify/functions/check-registration.ts`  
     - `netlify/functions/register-participant.ts`  
     - `netlify/functions/submit-project.ts`  
   - **Issue:** User-controlled values are injected into Airtable formulas without escaping quotes.  
   - **Impact:** Slugs/emails containing quotes can break queries or cause 500s.

6. **School detail returns 200 for unknown schools**  
   - **File:** `netlify/functions/school-projects.ts`  
   - **Issue:** If no projects match, API still returns `{ school: schoolSlug }` with 200.  
   - **Impact:** UI shows a fake school header instead of a 404/not found.

---

## ⚠️ Bad UX / Accessibility Issues

1. **Mobile menu toggle missing aria-label**  
   - **Files:** `App.tsx`, `components/ShowcaseLayout.tsx`, `pages/ActivityPage.tsx`  
   - **Impact:** Screen readers cannot identify the menu toggle button.

2. **Contact modal lacks focus trap / escape close**  
   - **File:** `App.tsx`  
   - **Impact:** Keyboard users can tab behind modal and can’t close with `Esc`.

3. **Mobile menu doesn’t lock background scroll**  
   - **Files:** same as above  
   - **Impact:** Page scrolls under overlay, causing disorientation.

4. **Nav section scroll doesn’t update URL hash**  
   - **File:** `App.tsx`  
   - **Issue:** `scrollTo` prevents default and never updates `location.hash`.  
   - **Impact:** Deep-linking and back/forward navigation don’t work for sections.

5. **Hero heading gets smaller on tablets**  
   - **File:** `App.tsx`  
   - **Issue:** `md:text-2xl` makes the hero headline smaller at the tablet breakpoint.  
   - **Impact:** Jarring typography regression on medium screens.

6. **Team member email input gives no feedback on failure**  
   - **File:** `pages/ProjectSubmissionPage.tsx`  
   - **Issue:** Invalid email or non-added input fails silently.  
   - **Impact:** Users don’t know why the chip isn’t added.
   
   
   


OUTPUT:
- Only changed files or diffs
- No explanations

INPUT PLAN:
[PASTE APPROVED MARKDOWN PLAN HERE]
