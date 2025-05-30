import { useTranslation } from "react-i18next";

interface FormFieldProps {
  name: string;
  value: string | number;
  onChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => void;
  label: string;
  type?: string;
  className?: string;
  required?: boolean;
  options?: { value: string | number; label: string }[];
  rows?: number;
}

export default function FormField({
  name,
  value,
  onChange,
  label,
  type = "text",
  className = "",
  required = false,
  options,
  rows,
}: FormFieldProps) {
  const { t } = useTranslation();

  const renderInput = () => {
    if (type === "select" && options) {
      return (
        <select
          name={name}
          value={value}
          onChange={onChange}
          className={`border border-blue-300 rounded px-2 py-1 text-xs focus:ring-2 focus:ring-blue-400 outline-none ${className}`}
          required={required}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      );
    }

    if (type === "textarea") {
      return (
        <textarea
          name={name}
          value={value}
          onChange={onChange}
          rows={rows}
          className={`border border-blue-300 rounded px-2 py-1 text-xs focus:ring-2 focus:ring-blue-400 outline-none ${className}`}
          required={required}
        />
      );
    }

    return (
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        className={`border border-blue-300 rounded px-2 py-1 text-xs focus:ring-2 focus:ring-blue-400 outline-none ${className}`}
        required={required}
      />
    );
  };

  return (
    <div className="flex flex-col min-w-[160px]">
      <label className="block text-xs font-semibold mb-1 text-blue-800">
        {label}
      </label>
      {renderInput()}
    </div>
  );
}
