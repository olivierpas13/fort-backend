const createIssueEditQuery = (updatedFields) =>{
    const updateQuery = Object.entries(updatedFields).reduce((acc, [key, value]) => {
      acc[`issues.$.${key}`] = value;
      return acc;
    }, {});

    return updateQuery
}

export default createIssueEditQuery;