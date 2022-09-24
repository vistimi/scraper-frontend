#!/bin/bash
region=us-east-1
applicationLoadBalancer=dataset-gui-alb
targetGroup=dataset-gui-tg
securityGroup=dataset-gui-sg

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
echo "backendDNS = ${backendDNS}"

# update the github secret env variable
gh secret set NEXT_PUBLIC_API_URL --env production -b "${backendDNS}" -r KookaS/dataset-gui

# redo the CI/CD
gh workflow run CICD.yml -r production -f dns="${backendDNS}" -R KookaS/dataset-gui

echo "Sleep 10 seconds for spawning action"
sleep 10s
echo "Continue to check the status"

# while workflow status == in_progress, wait
workflowStatus=$(gh run list --workflow CI/CD --limit 1 | awk '{print $1}')
while [ "${workflowStatus}" != "completed" ]
do
    echo "Waiting for status workflow to complete: "${workflowStatus}
    sleep 5s
    workflowStatus=$(gh run list --workflow CI/CD --limit 1 | awk '{print $1}')
done

echo "Workflow finished: "${workflowStatus}

# result of the last completed workflow
workflowResult=$(gh run list --workflow CI/CD | grep -oh "completed.*" | head -1 | awk '{print $2}')
echo 'workflowResult = '${workflowResult}

# needs to be successful, otherwise exit
if [ "${workflowResult}" != "success" ]; then
  exit 1
fi

# write to production file
echo 'NEXT_PUBLIC_API_URL='${backendDNS} > .env.production

#push production file (aws only support .env extension)
bucketName=s3-dataset-gui-production-secrets
PUSH_ENV_S3=$(aws s3 cp .env.production s3://${bucketName}/.env)
echo ${PUSH_ENV_S3}

# get security group
GET_SGs=$(
    aws ec2 describe-security-groups \
        --filters Name=group-name,Values=${securityGroup} \
        --region ${region} \
        --query 'SecurityGroups[0].[GroupId]' \
        --output text
    )
securityGroupID=${GET_SGs}
echo "securityGroupID = "${securityGroupID}

# create elb
CREATE_ELB_GET_ARNs=$(
    aws elbv2 create-load-balancer \
        --name ${applicationLoadBalancer} \
        --region ${region} \
        --subnets subnet-0f537719e61603532 subnet-0e7d325654b95d975 subnet-04872fb36cef128ac \
        --security-groups ${securityGroupID} \
        --type application \
        --scheme internet-facing \
        --ip-address-type ipv4 \
        --tags Key=vpc,Value=scraper-vpc \
        --query 'LoadBalancers[0].[LoadBalancerArn]' \
        --output text
    )
loadBalancerArn=${CREATE_ELB_GET_ARNs}
echo "loadBalancerArn = "${loadBalancerArn}

GET_FRONTEND_DNSs=$(
    aws elbv2 describe-load-balancers \
        --names ${applicationLoadBalancer} \
        --region ${region} \
        --query 'LoadBalancers[0].[DNSName]' \
        --output text
)
frontendDNS=${GET_BACKEND_DNSs}
echo "frontendDNS = ${frontendDNS}"

# get target group of elb
GET_TGs=$(
    aws elbv2 describe-target-groups \
        --names ${targetGroup} \
        --region ${region} \
        --query 'TargetGroups[0].[TargetGroupArn]' \
        --output text
)
targetGroupArn=${GET_TGs}
echo "targetGroupArn = "${targetGroupArn}

# add listener to elb
CREATE_LISTENER=$(
    aws elbv2 create-listener \
        --load-balancer-arn ${loadBalancerArn} \
        --protocol HTTP \
        --port 80 \
        --region ${region} \
        --default-actions Type=forward,TargetGroupArn=${targetGroupArn} \
        --query 'Listeners[0].[ListenerArn]' \
        --output text
)
echo "listenerArn = "${CREATE_LISTENER}

# update the service
SCRIPT_DIR=$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )
${SCRIPT_DIR}/update_service.sh