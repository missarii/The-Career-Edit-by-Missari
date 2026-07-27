const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Configuration
const TOTAL_PRS = 120;
const REPO_OWNER = 'missarii';
const REPO_NAME = 'The-Career-Edit-by-Missari';

function runCommand(cmd) {
  try {
    return execSync(cmd, { encoding: 'utf8', stdio: 'pipe' }).trim();
  } catch (error) {
    console.error(`Error executing: ${cmd}`);
    console.error(error.message);
    throw error;
  }
}

function createBranch(index) {
  const branchName = `pr-${String(index).padStart(3, '0')}-batch`;
  console.log(`\n[${index}/${TOTAL_PRS}] Creating branch: ${branchName}`);
  
  // Create and switch to new branch
  runCommand(`git checkout -b ${branchName}`);
  
  // Make a small change - append to a log file
  const logFile = 'pr-creation-log.md';
  const timestamp = new Date().toISOString();
  const entry = `\n## ${branchName}\n- Created: ${timestamp}\n- PR Number: ${index}\n`;
  
  if (fs.existsSync(logFile)) {
    fs.appendFileSync(logFile, entry);
  } else {
    fs.writeFileSync(logFile, `# Pull Request Creation Log\n${entry}`);
  }
  
  // Commit the change
  runCommand('git add pr-creation-log.md');
  runCommand(`git commit -m "Add PR log entry for ${branchName}"`);
  
  // Push the branch
  runCommand(`git push origin ${branchName}`);
  
  return branchName;
}

function createPullRequest(branchName, index) {
  const title = `PR #${index}: Incremental update batch ${index}`;
  const body = `This is pull request #${index} of 120 from the batch update series.\n\n**Branch:** ${branchName}\n**Sequence:** ${index}/${TOTAL_PRS}\n\nChanges:\n- Added log entry to pr-creation-log.md\n\nThis PR is part of an automated batch creation of 120 pull requests.`;
  
  console.log(`Creating pull request for: ${branchName}`);
  
  const prCommand = `gh pr create --base main --head ${branchName} --title "${title}" --body "${body}"`;
  
  try {
    const output = runCommand(prCommand);
    console.log(`✓ Created PR #${index}: ${output}`);
    return output;
  } catch (error) {
    // If PR already exists, continue
    if (error.message.includes('already exists')) {
      console.log(`⚠ PR for ${branchName} already exists, skipping...`);
      return null;
    }
    throw error;
  }
}

function main() {
  console.log('Starting creation of 120 pull requests...');
  console.log(`Repository: ${REPO_OWNER}/${REPO_NAME}`);
  console.log(`Base branch: main\n`);
  
  // Create the log file initially if it doesn't exist
  const logFile = 'pr-creation-log.md';
  if (!fs.existsSync(logFile)) {
    fs.writeFileSync(logFile, '# Pull Request Creation Log\n\n');
    runCommand('git add pr-creation-log.md');
    runCommand('git commit -m "Initialize PR creation log"');
    runCommand('git push origin main');
  }
  
  let successCount = 0;
  let failCount = 0;
  
  for (let i = 1; i <= TOTAL_PRS; i++) {
    try {
      const branchName = createBranch(i);
      const prResult = createPullRequest(branchName, i);
      
      if (prResult) {
        successCount++;
      } else {
        failCount++;
      }
      
      // Switch back to main to prepare for next iteration
      runCommand('git checkout main');
      
      // Add small delay to avoid rate limiting
      if (i % 10 === 0) {
        console.log(`\n--- Progress: ${i}/${TOTAL_PRS} (${Math.round((i/TOTAL_PRS)*100)}%) ---`);
        console.log(`Success: ${successCount}, Skipped: ${failCount}`);
      }
      
    } catch (error) {
      console.error(`\n✗ Failed at PR #${i}:`, error.message);
      failCount++;
      
      // Ensure we're back on main
      try {
        runCommand('git checkout main');
      } catch (e) {
        console.error('Could not switch back to main, stopping...');
        break;
      }
    }
  }
  
  console.log('\n========================================');
  console.log('SUMMARY');
  console.log('========================================');
  console.log(`Total PRs attempted: ${TOTAL_PRS}`);
  console.log(`Successfully created: ${successCount}`);
  console.log(`Skipped (already existed): ${failCount}`);
  console.log(`Success rate: ${Math.round((successCount/TOTAL_PRS)*100)}%`);
  console.log('\nCleanup: The branch pr-creation-log.md has been updated.');
  console.log('You can remove it later if desired.');
}

main();