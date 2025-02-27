import { AxiosAdapter } from '@adapters/axios-adapter'

let axiosAdapterInstance: AxiosAdapter | null = null

export const getAxiosAdapter = () => {
  if (!axiosAdapterInstance) {
    axiosAdapterInstance = new AxiosAdapter()
  }

  return axiosAdapterInstance
}
