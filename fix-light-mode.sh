#!/bin/bash

# Comprehensive light mode text color fix
# Replaces all problematic color classes with dark mode variants

files=(
  "components/sentiment/SentimentHeatmapRevised.tsx"
  "components/sentiment/ProblemCategoriesView.tsx"
  "components/sentiment/InterventionsView.tsx"
  "components/sentiment/CategoryDetailModal.tsx"
  "components/dashboard/ExecutiveDashboard.tsx"
  "components/dashboard/FilterPanel.tsx"
  "components/dashboard/StatsCards.tsx"
  "components/capability/CapabilityAnalysisPro.tsx"
  "components/capability/DimensionDrilldown.tsx"
  "components/capability/OpenEndedSummary.tsx"
  "components/recommendations/RecommendationsView.tsx"
  "components/reports/ReportsView.tsx"
)

# Fix text-white to be conditional
for file in "${files[@]}"; do
  if [ -f "$file" ]; then
    # Text colors
    sed -i 's/text-white"/text-slate-900 dark:text-white"/g' "$file"
    sed -i "s/text-white'/text-slate-900 dark:text-white'/g" "$file"
    sed -i 's/text-white /text-slate-900 dark:text-white /g' "$file"
    sed -i 's/text-white}/text-slate-900 dark:text-white}/g' "$file"
    
    # Gray text
    sed -i 's/text-gray-300"/text-slate-700 dark:text-gray-300"/g' "$file"
    sed -i 's/text-gray-400"/text-slate-600 dark:text-gray-400"/g' "$file"
    sed -i 's/text-gray-500"/text-slate-500 dark:text-gray-500"/g' "$file"
    
    # Colored text (needs dark variants)
    sed -i 's/text-teal-300"/text-teal-700 dark:text-teal-300"/g' "$file"
    sed -i 's/text-teal-400"/text-teal-700 dark:text-teal-400"/g' "$file"
    sed -i 's/text-purple-300"/text-purple-700 dark:text-purple-300"/g' "$file"
    sed -i 's/text-purple-400"/text-purple-700 dark:text-purple-400"/g' "$file"
    sed -i 's/text-blue-300"/text-blue-700 dark:text-blue-300"/g' "$file"
    sed -i 's/text-blue-400"/text-blue-700 dark:text-blue-400"/g' "$file"
    
    echo "Fixed: $file"
  fi
done

echo "Light mode text colors fixed!"

