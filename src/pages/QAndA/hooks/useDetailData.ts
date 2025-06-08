import { getDetail } from '@/router/api'
import { useQuery } from '@tanstack/react-query'

export const useDetailData = ({ id }: { id: number }) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['postItem', id],
    queryFn: async () => {
      const response = await getDetail(id)
      return {
        answer: response.data['Answers'],
        question: response.data['QuestionPost']
      }
    }
  })
  return {
    data,
    isLoading,
    error
  }
}
