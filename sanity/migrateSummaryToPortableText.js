import { createClient } from '@sanity/client'
import crypto from 'node:crypto'  // Import crypto for random UUIDs

const client = createClient({
  projectId: 'xf8ueo0c', // Replace with your actual project ID (lowercase letters, numbers, and dashes)
  dataset: 'production',        // Replace if necessary
  apiVersion: '2023-08-01',
  token: 'skWMcgogup59EKb3vFaWq2DKAjKaYq67h4nAasp01tqezR0NdnWXgOVHmPjMs75rccYZkGUZM83HuT4gGWirDVFzzkVJ3xKkwKNiSPS94nOGzQjJp5HpNZ1qJWPlFwrYG55jD4HGNgD02FEE14sn9lbr6etEhcyXVGO2pJYEF362Kkdumb3E',   // Replace with your token that has write access
  useCdn: false
})

async function migrateSummaries() {
  // Fetch all documents with a defined summary field.
  const query = `*[_type == "powerRanking" && defined(summary)]{_id, summary}`
  const docs = await client.fetch(query)

  // If no documents are found, exit.
  if (!Array.isArray(docs) || docs.length === 0) {
    console.log('✅ No documents need migration.')
    return
  }

  console.log(`🔄 Found ${docs.length} documents with a summary field.`)

  let migratedCount = 0

  for (const doc of docs) {
    // Skip if summary is already an array (Portable Text).
    if (Array.isArray(doc.summary)) continue

    // Convert non-array summary (assumed string) to a block array.
    if (typeof doc.summary === 'string' && doc.summary.trim().length > 0) {
      const blockText = [
        {
          _type: 'block',
          _key: crypto.randomUUID(),
          style: 'normal',
          markDefs: [],
          children: [
            {
              _type: 'span',
              _key: crypto.randomUUID(),
              text: doc.summary,
              marks: []
            }
          ]
        }
      ]

      try {
        await client.patch(doc._id).set({ summary: blockText }).commit()
        console.log(`✅ Updated: ${doc._id}`)
        migratedCount++
      } catch (err) {
        console.error(`❌ Failed to update ${doc._id}:`, err.message)
      }
    }
  }

  if (migratedCount === 0) {
    console.log('✅ All summaries already formatted correctly.')
  } else {
    console.log(`🎉 Migration complete! ${migratedCount} summaries updated.`)
  }
}

migrateSummaries()
