module.exports = {
  onInit: ({ utils }) => {
    console.log("PROJECT NAME", process.env.PROJECT_NAME);
    console.log("CACHED REF", process.env.CACHED_COMMIT_REF);
    console.log("CURRENT REF", process.env.COMMIT_REF);

    const currentProject = process.env.PROJECT_NAME;
    const lastDeployedCommit = process.env.CACHED_COMMIT_REF;
    const latestCommit = 'HEAD';
    const projectHasChanged = projectChanged(
      currentProject,
      lastDeployedCommit,
      latestCommit
    );
    if (!projectHasChanged) {
      utils.build.cancelBuild(
        `Build was cancelled because ${currentProject} was not affected by the latest changes`
      );
    }
  }
};

function projectChanged(currentProject, fromHash, toHash) {
  const execSync = require('child_process').execSync;
  const getAffected = `nx print-affected --base=${fromHash} --head=${toHash}`;
  const output = execSync(getAffected).toString();
  console.log("OUTPUT", output)
  //get the list of changed projects from the output
  const changedProjects = JSON.parse(output).projects;
  if (changedProjects.find(project => project === currentProject)) {
    return true;
  } else {
    return false;
  }
}
