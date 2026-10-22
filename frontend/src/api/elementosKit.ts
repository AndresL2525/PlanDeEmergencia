import { createCrudApi } from './client'
import type { ElementoKit, ElementoKitInput } from '../types/models'

export const elementosKitApi = createCrudApi<ElementoKit, ElementoKitInput>('/elementos-kit/')
