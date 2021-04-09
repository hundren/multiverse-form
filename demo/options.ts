import { Component, Vue } from 'vue-property-decorator'
import { fieldType } from '../form/fieldType'
@Component
export default class Options extends Vue {
  fieldListMaker(formData: any): Array<fieldType> {
    return [
      {
        fieldType: 'text',
        key: 'abc',
        label: 'def',
      },
    ]
  }
}

