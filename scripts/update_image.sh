#!/bin/bash
region=us-east-1

# get DNS of backend
backendELB=scraper-alb 
GET_BACKEND_DNSs=$(
    aws elbv2 describe-load-balancers \
        --names ${backendELB} \
        --region ${region} \
        --query 'LoadBalancers[0].[DNSName]' \
        --output text
)
backendDNS=${GET_BACKEND_DNSs}
echo "backendDNS = http://"${backendDNS}

# write to production file
echo 'NEXT_PUBLIC_API_URL='${backendDNS} > .env.production

#push production file (aws only support .env extension)
bucketName=s3-dataset-gui-production-secrets
PUSH_ENV_S3=$(aws s3 cp .env.production s3://${bucketName}/.env)
echo ${PUSH_ENV_S3}

# # update the github secret env variable
# gh secret set NEXT_PUBLIC_API_URL --env production -b "http://${backendDNS}" -r KookaS/dataset-gui

# # redo the CI/CD
# gh workflow run CICD.yml -r production -f dns="http://${backendDNS}" -R KookaS/dataset-gui

# echo "Sleep 10 seconds for spawning action"
# sleep 10s
# echo "Continue to check the status"

# # while workflow status == in_progress, wait
# workflowStatus=$(gh run list --workflow CI/CD --limit 1 | awk '{print $1}')
# while [ "${workflowStatus}" != "completed" ]
# do
#     echo "Waiting for status workflow to complete: "${workflowStatus}
#     sleep 5s
#     workflowStatus=$(gh run list --workflow CI/CD --limit 1 | awk '{print $1}')
# done

# echo "Workflow finished: "${workflowStatus}

# # result of the last completed workflow
# workflowResult=$(gh run list --workflow CI/CD | grep -oh "completed.*" | head -1 | awk '{print $2}')
# echo 'workflowResult = '${workflowResult}

# # needs to be successful, otherwise exit
# if [ "${workflowResult}" != "success" ]; then
#   exit 1
# fi