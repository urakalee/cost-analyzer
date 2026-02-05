import { Platform, ParseResult } from '@/types/transaction'
import { parseAlipayCSV } from './alipayParser'
import { parseWechatExcel } from './wechatParser'
import { parseJDCSV } from './jdParser'

export const parseFile = async (file: File, platform: Platform): Promise<ParseResult> => {
  switch (platform) {
    case 'alipay':
      return parseAlipayCSV(file)
    case 'wechat':
      return parseWechatExcel(file)
    case 'jd':
      return parseJDCSV(file)
    default:
      return {
        transactions: [],
        errors: [`不支持的平台: ${platform}`]
      }
  }
}

export { parseAlipayCSV, parseWechatExcel, parseJDCSV }
