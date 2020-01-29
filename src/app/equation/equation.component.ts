import { Component, OnInit } from "@angular/core";
import { FormGroup, FormControl } from "@angular/forms";
import { delay, filter, scan } from "rxjs/operators";
import { MathValidators } from "../math-validators";

@Component({
  selector: "app-equation",
  templateUrl: "./equation.component.html",
  styleUrls: ["./equation.component.css"]
})
export class EquationComponent implements OnInit {
  secondPerSolution = 0;
  mathForm = new FormGroup(
    {
      a: new FormControl(this.randomNumber()),
      b: new FormControl(this.randomNumber()),
      answer: new FormControl("")
    },
    [MathValidators.addition("answer", "a", "b")]
  );

  constructor() {}

  get a() {
    return this.mathForm.value.a;
  }

  get b() {
    return this.mathForm.value.b;
  }

  ngOnInit() {
    // const startTime = new Date();
    // let numberSolved = 0;

    this.mathForm.statusChanges
      .pipe(
        filter(el => el === "VALID"),
        delay(250),
        scan(
          (acc, value) => {
            return {
              numberSolved: acc.numberSolved + 1,
              startTime: acc.startTime
            };
          },
          { numberSolved: 0, startTime: new Date() }
        )
      )
      .subscribe(({ numberSolved, startTime }) => {
        // numberSolved += 1;
        this.secondPerSolution =
          (new Date().getTime() - startTime.getTime()) / numberSolved / 1000;

        this.mathForm.setValue({
          a: this.randomNumber(),
          b: this.randomNumber(),
          answer: ""
        });
      });
  }

  randomNumber() {
    return Math.floor(Math.random() * 10);
  }
}
