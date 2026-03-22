'use client'
import { useState, useEffect, useMemo, useCallback } from 'react'
import Link from 'next/link'
import { Recipe, CATEGORIES, CUISINES, categoryEmoji, slugify } from '@/types/recipe'

const STORAGE_KEY = 'hille_recipes_added'

export default function Home() {
  const [baseRecipes, setBaseRecipes] = useState<Recipe[]>([])
  const [addedRecipes, setAddedRecipes] = useState<Recipe[]>([])
  const [search, setSearch] = useState('')
  const [activeCategory, setActiveCategory] = useState('All')
  const [activeCuisine, setActiveCuisine] = useState('All')
  const [showAddForm, setShowAddForm] = useState(false)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    fetch('/data/recipes.json').then(r => r.json()).then((d: Recipe[]) => {
      setBaseRecipes(d)
      setLoaded(true)
    })
  }, [])

  useEffect(() => {
    try {
      const s = localStorage.getItem(STORAGE_KEY)
      if (s) setAddedRecipes(JSON.parse(s))
    } catch {}
  }, [])

  const allRecipes = useMemo(() => [...baseRecipes, ...addedRecipes], [baseRecipes, addedRecipes])

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim()
    return allRecipes
      .filter(r => activeCategory === 'All' || r.category === activeCategory)
      .filter(r => activeCuisine === 'All' || r.cuisine === activeCuisine)
      .filter(r => !q || r.name.toLowerCase().includes(q) || r.instructions.toLowerCase().includes(q) || r.ingredients.some(i => i.includes(q)))
      .sort((a, b) => a.name.localeCompare(b.name))
  }, [allRecipes, search, activeCategory, activeCuisine])

  const handleAdd = useCallback((recipe: Recipe) => {
    const updated = [...addedRecipes, recipe]
    setAddedRecipes(updated)
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(updated)) } catch {}
  }, [addedRecipes])

  return (
    <div style={{ minHeight: '100vh', background: '#fff' }}>
      {/* ── Header ── */}
      <header style={{ borderBottom: '1px solid #e5e5e5' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px' }}>
          {/* Top bar */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 0 12px' }}>
            <div>
              <p style={{ fontSize: '0.65rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: '#999', marginBottom: 4, fontFamily: 'var(--font-sans)' }}>
                A Family Collection
              </p>
              <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', fontWeight: 600, lineHeight: 1.1, color: '#111', margin: 0 }}>
                Hille Family Recipes
              </h1>
            </div>
            <button
              onClick={() => setShowAddForm(true)}
              style={{
                display: 'flex', alignItems: 'center', gap: 8,
                background: '#111', color: '#fff',
                border: 'none', borderRadius: 3,
                padding: '10px 18px', cursor: 'pointer',
                fontSize: '0.8rem', fontWeight: 500, letterSpacing: '0.04em',
                fontFamily: 'var(--font-sans)',
                whiteSpace: 'nowrap',
              }}
            >
              <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                <path d="M6.5 1v11M1 6.5h11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
              Add a Recipe
            </button>
          </div>

          {/* Search */}
          <div style={{ position: 'relative', marginBottom: 16 }}>
            <svg style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#999' }} width="16" height="16" viewBox="0 0 16 16" fill="none">
              <circle cx="7" cy="7" r="5.5" stroke="currentColor" strokeWidth="1.4"/>
              <path d="M11 11l3 3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
            </svg>
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search recipes, ingredients, cuisines…"
              style={{
                width: '100%', padding: '11px 14px 11px 42px',
                border: '1.5px solid #e5e5e5', borderRadius: 4,
                fontSize: '0.9rem', fontFamily: 'var(--font-sans)',
                color: '#111', background: '#fff',
              }}
            />
            {search && (
              <button onClick={() => setSearch('')} style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#999', padding: 0 }}>
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M1 1l12 12M13 1L1 13" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
                </svg>
              </button>
            )}
          </div>

          {/* Category tabs */}
          <div style={{ display: 'flex', gap: 0, overflowX: 'auto', paddingBottom: 0 }}>
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                style={{
                  padding: '10px 16px',
                  border: 'none', background: 'none', cursor: 'pointer',
                  fontSize: '0.8rem', fontWeight: activeCategory === cat ? 600 : 400,
                  color: activeCategory === cat ? '#111' : '#777',
                  borderBottom: activeCategory === cat ? '2px solid #111' : '2px solid transparent',
                  whiteSpace: 'nowrap',
                  fontFamily: 'var(--font-sans)',
                  transition: 'color 0.15s, border-color 0.15s',
                }}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* ── Cuisine filter + count bar ── */}
      <div style={{ borderBottom: '1px solid #e5e5e5', background: '#fafafa' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '10px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontSize: '0.75rem', color: '#999', fontFamily: 'var(--font-sans)' }}>Cuisine:</span>
            <select
              value={activeCuisine}
              onChange={e => setActiveCuisine(e.target.value)}
              style={{
                border: '1px solid #ddd', borderRadius: 3, padding: '5px 10px',
                fontSize: '0.78rem', color: '#333', background: '#fff',
                cursor: 'pointer', fontFamily: 'var(--font-sans)',
              }}
            >
              {CUISINES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            {(activeCategory !== 'All' || activeCuisine !== 'All' || search) && (
              <button
                onClick={() => { setActiveCategory('All'); setActiveCuisine('All'); setSearch('') }}
                style={{ fontSize: '0.75rem', color: '#d0021b', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'var(--font-sans)' }}
              >
                Clear filters
              </button>
            )}
          </div>
          <span style={{ fontSize: '0.75rem', color: '#999', fontFamily: 'var(--font-sans)', whiteSpace: 'nowrap' }}>
            {loaded ? `${filtered.length} recipe${filtered.length !== 1 ? 's' : ''}` : '—'}
          </span>
        </div>
      </div>

      {/* ── Recipe Grid ── */}
      <main style={{ maxWidth: 1200, margin: '0 auto', padding: '32px 24px 64px' }}>
        {!loaded ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '80px 0' }}>
            <div style={{ width: 32, height: 32, border: '2px solid #e5e5e5', borderTopColor: '#111', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
            <style>{`@keyframes spin { to { transform: rotate(360deg); }}`}</style>
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 0' }}>
            <p style={{ fontFamily: 'var(--font-serif)', fontSize: '1.4rem', color: '#333', marginBottom: 8 }}>No recipes found</p>
            <p style={{ color: '#999', fontSize: '0.9rem' }}>Try adjusting your search or filters</p>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
            gap: 32,
          }}>
            {filtered.map(recipe => (
              <RecipeCard key={recipe.id} recipe={recipe} />
            ))}
          </div>
        )}
      </main>

      <footer style={{ borderTop: '1px solid #e5e5e5', padding: '24px', textAlign: 'center' }}>
        <p style={{ fontSize: '0.75rem', color: '#bbb', letterSpacing: '0.1em', textTransform: 'uppercase', fontFamily: 'var(--font-sans)' }}>
          Hille Family Recipes — kept with love
        </p>
      </footer>

      {showAddForm && <AddRecipeModal onClose={() => setShowAddForm(false)} onAdd={handleAdd} />}
    </div>
  )
}

// ── Recipe Card ──
function RecipeCard({ recipe }: { recipe: Recipe }) {
  const emoji = categoryEmoji(recipe.category)
  const slug = slugify(recipe.name)

  return (
    <Link href={`/recipe/${slug}?id=${recipe.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
      <article className="recipe-card" style={{ cursor: 'pointer' }}>
        {/* Photo area */}
        <div style={{
          width: '100%', paddingTop: '66%', position: 'relative',
          borderRadius: 4, overflow: 'hidden', marginBottom: 14,
          background: recipe.photoUrl ? undefined : '#f4f4f4',
        }}>
          {recipe.photoUrl ? (
            <img
              src={recipe.photoUrl}
              alt={recipe.name}
              style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
              onError={e => { (e.target as HTMLImageElement).style.display = 'none' }}
            />
          ) : (
            <div style={{
              position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '2.5rem', background: 'linear-gradient(135deg, #f4f4f4, #ebebeb)',
            }}>
              {emoji}
            </div>
          )}
          {/* Category tag overlay */}
          <div style={{
            position: 'absolute', bottom: 10, left: 10,
            background: 'rgba(255,255,255,0.92)', backdropFilter: 'blur(4px)',
            borderRadius: 100, padding: '3px 10px',
            fontSize: '0.65rem', fontWeight: 600, letterSpacing: '0.08em',
            textTransform: 'uppercase', color: '#333',
            fontFamily: 'var(--font-sans)',
          }}>
            {recipe.cuisine}
          </div>
        </div>

        {/* Text */}
        <div>
          <h2 className="line-clamp-2" style={{
            fontFamily: 'var(--font-serif)',
            fontSize: '1.05rem', fontWeight: 500, lineHeight: 1.35,
            color: '#111', marginBottom: 6,
          }}>
            {recipe.name}
          </h2>
          <p style={{ fontSize: '0.78rem', color: '#999', fontFamily: 'var(--font-sans)' }}>
            By {recipe.submittedBy || 'Family'}
            {recipe.servings ? ` · ${recipe.servings}` : ''}
          </p>
        </div>
      </article>
    </Link>
  )
}

// ── Add Recipe Modal ──
function AddRecipeModal({ onClose, onAdd }: { onClose: () => void; onAdd: (r: Recipe) => void }) {
  const [form, setForm] = useState({ name: '', instructions: '', category: 'Main Course', cuisine: 'American', submittedBy: '', servings: '', notes: '', photoUrl: '' })
  const [done, setDone] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const h = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', h)
    document.body.style.overflow = 'hidden'
    return () => { document.removeEventListener('keydown', h); document.body.style.overflow = '' }
  }, [onClose])

  const submit = () => {
    if (!form.name.trim()) { setError('Please enter a recipe name.'); return }
    if (!form.instructions.trim()) { setError('Please enter the instructions.'); return }
    if (!form.submittedBy.trim()) { setError('Please enter your name.'); return }
    const words = form.instructions.toLowerCase().split(/\s+/)
    const stop = new Set(['the','and','with','from','until','then','add','mix','cook','heat','place','salt','pepper','butter','water','flour','sugar'])
    const ingredients = [...new Set(words.filter(w => w.length > 4 && !stop.has(w) && /^[a-z]+$/.test(w)))].slice(0, 15)
    onAdd({ id: Date.now(), ...form, ingredients, dateAdded: new Date().toISOString() })
    setDone(true)
  }

  const inp = { width: '100%', padding: '10px 12px', border: '1.5px solid #e5e5e5', borderRadius: 3, fontSize: '0.88rem', fontFamily: 'var(--font-sans)', color: '#111', background: '#fff' }
  const lbl = { display: 'block' as const, fontSize: '0.7rem', fontWeight: 600 as const, letterSpacing: '0.08em', textTransform: 'uppercase' as const, color: '#666', marginBottom: 6, fontFamily: 'var(--font-sans)' }

  return (
    <div onClick={e => e.target === e.currentTarget && onClose()} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 50, display: 'flex', alignItems: 'flex-start', justifyContent: 'center', padding: '40px 16px', overflowY: 'auto' }}>
      <div style={{ background: '#fff', borderRadius: 6, width: '100%', maxWidth: 560, position: 'relative', overflow: 'hidden' }}>
        <div style={{ padding: '28px 28px 20px', borderBottom: '1px solid #e5e5e5' }}>
          <p style={{ fontSize: '0.65rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: '#d0021b', marginBottom: 6, fontFamily: 'var(--font-sans)' }}>Share with the family</p>
          <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.6rem', fontWeight: 600, margin: 0 }}>Add a Recipe</h2>
        </div>

        {done ? (
          <div style={{ padding: '48px 28px', textAlign: 'center' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: 16 }}>🎉</div>
            <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.4rem', marginBottom: 8 }}>Recipe Added!</h3>
            <p style={{ color: '#777', fontSize: '0.9rem', marginBottom: 24 }}>Thank you, {form.submittedBy}!</p>
            <button onClick={onClose} style={{ background: '#111', color: '#fff', border: 'none', borderRadius: 3, padding: '10px 24px', cursor: 'pointer', fontSize: '0.85rem', fontFamily: 'var(--font-sans)' }}>Close</button>
          </div>
        ) : (
          <>
            <div style={{ padding: '24px 28px', display: 'flex', flexDirection: 'column', gap: 18, maxHeight: '65vh', overflowY: 'auto' }}>
              <div><label style={lbl}>Recipe Name *</label><input style={inp} value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="e.g. Grandma's Apple Pie" /></div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div><label style={lbl}>Category</label>
                  <select style={{ ...inp, cursor: 'pointer' }} value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}>
                    {CATEGORIES.filter(c => c !== 'All').map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div><label style={lbl}>Cuisine</label>
                  <select style={{ ...inp, cursor: 'pointer' }} value={form.cuisine} onChange={e => setForm(f => ({ ...f, cuisine: e.target.value }))}>
                    {CUISINES.filter(c => c !== 'All').map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div><label style={lbl}>Your Name *</label><input style={inp} value={form.submittedBy} onChange={e => setForm(f => ({ ...f, submittedBy: e.target.value }))} placeholder="e.g. Mom" /></div>
                <div><label style={lbl}>Servings</label><input style={inp} value={form.servings} onChange={e => setForm(f => ({ ...f, servings: e.target.value }))} placeholder="e.g. serves 4" /></div>
              </div>
              <div><label style={lbl}>Photo URL (optional)</label><input style={inp} value={form.photoUrl} onChange={e => setForm(f => ({ ...f, photoUrl: e.target.value }))} placeholder="https://..." /></div>
              <div><label style={lbl}>Instructions *</label><textarea style={{ ...inp, resize: 'vertical', lineHeight: 1.7 }} rows={9} value={form.instructions} onChange={e => setForm(f => ({ ...f, instructions: e.target.value }))} placeholder={"List ingredients and steps:\n\n1. Preheat oven to 350°F.\n2. Mix together..."} /></div>
              <div><label style={lbl}>Notes / Tips (optional)</label><textarea style={{ ...inp, resize: 'vertical' }} rows={3} value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} placeholder="Substitutions, family history, tips…" /></div>
              {error && <p style={{ color: '#d0021b', fontSize: '0.85rem', background: '#fff5f5', padding: '10px 12px', borderRadius: 3 }}>{error}</p>}
            </div>
            <div style={{ padding: '16px 28px', borderTop: '1px solid #e5e5e5', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#999', fontSize: '0.85rem', fontFamily: 'var(--font-sans)' }}>Cancel</button>
              <button onClick={submit} style={{ background: '#111', color: '#fff', border: 'none', borderRadius: 3, padding: '10px 24px', cursor: 'pointer', fontSize: '0.85rem', fontFamily: 'var(--font-sans)' }}>Add Recipe →</button>
            </div>
          </>
        )}

        <button onClick={onClose} style={{ position: 'absolute', top: 16, right: 16, background: '#f4f4f4', border: 'none', borderRadius: '50%', width: 32, height: 32, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#666' }}>
          <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M1 1l11 11M12 1L1 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
        </button>
      </div>
    </div>
  )
}
