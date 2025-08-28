#!/bin/bash
set -e

export AWS_PROFILE=evive-sandbox

echo "Building SAM project..."
sam build

echo "Deploying SAM stack..."
if ! sam deploy --stack-name currency-lambda-sam --no-confirm-changeset --capabilities CAPABILITY_IAM; then
    echo "No changes to deploy or deploy failed, continuing..."
fi

echo "Starting local API..."
sam local start-api --port 4000
