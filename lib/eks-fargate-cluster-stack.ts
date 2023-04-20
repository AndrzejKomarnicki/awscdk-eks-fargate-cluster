import * as cdk from "aws-cdk-lib";
import { KubernetesVersion } from "aws-cdk-lib/aws-eks";
import { Construct } from "constructs";
import * as eks from "aws-cdk-lib/aws-eks";
import * as ec2 from "aws-cdk-lib/aws-ec2";
import * as iam from "aws-cdk-lib/aws-iam";
import { KubectlV25Layer } from '@aws-cdk/lambda-layer-kubectl-v25';

export class EksFargateClusterStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
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
          subnetType: ec2.SubnetType.PRIVATE_WITH_EGRESS
        },
        {
          cidrMask: 24,
          name: "Private2",
          subnetType: ec2.SubnetType.PRIVATE_WITH_EGRESS
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
    const clusterAdmin = new iam.Role(this, 'AdminRole', {
      assumedBy: new iam.AccountRootPrincipal()
    });

    // Initialize cluster
    const cluster = new eks.FargateCluster(this, 'MyCluster', {
      version: eks.KubernetesVersion.V1_25,
      kubectlLayer: new KubectlV25Layer(this, 'kubectl'),
      mastersRole: clusterAdmin,
      outputClusterName: true,
      outputMastersRoleArn: true,
      vpc
    });


    cluster.addManifest('Express Hello App', {
      apiVersion: "v1",
      kind: "Service",
      metadata: { name: "hello-expressjs" },
      spec: {
        type: "NodePort",
        ports: [{ port: 8080, nodePort: 30036 }],
        selector: { app: "hello-expressjs" }
      }
    },
      {
        apiVersion: "apps/v1",
        kind: "Deployment",
        metadata: { name: "hello-expressjs" },
        spec: {
          replicas: 1,
          selector: { matchLabels: { app: "hello-expressjs" } },
          template: {
            metadata: {
              labels: { app: "hello-expressjs" }
            },
            spec: {
              containers: [
                {
                  name: "hello-expressjs",
                  image: "andrzejkomarnicki/expresshello:1.0",
                  ports: [{ containerPort: 8080 }]
                }
              ]
            }
          }
        }
      });

  }
}
