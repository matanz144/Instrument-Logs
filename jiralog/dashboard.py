# cd ~/projects/jira-stats/
# source ~/ve/instrument-logs/bin/activate
# ipython:
import json
from pprint import pprint
from jiralog.connector import JiraConnector
from pandas import DataFrame

# issue types consts:
ISSUE_TYPE_QC = 'QC'
ISSUE_TYPE_FAULT = 'Fault'
ISSUE_TYPE_CLEAN = 'Maintenance - Clean'
ISSUE_TYPE_CALIBRATE = 'Maintenance - Calibrate'
ISSUE_TYPE_REPLACE = 'Maintenance -\xa0Replace'
ISSUE_TYPES = [ISSUE_TYPE_QC, ISSUE_TYPE_FAULT, ISSUE_TYPE_CLEAN, ISSUE_TYPE_CALIBRATE, ISSUE_TYPE_REPLACE]

# instrument consts:
INSTRUMENT_QEP2 = 'QEP2'
INSTRUMENT_FUSION1 = 'Fusion1'
INSTRUMENT_HFX = 'HFX'
INSTRUMENT_HF1 = 'HF1'
INSTRUMENT_HF2 = 'HF2'
INSTRUMENTS = [INSTRUMENT_FUSION1, INSTRUMENT_HF1, INSTRUMENT_HF2, INSTRUMENT_HFX, INSTRUMENT_QEP2]



class JiraDasboard ():

    def test(self):
        # building empty logs data:
        logs = {}
        for instrument in INSTRUMENTS:
            logs[instrument] = {}
            for issue in ISSUE_TYPES:
                if issue == ISSUE_TYPE_QC:
                    logs[instrument][issue] = {}
                else:
                    logs[instrument][issue] = []
        # cleanDates = {'date': [], 'type': 'Clean'}
        jira_connector = JiraConnector()
        issues = jira_connector.get_all_logs()
        df = DataFrame(issues)
        length = len(df['log_date'])
        # iterating issues:
        qc_col_names = [col_name for col_name in df.columns if col_name.startswith('qc_')]
        for i in range(length):
            # ignore records without a known instrument or issue type:
            if df['issue_type'][i] not in ISSUE_TYPES or df['ms'][i] not in INSTRUMENTS:
                continue
            # fill the dict according to the issue type:
            if df['issue_type'][i] == ISSUE_TYPE_QC:
                for qc_col_name in qc_col_names:
                    qc_param_dict = logs[df['ms'][i]][df['issue_type'][i]].setdefault(qc_col_name, {
                        'dates': [],
                        'values': []
                    })
                    qc_param_dict['dates'].append(df['log_date'][i])
                    qc_param_dict['values'].append(df[qc_col_name][i])
            else:
                logs[df['ms'][i]][df['issue_type'][i]].append(df['log_date'][i])

        # pprint(logs)
        return logs


