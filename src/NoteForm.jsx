import React, { useState } from 'react'


function NoteForm({ onCreate, existingTags = [] }) {
    const [title, setTitle] = useState('')
    const [content, setContent] = useState('')
    const [tagInput, setTagInput] = useState('')
    const [tags, setTags] = useState([])


    function addTag() {
        const t = tagInput.trim()
        if (!t) return
        if (!tags.includes(t)) setTags(prev => [...prev, t])
        setTagInput('')
    }


    function removeTag(t) {
        setTags(prev => prev.filter(x => x !== t))
    }


    function submit(e) {
        e.preventDefault()
        if (!title && !content) return
        onCreate({ title, content, tags })
        setTitle('')
        setContent('')
        setTags([])
    }


    return (
        <form onSubmit={submit} className="p-4 rounded bg-white shadow-sm">
            <h2 className="font-medium mb-2">Create note</h2>
            <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Title" className="w-full mb-2 rounded border px-3 py-2" />
            <textarea value={content} onChange={e => setContent(e.target.value)} placeholder="Write something..." className="w-full rounded border px-3 py-2 h-28" />


            <div className="mt-3">
                <div className="flex gap-2">
                    <input value={tagInput} onChange={e => setTagInput(e.target.value)} placeholder="add tag and press Add" className="flex-1 rounded border px-3 py-2" />
                    <button type="button" onClick={addTag} className="px-3 py-2 rounded bg-gray-100">Add</button>
                </div>
                <div className="mt-2 flex gap-2 flex-wrap">
                    {tags.map(t => (
                        <div key={t} className="px-2 py-1 bg-blue-50 text-blue-700 rounded flex items-center gap-2">{t} <button onClick={() => removeTag(t)}>×</button></div>
                    ))}
                </div>
            </div>


            <div className="mt-4 flex justify-end gap-2">
                <button type="button" onClick={() => { setTitle(''); setContent(''); setTags([]) }} className="px-4 py-2 rounded border">Clear</button>
                <button type="submit" className="px-4 py-2 rounded bg-indigo-600 text-white">Save</button>
            </div>
        </form>
    )
}
export default NoteForm;