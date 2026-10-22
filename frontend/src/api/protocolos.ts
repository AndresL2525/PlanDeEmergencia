import { createCrudApi } from './client'
import type { Protocolo, ProtocoloInput } from '../types/models'

export const protocolosApi = createCrudApi<Protocolo, ProtocoloInput>('/protocolos/')
