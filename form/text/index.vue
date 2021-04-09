<template>
    <van-field
      :value="value"
      @input="handleChange"
      :class="{'field_wrap flex_direction_column':fieldItem.isWrap,[fieldItem.classNames]:fieldItem.classNames}"
      :input-align="fieldItem.inputAlign?fieldItem.inputAlign:'right'"
      :error-message-align="fieldItem.errorAlign?fieldItem.errorAlign:'right'"
      :name="fieldItem.key || ''"
      :clickable="fieldItem.clickable"
      :placeholder="!fieldItem.noPlaceholder ? (fieldItem.placeholder || '请输入') : ''"
      @click-right-icon="fieldItem.clickRightIcon?fieldItem.clickRightIcon():null"
      @blur="fieldItem.onBlur?fieldItem.onBlur(value):null"
      @focus="fieldItem.onFocus?fieldItem.onFocus(value):null"
      v-bind="fieldItem"
      @click="fieldItem.onClick?fieldItem.onClick(value):null"
      @keyup.enter.native="fieldItem.onEnter?fieldItem.onEnter(value):null"
    >
      <template #extra v-if="fieldItem.unit">
        <span class="unit">{{fieldItem.unit}}</span>
      </template>
    </van-field>
</template>
<script lang='ts'>
import { Component, Vue, Prop, Model } from 'vue-property-decorator'
import { Field } from 'vant'
import { fieldType } from '../fieldType'

@Component({
  components: {
    [Field.name]: Field
  }
})
export default class FormText extends Vue {
  @Prop()
  fieldItem!: fieldType
  @Model('change')
  value!: string
  handleChange(value:string) {
    if(this.fieldItem.toUpperCase && typeof value === 'string') {
      this.$emit('change', value.toUpperCase())
    }else{
      this.$emit('change', value)
    }
  }
}
</script>
<style lang="less" scoped>
.unit {
  color: @font-color-hint;
  margin-left: 10px;
}
</style>
