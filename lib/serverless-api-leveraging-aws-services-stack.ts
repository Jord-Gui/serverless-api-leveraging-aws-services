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

    const storeFunction = new Function(this, "StoreFunctionHandler", {
      runtime: Runtime.NODEJS_20_X,
      code: Code.fromAsset("lambda"),
      handler: "storeAddress.handler",
      environment: {
        TABLE_NAME: table.tableName,
      }
    });

    table.grantReadWriteData(storeFunction);

    const api = new LambdaRestApi(this, "AddressApi", {
      handler: storeFunction,
      proxy: false,
    });

    // Define /users/{userID}/addresses resource
    const users = api.root.addResource("users");
    const user = users.addResource("{userID}");
    const addresses = user.addResource("addresses");

    addresses.addMethod("POST", new LambdaIntegration(storeFunction));
  }
}
