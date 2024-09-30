import { Stack, StackProps, RemovalPolicy } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { AttributeType, Table } from 'aws-cdk-lib/aws-dynamodb';
import { Function, Runtime, Code} from 'aws-cdk-lib/aws-lambda';
import { LambdaRestApi, LambdaIntegration } from 'aws-cdk-lib/aws-apigateway';

export class ServerlessApiLeveragingAwsServicesStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const table = new Table(this, "AddressesTable", {
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

    // route /users/{userID}/addresses
    const users = api.root.addResource("users");
    const user = users.addResource("{userID}");
    const addresses = user.addResource("addresses");

    addresses.addMethod("POST", new LambdaIntegration(storeAddressFunction));
    addresses.addMethod("GET", new LambdaIntegration(retrieveAddressFunction));
  }
}
