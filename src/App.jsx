import React, { useEffect, useMemo, useState } from 'react'
import { Routes, Route, Link, useNavigate } from 'react-router-dom'
import NoteForm from './NoteForm'
import NoteCard from './NoteCard'
import NoteModal from './NoteModal'
import TagFilter from './Tagfilter'


const STORAGE_KEY = 'react-notes-app:v1'


function uid() {
  return Math.random().toString(36).slice(2, 9)
}


function useLocalStorage(key, initial) {
  const [state, setState] = useState(() => {
    try {
      const raw = localStorage.getItem(key)
      return raw ? JSON.parse(raw) : initial
    } catch (e) {
      console.error('Failed to parse localStorage', e)
      return initial
    }
  })


  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(state))
  }, [key, state])


  return [state, setState]
}


function App() {
  const [notes, setNotes] = useLocalStorage(STORAGE_KEY, [])
  const [query, setQuery] = useState('')
  const [activeTag, setActiveTag] = useState(null)
  const [selectedNote, setSelectedNote] = useState(null)
  const navigate = useNavigate()
  useEffect(() => {
    setNotes(prev => {
      const sorted = [...prev].sort((a, b) => {
        if (a.pinned === b.pinned) return new Date(b.updatedAt) - new Date(a.updatedAt)
        return a.pinned ? -1 : 1
      })
      return sorted
    })
  }, [])
  const allTags = useMemo(() => {
    const set = new Set()
    notes.forEach(n => n.tags?.forEach(t => set.add(t)))
    return Array.from(set).sort()
  }, [notes])


  function createNote({ title, content, tags }) {
    const now = new Date().toISOString()
    const note = {
      id: uid(),
      title: title || 'Untitled',
      content: content || '',
      tags: tags || [],
      pinned: false,
      archived: false,
      deleted: false,
      createdAt: now,
      updatedAt: now,
    }
    setNotes(prev => [note, ...prev])
  }


  function updateNote(id, patch) {
    setNotes(prev => prev.map(n => n.id === id ? { ...n, ...patch, updatedAt: new Date().toISOString() } : n))
  }


  function moveToTrash(id) {
    updateNote(id, { deleted: true, archived: false, pinned: false })
  }


  function restoreFromTrash(id) {
    updateNote(id, { deleted: false })
  }


  function permanentlyDelete(id) {
    setNotes(prev => prev.filter(n => n.id !== id))
  }


  function togglePin(id) {
    setNotes(prev => prev.map(n => n.id === id ? { ...n, pinned: !n.pinned, updatedAt: new Date().toISOString() } : n))
  }


  function toggleArchive(id) {
    setNotes(prev => prev.map(n => n.id === id ? { ...n, archived: !n.archived, deleted: false, updatedAt: new Date().toISOString() } : n))
  }
  function filteredNotes(view = 'notes') {
    return notes.filter(n => {
      if (view === 'notes' && (n.deleted || n.archived)) return false
      if (view === 'archive' && !n.archived) return false
      if (view === 'trash' && !n.deleted) return false
      const q = query.trim().toLowerCase()
      if (q) {
        const inTitle = n.title.toLowerCase().includes(q)
        const inContent = n.content.toLowerCase().includes(q)
        if (!inTitle && !inContent) return false
      }
      if (activeTag && !n.tags.includes(activeTag)) return false
      return true
    })
  }
  function sortedNotes(view = "notes") {
    return filteredNotes(view).sort((a, b) => {
      if (a.pinned === b.pinned) {
        // If both are pinned or both are not pinned, sort by latest update
        return new Date(b.updatedAt) - new Date(a.updatedAt)
      }
      // If one is pinned and other not → pinned first
      return a.pinned ? -1 : 1
    })
  }
  return (
    <div className="min-h-screen p-6 max-w-6xl mx-auto bg-gray-100">
      <header className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">Notes 📝</h1>

        <nav className="space-x-3">
          <Link to="/" className="px-3 py-1 rounded hover:bg-gray-100">All</Link>
          <Link to="/archive" className="px-3 py-1 rounded hover:bg-gray-100">Archive</Link>
          <Link to="/trash" className="px-3 py-1 rounded hover:bg-gray-100">Trash</Link>
        </nav>
      </header>


      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <aside className="md:col-span-1">
          <NoteForm onCreate={createNote} existingTags={allTags} />


          <div className="mt-6">
            <label className="block text-sm font-medium mb-2">Search</label>
            <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search title or content" className="w-full rounded border px-3 py-2" />
          </div>


          <div className="mt-6">
            <TagFilter tags={allTags} activeTag={activeTag} onSelect={t => setActiveTag(t)} onClear={() => setActiveTag(null)} />
          </div>
        </aside>


        <main className="md:col-span-2">
          <Routes>
            <Route path="/" element={<NotesList notes={sortedNotes('notes')} onOpen={setSelectedNote} onTogglePin={togglePin} onArchive={toggleArchive} onTrash={moveToTrash} onEdit={updateNote} />} />
            <Route path="/archive" element={<NotesList notes={sortedNotes('archive')} onOpen={setSelectedNote} onTogglePin={togglePin} onArchive={toggleArchive} onTrash={moveToTrash} onEdit={updateNote} />} />
            <Route path="/trash" element={<TrashList notes={sortedNotes('trash')} onRestore={restoreFromTrash} onDelete={permanentlyDelete} />} />
          </Routes>
        </main>
      </div>


      {selectedNote && <NoteModal note={selectedNote} onClose={() => setSelectedNote(null)} onSave={(id, patch) => { updateNote(id, patch); setSelectedNote(null) }} />}
    </div>
  )
}


function NotesList({ notes, onOpen, onTogglePin, onArchive, onTrash, onEdit }) {
  if (!notes.length) return <div className="text-center py-12 text-gray-500">No notes here</div>
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {notes.map(n => (
        <NoteCard key={n.id} note={n} onOpen={() => onOpen(n)} onTogglePin={() => onTogglePin(n.id)} onArchive={() => onArchive(n.id)} onTrash={() => onTrash(n.id)} onEdit={patch => onEdit(n.id, patch)} />
      ))}
    </div>
  )
}


function TrashList({ notes, onRestore, onDelete }) {
  if (!notes.length) return <div className="text-center py-12 text-gray-500">Trash is empty</div>
  return (
    <div className="space-y-4">
      {notes.map(n => (
        <div key={n.id} className="p-4 rounded bg-white shadow-sm flex justify-between items-start">
          <div>
            <div className="font-semibold">{n.title}</div>
            <div className="text-sm text-gray-600 mt-1 truncate max-w-xl">{n.content}</div>
            <div className="text-xs text-gray-400 mt-2">Deleted: {new Date(n.updatedAt).toLocaleString()}</div>
          </div>
          <div className="flex gap-2">
            <button onClick={() => onRestore(n.id)} className="px-3 py-1 rounded bg-green-50">Restore</button>
            <button onClick={() => onDelete(n.id)} className="px-3 py-1 rounded bg-red-50">Delete</button>
          </div>
        </div>
      ))}
    </div>
  )
}
export default App;