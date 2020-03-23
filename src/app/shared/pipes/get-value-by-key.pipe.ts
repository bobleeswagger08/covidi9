import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: "getValueByKey",
  pure: false
})
export class GetValueByKeyPipe implements PipeTransform {
  transform(value: any[], id: number, property: string): any {
    console.log(id);
    const filteredObj = value.find(item => {
      if (item.moduleId !== undefined) {
        return item.moduleId === id;
      }

      return false;
    });

    if (filteredObj) {
      return filteredObj[property];
    }
  }
}
