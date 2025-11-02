// Service to load and map category data from CSV
import Papa from 'papaparse'

export interface CategoryActionData {
  category: string
  reason: string
  level: string
  description: string
  showsUpAs: string
  actions: {
    title: string
    explanation: string
    flavor: 'risky' | 'basic' | 'boring'
  }[]
}

// Map category names to cell IDs
const CATEGORY_TO_CELL_MAPPING: Record<string, string> = {
  'The Intrusive AI': 'L1_C1',       // Personal × Too Autonomous
  'The Unadaptive AI': 'L1_C2',      // Personal × Too Inflexible
  'The Uncaring AI': 'L1_C3',        // Personal × Emotionless
  'The Confusing AI': 'L1_C4',       // Personal × Too Opaque
  'The Aloof AI': 'L1_C5',           // Personal × Prefer Human
  
  'The Redefining AI': 'L2_C1',      // Collaboration × Too Autonomous
  'The Forcing AI': 'L2_C2',         // Collaboration × Too Inflexible
  'The Distant AI': 'L2_C3',         // Collaboration × Emotionless
  'The Obscuring AI': 'L2_C4',       // Collaboration × Too Opaque
  'The Separating AI': 'L2_C5',      // Collaboration × Prefer Human
  
  'The Unjust AI': 'L3_C1',          // Trust & Fairness × Too Autonomous
  'The Constricting AI': 'L3_C2',    // Trust & Fairness × Too Inflexible
  'The Callous AI': 'L3_C3',         // Trust & Fairness × Emotionless
  'The Hidden AI': 'L3_C4',          // Trust & Fairness × Too Opaque
  'The Usurping AI': 'L3_C5',        // Trust & Fairness × Prefer Human
  
  'The Threatening AI': 'L4_C1',     // Career Security × Too Autonomous
  'The Stagnating AI': 'L4_C2',      // Career Security × Too Inflexible
  'The Devaluing AI': 'L4_C3',       // Career Security × Emotionless
  'The Unknowable AI': 'L4_C4',      // Career Security × Too Opaque
  'The Replacing AI': 'L4_C5',       // Career Security × Prefer Human
  
  'The Uncontrolled AI': 'L5_C1',    // Org Stability × Too Autonomous
  'The Brittle AI': 'L5_C2',         // Org Stability × Too Inflexible
  'The Dehumanizing AI': 'L5_C3',    // Org Stability × Emotionless
  'The Risky AI': 'L5_C4',           // Org Stability × Too Opaque
  'The Undermining AI': 'L5_C5',     // Org Stability × Prefer Human
}

export class CategoryDataService {
  private static data: Map<string, CategoryActionData> = new Map()
  private static isLoaded = false

  static async loadData(): Promise<void> {
    if (this.isLoaded) return

    try {
      // Load CSV data
      const response = await fetch('/data/categoriesandactionainav.csv')
      const csvText = await response.text()

      const result = Papa.parse(csvText, {
        header: true,
        skipEmptyLines: true
      })

      // Parse and map data
      result.data.forEach((row: any) => {
        if (!row.Category) return

        const cellId = CATEGORY_TO_CELL_MAPPING[row.Category]
        if (!cellId) return

        const categoryData: CategoryActionData = {
          category: row.Category || '',
          reason: row.Reason || '',
          level: row.Level || '',
          description: row.Description || '',
          showsUpAs: row['Shows up as'] || '',
          actions: []
        }

        // Parse 3 actions with different flavors
        if (row['Action 1']) {
          categoryData.actions.push({
            title: row['Action 1'],
            explanation: row['Explanation 1'] || '',
            flavor: 'basic' // Action 1 = Basic/Standard
          })
        }
        if (row['Action 2']) {
          categoryData.actions.push({
            title: row['Action 2'],
            explanation: row['Explanation 2'] || '',
            flavor: 'risky' // Action 2 = Risky/Creative
          })
        }
        if (row['Action 3']) {
          categoryData.actions.push({
            title: row['Action 3'],
            explanation: row['Explanation 3'] || '',
            flavor: 'boring' // Action 3 = Boring/Safe
          })
        }

        this.data.set(cellId, categoryData)
      })

      this.isLoaded = true
      console.log('✅ Category data loaded:', this.data.size, 'categories')
    } catch (error) {
      console.error('Failed to load category data:', error)
    }
  }

  static getCategoryForCell(cellId: string): CategoryActionData | null {
    return this.data.get(cellId) || null
  }

  static getAllCategories(): Map<string, CategoryActionData> {
    return this.data
  }

  static getCellIdForCategory(categoryName: string): string | null {
    return CATEGORY_TO_CELL_MAPPING[categoryName] || null
  }
}





