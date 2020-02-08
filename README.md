# awscdk-eks-fargate-cluster

Serverless Kubernetes deployment with Amazon EKS on Fargate using AWS CDK (Cloud Development Kit).

---

This CDK app boilerplate will deploy a 'nodeless' EKS cluster and default Fargate profile that matches all pods from the "kube-system" and "default" namespaces. It's also configured to run CoreDNS on Fargate.

The Kubernetes resource currently added is an Express.js "Hello World" API. This boilerplate does not currently expose this API to the internet, but this feature will come with a future v1.0 release.

When you `cdk deploy` this app you will notice that an output will be printed with the `update-kubeconfig` command, copy and paste it in your shell in order to connect to your EKS cluster with the "masters" role.

\*\*\* Note: You have to specify your AWS account # under /bin.

\*\*\* EKS on Fargate is available in the following regions: US East (N. Virginia), US East (Ohio), Europe (Ireland), and Asia Pacific (Tokyo).

---

## Useful CDK commands

- `npm run build` compile typescript to js
- `npm run watch` watch for changes and compile

- `cdk diff` compare deployed stack with current state
- `cdk synth` emits the synthesized CloudFormation template
- `cdk bootstrap` bootstraps the s3 bucket for the deployment
- `cdk deploy` deploy this stack to your default AWS account/region

## Troubleshooting

If you have issues with the CoreDNS deployment, validate that the pod template has the following Annotations:
eks.amazonaws.com/compute-type: fargate

    $ kubectl describe deployment coredns --namespace kube-system

Trigger a rollout of the coredns Deployment:

    $ kubectl rollout restart -n kube-system deployment coredns
