import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { getPostList } from '@/router/api'

export const usePostList = ({
  page,
  pageSize,
  category,
  search,
  sortby
}: {
  page: number
  pageSize: number
  category: string
  search: string
  sortby: string
}) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['postListMock', page, pageSize, category, search, sortby],
    queryFn: async () => {
      const response = await getPostList(page, pageSize, category, search, sortby)
      return {
        pageInfo: response.data['page-information'],
        posts: response.data.questionPosts
      }
    }
  })
  return {
    data,
    isLoading,
    error
  }
}
