import {
  setDoc,
  collection,
  getFirestore,
  CollectionReference,
  doc,
  getDocs,
  query,
  orderBy,
  where,
  writeBatch,
} from 'firebase/firestore'
import { Collections } from './utils/collections'
import { getGenericConverter } from './utils/genericConverger'
import * as yup from 'yup'
import { InputErrorsMap, Validator } from '../utils/validator'

export type TCategory = {
  id: string
  abbreviation: string
  name: string
  isActive: boolean
  colorHex: string
  order: number
}

export type TCategoryInput = Omit<TCategory, 'id' | 'isActive'>

// /user/{userId}/category/{categoryId}
export class Category {
  private collection: CollectionReference<TCategory>

  constructor(
    userId: string,
    private validator: Validator = new CategoryValidator(yup)
  ) {
    const firestore = getFirestore()
    this.collection = collection(
      firestore,
      `${Collections.user}/${userId}/${Collections.category}`
    ).withConverter(getGenericConverter<TCategory>())
  }

  public async create (data: TCategoryInput): Promise<void | InputErrorsMap> {
    const { id } = doc(this.collection)
    const nrOfAllCategories = (await this.getAll()).length + 1
    const category = {
      id,
      ...data,
      isActive: true,
      order: nrOfAllCategories
    }
    const errors = await this.validator.validate(data)
    return errors
      ? errors
      : await setDoc(doc(this.collection, id), category)
  }

  public async update (
    id: string,
    data: Partial<TCategory>
  ): Promise<void | InputErrorsMap> {
    const errors = await this.validator.validate(data)
    return errors
      ? errors
      : await setDoc(doc(this.collection, id), data, { merge: true })
  }

  public async deactivate (id: string): Promise<void> {
    await this.update(id, { isActive: false })
  }

  public async getAll (): Promise<TCategory[]> {
    return (await getDocs(this.collection)).docs.map(s => s.data())
  }

  public async getAllActive (): Promise<TCategory[]> {
    return (
      await getDocs(query(this.collection, orderBy('order', 'asc'), where('isActive', '==', true)))
    ).docs.map((s) => s.data())
  }

  public async swapOrder (categoryA: TCategory, categoryB: TCategory): Promise<void> {
    const { order: orderA } = categoryA
    const { order: orderB } = categoryB
    const batch = writeBatch(getFirestore())
    batch.update(doc(this.collection, categoryA.id), {
      order: orderB
    })
    batch.update(doc(this.collection, categoryB.id), {
      order: orderA
    })
    await batch.commit()
  }
}

class CategoryValidator extends Validator {
  schema: any
  constructor(yup: any) {
    super(yup)
    this.schema = this.yup.object().shape({
      abbreviation: this.yup
        .string()
        .required()
        .length(2, 'Abbreviation has to be 2 characters long.'),
      name: this.yup.string(),
      colorHex: this.yup.string().required().matches(/^#[0-9a-f]{6}$/i, 'This is not valid hex color.')
    })
  }
}
