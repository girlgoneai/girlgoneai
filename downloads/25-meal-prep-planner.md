# Meal Prep & Recipe Planner — Notion Template

> Duplicate this page into your Notion workspace to get started. All databases are pre-linked and formulas are pre-built. Follow the Quick-Start Guide at the bottom before adding real data.

---

## DATABASES

---

### 1. Recipes

**Purpose:** Your personal digital cookbook — every recipe searchable, tagged, and rated.

**Properties:**

| Property | Type | Notes |
|---|---|---|
| Recipe Name | Title | Clear, descriptive name |
| Cuisine | Select | American / Italian / Mexican / Chinese / Japanese / Thai / Indian / Mediterranean / Korean / French / Middle Eastern / Southern / Tex-Mex / Other |
| Category | Select | Breakfast / Lunch / Dinner / Snack / Dessert / Appetizer / Side / Drink / Sauce |
| Protein | Select | Chicken / Beef / Pork / Fish / Shrimp / Tofu / Eggs / Beans / Turkey / Lamb / None |
| Difficulty | Select | Easy / Medium / Hard |
| Prep Time | Number | Minutes of active prep |
| Cook Time | Number | Minutes of cooking |
| Total Time | Formula | `prop("Prep Time") + prop("Cook Time")` |
| Time Category | Formula | `if(prop("Total Time") <= 15, "15 min or less", if(prop("Total Time") <= 30, "30 min or less", if(prop("Total Time") <= 60, "1 hour or less", "1+ hours")))` |
| Servings | Number | Number of servings produced |
| Calories (per serving) | Number | Approximate kcal |
| Protein (g) | Number | Grams per serving |
| Carbs (g) | Number | Grams per serving |
| Fat (g) | Number | Grams per serving |
| Fiber (g) | Number | Grams per serving |
| Dietary Tags | Multi-select | Vegetarian / Vegan / Gluten-Free / Dairy-Free / Keto / Paleo / Nut-Free / Low-Sodium / Low-Carb / High-Protein / Whole30 / Pescatarian |
| Ingredients | Text | Full ingredient list with quantities |
| Instructions | Text | Numbered step-by-step instructions |
| Source | URL | Link to original recipe (blog, YouTube, etc.) |
| Source Name | Text | "Budget Bytes" / "Grandma" / "Original" / etc. |
| Meal Prep Friendly | Checkbox | Does this recipe store and reheat well? |
| Freezer Friendly | Checkbox | Can this be frozen and reheated? |
| Storage Notes | Text | How long it keeps, reheating instructions |
| Equipment | Multi-select | Oven / Stovetop / Instant Pot / Slow Cooker / Air Fryer / Blender / Sheet Pan / Grill / No Cook |
| Season | Multi-select | Spring / Summer / Fall / Winter / Any |
| Rating | Select | 5-Amazing / 4-Great / 3-Good / 2-Okay / 1-Won't Make Again |
| Times Made | Number | How many times you've made this |
| Last Made | Date | When you last cooked this |
| Notes | Text | Substitutions, tips, "kids liked it," adjustments |
| Photo | Files & media | Upload a photo of the finished dish |
| Linked Meal Plans | Relation | → Meal Plans database |
| Linked Grocery Items | Relation | → Grocery Lists database |
| Tags | Multi-select | Family Favorite / Quick Weeknight / Batch Cook / Date Night / Company Worthy / Budget Friendly / Kid Approved |

**Views:**
- **All Recipes** — Table, sorted by Recipe Name
- **Recipe Cards** — Gallery view, showing photo, name, total time, rating, dietary tags
- **By Cuisine** — Table, grouped by Cuisine
- **By Category** — Table, grouped by Category (Breakfast / Lunch / Dinner / etc.)
- **Quick Meals** — Filter: Total Time <= 30 minutes
- **Meal Prep Friendly** — Filter: Meal Prep Friendly = true
- **High Protein** — Filter: Protein (g) >= 25, sorted by Protein descending
- **Vegetarian** — Filter: Dietary Tags contains Vegetarian or Vegan
- **Top Rated** — Filter: Rating = 5-Amazing or 4-Great, sorted by Times Made descending
- **Haven't Made Recently** — Filter: Last Made is more than 60 days ago, Rating >= 3
- **By Protein Source** — Table, grouped by Protein
- **Keto Friendly** — Filter: Dietary Tags contains Keto

---

### 2. Meal Plans

**Purpose:** Weekly meal planning board — assign recipes to days and meals, track daily nutrition, and see the week at a glance.

**Properties:**

| Property | Type | Notes |
|---|---|---|
| Meal Plan Entry | Title | Auto-format: "[Day] — [Meal]" (e.g., "Monday — Dinner") |
| Week | Date | Monday of the planning week |
| Day | Select | Monday / Tuesday / Wednesday / Thursday / Friday / Saturday / Sunday |
| Meal | Select | Breakfast / Lunch / Dinner / Snack |
| Recipe | Relation | → Recipes database |
| Recipe Name | Rollup | Recipe Name from linked Recipe |
| Custom Meal | Text | For meals without a recipe entry (e.g., "Leftovers" or "Eating out") |
| Prep Required | Checkbox | Does this need advance prep? |
| Prep Day | Select | Sunday / Monday / Tuesday / Wednesday / Thursday / Friday / Saturday |
| Prep Notes | Text | What to prep in advance (chop vegetables, marinate, etc.) |
| Calories | Rollup | Calories per serving from linked Recipe |
| Protein | Rollup | Protein (g) from linked Recipe |
| Carbs | Rollup | Carbs (g) from linked Recipe |
| Fat | Rollup | Fat (g) from linked Recipe |
| Servings Needed | Number | How many servings to prepare (family size) |
| Status | Select | Planned / Prepped / Cooked / Skipped / Swapped |
| Notes | Text | Adjustments, substitutions, "made extra for lunches" |

**Views:**
- **This Week** — Table, filter: Week = current week, grouped by Day, sorted by Meal order
- **Weekly Board** — Board view, grouped by Day, cards show Meal + Recipe Name
- **Meal Calendar** — Calendar view by Week
- **Prep List** — Filter: Prep Required = true, grouped by Prep Day
- **Next Week** — Table, filter: Week = next week
- **By Meal Type** — Table, grouped by Meal
- **Nutrition Summary** — Table, grouped by Day, showing sum of Calories, Protein, Carbs, Fat

### Daily Nutrition Targets (Customize These)

| Nutrient | Target | Notes |
|---|---|---|
| Calories | 2,000 kcal | Adjust based on your TDEE and goals |
| Protein | 100g | 0.7-1g per pound of body weight is common |
| Carbs | 250g | Adjust for keto, low-carb, or performance needs |
| Fat | 65g | 25-35% of total calories |
| Fiber | 30g | Most adults don't get enough |

---

### 3. Grocery Lists

**Purpose:** Weekly shopping lists organized by store section, linked to recipes, with pantry tracking.

**Properties:**

| Property | Type | Notes |
|---|---|---|
| Item Name | Title | Grocery item (e.g., "Chicken thighs, boneless skinless") |
| Store Section | Select | Produce / Dairy & Eggs / Meat & Seafood / Bakery / Pantry & Dry Goods / Frozen / Canned & Jarred / Spices & Seasonings / Oils & Vinegars / Snacks / Beverages / Other |
| Quantity | Text | Amount needed (e.g., "2 lbs," "1 bunch," "3 cans") |
| Week | Date | Monday of the shopping week |
| Linked Recipes | Relation | → Recipes database |
| Have It | Checkbox | Already in your pantry — skip this item |
| Purchased | Checkbox | Check off as you shop |
| Estimated Cost | Number (USD) | Approximate cost |
| Store | Select | Primary Store / Costco / Trader Joe's / Specialty / Online |
| Notes | Text | Brand preference, size, substitution options |
| Recurring | Checkbox | Buy this every week (pantry staple) |
| Tags | Multi-select | Organic / Sale / Bulk / Staple |

**Views:**
- **This Week's List** — Filter: Week = current week AND Have It = false, grouped by Store Section, sorted by Item Name
- **Shopping Mode** — Filter: Week = current week AND Have It = false AND Purchased = false, grouped by Store Section (use on your phone while shopping)
- **All Items** — Table, sorted by Store Section then Item Name
- **Pantry Staples** — Filter: Recurring = true (review monthly to make sure you're stocked)
- **By Store** — Table, grouped by Store
- **Cost Estimate** — Table, showing sum of Estimated Cost for the week
- **Already Have** — Filter: Have It = true (items to skip this week)

---

## DASHBOARD

> Create this as a Notion page that serves as your meal planning command center.

### Dashboard Layout

```
┌──────────────────────────────────────────────────────────┐
│  MEAL PREP HQ — Week of April 7                          │
├──────────────┬──────────────┬─────────────┬──────────────┤
│  Meals       │  Recipes     │ Grocery     │  Prep        │
│  Planned     │  Saved       │  Items      │  Sessions    │
│   14         │    47        │   32        │    2         │
├──────────────┴──────────────┴─────────────┴──────────────┤
│  THIS WEEK'S MEAL PLAN                                    │
│  [Linked view → Meal Plans, filter: this week]            │
│                                                           │
│  Mon: Overnight Oats | Turkey Wrap | Sheet Pan Chicken    │
│  Tue: Smoothie Bowl  | Leftover CP | Beef Stir-Fry       │
│  Wed: Overnight Oats | Grain Bowl  | Pasta Primavera     │
│  Thu: Eggs + Toast   | Leftover PP | Slow Cooker Chili   │
│  Fri: Smoothie Bowl  | Leftover SC | Pizza (eating out)  │
│  Sat: Pancakes       | Sandwiches  | Grilled Salmon      │
│  Sun: Brunch Frittata| Snack Plate | Meal Prep for Week  │
├──────────────────────────────────────────────────────────┤
│  PREP SCHEDULE                                            │
│  [Linked view → Meal Plans, filter: Prep Required = true] │
│  Sunday: Chop vegetables, cook rice, marinate chicken     │
│  Wednesday: Prep chili ingredients, make overnight oats   │
├──────────────────────────────────────────────────────────┤
│  GROCERY LIST                                             │
│  [Linked view → Grocery Lists, this week, Shopping Mode]  │
│  32 items | Est. cost: $87                                │
├──────────────────────────────────────────────────────────┤
│  FAVORITE RECIPES (Quick Access)                          │
│  [Linked view → Recipes, filter: Rating = 5-Amazing]     │
├──────────────────────────────────────────────────────────┤
│  DAILY NUTRITION (Today)                                  │
│  Calories: 1,850  |  Protein: 95g  |  Carbs: 210g       │
├──────────────────────────────────────────────────────────┤
│  RECENTLY ADDED RECIPES                                   │
│  [Linked view → Recipes, sorted: created date desc]       │
└──────────────────────────────────────────────────────────┘
```

---

## STARTER RECIPES (15 Pre-Loaded)

### 1. Sheet Pan Chicken Thighs with Vegetables

**Cuisine:** American | **Category:** Dinner | **Protein:** Chicken
**Prep:** 15 min | **Cook:** 35 min | **Total:** 50 min | **Servings:** 4
**Calories:** 380 | **Protein:** 32g | **Carbs:** 22g | **Fat:** 18g
**Dietary Tags:** Gluten-Free, Dairy-Free, Paleo, Whole30
**Equipment:** Oven, Sheet Pan
**Meal Prep Friendly:** Yes | **Freezer Friendly:** Yes

**Ingredients:**
- 8 bone-in chicken thighs (about 2 lbs)
- 2 medium sweet potatoes, cubed (1-inch pieces)
- 2 cups broccoli florets
- 1 red bell pepper, sliced
- 2 tbsp olive oil
- 1 tsp garlic powder
- 1 tsp smoked paprika
- 1/2 tsp onion powder
- Salt and pepper to taste
- Fresh lemon (for serving)

**Instructions:**
1. Preheat oven to 425F. Line a large sheet pan with parchment paper.
2. Toss sweet potatoes with 1 tbsp olive oil, salt, and pepper. Spread on the pan and roast for 10 minutes.
3. Season chicken thighs with garlic powder, paprika, onion powder, salt, and pepper.
4. Remove pan, push sweet potatoes to the sides. Place chicken in the center, skin-side up.
5. Add broccoli and bell pepper around the chicken. Drizzle remaining olive oil over vegetables.
6. Roast 25-30 minutes until chicken reaches 165F internal temperature and skin is crispy.
7. Squeeze fresh lemon over everything before serving.

**Storage:** Refrigerate up to 4 days. Reheat in oven at 375F for 10 minutes to keep chicken crispy.

---

### 2. Overnight Oats — 3 Ways

**Cuisine:** American | **Category:** Breakfast | **Protein:** None
**Prep:** 5 min | **Cook:** 0 min | **Total:** 5 min + overnight | **Servings:** 1
**Calories:** 350 | **Protein:** 14g | **Carbs:** 52g | **Fat:** 10g
**Dietary Tags:** Vegetarian, High-Protein (with add-ins)
**Equipment:** No Cook
**Meal Prep Friendly:** Yes | **Freezer Friendly:** No

**Base Ingredients (per serving):**
- 1/2 cup rolled oats
- 1/2 cup milk (dairy or plant-based)
- 1/4 cup Greek yogurt
- 1 tbsp chia seeds
- 1 tsp honey or maple syrup

**Variation A — PB Banana:**
Add 1 tbsp peanut butter + 1/2 sliced banana + drizzle of honey

**Variation B — Berry Vanilla:**
Add 1/2 cup mixed berries + 1/2 tsp vanilla extract + 1 tbsp almond slivers

**Variation C — Chocolate Protein:**
Add 1 scoop chocolate protein powder + 1 tbsp cocoa powder + 1 tbsp almond butter

**Instructions:**
1. Combine base ingredients in a mason jar or container.
2. Add variation toppings and mix well.
3. Cover and refrigerate overnight (minimum 4 hours).
4. Eat cold or microwave for 1-2 minutes. Add a splash of milk if too thick.

**Storage:** Keeps in fridge for 3 days. Make 3-5 jars on Sunday for the week.

---

### 3. Quick Beef Stir-Fry

**Cuisine:** Chinese | **Category:** Dinner | **Protein:** Beef
**Prep:** 15 min | **Cook:** 10 min | **Total:** 25 min | **Servings:** 4
**Calories:** 420 | **Protein:** 35g | **Carbs:** 30g | **Fat:** 16g
**Dietary Tags:** Dairy-Free
**Equipment:** Stovetop
**Meal Prep Friendly:** Yes | **Freezer Friendly:** Yes

**Ingredients:**
- 1 lb flank steak, thinly sliced against the grain
- 2 cups broccoli florets
- 1 red bell pepper, sliced
- 1 cup snap peas
- 3 cloves garlic, minced
- 1 tbsp fresh ginger, grated
- 3 tbsp soy sauce (or tamari for GF)
- 1 tbsp sesame oil
- 1 tbsp rice vinegar
- 1 tbsp honey
- 1 tbsp cornstarch + 2 tbsp water (slurry)
- 2 tbsp vegetable oil
- Cooked rice for serving
- Sesame seeds and green onion for garnish

**Instructions:**
1. Whisk together soy sauce, sesame oil, rice vinegar, and honey. Set aside.
2. Heat vegetable oil in a large skillet or wok over high heat until smoking.
3. Add beef in a single layer — don't crowd the pan. Sear 1-2 minutes per side. Remove and set aside.
4. Add broccoli, bell pepper, and snap peas. Stir-fry 3-4 minutes until crisp-tender.
5. Add garlic and ginger, stir 30 seconds until fragrant.
6. Return beef to pan. Pour sauce over everything.
7. Add cornstarch slurry and stir until sauce thickens (about 1 minute).
8. Serve over rice, garnish with sesame seeds and sliced green onion.

**Storage:** Refrigerate up to 3 days. Store rice separately. Reheat in a skillet for best results.

---

### 4. Mediterranean Grain Bowl

**Cuisine:** Mediterranean | **Category:** Lunch | **Protein:** Chicken
**Prep:** 15 min | **Cook:** 20 min | **Total:** 35 min | **Servings:** 4
**Calories:** 450 | **Protein:** 30g | **Carbs:** 45g | **Fat:** 18g
**Dietary Tags:** High-Protein
**Equipment:** Stovetop
**Meal Prep Friendly:** Yes | **Freezer Friendly:** No

---

### 5. Slow Cooker Chili

**Cuisine:** American | **Category:** Dinner | **Protein:** Beef
**Prep:** 15 min | **Cook:** 6 hrs (slow cooker) | **Total:** 6 hrs 15 min | **Servings:** 8
**Calories:** 380 | **Protein:** 28g | **Carbs:** 35g | **Fat:** 14g
**Dietary Tags:** Gluten-Free, Dairy-Free
**Equipment:** Slow Cooker
**Meal Prep Friendly:** Yes | **Freezer Friendly:** Yes

---

### 6. Turkey Taco Lettuce Wraps

**Cuisine:** Tex-Mex | **Category:** Dinner | **Protein:** Turkey
**Prep:** 10 min | **Cook:** 15 min | **Total:** 25 min | **Servings:** 4
**Calories:** 280 | **Protein:** 26g | **Carbs:** 12g | **Fat:** 14g
**Dietary Tags:** Gluten-Free, Low-Carb, Keto
**Equipment:** Stovetop
**Meal Prep Friendly:** Yes | **Freezer Friendly:** Yes (filling only)

---

### 7. Pasta Primavera

**Cuisine:** Italian | **Category:** Dinner | **Protein:** None (vegetarian)
**Prep:** 10 min | **Cook:** 20 min | **Total:** 30 min | **Servings:** 4
**Calories:** 420 | **Protein:** 14g | **Carbs:** 58g | **Fat:** 16g
**Dietary Tags:** Vegetarian
**Equipment:** Stovetop
**Meal Prep Friendly:** Yes | **Freezer Friendly:** No

---

### 8. Smoothie Bowl (Berry Protein)

**Cuisine:** American | **Category:** Breakfast | **Protein:** None
**Prep:** 5 min | **Cook:** 0 min | **Total:** 5 min | **Servings:** 1
**Calories:** 380 | **Protein:** 28g | **Carbs:** 48g | **Fat:** 8g
**Dietary Tags:** Vegetarian, Gluten-Free, High-Protein
**Equipment:** Blender
**Meal Prep Friendly:** No (make fresh) | **Freezer Friendly:** No

---

### 9. Chicken Caesar Salad Wraps

**Cuisine:** American | **Category:** Lunch | **Protein:** Chicken
**Prep:** 10 min | **Cook:** 0 min | **Total:** 10 min | **Servings:** 4
**Calories:** 350 | **Protein:** 28g | **Carbs:** 28g | **Fat:** 14g
**Dietary Tags:** High-Protein
**Equipment:** No Cook (using pre-cooked chicken)
**Meal Prep Friendly:** Yes | **Freezer Friendly:** No

---

### 10. Black Bean & Sweet Potato Tacos

**Cuisine:** Mexican | **Category:** Dinner | **Protein:** Beans
**Prep:** 10 min | **Cook:** 25 min | **Total:** 35 min | **Servings:** 4
**Calories:** 360 | **Protein:** 12g | **Carbs:** 56g | **Fat:** 10g
**Dietary Tags:** Vegetarian, Vegan, Dairy-Free, Gluten-Free (with corn tortillas)
**Equipment:** Oven, Stovetop
**Meal Prep Friendly:** Yes (filling only) | **Freezer Friendly:** Yes (filling only)

---

### 11. Egg & Veggie Breakfast Frittata

**Cuisine:** Italian | **Category:** Breakfast | **Protein:** Eggs
**Prep:** 10 min | **Cook:** 20 min | **Total:** 30 min | **Servings:** 6
**Calories:** 220 | **Protein:** 16g | **Carbs:** 8g | **Fat:** 14g
**Dietary Tags:** Vegetarian, Gluten-Free, Keto, Low-Carb
**Equipment:** Oven, Stovetop
**Meal Prep Friendly:** Yes | **Freezer Friendly:** Yes

---

### 12. Honey Garlic Salmon

**Cuisine:** American | **Category:** Dinner | **Protein:** Fish
**Prep:** 5 min | **Cook:** 15 min | **Total:** 20 min | **Servings:** 4
**Calories:** 340 | **Protein:** 34g | **Carbs:** 14g | **Fat:** 16g
**Dietary Tags:** Gluten-Free, Dairy-Free, High-Protein, Pescatarian
**Equipment:** Oven
**Meal Prep Friendly:** Yes | **Freezer Friendly:** No

---

### 13. Chicken Burrito Bowl

**Cuisine:** Mexican | **Category:** Lunch | **Protein:** Chicken
**Prep:** 15 min | **Cook:** 20 min | **Total:** 35 min | **Servings:** 4
**Calories:** 480 | **Protein:** 35g | **Carbs:** 52g | **Fat:** 14g
**Dietary Tags:** Gluten-Free
**Equipment:** Stovetop
**Meal Prep Friendly:** Yes | **Freezer Friendly:** Yes

---

### 14. One-Pot Lentil Soup

**Cuisine:** Mediterranean | **Category:** Dinner | **Protein:** Beans
**Prep:** 10 min | **Cook:** 30 min | **Total:** 40 min | **Servings:** 6
**Calories:** 280 | **Protein:** 18g | **Carbs:** 42g | **Fat:** 4g
**Dietary Tags:** Vegan, Gluten-Free, Dairy-Free, Low-Fat, High-Protein
**Equipment:** Stovetop
**Meal Prep Friendly:** Yes | **Freezer Friendly:** Yes

---

### 15. Greek Yogurt Parfait

**Cuisine:** American | **Category:** Snack | **Protein:** None
**Prep:** 5 min | **Cook:** 0 min | **Total:** 5 min | **Servings:** 1
**Calories:** 280 | **Protein:** 20g | **Carbs:** 35g | **Fat:** 8g
**Dietary Tags:** Vegetarian, Gluten-Free, High-Protein
**Equipment:** No Cook
**Meal Prep Friendly:** No (make fresh) | **Freezer Friendly:** No

---

## WEEKLY MEAL PREP WORKFLOW

### Sunday Prep Session (60-90 minutes)

**Before You Start:**
1. Review this week's Meal Plan
2. Check the Prep List view for everything that needs advance prep
3. Pull up the Grocery List — confirm all items are purchased
4. Clear counter space and pull out containers

**Prep Order (for efficiency):**
1. **Start slow cooker/oven items first** — they cook while you prep other things
2. **Cook grains in bulk** — rice, quinoa, or pasta (enough for 3-4 meals)
3. **Roast a large batch of vegetables** — sheet pan at 425F for 20 minutes
4. **Cook protein** — grill, bake, or pan-sear enough chicken/beef/tofu for 3-4 days
5. **Chop raw vegetables** — for salads, snacks, stir-fries later in the week
6. **Assemble grab-and-go breakfasts** — overnight oats, smoothie bags, egg muffins
7. **Portion into containers** — label with contents and date

**Container Tips:**
- Glass containers for anything reheated (no plastic in the microwave)
- Mason jars for overnight oats, salads, and soups
- Small containers for sauces and dressings (keep separate)
- Label everything with masking tape and a marker — "Chicken Stir-Fry — Wed"

---

## KEY FORMULA REFERENCE

**Total Recipe Time:**
```
prop("Prep Time") + prop("Cook Time")
```

**Time Category:**
```
if(
  prop("Total Time") <= 15, "15 min or less",
  if(
    prop("Total Time") <= 30, "30 min or less",
    if(
      prop("Total Time") <= 60, "1 hour or less",
      "1+ hours"
    )
  )
)
```

**Cost per Serving (if tracking recipe costs):**
```
if(prop("Servings") > 0, prop("Total Recipe Cost") / prop("Servings"), 0)
```

**Weekly Calorie Average:**
Create a filtered view of Meal Plans for the current week. Sum the Calories rollup and divide by 7.

**Grocery Cost Estimate:**
Create a filtered view of Grocery Lists for the current week. Sum the Estimated Cost property.

---

## QUICK-START GUIDE

### Step 1 — Add Your First 10 Recipes
- Open the **Recipes** database
- Start with 10 recipes your household already makes and enjoys
- Fill in the full details: ingredients, instructions, nutrition info, prep/cook times
- Tag with dietary preferences and cuisine type
- Rate them based on past experience
- The 15 starter recipes are already loaded — keep, modify, or delete them

### Step 2 — Build Your First Weekly Meal Plan
- Open the **Meal Plans** database
- Create entries for each meal slot you want to plan (e.g., Mon-Fri dinners, all breakfasts)
- Link each entry to a Recipe from your database
- For meals you're not planning (eating out, leftovers), use the Custom Meal text field
- Check "Prep Required" for any meals that need advance preparation
- Use the "This Week" view to see your plan at a glance

### Step 3 — Generate Your Grocery List
- Open the **Grocery Lists** database
- Review your planned recipes for the week
- Add each ingredient you need to buy, organized by Store Section
- Check "Have It" for items already in your pantry
- Set quantities based on servings needed
- Use the "Shopping Mode" view on your phone at the store

### Step 4 — Do Your Prep Session
- Check the Prep List view in Meal Plans for items flagged as Prep Required
- Follow the Sunday Prep Workflow above
- Update Meal Plan entries to "Prepped" status as you complete them
- Store prepped items with labels

### Step 5 — Cook and Track Through the Week
- Each day, check your Meal Plan for what's on the menu
- After cooking, update the status to "Cooked"
- If you swap a meal (made something different), update the entry
- Rate new recipes after trying them — this builds your personal favorites over time

### Step 6 — Weekly Rhythm
- **Saturday:** Browse recipes, decide on next week's plan
- **Sunday morning:** Build the grocery list, go shopping
- **Sunday afternoon:** Prep session (60-90 min)
- **Daily:** Check the plan, cook, enjoy
- **Friday:** Review the week — what worked? What to change?

### Pro Tips
- Start small — plan just dinners for the first 2 weeks, then add breakfasts and lunches
- Use the "Haven't Made Recently" view to rediscover good recipes you've forgotten about
- Duplicate last week's meal plan and swap 2-3 meals instead of building from scratch
- Batch cook proteins on Sunday — grilled chicken works in bowls, wraps, salads, and stir-fries all week
- Keep a "Snack Prep" section for cut vegetables, hummus portions, trail mix bags, and hard-boiled eggs
- Use the Freezer Friendly filter to build a freezer stash — future you will be grateful
- Share the workspace with your partner or family so everyone knows the plan
- Add recipes as you discover them — even if you don't plan to make them this week, save them for later
