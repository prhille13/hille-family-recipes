# Dad's Recipes — Setup Guide

A family recipe site built with Next.js 14, Tailwind CSS, and TypeScript.
315 recipes pre-loaded from Dad's collection. Family members can add their own.

---

## Quick Start (Mac Mini)

```bash
# 1. Move the project folder to your Mac Mini
cp -r recipe-site ~/recipe-site
cd ~/recipe-site

# 2. Install dependencies
npm install

# 3. Test locally
npm run dev
# → Opens at http://localhost:3000

# 4. Build for production
npm run build

# 5. Start production server (port 3001 to avoid conflicts)
npm start
```

---

## Add to PM2 (alongside camplittlepog.com)

```bash
# Start with PM2
pm2 start npm --name "recipes" -- start

# Save so it restarts on reboot
pm2 save

# Check status
pm2 status
```

---

## Caddy Config

Add to your existing Caddyfile:

```
recipes.yourdomain.com {
    reverse_proxy localhost:3001
}
```

Or as a path on an existing domain:

```
yourdomain.com {
    handle /recipes* {
        reverse_proxy localhost:3001
    }
    # ... your other routes
}
```

Then reload: `caddy reload`

---

## GitHub Webhook Auto-Deploy

Same pattern as camplittlepog.com. Add to your webhook handler:

```bash
cd ~/recipe-site && git pull && npm run build && pm2 restart recipes
```

---

## How It Works

- **Recipe data**: `public/data/recipes.json` — 315 recipes from Dad's collection
- **User-added recipes**: Saved to browser `localStorage` — no backend needed.
  They persist across visits and appear instantly.
- **Search**: Searches name, instructions text, and ingredient keywords simultaneously
- **Filters**: Category pills + cuisine dropdown, both with counts
- **Sort**: A–Z or Newest first (user-added recipes float to top)

---

## Adding More Recipes in Bulk

To add more recipes to the base JSON:

```javascript
// public/data/recipes.json is a plain JSON array
// Each recipe object:
{
  "id": 316,
  "name": "Mom's Banana Bread",
  "instructions": "1. Preheat oven...",
  "category": "Bread",          // See CATEGORIES in src/types/recipe.ts
  "cuisine": "American",         // See CUISINES in src/types/recipe.ts
  "ingredients": ["banana", "walnut", "vanilla"],
  "servings": "serves 8",
  "submittedBy": "Mom",
  "dateAdded": "2026-03-17T00:00:00Z",
  "notes": "Optional tip or family story"
}
```

---

## Cuisine / Category Options

**Categories**: Main Course, Side Dish, Soup, Salad, Vegetable, Barbecue,
Bread, Sauce, Breakfast, Dessert, Indian, Asian

**Cuisines**: American, French, Italian, Indian, Mexican / Latin, Thai,
Asian, Chinese, Japanese, Korean, Vietnamese, Greek, Middle Eastern,
Caribbean, German / European, Eastern European, Moroccan, World

---

## Note on Recipe Names

Dad's document was an old `.doc` binary file (not `.docx`). Special characters
like `°` (degree signs) and accented letters like `é` in "sauté" were lost
during text extraction. A handful of recipe names may look slightly clipped
(e.g., "Rahmschnitzel and Sp" instead of "Spätzle"). The instructions are
all intact. You can fix individual names directly in `public/data/recipes.json`.

---

## Project Structure

```
recipe-site/
├── public/
│   └── data/
│       └── recipes.json        ← 315 pre-loaded recipes
├── src/
│   ├── app/
│   │   ├── layout.tsx          ← Root layout + fonts
│   │   ├── page.tsx            ← Main page (all UI logic)
│   │   └── globals.css         ← Global styles
│   ├── components/
│   │   ├── RecipeModal.tsx     ← Recipe detail view
│   │   └── AddRecipeModal.tsx  ← Add recipe form
│   └── types/
│       └── recipe.ts           ← TypeScript types + constants
├── package.json
├── tailwind.config.js
├── tsconfig.json
└── next.config.js
```
