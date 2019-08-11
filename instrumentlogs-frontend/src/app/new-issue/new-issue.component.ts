import {Component, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';


@Component({
  selector: 'app-new-issue',
  templateUrl: './new-issue.component.html',
  styleUrls: ['./new-issue.component.css']
})
export class NewIssueComponent implements OnInit {

  constructor(private httpClient: HttpClient) {}
  Issue_name = '';
  issueType =  '';
  select1: any;
  choice = '';
  Instrument = '';
  MS_Instrument = '';
  LC_Instrument = '';
  PPMText: string;
  PPMNum: number;

  new_issue: {issue_name: any , instrument: any, instrument_type: string, issue_type: string, issue_params: any[]} = {
    'issue_name': '',
    'instrument': {
      'ms': '',
      'lc': ''
    },
    'instrument_type': '',
    'issue_type': '',
    'issue_params': []
  };
  FaultParams: { RT_Shift: boolean, Loss_of_Pressure: boolean, Carry_Over: boolean,
    Sensitivity: boolean, MS_Fragmentation: boolean, Fault_other: string} = {
    'RT_Shift': false,
    'Loss_of_Pressure': false,
    'Carry_Over': false,
    'Sensitivity': false,
    'MS_Fragmentation': false,
    'Fault_other': ''
  };

  QCParams: {MS2: number, PSM: number, Peptides: number, Proteins: number, PPM: string} = {
    'MS2': 0,
    'PSM': 0,
    'Peptides': 0,
    'Proteins': 0,
    'PPM': ''
  };

  ReplaceParams: {Emitter: boolean, Trap_column: string, Analytical_column: string,
    Solvent: boolean, Heated_Capillary: boolean, Ion_Source: boolean,
    LC_Replace: number, Other: string} = {
    'Emitter': false,
    'Trap_column': '',
    'Analytical_column': '',
    'Solvent': false,
    'Heated_Capillary': false,
    'Ion_Source': false,
    'LC_Replace': 0,
    'Other': ''
  };

  CleanParams: {Multiple_choices: boolean, S_Lens: boolean, Inj_Flatapole: boolean,
    HCD: boolean, Exit_Lens: boolean, Full: boolean, Clean_other: string} = {
    'Multiple_choices': false,
    'S_Lens': false,
    'Inj_Flatapole': false,
    'HCD': false,
    'Exit_Lens': false,
    'Full': false,
    'Clean_other': ''
  };

  CalibrateParams: {Calibrate_Full: boolean, IT: boolean, OT: boolean, ETD: boolean,
    High_Mass: boolean, Mass_Only: boolean,Check_Only: boolean, Calibrate_Fail_text: string} = {
    'Calibrate_Full': false,
    'IT': false,
    'OT': false,
    'ETD': false,
    'High_Mass': false,
    'Mass_Only': false,
    'Check_Only': false,
    Calibrate_Fail_text: ''
  };


  Fault_params() {
    this.new_issue['issue_params'] = [];
    for (const key in this.FaultParams) {
      if(this.FaultParams[key])
        if(key !== 'Fault_other') {
          this.new_issue['issue_params'].push(key);}
        else
          this.new_issue['issue_params'].push(this.FaultParams['Fault_other']);
    }
  }


  QC_params(): void {
    this.new_issue['issue_params'] = [];
    this.QCParams['PPM'] = this.PPMNum.toString().concat(', ', this.PPMText);
    this.new_issue['issue_params'].push(this.QCParams);
  }

  Replace_params(): void {
    this.new_issue['issue_params'] = [];
    if (this.choice === 'Trap_column' || this.choice === 'Analytical_column' || this.choice === 'Other')
      this.new_issue['issue_params'].push(this.choice, this.ReplaceParams[this.choice]);
    else if (this.choice === 'LC_Replace')
      this.new_issue['issue_params'].push('LC', this.ReplaceParams[this.choice].toString());
    else
      this.new_issue['issue_params'].push(this.choice);
  }

  Clean_params(): void {
    this.new_issue['issue_params'] = [];
    for(const key in this.CleanParams) {
      if(this.CleanParams[key])
        if(key !== 'Clean_other')
          this.new_issue['issue_params'].push(key);
        else
          this.new_issue['issue_params'].push(this.CleanParams['Clean_other']);
    }
  }

  Calibrate_params(): void {
    this.new_issue['issue_params'] = [];
    for(const key in this.CalibrateParams) {
      if(this.CalibrateParams[key])
        if(key !== 'Calibrate_Fail_text')
          this.new_issue['issue_params'].push(key);
        else
          this.new_issue['issue_params'].push(this.CalibrateParams['Calibrate_Fail_text']);
    }
  }
  Issue_Type_Select(): void {
    this.issueType = this.select1;
    this.new_issue['issue_type'] = this.select1;
  }

  isSelected(name: string): boolean {
    if (!this.issueType) {
      return false;
    }
    return (this.issueType === name);
  }

  InstrumentSelect() {
    this.new_issue['instrument']['ms'] = this.MS_Instrument;
    this.new_issue['instrument']['lc'] = this.LC_Instrument;
    // if (this.Instrument === 'MS') {
    //   this.new_issue['instrument'] = this.MS_Instrument;
    //   this.new_issue['instrument_type'] = 'ms';
    // } if (this.Instrument === 'LC') {
    //   this.new_issue['instrument'] = this.LC_Instrument;
    //   this.new_issue['instrument_type'] = 'lc';
    // }
  }



  onSubmit() {


    switch (this.select1) {
      case 'Fault': this.Fault_params();
        break;
      case 'QC': this.QC_params();
        break;
      case 'Maintenance - Replace': this.Replace_params();
        break;
      case 'Maintenance - Clean': this.Clean_params();
        break;
      case 'Maintenance - Calibrate': this.Calibrate_params();
        break;
    }

    console.log(this.new_issue);
    this.new_issue['issue_name'] = this.Issue_name;
    console.log(this.new_issue);
    console.log(typeof(this.ReplaceParams[this.choice]));
    this.httpClient.post('jiralog/new/', this.new_issue )
      .subscribe(

    (response) => {
          console.log(response);
          alert('log was added successfully!');
        },
        (error) => {
          console.log(error);
          alert('Failed adding new log');
        }
      );

  }

  ngOnInit() {
  }

}
