export default {
  name: 'methodology',
  title: 'Methodology Page',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Page Title',
      type: 'string',
      initialValue: 'Progressive Power Rankings Methodology',
    },
    {
      name: 'intro',
      title: 'Intro Summary',
      type: 'text',
      description: 'A short intro to display at the top of the page.',
    },
    {
      name: 'body',
      title: 'Full Methodology Text',
      type: 'array',
      of: [
        {
          type: 'block',
        },
        {
          type: 'image',
          options: { hotspot: true },
        },
      ],
    },
  ],
};
