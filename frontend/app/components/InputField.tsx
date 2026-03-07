export default function InputField({ label, value, onChange, placeholder = "" }) {
  return (
    <div className="mb-3">
      <label className="block text-sm font-medium mb-1">{label}</label>
      <input
        className="w-full border px-3 py-2 rounded"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
      />
    </div>
  );
}
