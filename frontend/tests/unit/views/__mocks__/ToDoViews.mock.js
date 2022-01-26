export default {
  get: (_url, _body) => {
    return new Promise((resolve) => {
      resolve({
        data: {
          tasks: [
            {
              task: { title: "15678" },
              _id: "61eeabd7525267e4bd11d5f5",
              complete: false,
              position: 2168,
              date_create: "2022-01-24T13:38:31.662Z",
              __v: 0,
            },
            {
              task: { title: "у21у21у122112у" },
              _id: "61e1c012d41b256f8a95b479",
              complete: false,
              position: 2190,
              date_create: "2022-01-14T18:25:22.429Z",
              __v: 0,
            },
          ],
          totalElement: 24,
        },
      });
    });
  },
  post: (_url, _body) => {
    return new Promise((resolve) => {
      resolve({
        data: {
          task: { title: _body.task.title },
          _id: "61eeabd7525267e4bd11d5f5",
          complete: _body.complete,
          position: _body.position,
          date_create: "2022-01-24T13:38:31.662Z",
          __v: 0,
        },
      });
    });
  },
  delete: (_url, _body) => {
    return new Promise((resolve) => {
      resolve(true);
    });
  },
};
