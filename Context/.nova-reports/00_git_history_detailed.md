commit 981d966321044a7d2fb33c339749c856924a563b
Merge: 04201f9 e11d75b
Author: Daniel <Daniel@specno.com>
Date:   Fri Feb 13 16:43:43 2026 +0200

    Merge branch 'main' of https://github.com/danielnov-rgb/togetherpoc into CV-builder-Tool

commit e11d75bdfcfaf8cdd51c0f89a74530399236b0d2
Author: Jacques Jordaan <jacquesjordaan@Jacquess-MacBook-Air-2.local>
Date:   Fri Feb 13 16:39:32 2026 +0200

    Completion text overhaul: encouraging tone, DNA mentions, milestone-aware headings
    
    - CompletionFooter heading: "Well done!" for regular cards, "Congratulations!" for last card in milestone
    - Default body text now mentions My DNA for progress tracking
    - Seed data completion body updated across both seed files (no reflection/strides mentions)
    - Removed hardcoded heading fields from end-of-milestone insights cards
    - FreshnessBadge: fixed visibility on dark hero, added hover tooltips
    - CompletionMessage: removed strides sentence
    - EvidenceCard: cleaned up completion body text
    
    Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>

 .../go-cards/shared/CompletionFooter.jsx           | 49 ++++++++++------------
 .../go-cards/shared/CompletionMessage.jsx          | 12 ++----
 src/components/go-cards/types/EvidenceCard.jsx     |  8 ++--
 .../go-cards/types/evidence/FreshnessBadge.jsx     | 38 ++++++++++++++---
 src/data/seed-land-your-next-job.js                | 48 ++++++++++-----------
 src/data/seed.js                                   | 13 +++---
 6 files changed, 90 insertions(+), 78 deletions(-)

commit 04201f99036bf7b9e3c7ecff1d3637a15544e12a
Merge: 97edee5 0502ab3
Author: Daniel <Daniel@specno.com>
Date:   Fri Feb 13 16:39:27 2026 +0200

    Merge remote main branch with Jacques' latest updates
    
    Accept Jacques' changes for all conflicting files.
    
    Co-Authored-By: Claude Opus 4.5 <noreply@anthropic.com>

commit 925e5aae55915229042c0311399a029ff1f76ce7
Author: Jacques Jordaan <jacquesjordaan@Jacquess-MacBook-Air-2.local>
Date:   Fri Feb 13 15:42:28 2026 +0200

    Fix go-card title truncation on hover — show full title instead of clamping to 2 lines
    
    Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>

 src/components/go-cards/GoCardCarouselCard.jsx | 2 +-
 1 file changed, 1 insertion(+), 1 deletion(-)

commit 73fbc87fdabf5ced2661351874e48098428b13c9
Author: Jacques Jordaan <jacquesjordaan@Jacquess-MacBook-Air-2.local>
Date:   Fri Feb 13 15:38:06 2026 +0200

    UI cleanup: in-progress lips, forced light mode cards, stride data, and Figma alignment
    
    - Add "In Progress" and "Completed" lip indicators on go-cards, milestone cards, and path cards
    - Force light-mode CSS variables on milestone and path carousel cards for dark mode consistency
    - Fetch go-card engagement data for Jump Back In section (strides display)
    - Add solid accent-md colors (accentMdSolid) to prevent opacity blending issues on path cards
    - Align PathCard right section with Figma: font-display, milestone numbering, leading, padding
    - Fix MilestoneCarouselCard content wrapper flex-1 to fill card height in both states
    - Add cursor-pointer to carousel nav buttons and navbar settings
    - Update badge, dimension, type, and strides components for pill styling
    
    Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>

 src/components/go-cards/GoCardCarouselCard.jsx     |  98 +++++++++++++++-----
 src/components/go-cards/shared/CardHeroSection.jsx |  17 +---
 src/components/go-cards/shared/DimensionBadge.jsx  |  13 ++-
 src/components/go-cards/shared/StridesBadge.jsx    |  42 ++++++---
 src/components/go-cards/shared/TypeBadge.jsx       |  25 ++++-
 src/components/layout/Navbar.jsx                   |   6 +-
 src/components/milestones/MilestoneAccordion.jsx   |   4 +-
 src/components/milestones/MilestoneCard.jsx        |   5 -
 .../milestones/MilestoneCarouselCard.jsx           |  78 +++++++++-------
 .../milestones/MilestonePreviewModal.jsx           |   5 +-
 src/components/paths/PathCard.jsx                  | 101 ++++++++++++---------
 src/components/shared/Carousel.jsx                 |   4 +-
 src/config/dimensions.js                           |  18 ++++
 src/pages/Discover.jsx                             |  68 +++++++++++++-
 src/pages/MilestoneView.jsx                        |   7 +-
 src/pages/PathView.jsx                             |   1 +
 src/services/firestore.js                          |  16 ++++
 src/services/progressService.js                    |   9 +-
 18 files changed, 360 insertions(+), 157 deletions(-)

commit b34ce5596f104cb0b10f37bf74ed26bf8839f0c1
Author: Jacques Jordaan <jacquesjordaan@Jacquess-MacBook-Air-2.local>
Date:   Fri Feb 13 13:53:26 2026 +0200

    Evidence co-create feature: AI-guided document builder with chat UI
    
    Add co-create tray to EvidenceCard with phased conversation flow
    (gathering, generating, complete), chat input/message components,
    document generation via docx library, and AI orchestration service.
    Includes new seed data for co-create evidence cards and minor
    cleanup of unused code in GoCardPreview, ArticleHero, and PathCard.
    
    Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>

 package-lock.json                                  |  88 +++++
 package.json                                       |   1 +
 src/components/go-cards/GoCardPreview.jsx          |   6 -
 src/components/go-cards/types/EvidenceCard.jsx     |  43 +++
 .../go-cards/types/article/ArticleHero.jsx         |  16 -
 .../types/evidence/co-create/ChatInput.jsx         | 197 +++++++++++
 .../types/evidence/co-create/ChatMessage.jsx       |  48 +++
 .../types/evidence/co-create/CoCreateButton.jsx    |  31 ++
 .../evidence/co-create/CoCreateOrchestrator.jsx    |  60 ++++
 .../types/evidence/co-create/CoCreateTray.jsx      |  66 ++++
 .../types/evidence/co-create/PhaseComplete.jsx     | 106 ++++++
 .../types/evidence/co-create/PhaseConversation.jsx | 153 +++++++++
 .../types/evidence/co-create/PhaseGathering.jsx    | 300 ++++++++++++++++
 .../types/evidence/co-create/PhaseGenerating.jsx   |  37 ++
 src/components/paths/PathCard.jsx                  |   5 -
 src/components/paths/PathOverviewModal.jsx         |   6 -
 src/data/seed-land-your-next-job.js                | 103 +++++-
 src/data/seed.js                                   |   9 +-
 src/hooks/useCoCreate.js                           | 331 ++++++++++++++++++
 src/pages/PathView.jsx                             |   6 +-
 src/services/coCreateAIService.js                  | 381 +++++++++++++++++++++
 src/utils/documentGenerator.js                     |  51 +++
 src/utils/documentTemplates.js                     | 194 +++++++++++
 23 files changed, 2193 insertions(+), 45 deletions(-)

commit 0502ab3da2261b2c9d983a4fb195d6d294f07c60
Author: Jacques Jordaan <jacquesjordaan@Jacquess-MacBook-Air-2.local>
Date:   Fri Feb 13 11:14:52 2026 +0200

    Em-dash cleanup, Jump Back In milestone fix, and badge score detection
    
    Replace em-dashes with standard punctuation across all content and AI prompts.
    Fix Jump Back In to fetch full milestone docs for in-progress milestones
    instead of relying on denormalized progress data. Fix quiz-score badge
    detection to handle nested response structure.
    
    Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>

 .../tools/InterviewStoryBuilder/StepAnalyzing.jsx  |   2 +-
 .../tools/InterviewStoryBuilder/StepInput.jsx      |   4 +-
 .../tools/InterviewStoryBuilder/StepQuestions.jsx  |   2 +-
 .../tools/QuickProofGenerator/StepAnalyzing.jsx    |   2 +-
 .../RoleEvidenceMatcher/RoleEvidenceMatcher.jsx    |  17 ++--
 .../tools/RoleEvidenceMatcher/StepAnalyzing.jsx    |   2 +-
 .../tools/RoleEvidenceMatcher/StepGapAnalysis.jsx  |   8 +-
 src/components/go-cards/types/InsightsCard.jsx     |  16 ++--
 src/components/go-cards/types/ToolCard.jsx         |   2 +-
 .../go-cards/types/event-parts/EventQuote.jsx      |   2 +-
 .../go-cards/types/evidence/UploadZone.jsx         |   2 +-
 .../go-cards/types/insights/JourneyProgress.jsx    |   8 +-
 src/components/go-cards/types/quiz/quizAnalyzer.js |   4 +-
 src/data/seed-land-your-next-job.js                |  66 +++++++------
 src/data/seed.js                                   | 106 ++++++++++-----------
 src/data/seedRegistry.js                           |   4 +-
 src/pages/Discover.jsx                             |  38 +++++++-
 src/pages/Onboarding.jsx                           |  10 +-
 src/services/badgeService.js                       |   5 +-
 src/services/evidenceAIService.js                  |   4 +-
 src/services/firestore.js                          |  18 ++++
 src/services/insightsAIService.js                  |   4 +-
 src/services/progressService.js                    |  41 ++++----
 src/services/toolAIService.js                      |   2 +-
 24 files changed, 216 insertions(+), 153 deletions(-)

commit 8b8d7158e466cbd53fbcf79af7291cc30acba46f
Author: Jacques Jordaan <jacquesjordaan@Jacquess-MacBook-Air-2.local>
Date:   Thu Feb 12 21:48:40 2026 +0200

    MyDNA page: write-time stats aggregation, name editing, badges display, and onboarding flow
    
    Rewrites MyDNA to read pre-computed stats from user document (0 additional
    Firestore reads). Adds inline name editing, badge grouping with counts,
    and write-time stat aggregation during go-card completion. Includes
    onboarding page, routing updates, and various UI refinements.
    
    Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>

 src/App.jsx                                        |   9 +-
 src/components/go-cards/GoCardExpanded.jsx         |  60 +-
 .../go-cards/shared/CompletionFooter.jsx           |  13 +-
 .../go-cards/shared/CompletionMessage.jsx          |  12 +-
 src/components/go-cards/shared/DimensionBadge.jsx  |   4 +-
 src/components/go-cards/shared/StridesBadge.jsx    |  29 +-
 src/components/go-cards/types/MediaCard.jsx        |   1 +
 .../go-cards/types/insights/JourneyProgress.jsx    |  56 +-
 .../go-cards/types/video/VideoPlayer.jsx           |  23 +-
 src/components/layout/Navbar.jsx                   |   8 +-
 src/components/milestones/MilestoneCard.jsx        |   7 +-
 .../milestones/MilestoneCarouselCard.jsx           | 283 ++++++++--
 .../milestones/MilestonePreviewModal.jsx           |   2 +-
 src/components/paths/PathCard.jsx                  | 102 ++--
 src/components/paths/PathOverviewModal.jsx         |   2 +-
 src/components/shared/StatCard.jsx                 |   5 +-
 src/config/designTokens.js                         |  62 +++
 src/context/AuthContext.jsx                        |  70 ++-
 src/data/seed-land-your-next-job.js                |  78 +++
 src/data/seed.js                                   |  30 +
 src/hooks/useGoCardPageData.js                     |  14 +-
 src/hooks/useProgress.js                           |  14 +-
 src/pages/Discover.jsx                             | 116 ++--
 src/pages/Login.jsx                                |  84 ++-
 src/pages/MyDNA.jsx                                | 299 +++++++---
 src/pages/Onboarding.jsx                           | 613 +++++++++++++++++++++
 src/pages/PathView.jsx                             |  41 +-
 src/services/auth.js                               |   1 +
 src/services/firestore.js                          | 264 ++++++++-
 src/services/progressService.js                    | 207 +++++--
 30 files changed, 2066 insertions(+), 443 deletions(-)

commit d600a5dd778bf409b7bc6b7bc02226af3b1d549b
Author: Jacques Jordaan <jacquesjordaan@Jacquess-MacBook-Air-2.local>
Date:   Thu Feb 12 18:38:35 2026 +0200

    Interview Story Builder tool, insights journey progress, and UX improvements
    
    - Add Interview Story Builder tool with 4-phase state machine (prefilling → input → analyzing → questions), SOAR answer frameworks in first person using real CV evidence, practice areas with AI coaching feedback, auto-save on generation, and config-driven prefill from prior path cards
    - Add inline "View Existing Questions" / "Regenerate" buttons when returning to ISB with existing results
    - Fix GoCardExpanded save chain to check response save result before marking complete
    - Add JourneyProgress component for insights card
    - Add GoCardPreviewModal and MilestonePreviewModal
    - Add badgeService for badge management
    - Update seed data with ISB tool configuration and first-person SOAR prompts
    - Update quiz outcomes, login page, insights data hook, and milestone accordion
    
    Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>

 .claude/tools/data-architecture.md                 | 560 +++++++++++++++++++++
 src/components/go-cards/GoCardExpanded.jsx         |   7 +-
 src/components/go-cards/GoCardPreviewModal.jsx     | 195 +++++++
 .../InterviewStoryBuilder.jsx                      | 337 +++++++++++++
 .../tools/InterviewStoryBuilder/StepAnalyzing.jsx  |  70 +++
 .../tools/InterviewStoryBuilder/StepInput.jsx      | 464 +++++++++++++++++
 .../tools/InterviewStoryBuilder/StepQuestions.jsx  | 554 ++++++++++++++++++++
 .../InterviewStoryBuilder/interviewAnalyzer.js     | 115 +++++
 src/components/go-cards/types/InsightsCard.jsx     |  17 +-
 src/components/go-cards/types/QuizCard.jsx         |  16 +-
 src/components/go-cards/types/ToolCard.jsx         |   3 +
 .../go-cards/types/insights/JourneyProgress.jsx    | 547 ++++++++++++++++++++
 .../go-cards/types/quiz/QuizOutcomes.jsx           |  36 +-
 src/components/milestones/MilestoneAccordion.jsx   |   1 -
 .../milestones/MilestonePreviewModal.jsx           | 258 ++++++++++
 src/data/seed-land-your-next-job.js                | 436 ++++++++++++----
 src/data/seedRegistry.js                           |   2 +-
 src/hooks/useInsightsData.js                       |   7 +-
 src/pages/Login.jsx                                |  98 +++-
 src/services/badgeService.js                       | 121 +++++
 src/services/insightsAIService.js                  |  26 +-
 src/services/toolAIService.js                      | 117 +++++
 22 files changed, 3850 insertions(+), 137 deletions(-)

commit 870dd6ae72ad8dcb207bed702acf9e1aee0d4901
Author: Jacques Jordaan <jacquesjordaan@Jacquess-MacBook-Air-2.local>
Date:   Thu Feb 12 10:53:21 2026 +0200

    Seed data updates, insights improvements, and M5 video card conversion
    
    - Convert M3/M4/M5 final reflection cards to insights cards, remove M6 reflection card (33→32 go-cards)
    - Replace M5 podcast placeholder with Madeline Mann STAR method video card
    - Update SOAR→STAR references in M5 tool and event cards
    - Add orphaned go-card cleanup to seed process
    - Improve insights analyzer with evidence analysis and milestone prioritisation
    - Update CardHeroSection with dimension-colored overlay approach
    - Insights card and AI service prompt improvements
    
    Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>

 src/components/go-cards/shared/CardHeroSection.jsx |  17 +-
 src/components/go-cards/types/InsightsCard.jsx     |   8 -
 .../go-cards/types/insights/FocusAreas.jsx         |   1 -
 .../go-cards/types/insights/KeyLearnings.jsx       |  37 +--
 .../go-cards/types/insights/LearningCard.jsx       |   4 +-
 .../go-cards/types/insights/insightsAnalyzer.js    | 104 +-----
 src/data/seed-land-your-next-job.js                | 368 +++++++++------------
 src/data/seedRegistry.js                           |   2 +-
 src/hooks/useInsightsData.js                       | 120 ++++---
 src/pages/Discover.jsx                             |  64 +++-
 src/pages/Home.jsx                                 |  26 +-
 src/pages/SeedData.jsx                             |  16 +-
 src/services/aiService.js                          |  10 -
 src/services/insightsAIService.js                  | 107 +++---
 14 files changed, 372 insertions(+), 512 deletions(-)

commit ecd65fc4340d137c4f42a62ace78516536c57d4a
Merge: 8c432d3 1fde1ab
Author: Jacques Jordaan <36951140+Jjordaan15@users.noreply.github.com>
Date:   Thu Feb 12 08:33:04 2026 +0200

    Merge pull request #1 from danielnov-rgb/users_path_view_update
    
    User path view updates, tool improvements, and evidence card UX

commit 1fde1ab8d5cee747f2ef86bc10ad3082cedd6c22
Author: Jacques Jordaan <jacquesjordaan@Jacquess-MacBook-Air-2.local>
Date:   Wed Feb 11 18:33:13 2026 +0200

    Quick-Proof Generator tool, evidence card UX, loading skeletons, and tool improvements
    
    - Add Quick-Proof Project Generator tool with seniority-aware difficulty rules
    - Fix tool AI caching: compare against saved Firestore data instead of unreliable JSON.stringify cache
    - Auto-save new AI results to DB when regenerating on already-completed tool cards
    - Add evidence card template downloads, version history, and upload UX improvements
    - Consolidate GoCardExpanded data fetching into useGoCardPageData hook
    - Add loading skeleton components for all page views
    - Widen go-card content containers from 608px to 730px
    - Constrain AI difficulty output to enum (beginner/intermediate/advanced)
    
    Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>

 CLAUDE.md                                          |   1 +
 public/templates/Case_Study_Template.docx          | Bin 0 -> 10322 bytes
 public/templates/Impact_Document_Template.docx     | Bin 0 -> 10442 bytes
 public/templates/Project_Summary_Template.docx     | Bin 0 -> 10524 bytes
 src/components/go-cards/GoCardExpanded.jsx         | 287 +++++++++++----------
 .../QuickProofGenerator/QuickProofGenerator.jsx    | 207 +++++++++++++++
 .../tools/QuickProofGenerator/StepAnalyzing.jsx    |  63 +++++
 .../tools/QuickProofGenerator/StepInput.jsx        | 184 +++++++++++++
 .../tools/QuickProofGenerator/StepProjects.jsx     | 214 +++++++++++++++
 .../RoleEvidenceMatcher/RoleEvidenceMatcher.jsx    |  86 +++---
 src/components/go-cards/types/ArticleCard.jsx      |   9 +-
 src/components/go-cards/types/AssessmentCard.jsx   |   8 +-
 src/components/go-cards/types/EventCard.jsx        |   8 +-
 src/components/go-cards/types/EvidenceCard.jsx     | 157 ++++++-----
 src/components/go-cards/types/InsightsCard.jsx     |   7 +-
 src/components/go-cards/types/PodcastCard.jsx      |  10 +-
 src/components/go-cards/types/PollCard.jsx         |   8 +-
 src/components/go-cards/types/QuizCard.jsx         |   8 +-
 src/components/go-cards/types/ReflectionCard.jsx   |  24 +-
 src/components/go-cards/types/ToolCard.jsx         |   6 +-
 src/components/go-cards/types/VideoCard.jsx        |  10 +-
 .../go-cards/types/article/ArticleBody.jsx         |   2 +-
 .../go-cards/types/article/blocks/ImageBlock.jsx   |   2 +-
 .../types/event-parts/EventDescription.jsx         |   2 +-
 .../go-cards/types/event-parts/EventStats.jsx      |   2 +-
 .../go-cards/types/evidence/TemplateDownload.jsx   |  29 ++-
 .../go-cards/types/evidence/UploadZone.jsx         | 102 ++++----
 .../go-cards/types/evidence/VersionHistory.jsx     |  46 +++-
 .../go-cards/types/insights/InsightsEmptyState.jsx |   2 +-
 src/components/shared/DiscoverLoadingSkeleton.jsx  |  29 +++
 src/components/shared/HomeLoadingSkeleton.jsx      |  28 ++
 .../shared/MilestoneViewLoadingSkeleton.jsx        |  66 +++++
 src/components/shared/PathViewLoadingSkeleton.jsx  |  78 ++++++
 src/components/shared/SkeletonElements.jsx         |  79 ++++++
 src/data/seed-land-your-next-job.js                | 139 +++++++++-
 src/hooks/useEvidenceRecord.js                     |  27 ++
 src/hooks/useGoCardPageData.js                     | 242 +++++++++++++++++
 src/hooks/useNextCardRecommendation.js             |   8 +-
 src/pages/Discover.jsx                             |  10 +-
 src/pages/Home.jsx                                 |  10 +-
 src/pages/MilestoneView.jsx                        |  10 +-
 src/pages/PathView.jsx                             |  10 +-
 src/services/evidenceService.js                    |  49 ++++
 src/services/toolAIService.js                      |  59 ++++-
 44 files changed, 1911 insertions(+), 417 deletions(-)

commit c9eaff900983f525cac95f3ed4b9c153c9a33834
Author: Jacques Jordaan <jacquesjordaan@Jacquess-MacBook-Air-2.local>
Date:   Wed Feb 11 13:51:09 2026 +0200

    Fix document analysis for .docx files — extract text client-side for unsupported MIME types
    
    Gemini multimodal doesn't support Office formats. For .docx files, use mammoth
    to extract text in the browser before sending to the AI. PDFs and images still
    use direct binary upload.
    
    Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>

 package-lock.json                 | 233 +++++++++++++++++++++++++++++++++++++-
 package.json                      |   1 +
 src/services/evidenceAIService.js |  83 +++++++++++++-
 3 files changed, 310 insertions(+), 7 deletions(-)

commit 80dad8e49239f670be2b468f769f05e186811696
Author: Jacques Jordaan <jacquesjordaan@Jacquess-MacBook-Air-2.local>
Date:   Wed Feb 11 11:40:24 2026 +0200

    Add per-user path access control with allowedPaths on user documents
    
    Users now have an allowedPaths array on their Firestore document that controls
    which paths (and their go-cards) are visible. Home, Discover, and MyDNA pages
    filter content to only allowed paths. Admin UI on SeedData page allows looking
    up users by email and toggling path access. Backwards compatible: existing users
    without the field see all content.
    
    Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>

 src/context/AuthContext.jsx |  23 ++++++--
 src/hooks/usePath.js        |  19 ++++---
 src/pages/Discover.jsx      |  31 ++++++-----
 src/pages/Home.jsx          |  31 ++++++-----
 src/pages/MyDNA.jsx         |  22 ++++----
 src/pages/SeedData.jsx      | 128 +++++++++++++++++++++++++++++++++++++++++++-
 src/services/auth.js        |   1 +
 src/services/firestore.js   | 116 +++++++++++++++++++++++++++++++++++++++
 8 files changed, 321 insertions(+), 50 deletions(-)

commit 8c432d388cde3fc54e98599aebd9118ac41bfcfa
Author: Jacques Jordaan <jacquesjordaan@Jacquess-MacBook-Air-2.local>
Date:   Wed Feb 11 11:30:23 2026 +0200

    Insights: evidence analysis integration, milestone prioritisation, and prompt improvements
    
    - Fix milestone data flow bug: GoCardExpanded now passes actual milestones array instead of undefined path.milestones
    - Enrich evidence responses in insights AI service by fetching document analysis from evidence collection
    - Fix EvidenceCard onComplete to pass uploadNote, fileName, and criteriaConfirmed
    - Add milestone prioritisation to AI prompt with [CURRENT MILESTONE] markers and real titles
    - Add evidence quality evaluation guidelines to AI prompt — cross-references learner progress against uploaded evidence
    - Bump insights schema version to 5 to invalidate stale caches
    - Rebrand navbar and browser title from 2gthr to POC
    - Add Firebase Hosting config
    
    Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>

 firebase.json                                      |  16 ++
 index.html                                         |   2 +-
 src/components/go-cards/GoCardExpanded.jsx         |   4 +-
 src/components/go-cards/types/EvidenceCard.jsx     |  39 +++-
 .../go-cards/types/evidence/DocumentAnalysis.jsx   | 246 +++++++++++++++++++++
 .../go-cards/types/insights/KeyLearnings.jsx       |  39 +++-
 .../go-cards/types/insights/LearningCard.jsx       |   2 +
 .../go-cards/types/insights/insightsAnalyzer.js    |  36 ++-
 src/components/layout/Navbar.jsx                   |   2 +-
 src/data/seed-land-your-next-job.js                | 162 +++++++++++++-
 src/data/seed.js                                   | 153 +++++++++++--
 src/hooks/useEvidenceRecord.js                     |  50 ++++-
 src/hooks/useInsightsData.js                       |  18 +-
 src/services/aiService.js                          |  87 +++++++-
 src/services/evidenceAIService.js                  | 130 +++++++++++
 src/services/evidenceService.js                    |  31 +++
 src/services/insightsAIService.js                  | 122 ++++++++--
 src/utils/responseBuilder.js                       |   1 +
 18 files changed, 1073 insertions(+), 67 deletions(-)

commit 97edee5997577bf3d211369d5e609e1486fce2cf
Merge: f689167 f013a85
Author: Daniel <Daniel@specno.com>
Date:   Tue Feb 10 15:06:22 2026 +0200

    Merge remote-tracking branch 'origin/main' into CV-builder-Tool
    
    Resolve merge conflicts between CV Builder feature and Jacques' updates:
    - Keep Jacques' seedRegistry pattern for seed data organization
    - Keep Jacques' updated GoCard components (QuizCard, ReflectionCard, etc.)
    - Preserve CV Builder tool in seed-land-your-next-job.js
    - Use Jacques' simplified SeedData page with registry selector
    
    Co-Authored-By: Claude Opus 4.5 <noreply@anthropic.com>

commit f013a85cdba181c9f096a7a89fd7385919825a00
Author: Jacques Jordaan <jacquesjordaan@Jacquess-MacBook-Air-2.local>
Date:   Tue Feb 10 13:40:26 2026 +0200

    Add Insights GoCard, Role-Evidence Matcher tool, response persistence, and AI analysis
    
    Introduces the Insights GoCard type with AI-powered personalised analysis
    (journey narrative, progress snapshot with animated strides, key learnings
    with detailed focus areas). Adds the Role-Evidence Matcher interactive tool
    with 4-phase state machine (input → analyzing → rating → results). Implements
    enriched response persistence via Firestore responses collection, lazy-loaded
    saved responses for card revisits, and scroll-to-top behaviour on card entry.
    
    Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>

 .claude/tools/content-to-seed.md                   |  271 ++++-
 package-lock.json                                  | 1083 +++++++++-----------
 package.json                                       |    2 +-
 src/components/go-cards/GoCardExpanded.jsx         |   67 +-
 .../RoleEvidenceMatcher/RoleEvidenceMatcher.jsx    |  200 ++++
 .../tools/RoleEvidenceMatcher/StepAnalyzing.jsx    |   68 ++
 .../tools/RoleEvidenceMatcher/StepGapAnalysis.jsx  |  170 +++
 .../tools/RoleEvidenceMatcher/StepInput.jsx        |  151 +++
 .../tools/RoleEvidenceMatcher/StepRating.jsx       |  158 +++
 .../tools/RoleEvidenceMatcher/gapAnalyzer.js       |  132 +++
 src/components/go-cards/types/AssessmentCard.jsx   |   45 +-
 src/components/go-cards/types/EventCard.jsx        |    7 +-
 src/components/go-cards/types/EvidenceCard.jsx     |    2 +-
 src/components/go-cards/types/InsightsCard.jsx     |  130 +++
 src/components/go-cards/types/PollCard.jsx         |    7 +-
 src/components/go-cards/types/QuizCard.jsx         |   40 +-
 src/components/go-cards/types/ReflectionCard.jsx   |   43 +-
 src/components/go-cards/types/ToolCard.jsx         |    7 +-
 .../types/assessment/AssessmentResults.jsx         |   51 +-
 .../types/assessment/assessmentAnalyzer.js         |   54 +
 .../go-cards/types/insights/FocusAreas.jsx         |  155 +++
 .../go-cards/types/insights/InsightsEmptyState.jsx |   26 +
 .../types/insights/InsightsLoadingScreen.jsx       |   93 ++
 .../go-cards/types/insights/JourneyNarrative.jsx   |  139 +++
 .../go-cards/types/insights/KeyLearnings.jsx       |  288 ++++++
 .../go-cards/types/insights/LearningCard.jsx       |   42 +
 .../go-cards/types/insights/MetricCard.jsx         |   42 +
 .../go-cards/types/insights/ProgressRing.jsx       |   58 ++
 .../go-cards/types/insights/ProgressSnapshot.jsx   |  335 ++++++
 .../go-cards/types/insights/insightsAnalyzer.js    |  459 +++++++++
 src/data/seed-land-your-next-job.js                |  193 +++-
 src/data/seed.js                                   |   64 +-
 src/hooks/useGoCardResponse.js                     |   53 +
 src/hooks/useInsightsData.js                       |  194 ++++
 src/hooks/useProgress.js                           |   53 +-
 src/services/aiService.js                          |   79 ++
 src/services/firestore.js                          |  101 +-
 src/services/insightsAIService.js                  |  321 ++++++
 src/services/responseService.js                    |  128 +++
 src/services/toolAIService.js                      |  132 +++
 src/utils/responseBuilder.js                       |  453 ++++++++
 41 files changed, 5306 insertions(+), 790 deletions(-)

commit a6964df4e368cace07db41c4a2eff9b2effc8d02
Author: Jacques Jordaan <jacquesjordaan@Jacquess-MacBook-Air-2.local>
Date:   Mon Feb 9 18:46:35 2026 +0200

    Add Land Your Next Job path, new GoCard types, and multi-path seed system
    
    Introduces the second learning path (6 milestones, 33 go-cards) with fully
    enriched content including per-option quiz feedback, structured article blocks,
    evidence upload workflows, podcast chapters, and reflection configs. Adds seed
    registry for multi-path support, new Evidence/Poll/Video card types, and
    content-to-seed authoring tooling.
    
    Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>

 .claude/tools/content-template.md                  |  652 +++++++
 .claude/tools/content-to-seed.md                   |  904 +++++++++
 CLAUDE.md                                          |    1 +
 public/SeedContentData/milestone_1_content.md      | 1146 ++++++++++++
 public/SeedContentData/milestone_2_content.md      | 1161 ++++++++++++
 public/SeedContentData/milestone_3_content.md      | 1000 ++++++++++
 public/SeedContentData/milestone_4_content.md      |  813 ++++++++
 public/SeedContentData/milestone_5_content.md      |  885 +++++++++
 public/SeedContentData/milestone_6_content.md      |  945 ++++++++++
 public/images/2gthr-symbol-light.svg               |    3 +
 src/components/go-cards/GoCardExpanded.jsx         |   50 +-
 src/components/go-cards/shared/CardHeroSection.jsx |    2 +-
 .../go-cards/shared/CompletionFooter.jsx           |   10 +-
 .../go-cards/shared/CompletionMessage.jsx          |    4 +-
 src/components/go-cards/shared/TypeBadge.jsx       |    4 +-
 src/components/go-cards/types/AssessmentCard.jsx   |   84 +-
 src/components/go-cards/types/ChecklistCard.jsx    |  149 --
 src/components/go-cards/types/EvidenceCard.jsx     |  391 ++++
 src/components/go-cards/types/PollCard.jsx         |   92 +
 src/components/go-cards/types/QuizCard.jsx         |   48 +-
 src/components/go-cards/types/ReflectionCard.jsx   |  202 +-
 src/components/go-cards/types/ToolCard.jsx         |   41 +-
 src/components/go-cards/types/VideoCard.jsx        |   65 +
 .../types/assessment/AssessmentInsightCard.jsx     |   14 +-
 .../go-cards/types/checklist/ChecklistItem.jsx     |  114 --
 .../go-cards/types/evidence/AcceptanceCriteria.jsx |   77 +
 .../go-cards/types/evidence/EvidenceContext.jsx    |   35 +
 .../go-cards/types/evidence/EvidenceTask.jsx       |   41 +
 .../go-cards/types/evidence/FreshnessBadge.jsx     |   68 +
 .../go-cards/types/evidence/StreakDisplay.jsx      |   59 +
 .../go-cards/types/evidence/TemplateDownload.jsx   |   38 +
 .../go-cards/types/evidence/TipsSection.jsx        |   53 +
 .../types/evidence/UnsavedChangesModal.jsx         |   74 +
 .../go-cards/types/evidence/UpdatePrompt.jsx       |   62 +
 .../go-cards/types/evidence/UploadZone.jsx         |  211 +++
 .../go-cards/types/evidence/VersionHistory.jsx     |  105 ++
 .../go-cards/types/poll/PollQuestion.jsx           |   85 +
 .../go-cards/types/poll/SuggestedCards.jsx         |   52 +
 .../go-cards/types/quiz/QuizQuestion.jsx           |    8 +-
 .../go-cards/types/reflection/ChatInput.jsx        |   54 +
 .../go-cards/types/reflection/ChatMessage.jsx      |   23 +
 .../go-cards/types/reflection/FindingCard.jsx      |   38 +
 .../go-cards/types/reflection/ReflectionPrompt.jsx |    2 +-
 .../go-cards/types/reflection/ThemeTabs.jsx        |   21 +
 .../go-cards/types/video/ContentEngagement.jsx     |   40 +
 src/components/go-cards/types/video/ExpertBio.jsx  |   50 +
 .../go-cards/types/video/VideoContent.jsx          |   41 +
 .../go-cards/types/video/VideoPlayer.jsx           |   33 +
 src/components/milestones/MilestoneAccordion.jsx   |   32 +-
 src/components/milestones/MilestoneActions.jsx     |   54 +
 src/components/shared/FormInput.jsx                |    2 +-
 src/components/shared/FormSubmitButton.jsx         |    2 +-
 src/components/shared/ProgressBar.jsx              |    2 +-
 src/config/goCardTypes.js                          |   23 +-
 src/data/seed-land-your-next-job.js                | 1951 ++++++++++++++++++++
 src/data/seed.js                                   |  493 +++--
 src/data/seedImages.js                             |  166 ++
 src/data/seedRegistry.js                           |   23 +
 src/hooks/useEvidenceRecord.js                     |  122 ++
 src/pages/Home.jsx                                 |    2 +-
 src/pages/PathView.jsx                             |  145 +-
 src/pages/SeedData.jsx                             |  107 +-
 src/services/evidenceService.js                    |  258 +++
 src/utils/evidenceCalculations.js                  |  270 +++
 64 files changed, 13044 insertions(+), 658 deletions(-)

commit 35715447475d0cbda5b5966763259fea2572380f
Author: Jacques Jordaan <jacquesjordaan@Jacquess-MacBook-Air-2.local>
Date:   Mon Feb 9 07:50:09 2026 +0200

    Theme migration, PathView redesign, new GoCard types, and design system tooling
    
    - Migrate all components from hardcoded colors to theme-aware CSS variable tokens
    - Redesign PathView with serif title, milestone accordions, and Figma background blobs
    - Add PodcastCard, AssessmentCard GoCard types with shared components
    - Extract shared GoCard components (CardHeroSection, CompletionMessage, StatusBadge, etc.)
    - Add design companion tool (visual tokens, component patterns, layout, interactions, UX)
    - Add Figma extraction and component design workflow tools
    - Add FOUC prevention, useTheme hook, and dark mode support
    
    Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>

 .claude/tools/component-design.md                  | 143 +++++++
 .claude/tools/design-companion/README.md           |  58 +++
 .../tools/design-companion/component-patterns.md   | 341 +++++++++++++++
 .../tools/design-companion/interaction-patterns.md | 275 +++++++++++++
 .claude/tools/design-companion/layout-patterns.md  | 216 ++++++++++
 .claude/tools/design-companion/ux-principles.md    | 203 +++++++++
 .claude/tools/design-companion/visual-tokens.md    | 315 ++++++++++++++
 .claude/tools/figma-extraction.md                  | 196 +++++++++
 .gitignore                                         |   1 +
 .mcp.json                                          |  12 +
 CLAUDE.md                                          |  17 +
 index.html                                         |   9 +
 public/images/footer-bg.png                        | Bin 0 -> 1821540 bytes
 public/images/gocard-backgrounds/bg-01.png         | Bin 0 -> 1754356 bytes
 public/images/gocard-backgrounds/bg-02.png         | Bin 0 -> 653634 bytes
 public/images/gocard-backgrounds/bg-04.png         | Bin 0 -> 1279202 bytes
 public/images/gocard-backgrounds/bg-05.png         | Bin 0 -> 544450 bytes
 public/images/gocard-backgrounds/bg-06.png         | Bin 0 -> 7764927 bytes
 public/images/gocard-backgrounds/bg-07.png         | Bin 0 -> 1131891 bytes
 public/images/gocard-backgrounds/bg-08.png         | Bin 0 -> 10554913 bytes
 public/images/gocard-backgrounds/bg-09.png         | Bin 0 -> 7124522 bytes
 public/images/gocard-backgrounds/bg-10.png         | Bin 0 -> 195829 bytes
 public/images/gocard-backgrounds/bg-11.png         | Bin 0 -> 239683 bytes
 public/images/gocard-backgrounds/bg-12.png         | Bin 0 -> 1921084 bytes
 public/images/gocard-backgrounds/bg-13.png         | Bin 0 -> 221842 bytes
 public/images/gocard-backgrounds/bg-14.png         | Bin 0 -> 1876144 bytes
 public/images/gocard-backgrounds/bg-15.png         | Bin 0 -> 1959173 bytes
 public/images/gocard-backgrounds/bg-16.png         | Bin 0 -> 627811 bytes
 public/images/gocard-backgrounds/bg-17.png         | Bin 0 -> 399751 bytes
 public/images/gocard-backgrounds/bg-18.png         | Bin 0 -> 1246674 bytes
 public/images/gocard-backgrounds/bg-19.png         | Bin 0 -> 6373212 bytes
 public/images/gocard-backgrounds/bg-20.png         | Bin 0 -> 148230 bytes
 public/images/gocard-backgrounds/bg-21.png         | Bin 0 -> 450884 bytes
 public/images/gocard-backgrounds/bg-22.png         | Bin 0 -> 1686563 bytes
 public/images/gocard-backgrounds/bg-23.png         | Bin 0 -> 6412043 bytes
 public/images/gocard-backgrounds/bg-24.png         | Bin 0 -> 1403478 bytes
 public/images/gocard-backgrounds/bg-25.png         | Bin 0 -> 946677 bytes
 public/images/gocard-backgrounds/blue-texture.png  | Bin 0 -> 6432938 bytes
 public/images/gocard-backgrounds/city-skyline.png  | Bin 0 -> 1381517 bytes
 .../images/gocard-backgrounds/woman-portrait.png   | Bin 0 -> 1054695 bytes
 public/images/gocard-bg.png                        | Bin 0 -> 1821540 bytes
 public/images/hero-bg.png                          | Bin 0 -> 246808 bytes
 public/images/path-bg-abstract.mp4                 | Bin 0 -> 16735288 bytes
 public/images/path-bg-blue.svg                     |  11 +
 public/images/path-bg-pink.svg                     |  11 +
 src/App.jsx                                        |   9 +
 src/components/go-cards/GoCardCarouselCard.jsx     | 198 +++------
 src/components/go-cards/GoCardExpanded.jsx         | 122 +++---
 src/components/go-cards/GoCardPreview.jsx          |  81 ++--
 .../go-cards/shared/CardBackgroundOverlay.jsx      |  52 +++
 src/components/go-cards/shared/CardHeroSection.jsx | 153 +++++++
 .../go-cards/shared/CompletionFooter.jsx           | 144 +++++++
 .../go-cards/shared/CompletionMessage.jsx          |  95 +++++
 src/components/go-cards/shared/DimensionBadge.jsx  |  91 +++++
 src/components/go-cards/shared/MetaItem.jsx        |  56 +++
 src/components/go-cards/shared/StatusBadge.jsx     |  46 +++
 src/components/go-cards/shared/StridesBadge.jsx    |  89 ++++
 src/components/go-cards/shared/TypeBadge.jsx       |  37 ++
 src/components/go-cards/shared/index.js            |  15 +
 src/components/go-cards/tools/EvidenceMapper.jsx   |  64 +--
 src/components/go-cards/types/ArticleCard.jsx      | 151 +++----
 src/components/go-cards/types/AssessmentCard.jsx   | 136 ++++++
 src/components/go-cards/types/ChecklistCard.jsx    | 311 +++-----------
 src/components/go-cards/types/EventCard.jsx        | 226 +++++-----
 src/components/go-cards/types/MediaCard.jsx        | 188 ++-------
 src/components/go-cards/types/PodcastCard.jsx      |  65 +++
 src/components/go-cards/types/QuizCard.jsx         | 455 ++++++---------------
 src/components/go-cards/types/ReflectionCard.jsx   | 227 ++--------
 src/components/go-cards/types/ToolCard.jsx         |  38 +-
 .../go-cards/types/article/ActionRail.jsx          | 154 +++----
 .../go-cards/types/article/ArticleBody.jsx         |   4 +-
 .../go-cards/types/article/ArticleHero.jsx         | 112 ++---
 .../go-cards/types/article/ArticleIntro.jsx        | 102 ++++-
 .../go-cards/types/article/CompletionFooter.jsx    | 208 ----------
 .../go-cards/types/article/blocks/BandBlock.jsx    |  81 ++--
 .../go-cards/types/article/blocks/DividerBlock.jsx |   8 +-
 .../go-cards/types/article/blocks/ImageBlock.jsx   |  31 +-
 .../types/article/blocks/ParagraphBlock.jsx        |   9 +-
 .../types/article/blocks/QuoteBandBlock.jsx        |  14 +-
 .../go-cards/types/article/blocks/SectionBlock.jsx |   6 +-
 .../types/article/blocks/TwoColumnBlock.jsx        |  81 ++--
 .../types/assessment/AssessmentInsightCard.jsx     |  82 ++++
 .../types/assessment/AssessmentOutcome.jsx         |  52 +++
 .../types/assessment/AssessmentResults.jsx         | 100 +++++
 .../go-cards/types/checklist/ChecklistItem.jsx     | 114 ++++++
 .../go-cards/types/event-parts/EventCarousel.jsx   | 134 +++---
 .../go-cards/types/event-parts/EventContent.jsx    | 110 +++--
 .../types/event-parts/EventDescription.jsx         | 110 +----
 .../go-cards/types/event-parts/EventDetailsBar.jsx |  26 +-
 .../go-cards/types/event-parts/EventFAQ.jsx        |  62 ++-
 .../go-cards/types/event-parts/EventHero.jsx       |   2 +-
 .../go-cards/types/event-parts/EventLocation.jsx   | 111 +++--
 .../go-cards/types/event-parts/EventQuote.jsx      |  21 +
 .../types/event-parts/EventRegistrationModal.jsx   | 146 +++++++
 .../types/event-parts/EventReservation.jsx         | 180 ++++----
 .../go-cards/types/event-parts/EventSpeaker.jsx    |  16 +-
 .../go-cards/types/event-parts/EventSponsors.jsx   |  58 ++-
 .../go-cards/types/event-parts/EventStats.jsx      |  15 +-
 .../go-cards/types/podcast/ContentEngagement.jsx   |  40 ++
 .../go-cards/types/podcast/ExpertBio.jsx           |  50 +++
 .../go-cards/types/podcast/PodcastContent.jsx      |  41 ++
 .../go-cards/types/podcast/PodcastVideoPlayer.jsx  |  33 ++
 .../go-cards/types/quiz/QuizOutcomes.jsx           | 165 ++++++++
 .../go-cards/types/quiz/QuizQuestion.jsx           | 112 +++++
 src/components/go-cards/types/quiz/quizAnalyzer.js |  82 ++++
 .../go-cards/types/reflection/ReflectionPrompt.jsx |  74 ++++
 src/components/layout/Navbar.jsx                   |  76 +++-
 src/components/milestones/MilestoneAccordion.jsx   | 193 +++++++++
 src/components/milestones/MilestoneCard.jsx        |  54 +--
 .../milestones/MilestoneCarouselCard.jsx           |   2 +-
 src/components/paths/PathCard.jsx                  |  38 +-
 src/components/paths/PathOverviewModal.jsx         |  46 +--
 src/components/shared/Carousel.jsx                 |   2 +-
 src/components/shared/EmptySection.jsx             |  34 ++
 src/components/shared/FormInput.jsx                |  33 ++
 src/components/shared/FormSubmitButton.jsx         |  51 +++
 src/components/shared/FormTextArea.jsx             |  42 ++
 src/components/shared/ProgressBar.jsx              |  88 ++++
 src/components/shared/StatCard.jsx                 |  76 ++++
 src/components/shared/index.js                     |  15 +
 src/config/designTokens.js                         |  99 +++++
 src/config/dimensions.js                           |  83 +++-
 src/config/goCardTypes.js                          | 106 +++++
 src/data/seed.js                                   | 343 +++++++++++++---
 src/hooks/useNextCardRecommendation.js             | 103 +++--
 src/hooks/useTheme.js                              |  57 +++
 src/index.css                                      | 187 ++++++++-
 src/pages/Discover.jsx                             |  34 +-
 src/pages/GoCardView.jsx                           |   6 +-
 src/pages/Home.jsx                                 |  22 +-
 src/pages/Login.jsx                                |  26 +-
 src/pages/MilestoneView.jsx                        |  46 +--
 src/pages/MyDNA.jsx                                |  60 +--
 src/pages/PathView.jsx                             | 215 +++++-----
 src/pages/SeedData.jsx                             |  70 +++-
 src/pages/UploadImages.jsx                         | 223 ++++++++++
 src/services/firestore.js                          |   6 +-
 tailwind.config.js                                 |  80 +++-
 138 files changed, 7271 insertions(+), 2848 deletions(-)

commit f689167a3df9cef9ce63718cdf2fd3e483ba87b3
Author: Daniel <Daniel@specno.com>
Date:   Mon Feb 2 17:15:08 2026 +0200

    feat: Add Milestone 6 "Improve Your CV" to Evidence Deficit path
    
    - Add Milestone 6 with CV improvement focus
    - Create 3 go-cards for the milestone:
      1. Article: "From Evidence to CV" - explains evidence-to-CV connection
      2. Tool: CV Builder - AI-powered CV analysis and generation
      3. Reflection: CV Improvement review and next steps planning
    - Update path structure to include milestone-6
    
    This milestone leverages the CV Builder tool to help users
    transform their documented evidence into a compelling CV.
    
    Co-Authored-By: Claude Opus 4.5 <noreply@anthropic.com>

 src/data/seed.js | 335 +++++++++++++++++++++++++++++++++++++++++++++++++++++++
 1 file changed, 335 insertions(+)

commit c2e3faaca9c46ef14a6a433f492d8f140c69e671
Author: Daniel <Daniel@specno.com>
Date:   Mon Feb 2 17:06:52 2026 +0200

    feat: Add CV Builder tool with AI-powered analysis and generation
    
    - Add analyzeCV Cloud Function for CV analysis using Claude AI
    - Add generateCV Cloud Function for improved CV generation
    - Create CVBuilder wizard component (4-step flow)
      - Step 1: Upload/paste CV
      - Step 2: Analysis display (strengths, gaps, score)
      - Step 3: Answer follow-up questions
      - Step 4: Preview and download
    - Add PDF generation utility (html2pdf.js integration)
    - Add cvService.js for CV operations and MyDNA integration
    - Register cv-builder tool in ToolCard.jsx
    
    Features:
    - S→A→R→E framework for achievement evaluation
    - AI-generated follow-up questions for CV gaps
    - Multiple download formats (HTML, Markdown)
    - MyDNA profile integration for data persistence
    
    Co-Authored-By: Claude Opus 4.5 <noreply@anthropic.com>

 functions/index.js                          | 266 ++++++++++
 src/components/go-cards/tools/CVBuilder.jsx | 783 ++++++++++++++++++++++++++++
 src/components/go-cards/types/ToolCard.jsx  |  18 +
 src/services/cvService.js                   | 271 ++++++++++
 src/utils/pdfGenerator.js                   | 305 +++++++++++
 5 files changed, 1643 insertions(+)

commit 24ab099ab7333a150b82f021e5bf6ddb34c9f91b
Author: Daniel <Daniel@specno.com>
Date:   Mon Feb 2 16:58:36 2026 +0200

    feat: Add V2 path implementation with admin infrastructure
    
    - Add ExperimentalCard component for future go-card types
    - Add V2 seed data (Jacques' Evidence Portfolio path)
    - Fix Quiz/Reflection card normalizers for V1/V2 compatibility
    - Add default completion footer for articles
    - Add admin route protection and adminService
    - Add content generator admin page with markdown parsing
    - Add Firebase Cloud Functions for AI content processing
    - Add comprehensive content schema documentation
    
    Co-Authored-By: Claude Opus 4.5 <noreply@anthropic.com>

 FIREBASE_SETUP.md                                  |  154 +
 context/Article structure/article context.txt      |  170 +
 context/CONTENT_SCHEMA_SPECIFICATION.md            |  777 +++
 context/Jacques content/test.md                    | 2844 +++++++++
 firebase.json                                      |   10 +
 firestore.rules                                    |   66 +
 functions/.gitignore                               |    2 +
 functions/index.js                                 |  395 ++
 functions/package-lock.json                        | 6746 ++++++++++++++++++++
 functions/package.json                             |   24 +
 src/App.jsx                                        |   14 +-
 src/components/admin/MarkdownUploader.jsx          |  151 +
 src/components/go-cards/GoCardExpanded.jsx         |    7 +-
 src/components/go-cards/types/ExperimentalCard.jsx |  202 +
 src/components/go-cards/types/QuizCard.jsx         |   28 +-
 src/components/go-cards/types/ReflectionCard.jsx   |   13 +-
 .../go-cards/types/article/CompletionFooter.jsx    |   24 +-
 src/components/layout/Navbar.jsx                   |   10 +-
 src/components/shared/AdminRoute.jsx               |   20 +
 src/context/AuthContext.jsx                        |   24 +-
 src/data/seed-v2.js                                | 1544 +++++
 src/pages/SeedData.jsx                             |   74 +
 src/pages/admin/ContentGenerator.jsx               |  326 +
 src/services/adminService.js                       |   64 +
 src/services/auth.js                               |    1 +
 25 files changed, 13673 insertions(+), 17 deletions(-)

commit d47ca3c4a33700faacc07b97eceb75c9fca503f6
Author: Daniel <Daniel@specno.com>
Date:   Fri Jan 30 17:39:48 2026 +0200

    feat: Implement MyDNA and Analytics infrastructure
    
    Added comprehensive MyDNA profile management and analytics tracking:
    
    MyDNA Service:
    - User profile management (basics, work, education, skills, goals)
    - Preferences tracking (notifications, privacy, theme)
    - Progress metrics (cards completed, strides, streaks, last active)
    - Card response mapping for future CV scraper integration
    
    Analytics Service:
    - Page view tracking
    - Path/milestone/card lifecycle events
    - User action tracking (sign up, sign in, profile updates)
    - Session tracking with time-on-page measurement
    - Batch event queue for performance optimization
    
    Integration:
    - Auto-update MyDNA metrics on card completion
    - Track analytics events across all major pages
    - Progress service integration with MyDNA updates
    
    Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>

 src/components/go-cards/GoCardExpanded.jsx         |  60 ++-
 src/components/go-cards/types/ChecklistCard.jsx    | 328 +++++++---------
 src/components/go-cards/types/QuizCard.jsx         | 297 ++++++--------
 .../go-cards/types/article/CompletionFooter.jsx    |  73 ++--
 src/components/milestones/MilestoneCard.jsx        |   7 +-
 src/components/paths/PathOverviewModal.jsx         |  34 +-
 src/hooks/useProgress.js                           |  35 +-
 src/pages/Discover.jsx                             |   8 +
 src/pages/Home.jsx                                 |   8 +
 src/pages/MilestoneView.jsx                        |  18 +
 src/pages/MyDNA.jsx                                |  63 +++
 src/pages/PathView.jsx                             |  26 +-
 src/pages/SeedData.jsx                             | 125 +++++-
 src/services/analytics.js                          | 428 +++++++++++++++++++++
 src/services/firestore.js                          | 229 ++++++++++-
 src/services/myDNAService.js                       | 329 ++++++++++++++++
 src/services/progressService.js                    |  89 +++++
 17 files changed, 1752 insertions(+), 405 deletions(-)

commit 3e3d004d1d20c3e5309fe493a2e3654cc543627d
Author: Daniel <Daniel.nov@enjoyscale.com>
Date:   Fri Jan 30 09:27:33 2026 +0200

    Initial commit: 2gthr POC paths basic flow

 .gitignore                                         |   30 +
 README.md                                          |   16 +
 context/Article structure/Article Page.png         |  Bin 0 -> 4941055 bytes
 context/Article structure/article context.txt      |    0
 context/Article structure/articletest.html         | 1210 +++++
 context/Article structure/files.zip                |  Bin 0 -> 29180 bytes
 context/Article structure/files/README.md          |  449 ++
 .../files/article-content-generation-guide.md      |  593 +++
 .../files/article-gocard-prototype.html            | 1281 +++++
 .../files/article-gocard-schema.json               |  490 ++
 .../files/react-implementation-spec.md             |  742 +++
 context/Event_go_card/eventCardObject              |  189 +
 context/Event_go_card/files/event-go-card.html     | 1870 ++++++++
 context/Event_go_card/files/event-photo.png        |  Bin 0 -> 190441 bytes
 context/Event_go_card/files/hero_no_text_v3.png    |  Bin 0 -> 9651 bytes
 context/Event_go_card/files/speaker-profile.png    |  Bin 0 -> 95531 bytes
 context/Event_go_card/full-go-card event.png       |  Bin 0 -> 4393159 bytes
 context/Event_go_card/hero_no_text_v3.png          |  Bin 0 -> 331470 bytes
 context/eventCardObject                            |  189 +
 eslint.config.js                                   |   29 +
 index.html                                         |   13 +
 package-lock.json                                  | 4920 ++++++++++++++++++++
 package.json                                       |   36 +
 postcss.config.js                                  |    6 +
 public/images/events/event-photo.png               |  Bin 0 -> 190441 bytes
 public/images/events/hero_no_text_v3.png           |  Bin 0 -> 331470 bytes
 public/images/events/speaker-profile.png           |  Bin 0 -> 95531 bytes
 public/vite.svg                                    |    1 +
 src/App.css                                        |   42 +
 src/App.jsx                                        |   82 +
 src/assets/react.svg                               |    1 +
 src/components/go-cards/GoCardCarouselCard.jsx     |  191 +
 src/components/go-cards/GoCardExpanded.jsx         |  192 +
 src/components/go-cards/GoCardPreview.jsx          |  163 +
 src/components/go-cards/tools/EvidenceMapper.jsx   |  223 +
 src/components/go-cards/types/ArticleCard.jsx      |  168 +
 src/components/go-cards/types/ChecklistCard.jsx    |  350 ++
 src/components/go-cards/types/EventCard.jsx        |  194 +
 src/components/go-cards/types/MediaCard.jsx        |  265 ++
 src/components/go-cards/types/QuizCard.jsx         |  357 ++
 src/components/go-cards/types/ReflectionCard.jsx   |  258 +
 src/components/go-cards/types/ToolCard.jsx         |   78 +
 .../go-cards/types/article/ActionRail.jsx          |  110 +
 .../go-cards/types/article/ArticleBody.jsx         |   29 +
 .../go-cards/types/article/ArticleHero.jsx         |   91 +
 .../go-cards/types/article/ArticleIntro.jsx        |   27 +
 .../go-cards/types/article/CompletionFooter.jsx    |  208 +
 .../go-cards/types/article/blocks/BandBlock.jsx    |   62 +
 .../types/article/blocks/ContentBlockRenderer.jsx  |   47 +
 .../go-cards/types/article/blocks/DividerBlock.jsx |   17 +
 .../go-cards/types/article/blocks/ImageBlock.jsx   |   35 +
 .../types/article/blocks/ParagraphBlock.jsx        |   28 +
 .../types/article/blocks/QuoteBandBlock.jsx        |   25 +
 .../go-cards/types/article/blocks/SectionBlock.jsx |   34 +
 .../types/article/blocks/TwoColumnBlock.jsx        |   66 +
 .../go-cards/types/event-parts/EventCarousel.jsx   |  107 +
 .../go-cards/types/event-parts/EventContent.jsx    |   80 +
 .../types/event-parts/EventDescription.jsx         |  108 +
 .../go-cards/types/event-parts/EventDetailsBar.jsx |   86 +
 .../go-cards/types/event-parts/EventFAQ.jsx        |   69 +
 .../go-cards/types/event-parts/EventHero.jsx       |   54 +
 .../go-cards/types/event-parts/EventLocation.jsx   |   74 +
 .../types/event-parts/EventReservation.jsx         |   92 +
 .../go-cards/types/event-parts/EventSpeaker.jsx    |  103 +
 .../go-cards/types/event-parts/EventSponsors.jsx   |   48 +
 .../go-cards/types/event-parts/EventStats.jsx      |   29 +
 src/components/layout/Navbar.jsx                   |   59 +
 src/components/milestones/MilestoneCard.jsx        |  150 +
 .../milestones/MilestoneCarouselCard.jsx           |   83 +
 src/components/paths/PathCard.jsx                  |  227 +
 src/components/paths/PathOverviewModal.jsx         |  216 +
 src/components/shared/Carousel.jsx                 |  123 +
 src/components/shared/ProtectedRoute.jsx           |   14 +
 src/config/dimensions.js                           |   71 +
 src/context/AuthContext.jsx                        |   39 +
 src/data/seed.js                                   | 1593 +++++++
 src/hooks/useGoCard.js                             |   41 +
 src/hooks/useMilestone.js                          |   38 +
 src/hooks/useNextCardRecommendation.js             |  137 +
 src/hooks/usePath.js                               |   70 +
 src/hooks/usePathGoCards.js                        |   55 +
 src/hooks/useProgress.js                           |   79 +
 src/index.css                                      |   32 +
 src/main.jsx                                       |   10 +
 src/pages/Discover.jsx                             |  352 ++
 src/pages/GoCardView.jsx                           |   16 +
 src/pages/Home.jsx                                 |  187 +
 src/pages/Login.jsx                                |  165 +
 src/pages/MilestoneView.jsx                        |  162 +
 src/pages/MyDNA.jsx                                |  154 +
 src/pages/PathView.jsx                             |  175 +
 src/pages/SeedData.jsx                             |   99 +
 src/services/auth.js                               |  117 +
 src/services/dependencyService.js                  |  192 +
 src/services/firebase.js                           |   25 +
 src/services/firestore.js                          |  396 ++
 src/services/progressService.js                    |  155 +
 src/services/stridesService.js                     |  191 +
 tailwind.config.js                                 |   44 +
 vite.config.js                                     |    7 +
 100 files changed, 21731 insertions(+)
