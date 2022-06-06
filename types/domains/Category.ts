import { setDoc, addDoc, collection, getFirestore, CollectionReference, doc, getDocs, query, where } from 'firebase/firestore'
import { Collections } from './utils/collections'
import { getGenericConverter } from './utils/genericConverger'

export type TCategory = {
  id: string
  abbreviation: string
  name: string
  isActive: boolean
  colorHex: string
}

export type TCategoryInput = Omit<TCategory, 'id' | 'isActive'>

// /user/{userId}/category/{categoryId}
export class Category {
  private collection: CollectionReference<TCategory>

  constructor(userId: string) {
    const firestore = getFirestore()
    this.collection = collection(firestore, `${Collections.user}/${userId}/${Collections.category}`)
      .withConverter(getGenericConverter<TCategory>())
  }

  public async create (data: TCategoryInput) {
    const { id } = doc(this.collection)
    const category = {
      id,
      ...data,
      isActive: true
    }
    await setDoc(doc(this.collection, id), category)
    return category
  }

  public async update (id: string, data: Partial<TCategory>): Promise<void> {
    await setDoc(doc(this.collection, id), data, { merge: true })
  }

  public async deactivate (id: string): Promise<void> {
    await this.update(id, { isActive: false })
  }

  public async getAllActive (): Promise<TCategory[]> {
    return (await getDocs(
      query(this.collection, where('isActive', '==', true))
    )).docs.map(s => s.data())
  }
}
