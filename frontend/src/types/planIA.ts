// Estructura del plan de emergencia que genera la IA.
// Django valida este JSON antes de enviarlo al frontend.

import type { NivelPeligrosidad } from './models'

export interface InformacionGeneral {
  titulo: string
  resumen: string
  nivel_riesgo_general: NivelPeligrosidad
}

export interface RiesgoIdentificado {
  tipo_riesgo_id: number | null
  nombre: string
  nivel: NivelPeligrosidad
  justificacion: string
}

export interface AccionPreventiva {
  accion: string
  prioridad: NivelPeligrosidad
  responsable: string
}

export interface PasoAccion {
  paso: number
  accion: string
}

export interface ElementoKitIA {
  elemento_kit_id: number | null
  nombre: string
  cantidad: number
  unidad: string
  motivo: string
}

export interface ProtocoloRecomendado {
  protocolo_id: number | null
  titulo: string
  motivo: string
}

export interface PuntoEncuentro {
  principal: string
  alternativo: string
  indicaciones: string
}

export interface ContactoEmergencia {
  nombre: string
  telefono: string
  relacion: string
}

export interface MedioComunicacion {
  principal: string
  alternativo: string
  contactos: ContactoEmergencia[]
}

export interface PlanIA {
  informacion_general: InformacionGeneral
  riesgos_identificados: RiesgoIdentificado[]
  acciones_preventivas: AccionPreventiva[]
  acciones_durante: PasoAccion[]
  acciones_despues: PasoAccion[]
  kit_emergencia: ElementoKitIA[]
  protocolo_recomendado: ProtocoloRecomendado
  punto_encuentro: PuntoEncuentro
  medio_comunicacion: MedioComunicacion
  recomendaciones_adicionales: string[]
}
