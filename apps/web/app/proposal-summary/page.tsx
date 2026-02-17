import type { Metadata } from "next";
import { PrintButton } from "./PrintButton";
import {
  proposalMeta,
  executiveSummary,
  deliverables,
  teamMembers,
  investment,
  nextSteps,
  contact,
} from "../proposal/_data/proposal-content";

export const metadata: Metadata = {
  title: "Nova FDE Proposal — Summary",
  description: "One-page summary of the Forward Deployed Product Intelligence Team proposal",
};

export default function ProposalSummary() {
  return (
    <div className="min-h-screen bg-white text-gray-900 print:bg-white">
      <style>{`
        @media print {
          body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          .no-print { display: none !important; }
        }
      `}</style>

      <div className="max-w-3xl mx-auto px-8 py-12 print:py-6 print:px-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-8 pb-6 border-b-2 border-gray-900">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
              {proposalMeta.title}
            </h1>
            <p className="text-sm text-gray-500 mt-1">{proposalMeta.subtitle}</p>
            <p className="text-xs text-gray-400 mt-0.5">{proposalMeta.tagline}</p>
          </div>
          <div className="text-right text-sm text-gray-500 flex-shrink-0 ml-6">
            <div className="font-semibold text-gray-900">Nova</div>
            <div>{proposalMeta.date}</div>
            <div className="text-xs">Confidential</div>
          </div>
        </div>

        {/* Executive Summary */}
        <section className="mb-7">
          <h2 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">Executive Summary</h2>
          <p className="text-sm text-gray-700 leading-relaxed">
            {executiveSummary.text}
          </p>
        </section>

        {/* Key Terms */}
        <section className="mb-7">
          <h2 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">Key Terms</h2>
          <div className="grid grid-cols-4 gap-3">
            {executiveSummary.keyFacts.map((fact) => (
              <div key={fact.label} className="border border-gray-200 rounded-lg p-3">
                <div className="text-lg font-bold text-gray-900">{fact.value}</div>
                <div className="text-xs text-gray-500">{fact.detail}</div>
              </div>
            ))}
          </div>
        </section>

        {/* What We Deliver */}
        <section className="mb-7">
          <h2 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">Monthly Deliverables — 3 Solutions per Month</h2>
          <div className="grid grid-cols-2 gap-3">
            {deliverables.map((d) => (
              <div key={d.id} className="border border-gray-200 rounded-lg p-3">
                <div className="text-sm font-semibold text-gray-900 mb-1">{d.title}</div>
                <p className="text-xs text-gray-500 leading-relaxed">{d.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Team + Investment side by side */}
        <section className="mb-7">
          <div className="grid grid-cols-2 gap-6">
            {/* Team */}
            <div>
              <h2 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">Team</h2>
              <div className="space-y-2">
                {teamMembers.map((member) => (
                  <div key={member.name} className="border border-gray-200 rounded-lg p-3 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-500 flex-shrink-0">
                      {member.initials}
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-gray-900">{member.name}</div>
                      <div className="text-xs text-gray-500">{member.role}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Investment */}
            <div>
              <h2 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">Investment</h2>
              <div className="border border-gray-200 rounded-lg p-4">
                <div className="text-2xl font-bold text-gray-900">{investment.total}</div>
                <div className="text-xs text-gray-500 mt-1">over {investment.duration}</div>
                <div className="mt-3 pt-3 border-t border-gray-100 space-y-1 text-xs text-gray-600">
                  <div>{investment.monthly}/month</div>
                  <div>3 FDEs @ {investment.perFDE}/month each</div>
                  <div className="text-gray-400">{investment.period}</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Next Steps */}
        <section className="mb-7">
          <h2 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">Next Steps</h2>
          <div className="grid grid-cols-4 gap-3">
            {nextSteps.map((step) => (
              <div key={step.number} className="border border-gray-200 rounded-lg p-3">
                <div className="text-xs font-bold text-gray-400 mb-1">{step.number}</div>
                <div className="text-sm font-semibold text-gray-900 mb-0.5">{step.title}</div>
                <div className="text-xs text-gray-500">{step.description}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Full Proposal Link */}
        <section className="mb-8 bg-gray-50 rounded-lg p-4 text-center border border-gray-200">
          <p className="text-sm text-gray-600 mb-1">View the full interactive proposal with detailed breakdowns:</p>
          <p className="text-sm font-mono font-semibold text-blue-600">
            [your-domain]/proposal
          </p>
        </section>

        {/* Signature Block */}
        <section className="border-t-2 border-gray-900 pt-8">
          <h2 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-6">Agreement</h2>
          <p className="text-sm text-gray-600 mb-8">
            By signing below, both parties agree to proceed with the engagement as outlined in this summary and the full proposal document.
          </p>

          <div className="grid grid-cols-2 gap-12">
            {/* Nova / ExploreScale */}
            <div>
              <div className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-5">Nova / ExploreScale</div>
              <div className="border-b border-gray-300 mb-1.5 h-8" />
              <div className="text-xs text-gray-400 mb-5">Signature</div>
              <div className="border-b border-gray-300 mb-1.5 h-8" />
              <div className="text-xs text-gray-400 mb-5">Full Name</div>
              <div className="border-b border-gray-300 mb-1.5 h-8" />
              <div className="text-xs text-gray-400">Date</div>
            </div>

            {/* Client */}
            <div>
              <div className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-5">Client</div>
              <div className="border-b border-gray-300 mb-1.5 h-8" />
              <div className="text-xs text-gray-400 mb-5">Signature</div>
              <div className="border-b border-gray-300 mb-1.5 h-8" />
              <div className="text-xs text-gray-400 mb-5">Full Name</div>
              <div className="border-b border-gray-300 mb-1.5 h-8" />
              <div className="text-xs text-gray-400">Date</div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <div className="mt-8 pt-4 border-t border-gray-200 flex items-center justify-between text-xs text-gray-400">
          <span>{contact.name} · {contact.email}</span>
          <span>{proposalMeta.date} · Confidential</span>
        </div>

        {/* Print button (hidden on print) */}
        <PrintButton />
      </div>
    </div>
  );
}
