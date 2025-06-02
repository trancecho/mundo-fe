export interface Tag {
  id: number
  name: string
  category: string
  description: string
}

export interface GroupedTags {
  [category: string]: Tag[]
}

export interface Post {
  id: number
  uid: number
  title: string
  content: string
  picture: string[]
  view: number
  collection: number
  is_completed: boolean
  status: 'approved' | 'pending' | 'rejected'
  answer_count: number
  tags: string[]
  exam?: boolean
  official?: boolean
  created_at?: string
}
