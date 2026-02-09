"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { problemsApi, sprintsApi, CsvParseResult, CsvImportResult } from "../_lib/api";
import { Sprint } from "../_lib/types";

export default function ImportPage() {
  const [csvContent, setCsvContent] = useState("");
  const [sprints, setSprints] = useState<Sprint[]>([]);
  const [selectedSprintId, setSelectedSprintId] = useState<string>("");
  const [previewResult, setPreviewResult] = useState<CsvParseResult | null>(null);
  const [importResult, setImportResult] = useState<CsvImportResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [step, setStep] = useState<"input" | "preview" | "success">("input");

  useEffect(() => {
    sprintsApi.list().then(setSprints).catch(console.error);
  }, []);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      setCsvContent(content);
      setPreviewResult(null);
      setImportResult(null);
      setStep("input");
    };
    reader.readAsText(file);
  };

  const handlePreview = async () => {
    if (!csvContent.trim()) {
      setError("Please enter or upload CSV content");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const result = await problemsApi.previewCsvImport(csvContent);
      setPreviewResult(result);
      setStep("preview");
    } catch (err: any) {
      setError(err.message || "Failed to parse CSV");
    } finally {
      setLoading(false);
    }
  };

  const handleImport = async () => {
    if (!previewResult?.valid) {
      setError("Please fix CSV errors before importing");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const result = await problemsApi.importCsv(csvContent, selectedSprintId || undefined);
      setImportResult(result);
      setStep("success");
    } catch (err: any) {
      setError(err.message || "Failed to import problems");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setCsvContent("");
    setPreviewResult(null);
    setImportResult(null);
    setSelectedSprintId("");
    setStep("input");
    setError(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Import Problems
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Bulk import problems from a CSV file
          </p>
        </div>
        <Link
          href="/admin/problems"
          className="text-primary-600 hover:text-primary-700 dark:text-primary-400"
        >
          ← Back to Problems
        </Link>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
          <p className="text-red-700 dark:text-red-400">{error}</p>
        </div>
      )}

      {/* Success State */}
      {step === "success" && importResult && (
        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-10 w-10 bg-green-100 dark:bg-green-800 rounded-full flex items-center justify-center">
              <svg className="h-6 w-6 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div>
              <h2 className="text-lg font-semibold text-green-800 dark:text-green-200">
                Import Successful!
              </h2>
              <p className="text-green-700 dark:text-green-300">
                {importResult.imported} problems imported successfully
              </p>
            </div>
          </div>

          {importResult.warnings.length > 0 && (
            <div className="mt-4 border-t border-green-200 dark:border-green-700 pt-4">
              <h3 className="text-sm font-medium text-yellow-700 dark:text-yellow-400 mb-2">
                Warnings ({importResult.warnings.length})
              </h3>
              <ul className="text-sm text-yellow-600 dark:text-yellow-500 space-y-1">
                {importResult.warnings.map((w, i) => (
                  <li key={i}>Row {w.row}: {w.field} - {w.message}</li>
                ))}
              </ul>
            </div>
          )}

          <div className="mt-6 flex gap-3">
            <button
              onClick={handleReset}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              Import More
            </button>
            <Link
              href="/admin/problems"
              className="px-4 py-2 border border-green-300 dark:border-green-700 text-green-700 dark:text-green-300 rounded-lg hover:bg-green-50 dark:hover:bg-green-900/20"
            >
              View Problems
            </Link>
          </div>
        </div>
      )}

      {/* Input Step */}
      {step === "input" && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 space-y-6">
          {/* CSV Format Guide */}
          <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
            <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
              CSV Format
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
              Required columns: <code className="bg-gray-200 dark:bg-gray-600 px-1 rounded">title</code>
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
              Optional columns: <code className="bg-gray-200 dark:bg-gray-600 px-1 rounded">description</code>,
              <code className="bg-gray-200 dark:bg-gray-600 px-1 rounded ml-1">tags</code> (comma-separated),
              <code className="bg-gray-200 dark:bg-gray-600 px-1 rounded ml-1">severity</code>,
              <code className="bg-gray-200 dark:bg-gray-600 px-1 rounded ml-1">feasibility</code>,
              <code className="bg-gray-200 dark:bg-gray-600 px-1 rounded ml-1">impact</code> (1-10),
              <code className="bg-gray-200 dark:bg-gray-600 px-1 rounded ml-1">evidence_sources</code>,
              <code className="bg-gray-200 dark:bg-gray-600 px-1 rounded ml-1">evidence_quotes</code> (pipe-separated)
            </p>
            <pre className="text-xs bg-gray-200 dark:bg-gray-600 p-2 rounded overflow-x-auto">
{`title,description,tags,severity,impact,evidence_sources
"Login issues","Users struggle to reset passwords","auth,ux",8,7,"user_interview,support_tickets"
"Slow dashboard","Page takes 5+ seconds to load","performance",6,9,"analytics"`}
            </pre>
          </div>

          {/* File Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Upload CSV File
            </label>
            <input
              type="file"
              accept=".csv"
              onChange={handleFileUpload}
              className="block w-full text-sm text-gray-500 dark:text-gray-400
                file:mr-4 file:py-2 file:px-4
                file:rounded-lg file:border-0
                file:text-sm file:font-semibold
                file:bg-primary-50 file:text-primary-700
                dark:file:bg-primary-900/20 dark:file:text-primary-400
                hover:file:bg-primary-100 dark:hover:file:bg-primary-900/30
                cursor-pointer"
            />
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white dark:bg-gray-800 text-gray-500">or paste content</span>
            </div>
          </div>

          {/* Text Area */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              CSV Content
            </label>
            <textarea
              value={csvContent}
              onChange={(e) => {
                setCsvContent(e.target.value);
                setPreviewResult(null);
              }}
              placeholder="Paste your CSV content here..."
              rows={10}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg
                bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                focus:ring-2 focus:ring-primary-500 focus:border-primary-500
                font-mono text-sm"
            />
          </div>

          {/* Sprint Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Assign to Sprint (optional)
            </label>
            <select
              value={selectedSprintId}
              onChange={(e) => setSelectedSprintId(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg
                bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="">No sprint</option>
              {sprints.map((sprint) => (
                <option key={sprint.id} value={sprint.id}>
                  {sprint.name} {sprint.status !== "ACTIVE" && `(${sprint.status})`}
                </option>
              ))}
            </select>
          </div>

          {/* Preview Button */}
          <div className="flex justify-end">
            <button
              onClick={handlePreview}
              disabled={loading || !csvContent.trim()}
              className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700
                disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Parsing..." : "Preview Import"}
            </button>
          </div>
        </div>
      )}

      {/* Preview Step */}
      {step === "preview" && previewResult && (
        <div className="space-y-6">
          {/* Summary */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Import Preview
              </h2>
              <div className="flex items-center gap-4">
                {previewResult.valid ? (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                    ✓ Valid
                  </span>
                ) : (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400">
                    ✕ Has Errors
                  </span>
                )}
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {previewResult.rowCount}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Problems</p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                <p className="text-2xl font-bold text-red-600 dark:text-red-400">
                  {previewResult.errors.length}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Errors</p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                  {previewResult.warnings.length}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Warnings</p>
              </div>
            </div>
          </div>

          {/* Errors */}
          {previewResult.errors.length > 0 && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
              <h3 className="text-sm font-medium text-red-800 dark:text-red-200 mb-2">
                Errors (must fix before importing)
              </h3>
              <ul className="text-sm text-red-700 dark:text-red-300 space-y-1">
                {previewResult.errors.map((e, i) => (
                  <li key={i}>
                    <span className="font-mono bg-red-100 dark:bg-red-900/50 px-1 rounded">Row {e.row}</span>{" "}
                    {e.field}: {e.message}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Warnings */}
          {previewResult.warnings.length > 0 && (
            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
              <h3 className="text-sm font-medium text-yellow-800 dark:text-yellow-200 mb-2">
                Warnings (will be skipped)
              </h3>
              <ul className="text-sm text-yellow-700 dark:text-yellow-300 space-y-1">
                {previewResult.warnings.map((w, i) => (
                  <li key={i}>
                    <span className="font-mono bg-yellow-100 dark:bg-yellow-900/50 px-1 rounded">Row {w.row}</span>{" "}
                    {w.field}: {w.message}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Preview Table */}
          {previewResult.problems.length > 0 && (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                  Problems to Import
                </h3>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                        Row
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                        Title
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                        Description
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                        Tags
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                        Scores
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    {previewResult.problems.slice(0, 20).map((p, i) => (
                      <tr key={i} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                        <td className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">
                          {p.row}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-900 dark:text-white font-medium">
                          {p.title}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400 max-w-xs truncate">
                          {p.description || "-"}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex flex-wrap gap-1">
                            {p.tags.map((tag, j) => (
                              <span
                                key={j}
                                className="inline-flex px-2 py-0.5 text-xs rounded-full bg-gray-100 dark:bg-gray-600 text-gray-700 dark:text-gray-300"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">
                          {Object.entries(p.scores)
                            .map(([k, v]) => `${k}: ${v}`)
                            .join(", ") || "-"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {previewResult.problems.length > 20 && (
                  <div className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400 text-center border-t border-gray-200 dark:border-gray-700">
                    Showing 20 of {previewResult.problems.length} problems
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-between">
            <button
              onClick={() => setStep("input")}
              className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
            >
              ← Back to Edit
            </button>
            <button
              onClick={handleImport}
              disabled={loading || !previewResult.valid}
              className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700
                disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Importing..." : `Import ${previewResult.rowCount} Problems`}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
