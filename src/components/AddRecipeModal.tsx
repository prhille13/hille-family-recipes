'use client'
import { useState, useEffect } from 'react'
import { Recipe, CATEGORIES, CUISINES } from '@/types/recipe'

interface Props {
  onClose: () => void
  onAdd: (recipe: Recipe) => void
}

export default function AddRecipeModal({ onClose, onAdd }: Props) {
  const [form, setForm] = useState({
    name: '',
    instructions: '',
    category: 'Main Course',
    cuisine: 'American',
    submittedBy: '',
    servings: '',
    notes: '',
  })
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', handleKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', handleKey)
      document.body.style.overflow = ''
    }
  }, [onClose])

  const handleSubmit = () => {
    if (!form.name.trim()) { setError('Please enter a recipe name.'); return }
    if (!form.instructions.trim()) { setError('Please enter the recipe instructions.'); return }
    if (!form.submittedBy.trim()) { setError('Please enter your name.'); return }
    setError('')

    // Extract rough ingredient keywords from instructions
    const words = form.instructions.toLowerCase().split(/\s+/)
    const stopwords = new Set(['the','and','or','in','of','a','an','to','with','from','cup','cups','tbsp','tsp','lb','oz','until','then','add','mix','stir','cook','heat','place','combine','bring','season','salt','pepper','butter','water','flour','sugar'])
    const ingredients = [...new Set(words.filter(w => w.length > 4 && !stopwords.has(w) && /^[a-z]+$/.test(w)))].slice(0, 15)

    const newRecipe: Recipe = {
      id: Date.now(),
      name: form.name.trim(),
      instructions: form.instructions.trim(),
      category: form.category,
      cuisine: form.cuisine,
      ingredients,
      submittedBy: form.submittedBy.trim(),
      servings: form.servings.trim(),
      notes: form.notes.trim(),
      dateAdded: new Date().toISOString(),
    }

    onAdd(newRecipe)
    setSubmitted(true)
  }

  const inputStyle = {
    width: '100%',
    padding: '10px 14px',
    border: '1px solid #ddd4c0',
    borderRadius: '2px',
    backgroundColor: '#fdfaf4',
    fontFamily: 'Inter, sans-serif',
    fontSize: '0.9rem',
    color: '#1a1a1a',
    lineHeight: 1.5,
  }

  const labelStyle = {
    display: 'block',
    fontSize: '0.72rem',
    letterSpacing: '0.08em',
    textTransform: 'uppercase' as const,
    color: '#8a7a6a',
    marginBottom: '6px',
    fontFamily: 'Inter, sans-serif',
    fontWeight: 500,
  }

  return (
    <div
      className="modal-overlay fixed inset-0 z-50 flex items-start justify-center p-4 pt-10 pb-10"
      style={{ backgroundColor: 'rgba(10,8,5,0.65)', backdropFilter: 'blur(3px)' }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className="modal-panel relative w-full max-w-xl rounded-sm overflow-hidden"
        style={{
          backgroundColor: '#fdfaf4',
          boxShadow: '0 32px 80px rgba(0,0,0,0.3)',
          maxHeight: '88vh',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* Header */}
        <div className="px-8 pt-8 pb-5 flex-shrink-0" style={{ borderBottom: '1px solid #e2d9c8' }}>
          <p className="text-xs uppercase tracking-widest mb-2" style={{ color: '#b5451b', fontFamily: 'Inter, sans-serif' }}>
            Add to the collection
          </p>
          <h2
            className="text-2xl"
            style={{ fontFamily: "'Playfair Display', Georgia, serif", fontWeight: 600 }}
          >
            Share a Recipe
          </h2>
        </div>

        {submitted ? (
          <div className="flex-1 flex flex-col items-center justify-center px-8 py-16 text-center">
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center mb-5"
              style={{ backgroundColor: '#edf2e8' }}
            >
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                <path d="M5 12l5 5L19 7" stroke="#6b7c5c" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <h3
              className="text-xl mb-2"
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            >
              Recipe Added!
            </h3>
            <p className="text-sm mb-6" style={{ color: '#7a6a5a', fontFamily: 'Inter, sans-serif' }}>
              Thank you, {form.submittedBy}. Your recipe is now in the collection.
            </p>
            <button
              onClick={onClose}
              className="px-6 py-2.5 text-sm rounded-sm transition-colors"
              style={{
                backgroundColor: '#b5451b',
                color: '#fff',
                fontFamily: 'Inter, sans-serif',
                letterSpacing: '0.04em',
              }}
              onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#9a3a16')}
              onMouseLeave={e => (e.currentTarget.style.backgroundColor = '#b5451b')}
            >
              Close
            </button>
          </div>
        ) : (
          <>
            {/* Form body */}
            <div className="overflow-y-auto flex-1 px-8 py-6">
              <div className="space-y-5">
                {/* Name */}
                <div>
                  <label style={labelStyle}>Recipe Name *</label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                    placeholder="e.g. Grandma's Apple Pie"
                    style={inputStyle}
                  />
                </div>

                {/* Two columns: category + cuisine */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label style={labelStyle}>Category</label>
                    <select
                      value={form.category}
                      onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
                      style={{ ...inputStyle, cursor: 'pointer' }}
                    >
                      {CATEGORIES.filter(c => c !== 'All').map(c => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label style={labelStyle}>Cuisine</label>
                    <select
                      value={form.cuisine}
                      onChange={e => setForm(f => ({ ...f, cuisine: e.target.value }))}
                      style={{ ...inputStyle, cursor: 'pointer' }}
                    >
                      {CUISINES.filter(c => c !== 'All').map(c => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Two columns: submitted by + servings */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label style={labelStyle}>Your Name *</label>
                    <input
                      type="text"
                      value={form.submittedBy}
                      onChange={e => setForm(f => ({ ...f, submittedBy: e.target.value }))}
                      placeholder="e.g. Mom, Uncle Joe…"
                      style={inputStyle}
                    />
                  </div>
                  <div>
                    <label style={labelStyle}>Servings</label>
                    <input
                      type="text"
                      value={form.servings}
                      onChange={e => setForm(f => ({ ...f, servings: e.target.value }))}
                      placeholder="e.g. serves 4–6"
                      style={inputStyle}
                    />
                  </div>
                </div>

                {/* Instructions */}
                <div>
                  <label style={labelStyle}>Recipe Instructions *</label>
                  <textarea
                    value={form.instructions}
                    onChange={e => setForm(f => ({ ...f, instructions: e.target.value }))}
                    placeholder={"List ingredients and steps. You can number them:\n\n1. Preheat oven to 350°F.\n2. Mix together 2 C. flour..."}
                    rows={10}
                    style={{ ...inputStyle, resize: 'vertical', lineHeight: 1.7 }}
                  />
                </div>

                {/* Notes */}
                <div>
                  <label style={labelStyle}>Notes / Tips (optional)</label>
                  <textarea
                    value={form.notes}
                    onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
                    placeholder="Any substitutions, family history, or tips..."
                    rows={3}
                    style={{ ...inputStyle, resize: 'vertical' }}
                  />
                </div>

                {error && (
                  <p
                    className="text-sm px-3 py-2.5 rounded-sm"
                    style={{ backgroundColor: '#fdecea', color: '#c0392b', fontFamily: 'Inter, sans-serif' }}
                  >
                    {error}
                  </p>
                )}
              </div>
            </div>

            {/* Footer */}
            <div
              className="px-8 py-5 flex justify-between items-center flex-shrink-0"
              style={{ borderTop: '1px solid #e2d9c8' }}
            >
              <button
                onClick={onClose}
                className="text-sm transition-colors"
                style={{ color: '#9a8a7a', fontFamily: 'Inter, sans-serif' }}
                onMouseEnter={e => (e.currentTarget.style.color = '#5a4a35')}
                onMouseLeave={e => (e.currentTarget.style.color = '#9a8a7a')}
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                className="px-6 py-2.5 text-sm rounded-sm transition-colors"
                style={{
                  backgroundColor: '#b5451b',
                  color: '#fff',
                  fontFamily: 'Inter, sans-serif',
                  letterSpacing: '0.04em',
                }}
                onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#9a3a16')}
                onMouseLeave={e => (e.currentTarget.style.backgroundColor = '#b5451b')}
              >
                Add Recipe →
              </button>
            </div>
          </>
        )}

        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-8 h-8 flex items-center justify-center rounded-full transition-colors"
          style={{ backgroundColor: '#ede4d4', color: '#7a6a5a' }}
          onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#e0d4c0')}
          onMouseLeave={e => (e.currentTarget.style.backgroundColor = '#ede4d4')}
          aria-label="Close"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M1 1l12 12M13 1L1 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </button>
      </div>
    </div>
  )
}
