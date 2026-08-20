Finding a bug in already-approved code is a situation that requires quick, transparent action. My approach depends on the severity of the bug and whether it's been deployed.

If the bug is in code that's been merged but not deployed, I immediately flag it to the author and the team. I create a fix PR and expedite its review. If the fix is simple and low-risk, I might merge it directly with a note explaining the issue. If the fix is complex, I revert the original PR first to unblock deployments, then work on a proper fix.

If the bug is in code that's already deployed, I assess the severity. A critical bug (data loss, security vulnerability, feature completely broken) gets an immediate hotfix—I drop whatever I'm working on and fix it. A non-critical bug (cosmetic issue, minor logic error with limited impact) gets a ticket and normal prioritization.

Regardless of severity, I don't assign blame. The bug slipped through the review process, which means the process has a gap—not that the author or reviewer failed. I focus on the fix and the prevention: how did this bug get through? Was the test coverage insufficient? Was the review checklist missing an item? Should we add a linting rule or automated check?

I use the incident as a learning opportunity. If the bug reveals a common mistake pattern, I suggest adding it to the review checklist or writing a linting rule to catch it automatically. If the bug was caused by unclear requirements, I advocate for better acceptance criteria. The goal is to make the system more robust so similar bugs are caught earlier in the future.

I also communicate openly about the bug. If it affected users, I notify the relevant stakeholders and include it in the team's incident log. Hiding bugs or silently fixing them erodes trust and prevents the team from learning. Transparency about mistakes—especially from senior team members—sets the tone that it's safe to acknowledge and learn from errors.