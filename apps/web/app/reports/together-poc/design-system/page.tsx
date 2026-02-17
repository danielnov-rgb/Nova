"use client";

import { PageHeader } from "../_components/PageHeader";
import { ContentSection, CardGrid, InfoCard, DataTable } from "../_components/ContentSection";

export default function DesignSystemPage() {
  return (
    <main className="bg-gray-950">
      <PageHeader
        title="Design System"
        subtitle="Comprehensive design tokens, components, and implementation status"
        badge="Design Asset Audit"
      />

      <div className="h-px bg-gradient-to-r from-transparent via-gray-800 to-transparent" />

      {/* Executive Summary */}
      <ContentSection title="Executive Summary">
        <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6">
          <p className="text-gray-300 mb-4">
            The 2gthr project has a <strong className="text-white">mature design system</strong> with
            Figma MCP integration configured. The design system includes comprehensive visual tokens,
            component patterns, and layout specifications.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary-400">103</div>
              <div className="text-sm text-gray-400">UI Components</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-400">97</div>
              <div className="text-sm text-gray-400">Fully Built (94%)</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-yellow-400">6</div>
              <div className="text-sm text-gray-400">Partially Built</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-cyan-400">50+</div>
              <div className="text-sm text-gray-400">Design Tokens</div>
            </div>
          </div>
        </div>
      </ContentSection>

      <div className="h-px bg-gradient-to-r from-transparent via-gray-800 to-transparent" />

      {/* Design Tokens */}
      <ContentSection title="Design Tokens">
        <h3 className="text-lg font-semibold text-white mb-4">Colors</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-lg bg-[#44c9de]" />
              <div>
                <div className="text-sm font-medium text-white">Brand</div>
                <div className="text-xs text-gray-500">#44c9de</div>
              </div>
            </div>
            <p className="text-xs text-gray-400">Primary actions, progress fills</p>
          </div>
          <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500" />
              <div>
                <div className="text-sm font-medium text-white">Career</div>
                <div className="text-xs text-gray-500">Blue/Cyan</div>
              </div>
            </div>
            <p className="text-xs text-gray-400">Career dimension accent</p>
          </div>
          <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-pink-500 to-rose-500" />
              <div>
                <div className="text-sm font-medium text-white">Learning</div>
                <div className="text-xs text-gray-500">Pink/Rose</div>
              </div>
            </div>
            <p className="text-xs text-gray-400">Learning dimension accent</p>
          </div>
          <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-green-500 to-emerald-500" />
              <div>
                <div className="text-sm font-medium text-white">Success</div>
                <div className="text-xs text-gray-500">Green/Emerald</div>
              </div>
            </div>
            <p className="text-xs text-gray-400">Success states</p>
          </div>
          <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-violet-500" />
              <div>
                <div className="text-sm font-medium text-white">Purple</div>
                <div className="text-xs text-gray-500">Purple/Violet</div>
              </div>
            </div>
            <p className="text-xs text-gray-400">Tools and insights</p>
          </div>
          <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-yellow-500 to-amber-500" />
              <div>
                <div className="text-sm font-medium text-white">Rewards</div>
                <div className="text-xs text-gray-500">Gold/Amber</div>
              </div>
            </div>
            <p className="text-xs text-gray-400">Badges and strides</p>
          </div>
        </div>

        <h3 className="text-lg font-semibold text-white mb-4">Typography</h3>
        <DataTable
          headers={["Token", "Value", "Usage"]}
          rows={[
            ["font/primary", "Plus Jakarta Sans (fallback)", "Main UI text"],
            ["font/secondary", "Georgia (fallback)", "Headlines, emphasis"],
            ["font/mono", "Roboto Mono", "Code, technical content"],
            ["Weight: Regular", "400", "ALL headings"],
            ["Weight: Medium", "500", "Buttons only"],
          ]}
        />

        <h3 className="text-lg font-semibold text-white mt-8 mb-4">Spacing & Border Radius</h3>
        <CardGrid columns={2}>
          <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-4">
            <h4 className="text-sm font-semibold text-white mb-3">Spacing Scale</h4>
            <div className="flex flex-wrap gap-2">
              {["4px", "8px", "12px", "16px", "24px", "32px", "40px", "48px", "60px"].map((size) => (
                <span key={size} className="px-2 py-1 bg-gray-800 rounded text-xs text-gray-400">{size}</span>
              ))}
            </div>
          </div>
          <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-4">
            <h4 className="text-sm font-semibold text-white mb-3">Border Radius</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between text-gray-400">
                <span>GoCard carousel</span>
                <span className="text-white">26px</span>
              </div>
              <div className="flex justify-between text-gray-400">
                <span>Heroes/modals</span>
                <span className="text-white">16px</span>
              </div>
              <div className="flex justify-between text-gray-400">
                <span>Standard cards</span>
                <span className="text-white">8px</span>
              </div>
              <div className="flex justify-between text-gray-400">
                <span>Badges</span>
                <span className="text-white">9999px</span>
              </div>
            </div>
          </div>
        </CardGrid>
      </ContentSection>

      <div className="h-px bg-gradient-to-r from-transparent via-gray-800 to-transparent" />

      {/* Component Categories */}
      <ContentSection title="Component Categories">
        <DataTable
          headers={["Pattern Category", "Components", "Examples"]}
          rows={[
            ["Cards", "8", "GoCardCarouselCard, PathCard, MilestoneCard, StatCard"],
            ["Heroes", "4", "CardHeroSection, CompletionFooter, CompletionMessage"],
            ["Navigation", "2", "Navbar, Breadcrumbs"],
            ["Forms", "7", "FormInput, FormTextArea, QuizQuestion, ChecklistItem"],
            ["Modals", "3", "PathOverviewModal, MilestonePreviewModal"],
            ["Carousels", "2", "Carousel, EventCarousel"],
            ["Badges", "4", "DimensionBadge, TypeBadge, StatusBadge, StridesBadge"],
            ["Content Blocks", "7", "ParagraphBlock, SectionBlock, BandBlock, ImageBlock"],
            ["Buttons", "5", "Primary, Secondary, Ghost, Icon, Full-Width"],
          ]}
        />
      </ContentSection>

      <div className="h-px bg-gradient-to-r from-transparent via-gray-800 to-transparent" />

      {/* Implementation Status */}
      <ContentSection title="Implementation Status">
        <h3 className="text-lg font-semibold text-white mb-4">Go-Card Types (14 types, all complete)</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-2 mb-8">
          {[
            "Article", "Quiz", "Reflection", "Checklist", "Tool", "Evidence",
            "Event", "Media", "Podcast", "Video", "Insights", "Assessment",
            "Poll", "Co-Create"
          ].map((type) => (
            <div key={type} className="bg-green-500/10 border border-green-500/30 rounded-lg p-2 text-center">
              <div className="text-xs text-green-400">{type}</div>
            </div>
          ))}
        </div>

        <h3 className="text-lg font-semibold text-white mb-4">Component Inventory by Category</h3>
        <DataTable
          headers={["Category", "Count", "Status"]}
          rows={[
            ["Layout Components", "3", <span key="1" className="text-green-400">✓ All Built</span>],
            ["Shared Components", "9", <span key="2" className="text-green-400">✓ All Built</span>],
            ["Path Components", "2", <span key="3" className="text-green-400">✓ All Built</span>],
            ["Milestone Components", "5", <span key="4" className="text-green-400">✓ All Built</span>],
            ["Go-Card Core", "4", <span key="5" className="text-green-400">✓ All Built</span>],
            ["Go-Card Shared", "9", <span key="6" className="text-green-400">✓ All Built</span>],
            ["Go-Card Types", "15", <span key="7" className="text-green-400">✓ All Built</span>],
            ["Article Blocks", "11", <span key="8" className="text-green-400">✓ All Built</span>],
            ["Event Components", "13", <span key="9" className="text-green-400">✓ All Built</span>],
            ["Evidence Components", "11", <span key="10" className="text-green-400">✓ All Built</span>],
            ["Tool Components", "15", <span key="11" className="text-green-400">✓ All Built</span>],
            ["Admin Components", "5", <span key="12" className="text-yellow-400">◐ Partial</span>],
          ]}
        />
      </ContentSection>

      <div className="h-px bg-gradient-to-r from-transparent via-gray-800 to-transparent" />

      {/* Design System Maturity */}
      <ContentSection title="Design System Maturity">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {[
            { aspect: "Token Documentation", rating: 5 },
            { aspect: "Component Patterns", rating: 5 },
            { aspect: "Layout Documentation", rating: 5 },
            { aspect: "Figma Integration", rating: 4 },
            { aspect: "CSS Implementation", rating: 5 },
            { aspect: "Component Coverage", rating: 4 },
          ].map((item) => (
            <div key={item.aspect} className="bg-gray-900/50 border border-gray-800 rounded-xl p-4">
              <div className="text-sm text-gray-400 mb-2">{item.aspect}</div>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <svg
                    key={star}
                    className={`w-5 h-5 ${star <= item.rating ? "text-yellow-400" : "text-gray-700"}`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
            </div>
          ))}
        </div>
      </ContentSection>

      {/* Footer spacing */}
      <div className="h-24" />
    </main>
  );
}
