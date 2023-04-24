#!/usr/bin/env node
import "source-map-support/register";
import { App } from 'aws-cdk-lib'
import { EksFargateClusterStack } from "../lib/eks-fargate-cluster-stack";

const app = new App();

const defaultenv = { account: process.env.CDK_DEFAULT_ACCOUNT, region: process.env.CDK_DEFAULT_REGION };

new EksFargateClusterStack(app, "EksFargateClusterStack", {
  env: defaultenv
});

app.synth(); 
