
import { LuxonDateAdapter } from '@adapters/luxon-date-adapter'

let luxonAdapterInstance: LuxonDateAdapter | null = null

export const getLuxonDateAdapter = () => {
  if (!luxonAdapterInstance) {
    luxonAdapterInstance = new LuxonDateAdapter()
  }

  return luxonAdapterInstance
}
