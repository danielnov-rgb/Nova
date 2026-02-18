"use client";

import { useEffect, useState } from "react";
import { projectsApi, ProjectItem, ProjectItemStatus, ProjectItemsByStatus } from "../_lib/api";
import { AgentPageHeader } from "../_components/AgentPageHeader";

const COLUMNS: { status: ProjectItemStatus; label: string; color: string }[] = [
  { status: "BACKLOG", label: "Backlog", color: "bg-gray-100 dark:bg-gray-800" },
  { status: "IN_PROGRESS", label: "In Progress", color: "bg-blue-50 dark:bg-blue-900/20" },
  { status: "REVIEW", label: "Review", color: "bg-yellow-50 dark:bg-yellow-900/20" },
  { status: "DONE", label: "Done", color: "bg-green-50 dark:bg-green-900/20" },
];

export default function ProjectsPage() {
  const [items, setItems] = useState<ProjectItemsByStatus>({
    BACKLOG: [],
    IN_PROGRESS: [],
    REVIEW: [],
    DONE: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [addToColumn, setAddToColumn] = useState<ProjectItemStatus>("BACKLOG");

  // New item form
  const [newTitle, setNewTitle] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchItems();
  }, []);

  async function fetchItems() {
    try {
      const data = await projectsApi.getByStatus();
      setItems(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load items");
    } finally {
      setLoading(false);
    }
  }

  async function handleAddItem(e: React.FormEvent) {
    e.preventDefault();
    if (!newTitle.trim()) return;

    setSaving(true);
    try {
      const item = await projectsApi.create({
        title: newTitle.trim(),
        description: newDescription.trim() || undefined,
        status: addToColumn,
      });
      setItems((prev) => ({
        ...prev,
        [addToColumn]: [...prev[addToColumn], item],
      }));
      setNewTitle("");
      setNewDescription("");
      setShowAddModal(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create item");
    } finally {
      setSaving(false);
    }
  }

  async function handleMoveItem(item: ProjectItem, newStatus: ProjectItemStatus) {
    // Optimistic update
    const oldStatus = item.status;
    setItems((prev) => ({
      ...prev,
      [oldStatus]: prev[oldStatus].filter((i) => i.id !== item.id),
      [newStatus]: [...prev[newStatus], { ...item, status: newStatus }],
    }));

    try {
      await projectsApi.update(item.id, { status: newStatus });
    } catch (err) {
      // Revert on error
      setItems((prev) => ({
        ...prev,
        [newStatus]: prev[newStatus].filter((i) => i.id !== item.id),
        [oldStatus]: [...prev[oldStatus], item],
      }));
      setError(err instanceof Error ? err.message : "Failed to move item");
    }
  }

  async function handleDeleteItem(item: ProjectItem) {
    if (!confirm("Delete this item?")) return;

    try {
      await projectsApi.delete(item.id);
      setItems((prev) => ({
        ...prev,
        [item.status]: prev[item.status].filter((i) => i.id !== item.id),
      }));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete item");
    }
  }

  function openAddModal(column: ProjectItemStatus) {
    setAddToColumn(column);
    setShowAddModal(true);
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <div className="py-8 h-[calc(100vh-4rem)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex flex-col">
        <AgentPageHeader agentId="engineering" />
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Project Board
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Track problems and solutions through your pipeline
            </p>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <p className="text-red-600 dark:text-red-400">{error}</p>
            <button onClick={() => setError(null)} className="text-sm underline mt-1">
              Dismiss
            </button>
          </div>
        )}

        {/* Kanban Board */}
        <div className="flex-1 grid grid-cols-4 gap-4 min-h-0">
          {COLUMNS.map((column) => (
            <div key={column.status} className="flex flex-col min-h-0">
              {/* Column Header */}
              <div className={`rounded-t-lg px-4 py-3 ${column.color}`}>
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    {column.label}
                  </h3>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {items[column.status].length}
                  </span>
                </div>
              </div>

              {/* Column Content */}
              <div className="flex-1 overflow-y-auto bg-gray-50 dark:bg-gray-900 border border-t-0 border-gray-200 dark:border-gray-800 rounded-b-lg p-2 space-y-2">
                {items[column.status].map((item) => (
                  <KanbanCard
                    key={item.id}
                    item={item}
                    onMove={(status) => handleMoveItem(item, status)}
                    onDelete={() => handleDeleteItem(item)}
                    currentStatus={column.status}
                  />
                ))}

                {/* Add Button */}
                <button
                  onClick={() => openAddModal(column.status)}
                  className="w-full p-3 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg text-gray-500 dark:text-gray-400 hover:border-primary-500 hover:text-primary-500 transition-colors"
                >
                  + Add item
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-900 rounded-xl shadow-xl max-w-md w-full mx-4 p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Add to {COLUMNS.find((c) => c.status === addToColumn)?.label}
            </h2>
            <form onSubmit={handleAddItem} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Title *
                </label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="What needs to be done?"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  autoFocus
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Description
                </label>
                <textarea
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  rows={3}
                  placeholder="Add details..."
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving || !newTitle.trim()}
                  className="flex-1 px-4 py-2 bg-primary-500 hover:bg-primary-600 disabled:bg-primary-400 text-white rounded-lg"
                >
                  {saving ? "Adding..." : "Add Item"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function KanbanCard({
  item,
  onMove,
  onDelete,
  currentStatus,
}: {
  item: ProjectItem;
  onMove: (status: ProjectItemStatus) => void;
  onDelete: () => void;
  currentStatus: ProjectItemStatus;
}) {
  const [showMenu, setShowMenu] = useState(false);

  const moveOptions = COLUMNS.filter((c) => c.status !== currentStatus);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-3 shadow-sm border border-gray-200 dark:border-gray-700 group">
      <div className="flex items-start justify-between gap-2">
        <h4 className="font-medium text-gray-900 dark:text-white text-sm">
          {item.title}
        </h4>
        <div className="relative">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <DotsIcon className="w-4 h-4" />
          </button>
          {showMenu && (
            <>
              <div className="fixed inset-0" onClick={() => setShowMenu(false)} />
              <div className="absolute right-0 top-6 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg py-1 z-10 min-w-[120px]">
                {moveOptions.map((col) => (
                  <button
                    key={col.status}
                    onClick={() => {
                      onMove(col.status);
                      setShowMenu(false);
                    }}
                    className="w-full px-3 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    Move to {col.label}
                  </button>
                ))}
                <hr className="my-1 border-gray-200 dark:border-gray-700" />
                <button
                  onClick={() => {
                    onDelete();
                    setShowMenu(false);
                  }}
                  className="w-full px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                >
                  Delete
                </button>
              </div>
            </>
          )}
        </div>
      </div>
      {item.description && (
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">
          {item.description}
        </p>
      )}
      {item.assignee && (
        <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
          {item.assignee}
        </div>
      )}
    </div>
  );
}

function DotsIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <circle cx="12" cy="5" r="2" />
      <circle cx="12" cy="12" r="2" />
      <circle cx="12" cy="19" r="2" />
    </svg>
  );
}
