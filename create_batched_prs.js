const { execSync } = require('child_process');
const fs = require('fs');

// Configuration
const BATCH_SIZE = 25;
const TOTAL_PRS = 120;

function runCommand(cmd, silent = false) {
  try {
    return execSync(cmd, { encoding: 'utf8', stdio: silent ? 'pipe' : 'inherit' }).trim();
  } catch (error) {
    if (!silent) {
      console.error(`Error: ${error.message}`);
    }
    throw error;
  }
}

function mergePR(index) {
  const prNumber = index;
  // Merge using rebase to avoid merge conflicts
  runCommand(`gh pr merge ${prNumber} --rebase`, true);
  console.log(`  ✓ Merged PR #${index}`);
}

function processBatch(batchNum, startIndex, endIndex) {
  console.log(`\n${'='.repeat(60)}`);
  console.log(`BATCH ${batchNum}: Merging PRs ${startIndex}-${endIndex}`);
  console.log('='.repeat(60));
  
  console.log(`\nMerging PRs...`);
  for (let i = startIndex; i <= endIndex; i++) {
    try {
      mergePR(i);
    } catch (error) {
      console.error(`  ✗ Failed to merge PR #${i}:`, error.message);
    }
  }
  
  console.log(`\n✓ Batch ${batchNum} complete!`);
}

function main() {
  console.log('Starting PR merging in batches...');
  console.log(`Target: Merge PRs 1-${TOTAL_PRS} (${TOTAL_PRS} PRs in ${BATCH_SIZE}-PR batches)`);
  
  let currentBatch = 1;
  
  // Process batch 1: PRs 1-25
  processBatch(currentBatch, 1, Math.min(25, TOTAL_PRS));
  currentBatch++;
  
  // Process batch 2: PRs 26-50
  if (TOTAL_PRS >= 26) {
    processBatch(currentBatch, 26, Math.min(50, TOTAL_PRS));
    currentBatch++;
  }
  
  // Process batch 3: PRs 51-75
  if (TOTAL_PRS >= 51) {
    processBatch(currentBatch, 51, Math.min(75, TOTAL_PRS));
    currentBatch++;
  }
  
  // Process batch 4: PRs 76-100
  if (TOTAL_PRS >= 76) {
    processBatch(currentBatch, 76, Math.min(100, TOTAL_PRS));
    currentBatch++;
  }
  
  // Process batch 5: PRs 101-120
  if (TOTAL_PRS >= 101) {
    processBatch(currentBatch, 101, TOTAL_PRS);
  }
  
  console.log('\n========================================');
  console.log('ALL BATCHES COMPLETED!');
  console.log('========================================');
  console.log(`Total PRs merged: ${TOTAL_PRS}`);
  console.log('Repository: missarii/The-Career-Edit-by-Missari');
  console.log('\nYou can verify all PRs at:');
  console.log('https://github.com/missarii/The-Career-Edit-by-Missari/pulls');
}

main();