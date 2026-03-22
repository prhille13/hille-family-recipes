export interface Note {
  id: string
  author: string
  text: string
  date: string
}

export interface Recipe {
  id: number
  name: string
  instructions: string
  category: string
  cuisine: string
  ingredients: string[]
  servings: string
  submittedBy: string
  dateAdded?: string
  notes?: string
  photoUrl?: string
}

export const CATEGORIES = [
  'All',
  'Main Course',
  'Side Dish',
  'Soup',
  'Salad',
  'Vegetable',
  'Barbecue',
  'Bread',
  'Sauce',
  'Breakfast',
  'Dessert',
  'Indian',
  'Asian',
]

export const CUISINES = [
  'All',
  'American',
  'French',
  'Italian',
  'Indian',
  'Mexican / Latin',
  'Thai',
  'Asian',
  'Chinese',
  'Japanese',
  'Korean',
  'Vietnamese',
  'Greek',
  'Middle Eastern',
  'Caribbean',
  'German / European',
  'Eastern European',
  'Moroccan',
  'World',
]

export function categoryEmoji(cat: string): string {
  const map: Record<string, string> = {
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
  return map[cat] || '📖'
}

export function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80)
}
