import {Component, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';

import {PlotlyModule} from 'angular-plotly.js';
import * as PlotlyJS from 'plotly.js/dist/plotly.js';
import {forEach} from "@angular/router/src/utils/collection";
import {isString} from "util";
import {FormArray} from "@angular/forms";
import {DataService} from "../data.service";
import {max} from "rxjs/operators";

// import {type} from "os";


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  private INSTRUMENT_FUSION1 = 'Fusion1';
  private INSTRUMENT_HF1 = 'HF1';
  private INSTRUMENT_HF2 = 'HF2';
  private INSTRUMENT_HFX = 'HFX';
  private INSTRUMENT_QEP2 = 'QEP2';
  private INSTRUMENTS = [this.INSTRUMENT_FUSION1, this.INSTRUMENT_HF1, this.INSTRUMENT_HF2, this.INSTRUMENT_HFX, this.INSTRUMENT_QEP2];

  private ISSUE_TYPE_QC = 'QC';
  private ISSUE_TYPE_FAULT = 'Fault';
  private ISSUE_TYPE_CLEAN = 'Maintenance - Clean';
  private ISSUE_TYPE_CALIBRATE = 'Maintenance - Calibrate';
  private ISSUE_TYPE_REPLACE = 'Maintenance -\xa0Replace';
  private ISSUE_TYPES = [this.ISSUE_TYPE_QC, this.ISSUE_TYPE_FAULT, this.ISSUE_TYPE_CLEAN, this.ISSUE_TYPE_CALIBRATE, this.ISSUE_TYPE_REPLACE];

  public Fusion1_graph = {name: this.INSTRUMENT_FUSION1, data: [], layout: {title: 'Fusion1'}};
  public HF1_graph = {name: this.INSTRUMENT_HF1, data: [], layout: {title: 'HF1'}};
  public HF2_graph = {name: this.INSTRUMENT_HF2, data: [], layout: {title: 'HF2'}};
  public HFX_graph = {name: this.INSTRUMENT_HFX, data: [], layout: {title: 'HFX'}};
  public QEP2_graph = {name: this.INSTRUMENT_QEP2, data: [], layout: {title: 'QEP2'}};
  public Instruemts_graphs = [this.Fusion1_graph, this.HF1_graph, this.HF2_graph, this.HFX_graph, this.QEP2_graph];

  constructor(private httpClient: HttpClient, private dataService: DataService) {  }

  logsList: any;
  show = false;
  fontStyle = {
    size: 12,
  };

  testGraph = {
    data: [{
      title: 'param',
      mode: 'lines',
      type: 'scatter',
      x: [1, 2, 3, 4],
      y: [0, 1, 2, 3]
    }],
    layout: {
      title: 'Test Graph',
      annotations: [
        {
          x: 2,
          y: 1,
          xref: 'x',
          yref: 'y',
          text: 'Annotation Text',
          showarrow: true,
          arrowhead: 3,
          ax: 15,
          ay: -50
        }
      ]
    }
  };

  // find_max_value(lst: Array<string>) {
  //   let maxValue = 0;
  //   let newLst = [];
  //   for (let i = 0; i < lst.length; i++){
  //     newLst.push(parseInt(lst[i], 10));
  //   }
  //   for (let i = 0; i < newLst.length; i++){
  //     if (maxValue < newLst[i])
  //       maxValue = newLst[i];
  //   }
  //   console.log('the type of maxValue is: ', typeof maxValue);
  //   return maxValue;
  // }

  create_graph(instrument) {
    let data = [];
    let layout = []; //TODO: add layout to every line
    let verticalLines = this.vertical(instrument); // create issues lines
    let horizontalLines = this.horizontal(instrument);
    for (let i = 0; i < verticalLines.length; i++) {
      data.push(verticalLines[i]);
    }
    for (let i = 0; i < horizontalLines.length; i++) {
      data.push(horizontalLines[i]);
    }
    return data;
  }

  horizontal(instrument) {
    let lst = [];
    let qc_data = this.logsList['data'][instrument][this.ISSUE_TYPE_QC];

    for (let param in qc_data) { // run for each parameter in QC except qc_ppm
      if (param === 'qc_ppm')
        continue;

      let lineStyle = {
        dash: 'solid',
        width: 2,
      };
      let date = qc_data[param]['dates'];
      let value = qc_data[param]['values'];

      let dict = {
        title: param,
        mode: 'lines+text+markers',
        name: param,
        text: [param],
        textposition: 'buttom',
        x: date,
        y: value,
        type: 'scatter',
        line: lineStyle,
        showlegend: true,
        textfont: this.fontStyle,
      }

      lst.push(dict);
    }
    return lst;
  }

  vertical(instrument) {
    let lst = [];
    let data = this.logsList['data'][instrument];
    for (let issue in data) { // run for each issue except QC
      let maxLst = [];
      if (issue === 'QC')
        // maxLst.push(this.find_max_value(data['QC']['qc_ms2']['values']));
        continue;
      let len = this.logsList['data'][instrument][issue].length;

      for (let i = 0; i < len; i++) { // creating graph for issue

        let color = 'green';
        let text = '';
        if (data[issue][i - 1] === data[issue][i])
          continue;
        if (issue === 'Fault') {
          color = 'red';
          text = 'Fault';
        } else if (issue === 'Maintenance - Clean') {
          color = 'blue';
          text = 'Clean';
        } else if (issue === 'Maintenance - Calibrate') {
          color = 'green';
          text = 'Calibrate';
        } else if (issue === 'Maintenance -\xa0Replace') {
          color = 'pink';
          text = 'Replace';
        }
        let dict = {
          title: text,
          mode: 'lines+text',
          name: text,
          text: [text],
          textposition: 'bottom',
          x: [data[issue][i], data[issue][i]],
          y: ['0', 40000],
          type: 'scatter',
          line: {
            dash: 'dashdot',
            width: 2,
            color: color
          },
          showlegend: true,
          textfont: this.fontStyle
        }
        lst.push(dict);
      }
    }
    return lst;
  }

  ngOnInit() {

    console.log('in dashboard init');
    this.dataService.subject.subscribe((response: any) => {
      console.log('got response from subject in dashboard');
    }, (error: any) => {
      console.log('got error from subject in dashboard');
    }, () => {
      console.log('completed');
      this.show = true;
      this.logsList = this.dataService.logsList;
      console.log(this.logsList);
      for(let i = 0; i < this.Instruemts_graphs.length; i++){
        this.Instruemts_graphs[i]['data'] = this.create_graph(this.Instruemts_graphs[i]['name'])
      }
    });
  }
}
