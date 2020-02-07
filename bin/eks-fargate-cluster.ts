#!/usr/bin/env node
import "source-map-support/register";
import * as cdk from "@aws-cdk/core";
import { EksFargateClusterStack } from "../lib/eks-fargate-cluster-stack";

const app = new cdk.App();

const envUSA = { account: "11111111111", region: "us-east-1" };

new EksFargateClusterStack(app, "EksFargateClusterStack", {
  env: envUSA
});

app.synth();
