#!/bin/bash

# SKYSPIRE ACAD - French Master Seeding Script
# This script runs all French-related seeders in the correct dependency order.

echo "🚀 Starting French Master Seeding..."

# 1. Grammar Hub Seeding
echo "------------------------------------------"
echo "Step 1: Seeding Grammar Hub..."
node src/seed_french_grammar.js

# 2. Lexicon Seeding (High Quality)
echo "------------------------------------------"
echo "Step 2: Seeding Lexicon (High Quality)..."
node scripts/seed/seed_lexicon_fr_v2.js

# 3. Learning Path Seeding (High Quality)
echo "------------------------------------------"
echo "Step 3: Seeding Learning Path (Survival)..."
node scripts/seed/seed_course_fr_v2.js

echo "------------------------------------------"
echo "✅ French Seeding Process Complete!"
