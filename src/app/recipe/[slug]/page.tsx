'use client'
import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Recipe, Note, categoryEmoji } from '@/types/recipe'

const STORAGE_KEY = 'hille_recipes_added'
const NOTES_KEY = 'hille_recipe_notes'

export default function RecipePage() {
  const params = useSearchParams()
  const id = params.get('id')
  const [recipe, setRecipe] = useState<Recipe | null>(null)
  const [notes, setNotes] = useState<Note[]>([])
  const [noteForm, setNoteForm] = useState({ author: '', text: '' })
  const [noteError, setNoteError] = useState('')
  const [photoInput, setPhotoInput] = useState('')
  const [showPhotoInput, setShowPhotoInput] = useState(false)
  const [loaded, setLoaded] = useState(false)

  // Load recipe
  useEffect(() => {
    const numId = Number(id)

    // Check user-added recipes first
    try {
      const added = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]') as Recipe[]
      const found = added.find(r => r.id === numId)
      if (found) { setRecipe(found); setLoaded(true); return }
    } catch {}

    // Then load from JSON
    fetch('/data/recipes.json')
      .then(r => r.json())
      .then((data: Recipe[]) => {
        const found = data.find(r => r.id === numId)
        setRecipe(found || null)
        setLoaded(true)
      })
  }, [id])

  // Load notes
  useEffect(() => {
    if (!id) return
    try {
      const all = JSON.parse(localStorage.getItem(NOTES_KEY) || '{}')
      setNotes(all[id] || [])
    } catch {}
  }, [id])

  // Save photo URL
  const savePhoto = () => {
    if (!recipe || !photoInput.trim()) return
    const updated = { ...recipe, photoUrl: photoInput.trim() }
    setRecipe(updated)
    setShowPhotoInput(false)
    setPhotoInput('')

    // Persist to localStorage for user-added recipes
    try {
      const added = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]') as Recipe[]
      const idx = added.findIndex(r => r.id === recipe.id)
      if (idx >= 0) {
        added[idx] = updated
        localStorage.setItem(STORAGE_KEY, JSON.stringify(added))
      }
    } catch {}
  }

  // Add note
  const addNote = () => {
    if (!noteForm.author.trim()) { setNoteError('Please enter your name.'); return }
    if (!noteForm.text.trim()) { setNoteError('Please enter a note.'); return }
    setNoteError('')
    const newNote: Note = {
      id: Date.now().toString(),
      author: noteForm.author.trim(),
      text: noteForm.text.trim(),
      date: new Date().toISOString(),
    }
    const updated = [...notes, newNote]
    setNotes(updated)
    setNoteForm({ author: '', text: '' })
    try {
      const all = JSON.parse(localStorage.getItem(NOTES_KEY) || '{}')
      all[id!] = updated
      localStorage.setItem(NOTES_KEY, JSON.stringify(all))
    } catch {}
  }

  // Format instructions
  const formatInstructions = (text: string) => {
    const lines = text.split('\n').filter(l => l.trim())
    return lines.map((line, i) => {
      const isStep = /^\d+\./.test(line.trim())
      return (
        <p key={i} style={{
          marginBottom: '0.9rem',
          lineHeight: 1.75,
          fontSize: '0.95rem',
          fontWeight: isStep ? 500 : 400,
          color: isStep ? '#111' : '#333',
        }}>
          {line.trim()}
        </p>
      )
    })
  }

  if (!loaded) return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
      <div style={{ width: 32, height: 32, border: '2px solid #e5e5e5', borderTopColor: '#111', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); }}`}</style>
    </div>
  )

  if (!recipe) return (
    <div style={{ maxWidth: 640, margin: '80px auto', padding: '0 24px', textAlign: 'center' }}>
      <p style={{ fontFamily: 'var(--font-serif)', fontSize: '1.4rem', marginBottom: 12 }}>Recipe not found</p>
      <Link href="/" style={{ color: '#d0021b', fontSize: '0.9rem' }}>← Back to all recipes</Link>
    </div>
  )

  const emoji = categoryEmoji(recipe.category)

  return (
    <div style={{ minHeight: '100vh', background: '#fff' }}>
      {/* Nav */}
      <nav style={{ borderBottom: '1px solid #e5e5e5', padding: '0 24px' }}>
        <div style={{ maxWidth: 780, margin: '0 auto', padding: '14px 0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 8, color: '#333', fontSize: '0.85rem', fontFamily: 'var(--font-sans)' }}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M10 3L5 8l5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            All Recipes
          </Link>
          <span style={{ fontFamily: 'var(--font-serif)', fontSize: '1rem', color: '#111', fontStyle: 'italic' }}>
            Hille Family Recipes
          </span>
        </div>
      </nav>

      <article style={{ maxWidth: 780, margin: '0 auto', padding: '48px 24px 80px' }}>
        {/* Tags */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap' }}>
          <span style={{ background: '#111', color: '#fff', padding: '4px 12px', borderRadius: 100, fontSize: '0.68rem', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', fontFamily: 'var(--font-sans)' }}>
            {recipe.cuisine}
          </span>
          <span style={{ background: '#f4f4f4', color: '#555', padding: '4px 12px', borderRadius: 100, fontSize: '0.68rem', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', fontFamily: 'var(--font-sans)' }}>
            {recipe.category}
          </span>
        </div>

        {/* Title */}
        <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', fontWeight: 600, lineHeight: 1.15, color: '#111', marginBottom: 12 }}>
          {recipe.name}
        </h1>

        {/* Meta */}
        <p style={{ fontSize: '0.85rem', color: '#888', marginBottom: 32, fontFamily: 'var(--font-sans)' }}>
          By {recipe.submittedBy || 'Family'}
          {recipe.servings ? ` · ${recipe.servings}` : ''}
          {recipe.dateAdded ? ` · Added ${new Date(recipe.dateAdded).toLocaleDateString('en-US', { year: 'numeric', month: 'long' })}` : ''}
        </p>

        {/* Photo */}
        <div style={{ marginBottom: 40 }}>
          {recipe.photoUrl ? (
            <div style={{ position: 'relative', borderRadius: 6, overflow: 'hidden', marginBottom: 8 }}>
              <img
                src={recipe.photoUrl}
                alt={recipe.name}
                style={{ width: '100%', maxHeight: 480, objectFit: 'cover', display: 'block' }}
                onError={e => { (e.target as HTMLImageElement).parentElement!.style.display = 'none' }}
              />
              <button
                onClick={() => setShowPhotoInput(true)}
                style={{ position: 'absolute', bottom: 12, right: 12, background: 'rgba(255,255,255,0.9)', border: 'none', borderRadius: 3, padding: '6px 12px', fontSize: '0.75rem', cursor: 'pointer', fontFamily: 'var(--font-sans)' }}
              >
                Change photo
              </button>
            </div>
          ) : (
            <div style={{
              width: '100%', height: 280, background: 'linear-gradient(135deg, #f4f4f4, #ebebeb)',
              borderRadius: 6, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 12, marginBottom: 8,
            }}>
              <span style={{ fontSize: '4rem' }}>{emoji}</span>
              {!showPhotoInput && (
                <button
                  onClick={() => setShowPhotoInput(true)}
                  style={{ background: '#fff', border: '1.5px solid #ddd', borderRadius: 3, padding: '8px 16px', fontSize: '0.8rem', cursor: 'pointer', fontFamily: 'var(--font-sans)', color: '#555' }}
                >
                  + Add a photo
                </button>
              )}
            </div>
          )}

          {showPhotoInput && (
            <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
              <input
                type="text"
                value={photoInput}
                onChange={e => setPhotoInput(e.target.value)}
                placeholder="Paste a photo URL…"
                style={{ flex: 1, padding: '9px 12px', border: '1.5px solid #e5e5e5', borderRadius: 3, fontSize: '0.85rem', fontFamily: 'var(--font-sans)' }}
                onKeyDown={e => e.key === 'Enter' && savePhoto()}
              />
              <button onClick={savePhoto} style={{ background: '#111', color: '#fff', border: 'none', borderRadius: 3, padding: '9px 16px', cursor: 'pointer', fontSize: '0.85rem', fontFamily: 'var(--font-sans)' }}>Save</button>
              <button onClick={() => setShowPhotoInput(false)} style={{ background: '#f4f4f4', border: 'none', borderRadius: 3, padding: '9px 14px', cursor: 'pointer', fontSize: '0.85rem', fontFamily: 'var(--font-sans)', color: '#666' }}>Cancel</button>
            </div>
          )}
        </div>

        <hr style={{ border: 'none', borderTop: '1px solid #e5e5e5', marginBottom: 40 }} />

        {/* Notes/tips from recipe */}
        {recipe.notes && (
          <div style={{ background: '#fffbf0', border: '1px solid #f0e8c8', borderRadius: 4, padding: '16px 20px', marginBottom: 32 }}>
            <p style={{ fontSize: '0.7rem', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#8a7040', marginBottom: 6, fontFamily: 'var(--font-sans)' }}>Recipe Notes</p>
            <p style={{ fontSize: '0.9rem', color: '#5a4a30', lineHeight: 1.65, fontStyle: 'italic' }}>{recipe.notes}</p>
          </div>
        )}

        {/* Ingredients */}
        {recipe.ingredients && recipe.ingredients.length > 0 && (
          <div style={{ marginBottom: 40 }}>
            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.3rem', fontWeight: 500, marginBottom: 16, color: '#111' }}>Ingredients</h2>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {recipe.ingredients.map((ing, i) => (
                <span key={i} style={{ background: '#f4f4f4', padding: '5px 12px', borderRadius: 100, fontSize: '0.8rem', color: '#444', fontFamily: 'var(--font-sans)', textTransform: 'capitalize' }}>
                  {ing}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Instructions */}
        <div style={{ marginBottom: 56 }}>
          <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.3rem', fontWeight: 500, marginBottom: 24, color: '#111' }}>Instructions</h2>
          <div style={{ fontFamily: 'var(--font-sans)' }}>
            {formatInstructions(recipe.instructions)}
          </div>
        </div>

        <hr style={{ border: 'none', borderTop: '1px solid #e5e5e5', marginBottom: 48 }} />

        {/* Community Notes */}
        <section>
          <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.5rem', fontWeight: 500, marginBottom: 6, color: '#111' }}>
            Family Notes
          </h2>
          <p style={{ fontSize: '0.85rem', color: '#999', marginBottom: 32, fontFamily: 'var(--font-sans)' }}>
            Made this recipe? Share how it went, any tweaks you made, or a memory it brings up.
          </p>

          {/* Existing notes */}
          {notes.length > 0 && (
            <div style={{ marginBottom: 40, display: 'flex', flexDirection: 'column', gap: 20 }}>
              {notes.map(note => (
                <div key={note.id} style={{ borderLeft: '3px solid #e5e5e5', paddingLeft: 20 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                    <div style={{ width: 32, height: 32, borderRadius: '50%', background: '#111', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '0.8rem', fontWeight: 600, fontFamily: 'var(--font-sans)' }}>
                      {note.author.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p style={{ fontSize: '0.85rem', fontWeight: 600, color: '#111', margin: 0, fontFamily: 'var(--font-sans)' }}>{note.author}</p>
                      <p style={{ fontSize: '0.75rem', color: '#bbb', margin: 0, fontFamily: 'var(--font-sans)' }}>
                        {new Date(note.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                      </p>
                    </div>
                  </div>
                  <p style={{ fontSize: '0.9rem', color: '#333', lineHeight: 1.65, margin: 0, fontFamily: 'var(--font-sans)' }}>{note.text}</p>
                </div>
              ))}
            </div>
          )}

          {/* Add note form */}
          <div style={{ background: '#fafafa', border: '1px solid #e5e5e5', borderRadius: 6, padding: 24 }}>
            <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.1rem', fontWeight: 500, marginBottom: 20, color: '#111' }}>
              Leave a Note
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#666', marginBottom: 6, fontFamily: 'var(--font-sans)' }}>Your Name</label>
                <input
                  type="text"
                  value={noteForm.author}
                  onChange={e => setNoteForm(f => ({ ...f, author: e.target.value }))}
                  placeholder="e.g. Aunt Sarah"
                  style={{ width: '100%', padding: '10px 12px', border: '1.5px solid #e5e5e5', borderRadius: 3, fontSize: '0.88rem', fontFamily: 'var(--font-sans)', background: '#fff' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#666', marginBottom: 6, fontFamily: 'var(--font-sans)' }}>Your Note</label>
                <textarea
                  value={noteForm.text}
                  onChange={e => setNoteForm(f => ({ ...f, text: e.target.value }))}
                  placeholder="How did it turn out? Any tweaks or memories to share?"
                  rows={4}
                  style={{ width: '100%', padding: '10px 12px', border: '1.5px solid #e5e5e5', borderRadius: 3, fontSize: '0.88rem', fontFamily: 'var(--font-sans)', background: '#fff', resize: 'vertical', lineHeight: 1.6 }}
                />
              </div>
              {noteError && <p style={{ color: '#d0021b', fontSize: '0.85rem', margin: 0 }}>{noteError}</p>}
              <div>
                <button
                  onClick={addNote}
                  style={{ background: '#111', color: '#fff', border: 'none', borderRadius: 3, padding: '10px 24px', cursor: 'pointer', fontSize: '0.85rem', fontFamily: 'var(--font-sans)' }}
                >
                  Post Note
                </button>
              </div>
            </div>
          </div>
        </section>
      </article>
    </div>
  )
}
