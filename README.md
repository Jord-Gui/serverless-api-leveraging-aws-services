# Serverless API Leveraging AWS Services

An API to store and retrieve addresses for a given user. You can filter addresses by suburb and postcode.

![serveless-aws-architecture-diagram](./public/serverless-aws.jpg)
**Figure: An architecture diagram of the solution**

## Useful commands

* `npm run build`   compile typescript to js
* `npm run watch`   watch for changes and compile
* `npx cdk deploy`  deploy this stack to your default AWS account/region
* `npx cdk diff`    compare deployed stack with current state
* `npx cdk synth`   emits the synthesized CloudFormation template

## TODO
- Update readme with steps on dev deployment

## Steps to get this Production ready
- Infrastructure - Add unit and integration tests
- Infrastructure - Add CDK Pipeline e.g. add dev/test/staging environment
- Infrastructure - Protect the main branch by adding a branch protection rule (can trigger the CDK pipeline on merge into main)
- Infrastructure - Add metrics and monitoring e.g. CloudWatch/AWS X-Ray/AWS Budgets
- Infrastructure - Generate an OpenAPI spec and set up Swagger UI
- DynamoDB - Change removal policy from DESTROY to RETAIN depending on company policy
- DynamoDB - Add backup options to AddressTable e.g. pointInTimeRecovery
- API Gateway - Usage Plan - Change throttle settings depending on user base
- API Gateway - Use AWS Secrets Manager to store the API key generated and set up key rotation
- API Gateway - Add access logging
- API Gateway - Add AWS WAF to protect against common attacks
