import { createClient } from '@sanity/client'

const client = createClient({
  projectId: 'xf8ueo0c',   // Replace with your actual project ID (all lowercase, numbers, dashes)
  dataset: 'production',          // Replace if needed
  apiVersion: '2023-08-01',
  token: 'skWMcgogup59EKb3vFaWq2DKAjKaYq67h4nAasp01tqezR0NdnWXgOVHmPjMs75rccYZkGUZM83HuT4gGWirDVFzzkVJ3xKkwKNiSPS94nOGzQjJp5HpNZ1qJWPlFwrYG55jD4HGNgD02FEE14sn9lbr6etEhcyXVGO2pJYEF362Kkdumb3E',     // Replace with a token that has write access
  useCdn: false
})

// Define the fields that are valid according to your schema.
const validFields = ['title', 'description', 'content', 'publishedDate', 'slug']

async function cleanEditorialDocuments() {
  // Fetch all documents of type editorialArticle.
  const query = `*[_type == "editorialArticle"]{_id, _type, title, description, content, publishedDate, slug}`
  const docs = await client.fetch(query)

  if (!docs.length) {
    console.log("✅ No documents found to clean.")
    return
  }

  for (const doc of docs) {
    // Get all keys present on the document.
    const allKeys = Object.keys(doc)
    // Filter out keys that are not valid (ignore _id and _type).
    const keysToRemove = allKeys.filter(
      (key) => !validFields.includes(key) && key !== '_id' && key !== '_type'
    )
    if (keysToRemove.length > 0) {
      console.log(`Cleaning document ${doc._id}: removing fields ${keysToRemove.join(', ')}`)
      try {
        await client.patch(doc._id).unset(keysToRemove).commit()
        console.log(`✅ Document ${doc._id} updated.`)
      } catch (err) {
        console.error(`❌ Failed to update ${doc._id}: ${err.message}`)
      }
    }
  }

  console.log("🎉 Migration complete!")
}

cleanEditorialDocuments()
