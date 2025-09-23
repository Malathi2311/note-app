import React, { useState } from 'react'

function NoteModal({ note, onClose, onSave }) {
    const [title, setTitle] = useState(note.title)
    const [content, setContent] = useState(note.content)
    const [tagsText, setTagsText] = useState(note.tags.join(', '))


    function submit(e) {
        e.preventDefault()
        const tags = tagsText.split(',').map(s => s.trim()).filter(Boolean)
        onSave(note.id, { title, content, tags })
    }


    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <form onSubmit={submit} className="w-full max-w-2xl p-6 bg-white rounded">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-semibold">Edit Note</h2>
                    <button type="button" onClick={onClose} className="px-3 py-1 rounded">Close</button>
                </div>
                <input value={title} onChange={e => setTitle(e.target.value)} className="w-full mb-3 rounded border px-3 py-2" />
                <textarea value={content} onChange={e => setContent(e.target.value)} className="w-full rounded border px-3 py-2 h-40" />
                <input value={tagsText} onChange={e => setTagsText(e.target.value)} className="w-full mt-3 rounded border px-3 py-2" placeholder="comma separated tags" />
                <div className="mt-4 flex justify-end gap-2">
                    <button type="button" onClick={onClose} className="px-4 py-2 rounded border">Cancel</button>
                    <button type="submit" className="px-4 py-2 rounded bg-indigo-600 text-white">Save</button>
                </div>
            </form>
        </div>
    )
}
export default NoteModal;