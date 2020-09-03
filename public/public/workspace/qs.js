window.qs = {
    parse: (string) => {
      let obj = {}
      let keyValues = string.split('&')
      keyValues.map(_keyValue => {
        let key = _keyValue.split('=')[0]
        let value = decodeURIComponent(_keyValue.split('=')[1])
        obj[key] = value
      })
      return obj
    }
  }