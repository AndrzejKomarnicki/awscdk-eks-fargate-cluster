import * as cdk from "@aws-cdk/core";
import ec2 = require("@aws-cdk/aws-ec2");
import eks = require("@aws-cdk/aws-eks");
import iam = require("@aws-cdk/aws-iam");

export class EksFargateClusterStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // allow all account users to assume this role in order to admin the cluster
    const clusterAdmin = new iam.Role(this, "AdminRole", {
      assumedBy: new iam.AccountRootPrincipal()
    });

    // Initialize cluster
    const cluster = new eks.FargateCluster(this, "MyCluster", {
      mastersRole: clusterAdmin
    });
  }
}
