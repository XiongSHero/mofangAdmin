/* eslint-disable */
export default {
  mf_get (path, vm, msg = '') {
    return new Promise((resolve, reject) => {
      axios.get(path).then((res) => {
        if (res.status === 200 && res.data.code === 200) {
          resolve(res)
        } else {
          this.mf_msg('error', '获取' + msg + '失败，请刷新或联系管理员', vm)
        }
      }).catch((err) => {
        reject(err)
        this.mf_msg('error','服务器崩溃，请联系网管', vm)
      })
    })
  },
  mf_post (path, data, vm, msg = '') {
    return new Promise((resolve, reject) => {
      axios.post(path, data).then((res) => {
        if (res.status === 200&& res.data.code === 200) {
          resolve(res.data.msg)
        } else {
          reject()
          this.mf_msg('error', msg + '失败，请刷新或联系管理员', vm)
        }
      }).catch((err) => {
        reject(err)
        this.mf_msg('error','服务器崩溃，请联系网管', vm)
      })
    })
  },
  mf_msg (type, msg, vm) {
    vm.$message({
      type: type,
      message: msg
    })
  },
  getSession (str) {
    return JSON.parse(localStorage.getItem(str))
  },
  addTwo (num) {
    return num < 10 ? '0' + num : '' + num
  },
  timeSerialize (date) {
    const y = date.getFullYear()
    const m = date.getMonth()
    const d = date.getDate()
    const h = date.getHours()
    const f = date.getMinutes()
    const s = date.getSeconds()
    return y + '-' + this.addTwo(m + 1) + '-' + this.addTwo(d) + ' '
      + this.addTwo(h) + ':' + this.addTwo(f) + ':' + this.addTwo(s)
  }
}
