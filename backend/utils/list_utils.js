const formatedList = (list) => {
  let newList = [];
  Array(...list).forEach((element) => {
    newList.push({
      id: element._id,
      task: element.task,
      position: element.position,
      complete: element.complete,
      date_create: element.date_create,
    });
  });
  return newList;
};

const sortList = (list) => {
  list.sort((next, prev) => {
    if (next.position > prev.position) {
      return 1;
    }
    if (next.position < prev.position) {
      return -1;
    }
    return 0;
  });

  return list;
};
module.exports = {
  formatedList,
  sortList,
};
