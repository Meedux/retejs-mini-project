import { createEditor as createDefaultEditor } from './default'
import { createEditor as createPerfEditor } from './perf'
import { createEditor as createCustomEditor } from './customization'
import { createEditor as create3DEditor } from './3d'
import { createEditor as defEditor } from './editor'

const factory = {
  'default': defEditor,
  'perf': createPerfEditor,
  'defalt': createCustomEditor,
  '3d': create3DEditor
}
// eslint-disable-next-line no-restricted-globals, no-undef
const query = typeof location !== 'undefined' && new URLSearchParams(location.search)
const name = ((query && query.get('template')) || 'default') as keyof typeof factory

const createEditor = factory[name]

if (!createEditor) {
  throw new Error(`template with name ${name} not found`)
}

export {
  createEditor
}
