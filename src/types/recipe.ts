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
