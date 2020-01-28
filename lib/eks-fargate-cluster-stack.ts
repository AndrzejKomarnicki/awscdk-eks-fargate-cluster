import * as cdk from "@aws-cdk/core";
import ec2 = require("@aws-cdk/aws-ec2");
import eks = require("@aws-cdk/aws-eks");
import iam = require("@aws-cdk/aws-iam");

export class EksFargateClusterStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Custom VPC Build (Min 2 AZs)

    const vpc = new ec2.Vpc(this, "MyVpc", {
      maxAzs: 2,
      natGateways: 2,
      subnetConfiguration: [
        {
          cidrMask: 24,
          name: "Public1",
          subnetType: ec2.SubnetType.PUBLIC
        },
        {
          cidrMask: 24,
          name: "Public2",
          subnetType: ec2.SubnetType.PUBLIC
        },
        {
          cidrMask: 24,
          name: "Private1",
          subnetType: ec2.SubnetType.PRIVATE
        },
        {
          cidrMask: 24,
          name: "Private2",
          subnetType: ec2.SubnetType.PRIVATE
        }
      ]
    });

    // VPC Endpoints - Optional

    /*
    const DynamoDBEndpoint = vpc.addGatewayEndpoint("DynamoDBEndpoint", {
      service: ec2.GatewayVpcEndpointAwsService.DYNAMODB
    });

    const S3Endpoint = vpc.addGatewayEndpoint("S3Endpoint", {
      service: ec2.GatewayVpcEndpointAwsService.S3
    });
    */

    // allow all account users to assume this role in order to admin the cluster
    const clusterAdmin = new iam.Role(this, "AdminRole", {
      assumedBy: new iam.AccountRootPrincipal()
    });

    // Initialize cluster
    const cluster = new eks.FargateCluster(this, "MyCluster", {
      mastersRole: clusterAdmin,
      outputClusterName: true,
      outputMastersRoleArn: true,
      vpc
    });

    // cluster.addResource("HelloApp", ...hello.resources); ?
  }
}
