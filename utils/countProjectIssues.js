function getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }
  
  function groupIssuesByProject(issues) {
    const groupedIssues = issues.reduce((acc, issue) => {
      const projectTitle = issue.projectTitle;
  
      if (!acc.hasOwnProperty(projectTitle)) {
        acc[projectTitle] = {
          title: projectTitle,
          value: 0,
          color: getRandomColor(),
        };
      }
  
      acc[projectTitle].value++;
  
      return acc;
    }, {});
  
    return Object.values(groupedIssues);
  }
  
export default groupIssuesByProject;