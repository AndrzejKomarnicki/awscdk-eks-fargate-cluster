import * as cdk from "@aws-cdk/core";
import ec2 = require("@aws-cdk/aws-ec2");
import eks = require("@aws-cdk/aws-eks");
import iam = require("@aws-cdk/aws-iam");

export class EksFargateClusterStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // VPC specs
    const vpc = new ec2.Vpc(this, "EKSFargateVPC", {
      cidr: "10.0.0.0/24",
      maxAzs: 1,
      natGateways: 1
    });

    // allow all account users to assume this role in order to admin the cluster
    const mastersRole = new iam.Role(this, "EKSAdminRole", {
      assumedBy: new iam.AccountRootPrincipal()
    });

    // Initialize cluster
    const cluster = new eks.FargateCluster(this, "MyEKSFargateCluster", {
      mastersRole
    });

    // Add ALB Ingress Controller using Helm
    cluster.addChart("ALBIngressController", {
      chart: "aws-alb-ingress-controller",
      repository: "http://storage.googleapis.com/kubernetes-charts-incubator",
      namespace: "kube-system"
    });

    // cluster.addResource("HelloApp", ...hello.resources); ?
  }
}
