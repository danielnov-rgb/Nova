"use client";

export interface RequiredField {
  field: string;
  label: string;
  required: boolean;
}

interface RequiredFieldsSelectorProps {
  selectedFields: RequiredField[];
  onChange: (fields: RequiredField[]) => void;
}

const DEMOGRAPHIC_FIELDS = [
  { field: "age", label: "Age" },
  { field: "gender", label: "Gender" },
  { field: "location", label: "Location" },
  { field: "incomeBracket", label: "Income Bracket" },
];

const PROFESSIONAL_FIELDS = [
  { field: "profession", label: "Profession / Role" },
  { field: "industry", label: "Industry" },
  { field: "companySize", label: "Company Size" },
  { field: "yearsOfExperience", label: "Years of Experience" },
  { field: "jobLevel", label: "Job Level" },
];

export function RequiredFieldsSelector({ selectedFields, onChange }: RequiredFieldsSelectorProps) {
  const selectedFieldMap = new Map(selectedFields.map((f) => [f.field, f]));

  function isFieldSelected(field: string): boolean {
    return selectedFieldMap.has(field);
  }

  function getFieldRequired(field: string): boolean {
    return selectedFieldMap.get(field)?.required ?? false;
  }

  function toggleField(field: string, label: string) {
    if (isFieldSelected(field)) {
      onChange(selectedFields.filter((f) => f.field !== field));
    } else {
      onChange([...selectedFields, { field, label, required: false }]);
    }
  }

  function toggleRequired(field: string) {
    onChange(
      selectedFields.map((f) =>
        f.field === field ? { ...f, required: !f.required } : f
      )
    );
  }

  function renderFieldRow(field: string, label: string) {
    const isSelected = isFieldSelected(field);
    const isRequired = getFieldRequired(field);

    return (
      <div
        key={field}
        className={`flex items-center justify-between py-2 px-3 rounded-lg ${
          isSelected ? "bg-primary-50 dark:bg-primary-900/20" : ""
        }`}
      >
        <label className="flex items-center gap-2 cursor-pointer flex-1">
          <input
            type="checkbox"
            checked={isSelected}
            onChange={() => toggleField(field, label)}
            className="rounded border-gray-300 text-primary-500 focus:ring-primary-500"
          />
          <span className="text-sm text-gray-900 dark:text-white">{label}</span>
        </label>
        {isSelected && (
          <select
            value={isRequired ? "mandatory" : "optional"}
            onChange={() => toggleRequired(field)}
            className="text-xs px-2 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300"
          >
            <option value="optional">Optional</option>
            <option value="mandatory">Mandatory</option>
          </select>
        )}
      </div>
    );
  }

  return (
    <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
      <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
        Required Voter Information
      </h4>
      <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
        Select information voters must provide before voting. Mandatory fields must be filled; optional fields are requested but not required.
      </p>

      <div className="space-y-4">
        <div>
          <h5 className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">
            Demographics
          </h5>
          <div className="space-y-1">
            {DEMOGRAPHIC_FIELDS.map(({ field, label }) => renderFieldRow(field, label))}
          </div>
        </div>

        <div>
          <h5 className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">
            Professional
          </h5>
          <div className="space-y-1">
            {PROFESSIONAL_FIELDS.map(({ field, label }) => renderFieldRow(field, label))}
          </div>
        </div>
      </div>

      {selectedFields.length > 0 && (
        <div className="mt-4 pt-3 border-t border-gray-200 dark:border-gray-700">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {selectedFields.filter((f) => f.required).length} mandatory,{" "}
            {selectedFields.filter((f) => !f.required).length} optional fields selected
          </p>
        </div>
      )}
    </div>
  );
}
