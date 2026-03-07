export default function TextareaField({ label, value, onChange }) {
  return (
    <div className="mb-3">
      <label className="block text-sm font-medium mb-1">{label}</label>
      <textarea
        className="w-full border px-3 py-2 rounded"
        rows={3}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}
