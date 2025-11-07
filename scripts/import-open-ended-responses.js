const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');
const Papa = require('papaparse');

// Load environment variables from .env.local
const envPath = path.join(__dirname, '../.env.local');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf-8');
  envContent.split('\n').forEach(line => {
    const match = line.match(/^([^=]+)=(.*)$/);
    if (match) {
      const key = match[1].trim();
      const value = match[2].trim();
      process.env[key] = value;
    }
  });
}

// Supabase configuration
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Error: Missing Supabase credentials');
  console.log('   Please ensure NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are set in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// File paths
const DATA_DIR = path.join(__dirname, '../data/Database info/AICapability_load_db/AI_CapScan_csv');
const Q39_FILE = path.join(DATA_DIR, 'AI_CapScan_3NF_Q39.csv');
const Q40_FILE = path.join(DATA_DIR, 'AI_CapScan_3NF_Q40.csv');
const Q41_FILE = path.join(DATA_DIR, 'AI_CapScan_3NF_Q41.csv');
const FACT_TABLE_FILE = path.join(DATA_DIR, 'AI_CapScan_3NF_fact_table.csv');

// Parse CSV file
function parseCSV(filePath) {
  const fileContent = fs.readFileSync(filePath, 'utf-8');
  const result = Papa.parse(fileContent, {
    header: true,
    skipEmptyLines: true
  });
  return result.data;
}

async function importOpenEndedResponses() {
  console.log('🚀 Starting open-ended responses import...\n');

  try {
    // Step 1: Read Q39, Q40, Q41 CSV files
    console.log('📖 Reading CSV files...');
    const q39Data = parseCSV(Q39_FILE);
    const q40Data = parseCSV(Q40_FILE);
    const q41Data = parseCSV(Q41_FILE);
    const factTable = parseCSV(FACT_TABLE_FILE);

    console.log(`   ✓ Q39 (Achievements): ${q39Data.length} responses`);
    console.log(`   ✓ Q40 (Challenges): ${q40Data.length} responses`);
    console.log(`   ✓ Q41 (Future Goals): ${q41Data.length} responses`);
    console.log(`   ✓ Fact Table: ${factTable.length} records\n`);

    // Step 2: Create lookup maps
    console.log('🗂️  Creating lookup maps...');
    const q39Map = new Map(q39Data.map(row => [row.Q39_id, row.Q39]));
    const q40Map = new Map(q40Data.map(row => [row.Q40_id, row.Q40]));
    const q41Map = new Map(q41Data.map(row => [row.Q41_id, row.Q41]));

    console.log(`   ✓ Q39 Map: ${q39Map.size} entries`);
    console.log(`   ✓ Q40 Map: ${q40Map.size} entries`);
    console.log(`   ✓ Q41 Map: ${q41Map.size} entries\n`);

    // Step 3: Build updates array
    console.log('🔨 Building update records...');
    const updates = [];
    let processedCount = 0;
    let skippedCount = 0;

    for (const row of factTable) {
      const recordId = row.ResponseId_id; // Use ResponseId_id which matches actual database respondent_id
      const q39Id = row.Q39_id;
      const q40Id = row.Q40_id;
      const q41Id = row.Q41_id;

      if (!recordId) {
        skippedCount++;
        continue;
      }

      const q39Text = q39Map.get(q39Id) || null;
      const q40Text = q40Map.get(q40Id) || null;
      const q41Text = q41Map.get(q41Id) || null;

      // Only update if at least one response exists
      if (q39Text || q40Text || q41Text) {
        updates.push({
          respondent_id: recordId,
          q39_achievements: q39Text,
          q40_challenges: q40Text,
          q41_future_goals: q41Text
        });
        processedCount++;
      }
    }

    console.log(`   ✓ Prepared ${processedCount} updates`);
    console.log(`   ⚠ Skipped ${skippedCount} records without IDs\n`);

    // Step 4: Update Supabase in batches
    console.log('💾 Updating Supabase...');
    const BATCH_SIZE = 50;
    let successCount = 0;
    let errorCount = 0;

    for (let i = 0; i < updates.length; i += BATCH_SIZE) {
      const batch = updates.slice(i, i + BATCH_SIZE);

      for (const update of batch) {
        const { error } = await supabase
          .from('respondents')
          .update({
            q39_achievements: update.q39_achievements,
            q40_challenges: update.q40_challenges,
            q41_future_goals: update.q41_future_goals
          })
          .eq('respondent_id', update.respondent_id);

        if (error) {
          console.error(`   ❌ Error updating ${update.respondent_id}:`, error.message);
          errorCount++;
        } else {
          successCount++;
        }
      }

      const progress = Math.min(i + BATCH_SIZE, updates.length);
      process.stdout.write(`   Progress: ${progress}/${updates.length} records...\r`);
    }

    console.log(`\n   ✓ Successfully updated ${successCount} respondents`);
    if (errorCount > 0) {
      console.log(`   ⚠ Errors: ${errorCount} records failed\n`);
    }

    // Step 5: Verify import
    console.log('\n✅ Verifying import...');
    const { data: verifyData, error: verifyError } = await supabase
      .from('respondents')
      .select('respondent_id, q39_achievements, q40_challenges, q41_future_goals')
      .or('q39_achievements.not.is.null,q40_challenges.not.is.null,q41_future_goals.not.is.null')
      .limit(5);

    if (verifyError) {
      console.error('   ❌ Verification failed:', verifyError.message);
    } else {
      console.log(`   ✓ Found ${verifyData.length} respondents with open-ended responses`);
      console.log('\n📊 Sample data:');
      verifyData.slice(0, 2).forEach((row, idx) => {
        console.log(`   ${idx + 1}. Respondent: ${row.respondent_id}`);
        console.log(`      Q39: ${row.q39_achievements ? row.q39_achievements.substring(0, 60) + '...' : 'N/A'}`);
        console.log(`      Q40: ${row.q40_challenges ? row.q40_challenges.substring(0, 60) + '...' : 'N/A'}`);
        console.log(`      Q41: ${row.q41_future_goals ? row.q41_future_goals.substring(0, 60) + '...' : 'N/A'}`);
      });
    }

    console.log('\n✨ Import completed successfully!\n');
  } catch (error) {
    console.error('\n❌ Import failed:', error);
    process.exit(1);
  }
}

// Run import
importOpenEndedResponses();
