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
      type: 'array',
      of: [{ type: 'block' }],
    },
  ],
};

export default missionPage;
// OR
export { missionPage };