const core = require("@actions/core");
const github = require("@actions/github");

exports.NotifyClassroom = async function NotifyClassroom(totalPoints, maxPoints) {
  console.log("Starting NotifyClassroom");
  // The action needs an API access to the repository so we require a token
  const token = process.env.GITHUB_TOKEN || core.getInput("token");
  if (!token || token === "") {
    console.log("No token provided");
    return;
  }

  // Create the octokit client
  const octokit = github.getOctokit(token);
  if (!octokit) {
    console.log("Failed to create octokit client");
    return;
  }

  const nwo = process.env.GITHUB_REPOSITORY || "/";
  const [owner, repo] = nwo.split("/");
  if (!owner || !repo) {
    console.log("Failed to get owner or repo");
    return;
  }

  // Get the run ID
  const runId = parseInt(process.env.GITHUB_RUN_ID || "");
  if (Number.isNaN(runId)) {
    console.log("Failed to get run ID");
    return;
  }

  // Fetch the workflow run
  const workflowRunResponse = await octokit.rest.actions.getWorkflowRun({
    owner,
    repo,
    run_id: runId,
  });

  // Find the check suite run
  console.log(`Workflow Run Response: ${workflowRunResponse.data.check_suite_url}`);
  const checkSuiteUrl = workflowRunResponse.data.check_suite_url;
  const checkSuiteId = parseInt(checkSuiteUrl.match(/[0-9]+$/)[0], 10);

  const checkRunsResponse = await octokit.rest.checks.listForSuite({
    owner,
    repo,
    check_name: "run-autograding-tests",
    check_suite_id: checkSuiteId,
  });

  // Filter to find the check run named "Autograding Tests" for the specific workflow run ID
  const checkRun = checkRunsResponse.data.total_count === 1 && checkRunsResponse.data.check_runs[0];

  if (!checkRun) {
    console.log("No check run named 'Autograding Tests' found");
    return;
  }

  const text = `Points ${totalPoints}/${maxPoints}`;
  await octokit.rest.checks.update({
    owner,
    repo,
    check_run_id: checkRun.id,
    output: {
      title: "Autograding",
      summary: text,
      text: JSON.stringify({ totalPoints, maxPoints }),
      annotations: [
        {
          // Using the `.github` path is what GitHub Actions does
          path: ".github",
          start_line: 1,
          end_line: 1,
          annotation_level: "notice",
          message: text,
          title: "Autograding complete",
        },
      ],
    },
  });
};
