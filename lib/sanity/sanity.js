import { createClient } from 'next-sanity'
export const sanityClient = createClient({
  projectId: 'xf8ueo0c',
  dataset: 'production',
  apiVersion: '2024-03-01', // Use today's date or the version you prefer
  useCdn: true, // `false` if you want to ensure fresh data
})
export default sanityClient