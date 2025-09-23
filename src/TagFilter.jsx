
function TagFilter({ tags = [], activeTag, onSelect, onClear }) {
    if (!tags.length) return <div className="text-sm text-gray-500">No tags yet</div>
    return (
        <div>
            <div className="flex items-center justify-between mb-2">
                <div className="font-medium text-sm ">Tags</div>
                <button onClick={onClear} className="text-xs text-gray-500">Clear</button>
            </div>
            <div className="flex gap-2 flex-wrap">
                {tags.map(t => (
                    <button key={t} onClick={() => onSelect(t)} className={`px-2 py-1 rounded ${activeTag === t ? 'bg-indigo-600 text-white' : 'bg-gray-300'}`}>{t}</button>
                ))}
            </div>
        </div>
    )
}
export default TagFilter;