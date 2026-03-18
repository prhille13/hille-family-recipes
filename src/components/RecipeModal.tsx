'use client'
import { useEffect } from 'react'
import { Recipe } from '@/types/recipe'

interface Props {
  recipe: Recipe
  onClose: () => void
}

export default function RecipeModal({ recipe, onClose }: Props) {
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', handleKey)
      document.body.style.overflow = ''
    }
  }, [onClose])

  // Format instructions: detect numbered steps
  const formatInstructions = (text: string) => {
    const lines = text.split('\n').filter(l => l.trim())
    return lines.map((line, i) => {
      const isStep = /^\d+\./.test(line.trim())
      const isSubStep = /^[a-z]\./.test(line.trim())
      return (
        <p
          key={i}
          className={`${isStep ? 'font-medium' : ''} ${isSubStep ? 'ml-4' : ''} leading-relaxed`}
          style={{ marginBottom: '0.6rem', color: isStep ? '#1a1a1a' : '#3a3a3a' }}
        >
          {line.trim()}
        </p>
      )
    })
  }

  return (
    <div
      className="modal-overlay fixed inset-0 z-50 flex items-start justify-center p-4 pt-12 pb-12"
      style={{ backgroundColor: 'rgba(10,8,5,0.65)', backdropFilter: 'blur(3px)' }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className="modal-panel relative w-full max-w-2xl rounded-sm overflow-hidden"
        style={{
          backgroundColor: '#fdfaf4',
          boxShadow: '0 32px 80px rgba(0,0,0,0.3)',
          maxHeight: '85vh',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* Header */}
        <div
          className="px-8 pt-8 pb-6 flex-shrink-0"
          style={{ borderBottom: '1px solid #e2d9c8' }}
        >
          {/* Tags */}
          <div className="flex gap-2 mb-3 flex-wrap">
            <span
              className="tag-pill px-2.5 py-1 rounded-sm"
              style={{ backgroundColor: '#b5451b', color: '#fff' }}
            >
              {recipe.cuisine}
            </span>
            <span
              className="tag-pill px-2.5 py-1 rounded-sm"
              style={{ backgroundColor: '#e8dfc8', color: '#5a4a35' }}
            >
              {recipe.category}
            </span>
            {recipe.submittedBy && (
              <span
                className="tag-pill px-2.5 py-1 rounded-sm"
                style={{ backgroundColor: '#edf2e8', color: '#4a5c3c' }}
              >
                by {recipe.submittedBy}
              </span>
            )}
          </div>

          <h2
            className="text-2xl md:text-3xl leading-tight"
            style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              fontWeight: 600,
              color: '#1a1a1a',
            }}
          >
            {recipe.name}
          </h2>

          {recipe.servings && (
            <p className="mt-1.5 text-sm" style={{ color: '#8a7a6a', fontFamily: 'Inter, sans-serif' }}>
              {recipe.servings}
            </p>
          )}
        </div>

        {/* Body — scrollable */}
        <div className="overflow-y-auto flex-1 px-8 py-7">
          {recipe.notes && (
            <div
              className="mb-6 p-4 rounded-sm text-sm italic leading-relaxed"
              style={{ backgroundColor: '#f5ede0', color: '#6a5040', borderLeft: '3px solid #b5451b' }}
            >
              {recipe.notes}
            </div>
          )}

          <div className="recipe-body text-sm" style={{ fontFamily: 'Inter, sans-serif', lineHeight: 1.8 }}>
            {formatInstructions(recipe.instructions)}
          </div>

          {recipe.ingredients && recipe.ingredients.length > 0 && (
            <div className="mt-8 pt-6" style={{ borderTop: '1px solid #e2d9c8' }}>
              <p
                className="text-xs uppercase tracking-widest mb-3"
                style={{ color: '#9a8a7a', fontFamily: 'Inter, sans-serif' }}
              >
                Key Ingredients
              </p>
              <div className="flex flex-wrap gap-1.5">
                {recipe.ingredients.map((ing, i) => (
                  <span
                    key={i}
                    className="px-2.5 py-1 text-xs rounded-sm capitalize"
                    style={{
                      backgroundColor: '#f0ebe0',
                      color: '#5a4a35',
                      fontFamily: 'Inter, sans-serif',
                    }}
                  >
                    {ing}
                  </span>
                ))}
              </div>
            </div>
          )}

          {recipe.dateAdded && (
            <p className="mt-6 text-xs" style={{ color: '#baa99a', fontFamily: 'Inter, sans-serif' }}>
              Added {new Date(recipe.dateAdded).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          )}
        </div>

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
