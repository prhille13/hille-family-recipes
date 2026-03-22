'use client'
import { useState, useEffect, useMemo, useCallback } from 'react'
import { Recipe, CATEGORIES, CUISINES } from '@/types/recipe'
import RecipeModal from '@/components/RecipeModal'
import AddRecipeModal from '@/components/AddRecipeModal'

const STORAGE_KEY = 'family_recipes_added'

export default function Home() {
  const [baseRecipes, setBaseRecipes] = useState<Recipe[]>([])
  const [addedRecipes, setAddedRecipes] = useState<Recipe[]>([])
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null)
  const [showAddForm, setShowAddForm] = useState(false)
  const [search, setSearch] = useState('')
  const [activeCategory, setActiveCategory] = useState('All')
  const [activeCuisine, setActiveCuisine] = useState('All')
  const [sortBy, setSortBy] = useState<'name' | 'recent'>('name')
  const [loaded, setLoaded] = useState(false)

  // Load base recipes from JSON
  useEffect(() => {
    fetch('/data/recipes.json')
      .then(r => r.json())
      .then((data: Recipe[]) => {
        setBaseRecipes(data)
        setLoaded(true)
      })
      .catch(() => setLoaded(true))
  }, [])

  // Load user-added recipes from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) setAddedRecipes(JSON.parse(stored))
    } catch {}
  }, [])

  const allRecipes = useMemo(() => [...baseRecipes, ...addedRecipes], [baseRecipes, addedRecipes])

  const handleAddRecipe = useCallback((recipe: Recipe) => {
    const updated = [...addedRecipes, recipe]
    setAddedRecipes(updated)
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(updated)) } catch {}
  }, [addedRecipes])

  // Filter + search
  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim()
    let results = allRecipes

    if (activeCategory !== 'All') {
      results = results.filter(r => r.category === activeCategory)
    }
    if (activeCuisine !== 'All') {
      results = results.filter(r => r.cuisine === activeCuisine)
    }
    if (q) {
      results = results.filter(r => {
        return (
          r.name.toLowerCase().includes(q) ||
          r.instructions.toLowerCase().includes(q) ||
          r.ingredients.some(i => i.includes(q)) ||
          r.submittedBy.toLowerCase().includes(q)
        )
      })
    }

    if (sortBy === 'name') {
      results = [...results].sort((a, b) => a.name.localeCompare(b.name))
    } else {
      // recent first: user-added on top (they have timestamp IDs), then by original id
      results = [...results].sort((a, b) => {
        const aNew = !!a.dateAdded
        const bNew = !!b.dateAdded
        if (aNew && !bNew) return -1
        if (!aNew && bNew) return 1
        return a.name.localeCompare(b.name)
      })
    }
    return results
  }, [allRecipes, search, activeCategory, activeCuisine, sortBy])

  // Cuisine counts for display
  const cuisineCounts = useMemo(() => {
    const counts: Record<string, number> = {}
    allRecipes.forEach(r => { counts[r.cuisine] = (counts[r.cuisine] || 0) + 1 })
    return counts
  }, [allRecipes])

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {}
    allRecipes.forEach(r => { counts[r.category] = (counts[r.category] || 0) + 1 })
    return counts
  }, [allRecipes])

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#fdfaf4' }}>
      {/* ─── Hero ─── */}
      <header
        className="relative overflow-hidden"
        style={{
          background: 'linear-gradient(160deg, #1a1208 0%, #2d1e10 50%, #1a1208 100%)',
          borderBottom: '1px solid #3a2a1a',
        }}
      >
        {/* Decorative grain texture overlay */}
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E")`,
            backgroundSize: '200px 200px',
          }}
        />

        <div className="relative max-w-5xl mx-auto px-6 py-16 md:py-20">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
            <div>
              <p
                className="text-xs uppercase tracking-widest mb-3 fade-up"
                style={{
                  color: '#c4935a',
                  fontFamily: 'Inter, sans-serif',
                  animationDelay: '0.05s',
                }}
              >
                A Family Collection
              </p>
              <h1
                className="fade-up"
                style={{
                  fontFamily: "'Playfair Display', Georgia, serif",
                  fontSize: 'clamp(2.2rem, 5vw, 3.4rem)',
                  fontWeight: 600,
                  color: '#f5e6c8',
                  lineHeight: 1.15,
                  animationDelay: '0.1s',
                }}
              >
                Hille Family Recipes
              </h1>
              <p
                className="mt-3 fade-up"
                style={{
                  color: '#9a8060',
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '0.95rem',
                  fontStyle: 'italic',
                  animationDelay: '0.2s',
                }}
              >
                Collected over decades. Made to be shared.
              </p>
            </div>

            <div
              className="fade-up flex flex-col items-start md:items-end gap-3"
              style={{ animationDelay: '0.3s' }}
            >
              <div
                className="text-right"
                style={{ fontFamily: 'Inter, sans-serif' }}
              >
                <span
                  className="block text-3xl font-light"
                  style={{ color: '#f5e6c8', letterSpacing: '-0.02em' }}
                >
                  {loaded ? allRecipes.length : '—'}
                </span>
                <span className="text-xs uppercase tracking-widest" style={{ color: '#7a6040' }}>
                  recipes
                </span>
              </div>

              <button
                onClick={() => setShowAddForm(true)}
                className="flex items-center gap-2 px-5 py-2.5 rounded-sm text-sm transition-all"
                style={{
                  backgroundColor: '#b5451b',
                  color: '#fff',
                  fontFamily: 'Inter, sans-serif',
                  letterSpacing: '0.04em',
                  border: '1px solid #c8561f',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.backgroundColor = '#d4602e'
                  e.currentTarget.style.transform = 'translateY(-1px)'
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.backgroundColor = '#b5451b'
                  e.currentTarget.style.transform = 'translateY(0)'
                }}
              >
                <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                  <path d="M6.5 1v11M1 6.5h11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
                Add a Recipe
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* ─── Search + Filters ─── */}
      <div
        className="sticky top-0 z-30"
        style={{
          backgroundColor: 'rgba(253, 250, 244, 0.95)',
          backdropFilter: 'blur(10px)',
          borderBottom: '1px solid #e2d9c8',
        }}
      >
        <div className="max-w-5xl mx-auto px-6 py-4">
          {/* Search bar */}
          <div className="relative mb-3">
            <svg
              className="absolute left-3.5 top-1/2 -translate-y-1/2"
              width="15" height="15" viewBox="0 0 15 15" fill="none"
              style={{ color: '#b5a090' }}
            >
              <circle cx="6.5" cy="6.5" r="5" stroke="currentColor" strokeWidth="1.3" />
              <path d="M10 10l3.5 3.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
            </svg>
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search by name, ingredient, or keyword…"
              className="w-full pl-10 pr-4 py-2.5 rounded-sm text-sm"
              style={{
                backgroundColor: '#f5ede0',
                border: '1px solid #e0d4c0',
                fontFamily: 'Inter, sans-serif',
                color: '#1a1a1a',
              }}
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-3 top-1/2 -translate-y-1/2"
                style={{ color: '#b5a090' }}
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M1 1l12 12M13 1L1 13" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
                </svg>
              </button>
            )}
          </div>

          {/* Filter row */}
          <div className="flex items-center gap-3 overflow-x-auto pb-1 hide-scrollbar">
            {/* Category pills */}
            <div className="flex gap-1.5 flex-shrink-0">
              {CATEGORIES.slice(0, 10).map(cat => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className="tag-pill px-3 py-1.5 rounded-sm whitespace-nowrap transition-colors"
                  style={{
                    backgroundColor: activeCategory === cat ? '#1a1a1a' : '#ede4d4',
                    color: activeCategory === cat ? '#fdfaf4' : '#5a4a35',
                    border: 'none',
                    cursor: 'pointer',
                  }}
                >
                  {cat}
                  {cat !== 'All' && categoryCounts[cat] ? (
                    <span className="ml-1 opacity-60">({categoryCounts[cat]})</span>
                  ) : null}
                </button>
              ))}
            </div>

            <div className="w-px h-5 flex-shrink-0" style={{ backgroundColor: '#ddd4c0' }} />

            {/* Cuisine select */}
            <select
              value={activeCuisine}
              onChange={e => setActiveCuisine(e.target.value)}
              className="tag-pill px-3 py-1.5 rounded-sm flex-shrink-0"
              style={{
                backgroundColor: activeCuisine !== 'All' ? '#b5451b' : '#ede4d4',
                color: activeCuisine !== 'All' ? '#fff' : '#5a4a35',
                border: 'none',
                cursor: 'pointer',
              }}
            >
              {CUISINES.map(c => (
                <option key={c} value={c}>
                  {c === 'All' ? '🌍 All Cuisines' : `${c}${cuisineCounts[c] ? ` (${cuisineCounts[c]})` : ''}`}
                </option>
              ))}
            </select>

            <div className="flex-1" />

            {/* Sort */}
            <div className="flex items-center gap-2 flex-shrink-0">
              <span className="text-xs" style={{ color: '#9a8a7a', fontFamily: 'Inter, sans-serif' }}>Sort:</span>
              <button
                onClick={() => setSortBy('name')}
                className="tag-pill px-2.5 py-1 rounded-sm"
                style={{
                  backgroundColor: sortBy === 'name' ? '#1a1a1a' : 'transparent',
                  color: sortBy === 'name' ? '#fff' : '#7a6a5a',
                  border: 'none',
                  cursor: 'pointer',
                }}
              >A–Z</button>
              <button
                onClick={() => setSortBy('recent')}
                className="tag-pill px-2.5 py-1 rounded-sm"
                style={{
                  backgroundColor: sortBy === 'recent' ? '#1a1a1a' : 'transparent',
                  color: sortBy === 'recent' ? '#fff' : '#7a6a5a',
                  border: 'none',
                  cursor: 'pointer',
                }}
              >New</button>
            </div>
          </div>
        </div>
      </div>

      {/* ─── Results count ─── */}
      <div className="max-w-5xl mx-auto px-6 pt-5 pb-2">
        {loaded && (
          <p
            className="text-xs"
            style={{ color: '#9a8a7a', fontFamily: 'Inter, sans-serif' }}
          >
            {filtered.length === allRecipes.length
              ? `${allRecipes.length} recipes`
              : `${filtered.length} of ${allRecipes.length} recipes`}
            {search && ` matching "${search}"`}
          </p>
        )}
      </div>

      {/* ─── Recipe Grid ─── */}
      <main className="max-w-5xl mx-auto px-6 pb-20">
        {!loaded ? (
          <div className="flex items-center justify-center py-32">
            <div
              className="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin"
              style={{ borderColor: '#ddd4c0', borderTopColor: '#b5451b' }}
            />
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-28 text-center">
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center mb-4"
              style={{ backgroundColor: '#f0e8d8' }}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <circle cx="11" cy="11" r="8" stroke="#c4a882" strokeWidth="1.5" />
                <path d="M21 21l-4-4" stroke="#c4a882" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </div>
            <p
              className="text-lg mb-2"
              style={{ fontFamily: "'Playfair Display', Georgia, serif", color: '#5a4a35' }}
            >
              No recipes found
            </p>
            <p className="text-sm mb-5" style={{ color: '#9a8a7a', fontFamily: 'Inter, sans-serif' }}>
              Try adjusting your search or filters
            </p>
            <button
              onClick={() => { setSearch(''); setActiveCategory('All'); setActiveCuisine('All') }}
              className="text-sm transition-colors"
              style={{ color: '#b5451b', fontFamily: 'Inter, sans-serif' }}
            >
              Clear all filters
            </button>
          </div>
        ) : (
          <div
            className="grid gap-px"
            style={{
              gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
              border: '1px solid #e2d9c8',
              borderRadius: '2px',
              overflow: 'hidden',
              marginTop: '8px',
            }}
          >
            {filtered.map((recipe, idx) => (
              <RecipeCard
                key={recipe.id}
                recipe={recipe}
                onClick={() => setSelectedRecipe(recipe)}
                isNew={!!recipe.dateAdded}
                idx={idx}
              />
            ))}
          </div>
        )}
      </main>

      {/* ─── Footer ─── */}
      <footer
        className="py-10 text-center"
        style={{ borderTop: '1px solid #e2d9c8' }}
      >
        <p
          className="text-xs uppercase tracking-widest"
          style={{ color: '#c4a882', fontFamily: 'Inter, sans-serif' }}
        >
          A family cookbook — kept with love
        </p>
      </footer>

      {/* ─── Modals ─── */}
      {selectedRecipe && (
        <RecipeModal
          recipe={selectedRecipe}
          onClose={() => setSelectedRecipe(null)}
        />
      )}
      {showAddForm && (
        <AddRecipeModal
          onClose={() => setShowAddForm(false)}
          onAdd={handleAddRecipe}
        />
      )}
    </div>
  )
}

// ─── Recipe Card ───
function RecipeCard({
  recipe,
  onClick,
  isNew,
  idx,
}: {
  recipe: Recipe
  onClick: () => void
  isNew: boolean
  idx: number
}) {
  // Category → icon
  const icon = categoryIcon(recipe.category)

  return (
    <button
      onClick={onClick}
      className="recipe-card text-left w-full group"
      style={{
        backgroundColor: '#fdfaf4',
        padding: '20px 22px',
        borderRight: '1px solid #e2d9c8',
        borderBottom: '1px solid #e2d9c8',
        cursor: 'pointer',
        position: 'relative',
      }}
    >
      {isNew && (
        <span
          className="absolute top-3 right-3 tag-pill px-1.5 py-0.5 rounded-sm"
          style={{ backgroundColor: '#6b7c5c', color: '#fff', fontSize: '0.6rem' }}
        >
          NEW
        </span>
      )}

      <div className="flex items-start gap-3">
        <span
          className="text-lg flex-shrink-0 mt-0.5"
          style={{ lineHeight: 1 }}
          aria-hidden
        >
          {icon}
        </span>
        <div className="flex-1 min-w-0">
          <h3
            className="text-sm font-medium leading-snug mb-1.5 group-hover:text-rust transition-colors line-clamp-2"
            style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              color: '#1a1a1a',
              fontSize: '0.95rem',
            }}
          >
            {recipe.name}
          </h3>
          <div className="flex items-center gap-1.5 flex-wrap">
            <span
              className="tag-pill px-1.5 py-0.5 rounded-sm"
              style={{ backgroundColor: '#f0e8d8', color: '#8a6040' }}
            >
              {recipe.cuisine}
            </span>
            {recipe.submittedBy && (
              <span
                className="text-xs"
                style={{ color: '#b5a090', fontFamily: 'Inter, sans-serif' }}
              >
                by {recipe.submittedBy}
              </span>
            )}
          </div>
        </div>
      </div>
    </button>
  )
}

function categoryIcon(cat: string): string {
  const icons: Record<string, string> = {
    'Main Course': '🍽️',
    'Side Dish': '🥗',
    'Soup': '🍲',
    'Salad': '🥬',
    'Vegetable': '🌿',
    'Barbecue': '🔥',
    'Bread': '🍞',
    'Sauce': '🫙',
    'Breakfast': '🍳',
    'Dessert': '🍰',
    'Indian': '🍛',
    'Asian': '🥢',
  }
  return icons[cat] || '📖'
}
