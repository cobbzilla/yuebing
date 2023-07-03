import ar_messages from './ar_messages'
import bn_messages from './bn_messages'
import de_messages from './de_messages'
import en_messages from './en_messages'
import es_messages from './es_messages'
import fr_messages from './fr_messages'
import ha_messages from './ha_messages'
import hi_messages from './hi_messages'
import id_messages from './id_messages'
import it_messages from './it_messages'
import ja_messages from './ja_messages'
import ko_messages from './ko_messages'
import mr_messages from './mr_messages'
import pl_messages from './pl_messages'
import pt_messages from './pt_messages'
import ru_messages from './ru_messages'
import sw_messages from './sw_messages'
import tl_messages from './tl_messages'
import tr_messages from './tr_messages'
import ur_messages from './ur_messages'
import vi_messages from './vi_messages'
import zh_messages from './zh_messages'

const UNKNOWN_MESSAGE_PREFIX : string = '???'

const unknownMessage = (msg : string) : string => UNKNOWN_MESSAGE_PREFIX + msg
export const isUnknownMessage = (msg : string) : boolean => !msg || msg.startsWith(UNKNOWN_MESSAGE_PREFIX)

const messageNotFoundHandler = {
    get (target : any, name : any) : string | boolean {
        if (typeof name === 'undefined') return unknownMessage('undefined')
        if (name === null) return unknownMessage('null')
        if (name === '') return unknownMessage('empty')
        const checkExists = name.toString().startsWith('!')
        const index = checkExists ? name.toString().substring(1) : name
        if (target.hasOwnProperty(index)) return checkExists ? true : target[index]
        const altName = index.toString().replace(/\./g, '_')
        if (target.hasOwnProperty(altName)) return checkExists ? true : target[altName]
        return checkExists ? false : unknownMessage(name.toString())
    }
}

const wrapMessages = (messages : Record<string, string>) : Record<string, string> => new Proxy(Object.assign({}, messages), messageNotFoundHandler)

export const MESSAGES : Record<string, Record<string, string>> = {
    ar: wrapMessages(ar_messages),
    bn: wrapMessages(bn_messages),
    de: wrapMessages(de_messages),
    en: wrapMessages(en_messages),
    es: wrapMessages(es_messages),
    fr: wrapMessages(fr_messages),
    ha: wrapMessages(ha_messages),
    hi: wrapMessages(hi_messages),
    id: wrapMessages(id_messages),
    it: wrapMessages(it_messages),
    ja: wrapMessages(ja_messages),
    ko: wrapMessages(ko_messages),
    mr: wrapMessages(mr_messages),
    pl: wrapMessages(pl_messages),
    pt: wrapMessages(pt_messages),
    ru: wrapMessages(ru_messages),
    sw: wrapMessages(sw_messages),
    tl: wrapMessages(tl_messages),
    tr: wrapMessages(tr_messages),
    ur: wrapMessages(ur_messages),
    vi: wrapMessages(vi_messages),
    zh: wrapMessages(zh_messages),
}
