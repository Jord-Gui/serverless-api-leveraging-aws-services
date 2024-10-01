import { Stack, StackProps, RemovalPolicy } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { AttributeType, Table } from 'aws-cdk-lib/aws-dynamodb';
import { Function, Runtime, Code} from 'aws-cdk-lib/aws-lambda';
import { LambdaRestApi, LambdaIntegration, UsagePlan } from 'aws-cdk-lib/aws-apigateway';

export class ServerlessApiLeveragingAwsServicesStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const table = new Table(this, "AddressTable", {
      partitionKey: { name: "userID", type: AttributeType.STRING },
      sortKey: { name: "addressID", type: AttributeType.STRING },
      removalPolicy: RemovalPolicy.DESTROY,
    });

    const storeAddressFunction = new Function(this, "StoreAddressFunctionHandler", {
      runtime: Runtime.NODEJS_20_X,
      code: Code.fromAsset("lambda"),
      handler: "storeAddress.handler",
      environment: {
        TABLE_NAME: table.tableName,
      }
    });
    table.grantReadWriteData(storeAddressFunction);

    const retrieveAddressFunction = new Function(this, "RetrieveAddressFunctionHandler", {
      runtime: Runtime.NODEJS_20_X,
      code: Code.fromAsset("lambda"),
      handler: "retrieveAddress.handler",
      environment: {
        TABLE_NAME: table.tableName,
      }
    })
    table.grantReadData(retrieveAddressFunction);

    const api = new LambdaRestApi(this, "AddressApi", {
      handler: storeAddressFunction, // TODO: Add a default handler
      proxy: false,
    });

    const apiKey = api.addApiKey("AddressApiKey");
    const usagePlan = new UsagePlan(this, "AddressUsagePlan", {
      name: "AddressUsagePlan",
      apiStages: [{ api: api, stage: api.deploymentStage }],
      throttle: {
        rateLimit: 10,
        burstLimit: 2,
      }
    });
    usagePlan.addApiKey(apiKey);

    // route /users/{userID}/addresses
    const users = api.root.addResource("users");
    const user = users.addResource("{userID}");
    const addresses = user.addResource("addresses");

    const storeAddressIntegration = new LambdaIntegration(storeAddressFunction);
    addresses.addMethod("POST", storeAddressIntegration, {
      apiKeyRequired: true,
    });
    const retrieveAddressIntegration = new LambdaIntegration(retrieveAddressFunction);
    addresses.addMethod("GET", retrieveAddressIntegration, {
      apiKeyRequired: true,
    });
  }
}
