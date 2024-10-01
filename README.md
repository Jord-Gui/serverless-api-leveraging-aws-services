# Serverless API Leveraging AWS Services

An API to store and retrieve addresses for a given user. You can filter addresses by suburb and postcode.

![serveless-aws-architecture-diagram](./public/serverless-aws.jpg)

## Useful commands

* `npm run build`   compile typescript to js
* `npm run watch`   watch for changes and compile
* `npx cdk deploy`  deploy this stack to your default AWS account/region
* `npx cdk diff`    compare deployed stack with current state
* `npx cdk synth`   emits the synthesized CloudFormation template

## TODO
- Update readme with steps on dev deployment

## Improvements (TODO: Move this to comments)
- Handle case where the same address is stored
- Convert files in lambda folder into Typescript
- Add input validation and sanitation
- Upgrade to TableV2 for DynamoDB

## Steps to get this Production ready
- Add unit and integration tests
- Add CDK Pipeline e.g. add a dev/test/staging environment
- Close off main, add branching policy. CDK Pipeline triggers on merge into main
- Change DynamoDB removal policy from DESTROY to RETAIN depending on company policy
- Add backup options to AddressTable e.g. pointInTimeRecovery
- Change Usage Plan throttle settings depending on user base
- Use AWS Secrets Manager to store the API key generated
- Add metrics and monitoring
