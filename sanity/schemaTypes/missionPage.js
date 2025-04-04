const missionPage = {
  name: 'missionPage',
  title: 'Mission Page',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Title',
      type: 'string',
    },
    {
      name: 'description',
      title: 'Description',
      type: 'text',
    },
  ],
};

export default missionPage; // OR this 👇
export { missionPage };
