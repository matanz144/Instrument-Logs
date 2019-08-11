import datetime
import logging
from enum import Enum

from jira import JIRA

from instrumentlogs.settings import JIRA_CONFIG

logger = logging.getLogger(__name__)


class JiraField(Enum):  # To get the customfield number, go to https://incpmpm.atlassian.net/rest/api/2/field
    issue_type = 'issuetype',
    log_date = 'customfield_17401',  # date
    lc = 'customfield_17411',  # string
    ms = 'customfield_17412',  # string
    replace = 'customfield_17413',  # string
    clean = 'customfield_17414',  # string
    calibrate = 'customfield_17415',  # string
    fault = 'customfield_17416',  # string
    qc_ms2 = 'customfield_17417',  # string
    qc_psms = 'customfield_17418',  # string
    qc_peptides = 'customfield_17419',  # string
    qc_proteins = 'customfield_17420',  # string
    qc_ppm = 'customfield_17423'  # string

    def __init__(self, internal_name):
        self.internal_name = internal_name


class JiraConnector(object):
    FIELDS = [
        JiraField.issue_type, JiraField.log_date, JiraField.lc, JiraField.ms, JiraField.replace,
        JiraField.clean, JiraField.calibrate, JiraField.fault, JiraField.qc_ms2, JiraField.qc_psms,
        JiraField.qc_peptides, JiraField.qc_proteins, JiraField.qc_ppm,
    ]

    def __init__(self):
        url, username, password = JIRA_CONFIG['url'], JIRA_CONFIG['username'], JIRA_CONFIG['password']
        logger.info('connecting to JIRA. URL: {} User: {}'.format(url, username))
        try:
            self.jira = JIRA(basic_auth=(username, password), server=url, max_retries=0)
           # self.jira = JIRA(server=url, basic_auth=(username, JIRA_CONFIG['password']), max_retries=0)
        except:
            raise ConnectionError('could not connect to JIRA, aborting')
        logger.info('connected to JIRA')

    @staticmethod
    def _get_field_values(issue, jira_field):
        val = getattr(issue.fields, jira_field.internal_name)
        if val is None:
            val = ''
        elif type(val) == str:
            val = val.strip()
        else:
            val = str(val)
        return val

    def _get_issue_fields(self, issue):
        field_values = {'key': issue.key}
        field_values.update(dict([(jira_field.name, self._get_field_values(issue, jira_field))
                                  for jira_field in self.FIELDS]))
        return field_values

    def _retrieve_jira_issues(self, start_at=0):
        logger.debug('retrieving JIRA issues at offset {}'.format(start_at))
        issues = self.jira.search_issues('project = IL', maxResults=100, startAt=start_at)
        logger.debug('retrieval done')
        return issues

    def get_all_logs(self):
        jira_issues = self._retrieve_jira_issues()
        issue_list = []
        while jira_issues:
            for issue in jira_issues:
                issue_list.append(self._get_issue_fields(issue))
            offset = len(jira_issues) + jira_issues.startAt
            jira_issues = self._retrieve_jira_issues(start_at=offset)

        print(issue_list)
        return issue_list

    def create_instrument_log(self, data):
        logger.info('creating new IL issue')
        logger.info(data)
        ms2 = psm = peptides = proteins = lc = ms = ppm = ""
        replace = fault = clean = calibrate = []
        # if data['instrument_type'] == 'lc':
        #      lc = data['instrument']
        # elif data['instrument_type'] == 'ms':
        #      ms = data['instrument']

        lc = data['instrument']['lc']
        ms = data['instrument']['ms']
        if data['issue_type'] == 'Fault':
            fault = data['issue_params']
        elif data['issue_type'] == 'QC':
            ms2 = data['issue_params'][0]['MS2']
            psm = data['issue_params'][0]['PSM']
            peptides = data['issue_params'][0]['Peptides']
            proteins = data['issue_params'][0]['Proteins']
            ppm = data['issue_params'][0]['PPM']
        elif data['issue_type'] == 'Maintenance - Replace':
            replace = data['issue_params']
        elif data['issue_type'] == 'Maintenance - Clean':
            clean = data['issue_params']
        elif data['issue_type'] == 'Maintenance - Calibrate':
            calibrate = data['issue_params']
        issue_fields = {
            'project': 'IL',
            'summary': data['issue_name'],
            'issuetype': data['issue_type'],
            'customfield_17411': lc,
            'customfield_17412': ms,
            'customfield_17413': ', '.join(replace),
            'customfield_17414': ', '.join(clean),
            'customfield_17415': ', '.join(calibrate),
            'customfield_17416': ', '.join(fault),
            'customfield_17417': str(ms2),
            'customfield_17418': str(psm),
            'customfield_17419': str(peptides),
            'customfield_17420': str(proteins),
            'customfield_17423': str(ppm),
            JiraField.log_date.internal_name: datetime.date.today().strftime('%Y-%m-%d'),
        }
        new_issue = self.jira.create_issue(fields=issue_fields)
        logger.info('new issue {} created'.format(new_issue.key))
        return self._get_issue_fields(new_issue)
