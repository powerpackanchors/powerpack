export default {
  name: 'artist',
  title: 'Artist',
  type: 'document',
  fields: [
    {
      name: 'featured',
      title: 'Featured (Show at top)',
      type: 'boolean',
      initialValue: false,
      description: 'Turn on to show this artist at the top of the list'
    },
    { name: 'name', title: 'Name', type: 'string' },
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
    {
      name: 'tier',
      title: 'Tier',
      type: 'string',
      options: {
        list: [
          { title: 'Elite', value: 'Elite' },
          { title: 'Premium', value: 'Premium' },
          { title: 'Official', value: 'Official' },
          { title: 'Open', value: 'Open' }
        ]
      }
    },
    { name: 'photo', title: 'Photo', type: 'image', options: { hotspot: true } },
    { name: 'photoUrl', title: 'Photo URL (Cloudinary)', type: 'url' },
    { name: 'bio', title: 'Bio', type: 'text' },
    { name: 'instagramHandle', title: 'Instagram Handle', type: 'string' },
    { name: 'experience', title: 'Experience', type: 'string' },
    { name: 'eventsCount', title: 'Events Count', type: 'string' },
    { name: 'rating', title: 'Rating', type: 'string' },
    { name: 'city', title: 'City', type: 'string' },
    { name: 'memberSince', title: 'Member Since', type: 'string' },
    { name: 'whatsappNumber', title: 'WhatsApp Number', type: 'string' },
    {
      name: 'languages',
      title: 'Languages',
      type: 'array',
      of: [{ type: 'string' }]
    },
    {
      name: 'specialisations',
      title: 'Specialisations',
      type: 'array',
      of: [{ type: 'string' }]
    }
  ]
}
