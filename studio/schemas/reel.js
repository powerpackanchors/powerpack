export default {
  name: 'reel',
  title: 'Reel',
  type: 'document',
  fields: [
    { name: 'title', title: 'Title', type: 'string' },
    {
      name: 'category',
      title: 'Category',
      type: 'string',
      options: {
        list: [
          { title: 'Anchors', value: 'Anchors' },
          { title: 'DJs', value: 'DJs' },
          { title: 'Choreographers', value: 'Choreographers' },
          { title: 'Reel Creators', value: 'Reel Creators' }
        ]
      }
    },
    { name: 'thumbnail', title: 'Thumbnail', type: 'image', options: { hotspot: true } },
    { name: 'videoUrl', title: 'Video URL', type: 'url' }
  ]
}
