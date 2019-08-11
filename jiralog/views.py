import logging
import os
from django.shortcuts import render
from django.http import HttpResponse, JsonResponse
from django.conf import settings
from rest_framework.views import APIView

from jiralog.connector import JiraConnector
from jiralog.dashboard import JiraDasboard

logger = logging.getLogger(__name__)


def get_angular_context():
    context_dict = {}
    for file in os.listdir(settings.ANGULAR_RESOURCES_DIR):
        if file.startswith('runtime') and file.endswith('.js'):
            context_dict['runtime'] = '/static/instrumentlogs-frontend/%s' % file
        if file.startswith('polyfills') and file.endswith('.js'):
            context_dict['polyfills'] = '/static/instrumentlogs-frontend/%s' % file
        if file.startswith('main') and file.endswith('.js'):
            context_dict['main'] = '/static/instrumentlogs-frontend/%s' % file
        if file.startswith('styles') and file.endswith('.css'):
            context_dict['styles'] = '/static/instrumentlogs-frontend/%s' % file
    # print(context_dict)
    return context_dict


def home(request):
    return render(request, 'home.html', get_angular_context())


class LogList(APIView):
    # noinspection PyUnusedLocal,PyMethodMayBeStatic
    def get(self):
        logger.info('retrieving all IL issues')
        jira_connector = JiraConnector()
        issues = jira_connector.get_all_logs()
        return JsonResponse(data={'data': issues}, status=200)

# Creating a new Log in Jira
class LogCreate(APIView):
    # noinspection PyUnusedLocal,PyMethodMayBeStatic
    def post(self, request):
        # print(request.data)
        jira_connector = JiraConnector()
        new_issue = jira_connector.create_instrument_log(request.data)
        return JsonResponse(data={'data': new_issue}, status=200)


# noinspection PyCallByClass
class TestView(APIView):
    # noinspection PyUnusedLocal,PyMethodMayBeStatic

    def get(self, url):
        data = JiraDasboard.test(self)
        return JsonResponse(data={'data': data}, status=200)

