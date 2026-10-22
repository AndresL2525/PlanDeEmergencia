// Tipos de los 4 recursos que expone la API de Django.
// Los valores de las opciones (categoria, nivel, etc.) deben coincidir con los "choices" del backend.

import type { PlanIA } from './planIA'

export type CategoriaRiesgo = 'natural' | 'tecnologico' | 'sanitario' | 'social'
export type NivelPeligrosidad = 'bajo' | 'medio' | 'alto'
export type CategoriaKit =
  | 'agua_alimentos'
  | 'botiquin'
  | 'documentos'
  | 'herramientas'
  | 'higiene'
  | 'comunicacion'
export type TipoVivienda = 'casa' | 'apartamento' | 'finca' | 'otro'

interface Timestamps {
  creado_en: string
  actualizado_en: string
}

export interface TipoRiesgo extends Timestamps {
  id: number
  nombre: string
  descripcion: string
  categoria: CategoriaRiesgo
  nivel_peligrosidad: NivelPeligrosidad
  activo: boolean
}

export interface Protocolo extends Timestamps {
  id: number
  tipo_riesgo: number
  titulo: string
  objetivo: string
  acciones_antes: string
  acciones_durante: string
  acciones_despues: string
  linea_emergencia: string
}

export interface ElementoKit extends Timestamps {
  id: number
  nombre: string
  descripcion: string
  categoria: CategoriaKit
  cantidad_sugerida: number
  unidad: string
  es_esencial: boolean
  tipos_riesgo: number[]
}

export interface PlanFamiliar extends Timestamps {
  id: number
  nombre_familia: string
  responsable: string
  telefono_responsable: string
  direccion: string
  ciudad: string
  tipo_vivienda: TipoVivienda
  numero_integrantes: number
  tiene_ninos: boolean
  tiene_adultos_mayores: boolean
  tiene_personas_discapacidad: boolean
  tiene_mascotas: boolean
  condiciones_medicas: string
  punto_encuentro: string
  medio_comunicacion: string
  contacto_emergencia_nombre: string
  contacto_emergencia_telefono: string
  riesgos: number[]
  protocolo_recomendado: number | null
  elementos_kit: number[]
  plan_ia: PlanIA | null
  fecha_generacion_ia: string | null
}

// Datos que se envían al crear o editar (sin campos que genera el servidor).
type CamposServidor = 'id' | keyof Timestamps

export type TipoRiesgoInput = Omit<TipoRiesgo, CamposServidor>
export type ProtocoloInput = Omit<Protocolo, CamposServidor>
export type ElementoKitInput = Omit<ElementoKit, CamposServidor>
export type PlanFamiliarInput = Omit<PlanFamiliar, CamposServidor | 'plan_ia' | 'fecha_generacion_ia'>
