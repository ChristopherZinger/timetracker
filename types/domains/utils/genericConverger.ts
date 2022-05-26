import { QueryDocumentSnapshot } from 'firebase/firestore'

export const getGenericConverter = <T> () => ({
  toFirestore (data: T): T {
    return data as T
  },
  fromFirestore (snapshot: QueryDocumentSnapshot): T {
    return snapshot.data() as T
  }
})