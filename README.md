# Welcome to your CDK TypeScript project

This is a blank project for CDK development with TypeScript.

The `cdk.json` file tells the CDK Toolkit how to execute your app.

## Useful commands

* `npm run build`   compile typescript to js
* `npm run watch`   watch for changes and compile
* `npm run test`    perform the jest unit tests
* `npx cdk deploy`  deploy this stack to your default AWS account/region
* `npx cdk diff`    compare deployed stack with current state
* `npx cdk synth`   emits the synthesized CloudFormation template

## TODO
- Add architecture diagram to readme
- Update readme with steps on dev deployment

## Steps to get this Production ready
- Add unit and integration tests
- Add cdk pipeline e.g. add a staging environment
- Close off main, add branching policy. CDK Pipeline triggers on merge into main
- Change DynamoDB removal policy from DESTROY to RETAIN
- Change Usage Plan throttle settings depending on user base
- Use AWS Secrets Manager to store the API key generated

## Improvements (TODO: Move this to comments)
- Handle case where the same address is stored
- Convert files in lambda folder into Typescript
- Add input validation and sanitation