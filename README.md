
  # Academic Quality, Assurance of Teaching

  A digital Verification of Subject Files workflow for the Academic Quality, Assurance of Teaching (AQAT), based on the PNG University of Technology assessment sheet.

  The app begins with a local sign-in screen. Administrator access opens the AQAT dashboard, which controls the lecturer, Head of School (HoS), and QA reviewer workflow views. Lecturers submit evidence and teaching allocations; the dedicated **Head of School** login verifies submitted records before AQAT review. Administrators can open or close the lecturer submission window and set a due date. The dashboard also includes persistent **Platform settings** for the platform name, institution name used on PDFs, support email, result filename prefix, and Google sign-in configuration status. The app captures subject and staff details, stores lecturer evidence metadata against the 12 scored checks in the supplied AQAT sheet, presents the examiners’ report and annual review as supporting records, records Head of School verification, and supports AQAT reviewer ratings and Chairperson approval. QA reviewers can rate individual checks or use the **Rate all checklist items** controls to assign Complete (24/24), Incomplete (12/24), or Nil (0/24), then refine individual rows. Workflow state and the local session are persisted in browser local storage. Enter a name in **Rename result file** before download to save the branded PDF result under that name; `.pdf` is applied automatically. It includes subject metadata, ratings, comments, evidence records, total marks, converted result, and Chairperson approval. It can be installed as a phone-friendly web app; after it has loaded once, its runtime cache supports reopening the application while offline.

  The form displays the 12 score-bearing checks from the AQAT sheet (maximum score 24), plus examiners’ report and annual-review supporting records. The final AQAT result is calculated as `total / 24 × 4`.

  The administrator dashboard includes the supplied School of Agriculture 2026 Semester One AQAT summary report, with its 14 subject-file records, assessment comments, rates, submission dates, and reported summary.

  ## Running locally

  ```bash
  npm install
  npm run dev
  ```

  Use the **Lecturer**, **Head of School**, and **QA reviewer** controls in the application header to move through the workflow roles.

  ## Google sign-in

  To enable the Google Identity prompt, configure a Google OAuth web client for the deployed URL and set `VITE_GOOGLE_CLIENT_ID` in the deployment environment before building. The current browser-only prototype uses the returned profile to start a local session; production deployments must verify the Google credential server-side and enforce institutional role access.

  ## Publishing with GitHub Pages

  The repository includes a GitHub Actions deployment workflow. Merge the deployment commit into `main`, then open **Settings → Pages** in GitHub and select **GitHub Actions** as the source. The site will be published at `https://ismaeldono-afk.github.io/AQAT/` after the workflow completes. To enable Google sign-in in that build, add `VITE_GOOGLE_CLIENT_ID` as a repository Actions variable under **Settings → Secrets and variables → Actions → Variables**.
  