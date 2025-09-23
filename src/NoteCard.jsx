import React from 'react'


function NoteCard({ note, onOpen, onTogglePin, onArchive, onTrash, onEdit }) {
    return (
        <article className="p-4 rounded bg-white shadow-sm relative">
            <div className="flex justify-between items-start gap-2">
                <h3 className="font-semibold">{note.title}</h3>
                <div className="flex items-center gap-1">
                    <button onClick={onTogglePin} title="Pin" className={`px-2 py-1 rounded ${note.pinned ? 'bg-yellow-100' : 'hover:bg-gray-100'}`}>
                        {note.pinned ? '📌': 'Pin'}
                    </button>
                    <div className="dropdown">
                        <button className="px-2 py-1 rounded hover:bg-gray-100">⋯</button>
                    </div>
                </div>
            </div>


            <p className="text-sm text-gray-700 mt-2 line-clamp-3">{note.content}</p>


            <div className="mt-3 flex gap-2 flex-wrap">
                {note.tags.map(t => <span key={t} className="text-xs px-2 py-1 bg-gray-100 rounded">{t}</span>)}
            </div>


            <div className="mt-3 flex justify-between items-center">
                <div className="text-xs text-gray-400">{new Date(note.updatedAt).toLocaleString()}</div>
                <div className="flex gap-2">
                    <button onClick={onArchive} className="text-sm px-2 py-1 rounded hover:bg-gray-100">Archive</button>
                    <button onClick={onTrash} className="text-sm px-2 py-1 rounded hover:bg-gray-100">Trash</button>
                    <button onClick={onOpen} className="text-sm px-2 py-1 rounded bg-indigo-50">Open</button>
                </div>
            </div>
        </article>
    )
}
export default NoteCard;