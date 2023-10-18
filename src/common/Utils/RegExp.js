
export function passwordRegExp({ password, oldPassword, newPassWord }) {
    if (!password || (typeof password !== 'string')) return ''
    const length = password.length
    let Message = null
    const rule = [
        { regx: /^[a-zA-Z\d(~!@#$%^&*_\-+=`|(){}\[\]:;"'<>,.?/)]{8,16}$/, message: '使用8-16位大小写英文字母、数字和特殊符号的组合' },
        { regx: /^(?=.*?[A-Z]).{8,16}$/, message: '密码必须包含一个大写英文字母' },
        { regx: /^(?=.*?[\d]).{8,16}$/, message: '密码必须包含一个数字' },
        { regx: /^(?=.*?[A-Z])(?=.*?[\d])(?=.*?[(~!@#$%^&*_\-+=`|(){}\[\]:;"'<>,.?/)]).{8,16}$/, message: '密码必须包含一个特殊符号(如!, $, #, %)' },
    ]
    if (length < 8) {
        return '密码不能少于8位'
    }
    if (length > 16) {
        return '密码不能超过16位'
    }
    for (const i of rule) {
        const { regx, message } = i
        if (!regx.test(password)) {
            Message = message
            break
        }
    }
    if (Message) return Message
    oldPassword ? (oldPassword === password ? (Message = '新密码不能和旧密码相同') : null) : null; if (Message) return Message
    newPassWord ? (newPassWord === password ? null : (Message = '两次密码输入不一致')) : null; if (Message) return Message
    return Message
}