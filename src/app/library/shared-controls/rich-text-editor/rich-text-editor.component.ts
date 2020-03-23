import { Component, OnInit, forwardRef, OnDestroy } from '@angular/core';
import * as jsPDF from 'jspdf';
import { EditorService } from '../../../services/shared/editor.service';
import { AppError } from 'app/shared/commonerror/app-error';
import { BadInput } from 'app/shared/commonerror/bad-input';
import { FormGroup, FormBuilder, NG_VALUE_ACCESSOR, ControlValueAccessor, Validators, FormControl } from '@angular/forms';
import { Subscription } from 'rxjs';
export interface RichTextEditorFormValues {
  richTextEditor: any;
}

@Component({
  selector: 'app-rich-text-editor',
  templateUrl: './rich-text-editor.component.html',
  styleUrls: [
    './rich-text-editor.component.css'
  ],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => RichTextEditorComponent),
      multi: true
    }]
})
export class RichTextEditorComponent implements OnInit,ControlValueAccessor, OnDestroy {
  editorform: FormGroup;
  subscriptions: Subscription[] = [];
  get value(): RichTextEditorFormValues {
    return this.editorform.value;
  }

  set value(value: RichTextEditorFormValues) {
    this.editorform.setValue(value);
    this.onChange(value);
    this.onTouched();
  }

  get textEditorControl() {
    return this.editorform.controls.richTextEditor;
  }

  // editorData = `<h1> Angular material admin</h1>
  // <p><a href="http://devegret.com" target="_blank"><strong>DevEgret</strong></a></p>
  // <p><br></p><p><strong >Lorem Ipsum</strong>
  // <span>&nbsp;is simply dummy text of the printing and typesetting industry. 
  // Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a 
  // galley of type and scrambled it to make a type specimen book. It has survived not only five centuries</span></p>`;
  editorData="";
  constructor(private formBuilder: FormBuilder) { 
    this.editorform = this.formBuilder.group({
      richTextEditor: [],
    });
    this.subscriptions.push(
      // any time the inner form changes update the parent of any change
      this.editorform.valueChanges.subscribe(value => {
        this.onChange(value);
        this.onTouched();
      })
    );
  }

  ngOnInit() {
  }
  ngOnDestroy() {
    this.subscriptions.forEach(s => s.unsubscribe());
  }

  onChange: any = () => {};
  onTouched: any = () => {};

  registerOnChange(fn) {
    this.onChange = fn;
  }
  writeValue(value) {
    if (value) {
      this.value = value;
    }

    if (value === null) {
      this.editorform.reset();
    }
  }

  registerOnTouched(fn) {
    this.onTouched = fn;
  }
  
  printContent(){
    let printContents = document.getElementsByClassName('ql-editor');
    console.log(printContents[0]);
    let popupWin = window.open("", "_blank", "top=0,left=0,height=auto,width=auto");
    popupWin.document.write(printContents[0].innerHTML);
    popupWin.document.close();
    popupWin.focus();
    popupWin.print();
    popupWin.close();
    
  }
  // saveToDataBase(){
  //   let printContents = document.getElementsByClassName('ql-editor');
  //   this.service.create(printContents)
  //     .subscribe(newEditor=>{
  //     },(error:AppError)=>{
  //       if(error instanceof BadInput){
  //       }
  //       else throw error;
  //     });
  // }
  download(){
    let pdf = new jsPDF('p', 'pt', 'a4'); 
    let source = document.getElementsByClassName('ql-editor')[0];
  

        let  specialElementHandlers = {
          // element with id of "bypass" - jQuery style selector
          '#bypassme': function (element, renderer) {
              // true = "handled elsewhere, bypass text extraction"
              return true
          }
      };
      let margins = {
        top: 80,
        bottom: 60,
        left: 40,
        width: 522
    };
    pdf.fromHTML(
      source, // HTML string or DOM elem ref.
      margins.left, // x coord
      margins.top, { // y coord
          'width': margins.width, // max width of content on PDF
          'elementHandlers': specialElementHandlers
      },

      function (dispose) {
        // dispose: object with X, Y of the last line add to the PDF 
        //          this allow the insertion of new lines after html
        pdf.save('hmcDocument.pdf');
    }, margins);

  }


  onContentChanged() { }
  onSelectionChanged() { }
}
