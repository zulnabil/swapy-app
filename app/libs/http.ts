export const HttpHelper = {
  axiosErrorHandler: (error: any) => {
    if (error.response) {
      if (error.response.data) return error.response.data
      else if (error.response.status) return error.response.status
      else if (error.response.headers) return error.response.headers
    } else if (error.request) {
      return error.request
    } else {
      return error.message
    }
  },
}
