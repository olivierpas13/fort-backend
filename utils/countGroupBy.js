const countGroupBy = (data, key) => {
    return data.reduce((storage, item) => {
        let group = item[key];
        storage[group] = storage[group] || [];
        console.log(storage[group]);
        storage[group]++;
        return storage; 
    }, {});
  };

  export default countGroupBy;