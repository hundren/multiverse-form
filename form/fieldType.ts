export interface fieldType {
  fieldType: keyof formTypes
  key: string
  dict?: string
  type?: string
  name?: string
  label?: string
  placeholder?: string
  required?: boolean
  isShow?: Function //是否显示
  dateType?: 'date' | 'time' | 'year-month' | 'month-day' | 'datetime'
  readonly?: boolean
  rules?: rule[]
  isWrap?: boolean
  hiddenLabel? :boolean
  extraKey?: string | extraKeyType[]
  stepList?: stepModel[],
  formDataFormatter?: Function //格式化函数
  formDataConvert?: Function // 转换成多个其他值
  propShowValue?:string //显示的字段
  handleChange?: Function
  [k: string]: any
}
export interface formTypes {
  slot?: any,
  divider?: any,
  text: any,
}
export interface rule {
  required?: boolean,
  message?: string | Function
  validator?: any
  pattern?: any
  trigger?: 'onChange' | 'onBlur'
  formatter?: Function
}
export interface stepModel {
  key: string
  typename: string
  disabled?: boolean
  limit?: number
}
