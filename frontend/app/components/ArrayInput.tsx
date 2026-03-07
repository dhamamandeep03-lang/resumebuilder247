export default function ArrayInput({ items, setItems, placeholder }) {
  const add = () => setItems([...items, ""]);
  const update = (index: number, value: string) => {
    const newList = [...items];
    newList[index] = value;
    setItems(newList);
  };
  const remove = (index: number) =>
    setItems(items.filter((_, i) => i !== index));

  return (
    <div className="mb-3">
      {items.map((item, idx) => (
        <div key={idx} className="flex gap-2 mb-2">
          <input
            className="flex-1 border px-3 py-2 rounded"
            value={item}
            onChange={(e) => update(idx, e.target.value)}
            placeholder={placeholder}
          />
          <button
            className="px-3 bg-red-500 text-white rounded"
            onClick={() => remove(idx)}
          >
            X
          </button>
        </div>
      ))}
      <button
        className="px-4 py-1 bg-gray-800 text-white rounded"
        onClick={add}
      >
        + Add
      </button>
    </div>
  );
}
