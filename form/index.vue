<template>
  <van-form @submit="handleSubmit" ref="vanFormRef" scroll-to-error>
    <div>
      <template v-for="fieldItem in fieldList">
        <van-row class="view-divider" :key="fieldItem.key" v-if="fieldItem.fieldType === 'divider' && (!fieldItem.isShow || (fieldItem.isShow && fieldItem.isShow(formData)))"></van-row>
        <slot v-else-if="fieldItem.fieldType === 'slot' && (!fieldItem.isShow || (fieldItem.isShow && fieldItem.isShow(formData)))" :name="fieldItem.key" v-bind:value="formData"></slot>
        <component
          v-else-if="formRegister[fieldItem.fieldType] && (!fieldItem.isShow || (fieldItem.isShow && fieldItem.isShow(formData)))"
          :key="fieldItem.key"
          :is="formRegister[fieldItem.fieldType]"
          :fieldItem="fieldItem"
          v-bind="fieldItem"
          v-model="formData[fieldItem.key]"
          @extraChange="setKeyValue"
        ></component>
      </template>
    </div>
  </van-form>
</template>
<script lang="ts">
import { Component, Prop, Vue, Watch, Model } from 'vue-property-decorator'
import { Field, Button, Stepper, Form, Row, Col } from 'vant'
import { fieldType, rule } from './fieldType'
import debounce from 'lodash/debounce'
import formRegister from './form-register'
import cloneDeep from 'lodash/cloneDeep'
@Component({
  name: 'FormList',
  components: {
    [Field.name]: Field,
    [Button.name]: Button,
    [Form.name]: Form,
    [Row.name]: Row,
    [Col.name]: Col,
    [Stepper.name]: Stepper,
  }
})
export default class FormList extends Vue {
  @Prop({ type: Boolean, default: () => false })
  showBtn!: boolean
  @Prop({ type: String, default: () => '确认' })
  btnWord!: string
  @Prop({ type: Boolean, default: () => false })
  isSubBtnValidate!: boolean
  @Prop({ type: Object })
  btnProps!: btnPropsType
  @Prop({ type: Object, default: ()=>{ return {} } })
  formParam!: btnPropsType
  @Prop({
    type: Function,
    default: () => {
      return []
    }
  })
  fieldListMaker!: Function
  @Model('modelChange')
  value!: any //暂时只做emit同步显示用
  private fieldList: fieldType[] = []
  public formData: any = {}
  private formRegister = formRegister
  get formDataString() {
    return JSON.stringify(this.formData)
  }

  @Watch('formDataString', { immediate: true, deep: false })
  formDataChanged(val: any, oldVal: any) {
    if (val !== oldVal) {
      this.updateBindValue()
      this.$emit('change', JSON.parse(val), oldVal ? JSON.parse(oldVal) : {})
      this.$emit('modelChange', JSON.parse(val))
      // 个别节点变更方法处理
      this.handleNodeValueChange(JSON.parse(val), oldVal ? JSON.parse(oldVal) : {})
    }
  }

  handleNodeValueChange(formData:any, oldFormData:any) {
    this.fieldList.forEach((fieldItem:fieldType) => {
      if(fieldItem.handleChange && typeof fieldItem.handleChange === 'function') {
        if(formData[fieldItem.key] && oldFormData[fieldItem.key] && formData[fieldItem.key] !== oldFormData[fieldItem.key]) {
          fieldItem.handleChange(formData)
        }
      }
    })
  }

  created() {
    this.fieldList.forEach(item => {
      if (
        item &&
        (item.defaultValue !== null && item.defaultValue !== undefined)
      ) {
        this.$set(this.formData, item.key, item.defaultValue)
      }
    })
  }

  updateFieldList() {
    this.fieldList = this.fieldListMaker(this.formData, this.formParam)
  }

  updateDefaultValue() {
    this.updateFieldList()
    this.fieldList.forEach(item => {
      if (
        item &&
        (item.defaultValue !== null && item.defaultValue !== undefined)
      ) {
        this.$set(this.formData, item.key, item.defaultValue)
      }
    })
  }

  updateBindValue() {
    this.updateFieldList()
    this.fieldList.forEach(item => {
      if (item && (item.bindValue !== null && item.bindValue !== undefined)) {
        this.$set(this.formData, item.key, item.bindValue)
      }
    })
  }

  setKeyValue(key: string, value: any) {
    this.$set(this.formData, key, value)
  }

  private handleSubmit = debounce(this.onSubmit, 1200, {
    leading: true,
    trailing: false
  })
  onSubmit() {
    this.$emit('onClickSubmit', this.getFormatData())
    return this.getFormatData()
  }

  handleSubClick(form: any): any {
    if (this.isSubBtnValidate) {
      const vanFormRef: any = this.$refs['vanFormRef']
      vanFormRef.validate().then((res: any) => {
        this.$emit('onSubClick', this.formData)
      })
    } else {
      this.$emit('onSubClick', this.formData)
    }
  }

  getFromRef(): any {
    return this.$refs['vanFormRef']
  }

  validate() {
    const vanFormRef: any = this.$refs.vanFormRef
    return vanFormRef.validate()
  }

  resetValidation() {
    const vanFormRef: any = this.$refs.vanFormRef
    vanFormRef.resetValidation()
  }

  // 都是提交的时候用
  getFormatData() {
    let _formData = cloneDeep(this.formData)
    this.fieldList.forEach((item:fieldType) => {
      // 增加转化字段
      if (
        item &&
        (item.formDataConvert && typeof item.formDataConvert === 'function')
      ) {
        _formData = { ..._formData, ...item.formDataConvert(_formData[item.key], _formData) }
      }
      // 替换原有字段的格式化处理
      if (
        item &&
        (item.formDataFormatter && typeof item.formDataFormatter === 'function')
      ) {
        _formData[item.key] = item.formDataFormatter(_formData[item.key], _formData)
      }
    })
    return _formData
  }
}
export { fieldType, rule }
</script>
<style lang="less" scoped>
.view-divider {
  height: 10px;
}
.btn-layout {
  padding: 16px;
  background-color: white;
  height: 44px;
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 100;
  .btn-submit {
    border-radius: 8px;
  }
}
.footer-btn__box {
  height: 100%;
}
</style>
