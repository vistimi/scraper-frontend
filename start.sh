#!/bin/bash
ecsClusterName=scraperClusterECS
ecsServiceName=datasetGUIServiceFargate
nameTaskDefinition=datasetGUIDefinitionFargate
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

# write to production file
echo 'NEXT_PUBLIC_API_URL='${backendDNS} > .env.production#!/bin/bash
ecsClusterName=scraperClusterECS
ecsServiceName=datasetGUIServiceFargate
nameTaskDefinition=datasetGUIDefinitionFargate
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

#write to production file
echo 'NEXT_PUBLIC_API_URL='${backendDNS} > .env.production

#push production file
bucketName=s3-dataset-gui-production-secrets
PUSH_ENV_S3=$(aws s3 cp .env.production s3://${bucketName}/.env.production)
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
echo "securityGroupID = ${securityGroupID}"

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
echo "loadBalancerArn = ${loadBalancerArn}"

# get target group of elb
GET_TGs=$(
    aws elbv2 describe-target-groups \
        --names ${targetGroup} \
        --region ${region} \
        --query 'TargetGroups[0].[TargetGroupArn]' \
        --output text
)
targetGroupArn=${GET_TGs}
echo "targetGroupArn = ${targetGroupArn}"

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
echo "listenerArn = ${CREATE_LISTENER}"

# desired tasks
UPDATE_FARGATE=$(
    aws ecs update-service \
        --cluster ${ecsClusterName} \
        --service ${ecsServiceName} \
        --desired-count 1 \
        --force-new-deployment \
        --region ${region} \
        --query 'service.[desiredCount]' \
        --output text
)
echo "desiredCount = ${UPDATE_FARGATE}"

# # for more than one variable
# IFS=', ' read -r -a array <<< "$ELB_ARN" 
# for arn in "${array[@]}" 
# do
#     echo ${arn} 
# done