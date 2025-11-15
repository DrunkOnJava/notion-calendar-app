#!/bin/bash
# LocalStack initialization script
# Creates S3 buckets and other AWS resources for testing

set -e

echo "Initializing LocalStack resources..."

# Wait for LocalStack to be ready
awslocal s3 ls || sleep 5

# Create S3 buckets
awslocal s3 mb s3://test-bucket
awslocal s3 mb s3://test-uploads
awslocal s3 mb s3://test-exports

# Create SQS queues
awslocal sqs create-queue --queue-name test-events-queue
awslocal sqs create-queue --queue-name test-notifications-queue

# Create DynamoDB tables
awslocal dynamodb create-table \
  --table-name test-sessions \
  --attribute-definitions \
    AttributeName=id,AttributeType=S \
  --key-schema \
    AttributeName=id,KeyType=HASH \
  --provisioned-throughput \
    ReadCapacityUnits=5,WriteCapacityUnits=5

echo "LocalStack resources initialized successfully"
