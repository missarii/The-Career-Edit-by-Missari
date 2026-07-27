const { execSync } = require('child_process');
const fs = require('fs');

// Configuration
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

function createBranchAndCommit(index) {
  const branchName = `pr-${String(index).padStart(3, '0')}-batch`;
  
  // Create and switch to new branch from main
  runCommand(`git checkout -b ${branchName} main`, true);
  
  // Create a unique directory and file for this PR to avoid conflicts
  const dirPath = `pr-updates`;
  const fileName = `pr-${String(index).padStart(3, '0')}-update.md`;
  const filePath = `${dirPath}/${fileName}`;
  
  // Ensure directory exists
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath);
  }
  
  // Create a unique file for this PR
  const timestamp = new Date().toISOString();
  const content = `# Pull Request Update ${index}\n\nThis file was created for PR #${index}.\n\n**Branch:** ${branchName}\n**Created:** ${timestamp}\n\n## Details\n\nThis is a unique update file to avoid merge conflicts when merging multiple PRs.\n\n---
`;
  
  fs.writeFileSync(filePath, content);
  
  // Commit and push
  runCommand('git add .', true);
  runCommand(`git commit -m "Add pr-${String(index).padStart(3, '0')} update"`, true);
  runCommand(`git push origin ${branchName}`, true);
  
  return branchName;
}

function createPR(branchName, index) {
  const title = `PR #${index}: Unique update ${index}`;
  const body = `This is pull request #${index} of ${TOTAL_PRS}.\n\n**Branch:** ${branchName}\n**Sequence:** ${index}/${TOTAL_PRS}\n\n## Changes\n\n- Created unique file: \`pr-updates/pr-${String(index).padStart(3, '0')}-update.md\`\n\nThis approach avoids merge conflicts since each PR modifies a different file.`;
  
  const output = runCommand(`gh pr create --base main --head ${branchName} --title "${title}" --body "${body}"`, true);
  console.log(`  ✓ Created PR #${index}`);
  return output;
}

function mergePR(index) {
  const prNumber = index;
  // Merge using merge commit method
  runCommand(`gh pr merge ${prNumber} --merge`, true);
  console.log(`  ✓ Merged PR #${index}`);
}

function processBatch(batchNum, startIndex, endIndex) {
  console.log(`\n${'='.repeat(60)}`);
  console.log(`BATCH ${batchNum}: PRs ${startIndex}-${endIndex}`);
  console.log('='.repeat(60));
  
  // For each PR: create branch, create PR, merge it immediately
  for (let i = startIndex; i <= endIndex; i++) {
    try {
      console.log(`\n[${i}/${TOTAL_PRS}] Processing PR #${i}...`);
      
      // Create branch and commit
      const branchName = createBranchAndCommit(i);
      
      // Create PR
      createPR(branchName, i);
      
      // Merge immediately
      mergePR(i);
      
      // Switch back to main
      runCommand('git checkout main', true);
      
    } catch (error) {
      console.error(`  ✗ Failed at PR #${i}:`, error.message);
      // Try to switch back to main
      try {
        runCommand('git checkout main', true);
      } catch (e) {
        console.error('Could not switch back to main!');
      }
    }
  }
  
  console.log(`\n✓ Batch ${batchNum} complete!`);
}

function main() {
  console.log('Starting creation of 120 unique PRs...');
  console.log(`Each PR will have a unique file to avoid merge conflicts.\n`);
  
  const BATCH_SIZE = 25;
  
  // Process in batches
  // Batch 1: PRs 1-25
  processBatch(1, 1, Math.min(25, TOTAL_PRS));
  
  // Batch 2: PRs 26-50
  if (TOTAL_PRS >= 26) {
    processBatch(2, 26, Math.min(50, TOTAL_PRS));
  }
  
  // Batch 3: PRs 51-75
  if (TOTAL_PRS >= 51) {
    processBatch(3, 51, Math.min(75, TOTAL_PRS));
  }
  
  // Batch 4: PRs 76-100
  if (TOTAL_PRS >= 76) {
    processBatch(4, 76, Math.min(100, TOTAL_PRS));
  }
  
  // Batch 5: PRs 101-120
  if (TOTAL_PRS >= 101) {
    processBatch(5, 101, TOTAL_PRS);
  }
  
  console.log('\n========================================');
  console.log('ALL 120 PULL REQUESTS COMPLETED!');
  console.log('========================================');
  console.log(`Repository: missarii/The-Career-Edit-by-Missari`);
  console.log('\nVerify at: https://github.com/missarii/The-Career-Edit-by-Missari/pulls');
}

main();