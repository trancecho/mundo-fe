// hooks/useTagsMenu.ts
import { useEffect, useState } from 'react'
import { fetchTags as fetchTagsApi } from '@/router/api'
import { Tag, GroupedTags } from '@/interfaces/post'

export const useTagsMenu = () => {
  const [tagsGrouped, setTagsGrouped] = useState<GroupedTags>({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchTags = async () => {
      try {
        const response = await fetchTagsApi()

        const tags: Tag[] = response.data.data.tags

        const grouped: GroupedTags = {}
        tags.forEach(tag => {
          if (!grouped[tag.category]) {
            grouped[tag.category] = []
          }
          grouped[tag.category].push(tag)
        })

        setTagsGrouped(grouped)
      } catch (err) {
        console.error('获取标签失败', err)
      } finally {
        setLoading(false)
      }
    }

    fetchTags()
  }, [])

  return { tagsGrouped, loading }
}
