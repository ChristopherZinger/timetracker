import {
  setDoc,
  collection,
  getFirestore,
  CollectionReference,
  doc,
  getDocs,
  query,
  where
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
    const category = {
      id,
      ...data,
      isActive: true
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

  public async getAllActive (): Promise<TCategory[]> {
    return (
      await getDocs(query(this.collection, where('isActive', '==', true)))
    ).docs.map((s) => s.data())
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
