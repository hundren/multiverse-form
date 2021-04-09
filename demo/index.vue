<template>
    <form-list
      ref="formRef"
      :fieldListMaker="fieldListMaker"
      @change="handleFormChange"
      @onClickSubmit="handleSubmit"
    ></form-list>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import FormList from '../form/index.vue'
import options from './options'
@Component({
  components: {
    FormList
  },
  mixins: [options]
})
export default class FormDemo extends Vue {
  handleFormChange(formData: any, oldFormData: any) {
  
  }
  
}
</script>

<style lang="less" scoped>
</style>
