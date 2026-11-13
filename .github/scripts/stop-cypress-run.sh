#!/usr/bin/env bash
# Stop the Cypress run that a workflow started on ECS with --started-by <key>, post the reason to Slack, and free its test account.
# Usage: stop-cypress-run.sh <key> <slack title> <stopped run> <reason>, with SLACK_WEBHOOK, LOCK_BUCKET and LOCK_PREFIX set.
set -euo pipefail

KEY=$1
TITLE=$2
STOPPED_RUN=$3
REASON=$4
CLUSTER=pipelines

running_tasks() {
  local arns running
  # `|| return 1`: set -e does not apply inside the command substitution that calls this function
  arns=$(aws ecs list-tasks --cluster "$CLUSTER" --started-by "$1" --query 'taskArns' --output text) || return 1
  if [ -z "$arns" ] || [ "$arns" = "None" ]; then
    return 0
  fi
  # ListTasks can also return tasks that have just stopped
  # shellcheck disable=SC2086
  running=$(aws ecs describe-tasks --cluster "$CLUSTER" --tasks $arns --query "tasks[?desiredStatus=='RUNNING'].taskArn" --output text) || return 1
  [ "$running" = "None" ] || echo "$running"
}

AGGREGATOR=$(running_tasks "$KEY/aggregator")
SHARDS=$(running_tasks "$KEY")
if [ -z "$AGGREGATOR$SHARDS" ]; then
  echo "No Cypress run in progress for $KEY"
else
  # The aggregator first: it posts the results as soon as the shards have stopped
  for arn in $AGGREGATOR $SHARDS; do
    aws ecs stop-task --cluster "$CLUSTER" --task "$arn" --reason "$REASON" --query 'task.taskArn' --output text
  done

  PAYLOAD=$(jq -cn --arg title "$TITLE" --arg run "$STOPPED_RUN" --arg reason "$REASON" \
    '{attachments: [{title: $title, text: "Test has been stopped for \($run)\nReason: \($reason)", color: "warning"}]}')
  curl -sf -X POST "$SLACK_WEBHOOK" -H 'Content-Type: application/json' -d "$PAYLOAD" || echo "Slack post failed"
fi

# A stopped aggregator never frees the account itself
bash "$(dirname "$0")/cypress-account.sh" release "$KEY"
