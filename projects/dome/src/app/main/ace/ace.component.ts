import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-ace',
  templateUrl: './ace.component.html',
  styleUrls: ['./ace.component.css']
})
export class AceComponent implements OnInit {
  public validateForm: FormGroup;
  public aclOptions = {
    maxLines: 4,
    minLines: 4,
  };
  public aceText = '';
  constructor(
    private fb: FormBuilder,
  ) { }

  ngOnInit() {
    this.validateForm = this.fb.group({
      ace: ['select * from t', [Validators.required]]
    });
  }

  public change(value): void {
    console.log(value);
  }

  public submitForm(): void {
    console.log(this.validateForm.value);
  }

}
