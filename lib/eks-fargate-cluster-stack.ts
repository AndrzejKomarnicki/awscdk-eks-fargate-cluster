import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import * as eks from "aws-cdk-lib/aws-eks";
import * as ec2 from "aws-cdk-lib/aws-ec2";
import * as iam from "aws-cdk-lib/aws-iam";
import * as kms from "aws-cdk-lib/aws-kms";
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

    // allow all account users to assume this role in order to view the eks cluster console resources
    const clusterAdmin = new iam.Role(this, 'AdminRole', {
      assumedBy: new iam.AccountRootPrincipal(),
      // add new inline iam policy with eks console access  
      inlinePolicies: {
        'eks-console-access': new iam.PolicyDocument({
          statements: [
            new iam.PolicyStatement({
              actions: ['eks:List*', 'eks:Describe*', 'eks:AccessKubernetesApi'],
              resources: ['*'],
            }),
          ],
        }),
      }
    })

    // Initialize cluster
    const cluster = new eks.FargateCluster(this, 'MyCluster', {
      version: eks.KubernetesVersion.V1_25,
      kubectlLayer: new KubectlV25Layer(this, 'kubectl'),
      mastersRole: clusterAdmin,
      outputClusterName: true,
      outputMastersRoleArn: true,
      outputConfigCommand: true,
      endpointAccess: eks.EndpointAccess.PUBLIC_AND_PRIVATE,
      albController: {
        version: eks.AlbControllerVersion.V2_5_1
      },

      secretsEncryptionKey: new kms.Key(this, 'EKS_KMS_Key'),
      vpc
    });

    // add tags to cluster  
    cdk.Tags.of(cluster).add('Project', 'EKS-Fargate-Cluster');


    // deploy k8s manifest with ingress
    const manifest = cluster.addManifest('Express Hello App', {
      apiVersion: "networking.k8s.io/v1",
      kind: "Ingress",
      metadata: {
        "name": "ingress-hello-expressjs",
        annotations: {
          'kubernetes.io/ingress.class': 'alb',
          'alb.ingress.kubernetes.io/scheme': 'internet-facing'
        }
      },
      spec: {
        defaultBackend: {
          service: {
            name: "hello-expressjs",
            port: {
              number: 80
            }
          }
        }
      }
    },
      {
        apiVersion: "v1",
        kind: "Service",
        metadata: {
          name: "hello-expressjs",
          annotations: {
            'alb.ingress.kubernetes.io/target-type': 'ip'
          }
        },
        spec: {
          type: "NodePort",
          ports: [{ port: 80, targetPort: 8080, protocol: "TCP" }],
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



    if (cluster.albController) {
      manifest.node.addDependency(cluster.albController);
    }

  }
}
