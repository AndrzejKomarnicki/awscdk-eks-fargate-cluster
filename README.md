# awscdk-eks-fargate-cluster

Serverless Kubernetes deployment with Amazon EKS on Fargate using AWS CDK (Cloud Development Kit).

---

This CDK app will deploy a 'nodeless' EKS cluster and default Fargate profile that matches all pods from the "kube-system" and "default"
namespaces. It's also configured to run CoreDNS on Fargate.

When you `cdk deploy` this app you will notice that an output will be printed with the `update-kubeconfig` command, copy and paste it in your shell in order to connect to your EKS cluster with the "masters" role.

\*\*\* note: this app will create a new VPC with 3 public, 3 private subnets and 3 NAT gateways. You have to specify your AWS account # under /bin.

\*\*\* EKS on Fargate is available in the following regions: US East (N. Virginia), US East (Ohio), Europe (Ireland), and Asia Pacific (Tokyo).

---

## Troubleshooting

If you have issues with the CoreDNS deployment, validate that the pod template has the following Annotations:
eks.amazonaws.com/compute-type: fargate
(`kubectl describe deployment coredns --namespace kube-system`)

Try scaling down then back up:
`kubectl scale -n kube-system deployment/coredns --replicas=0`
`kubectl scale -n kube-system deployment/coredns --replicas=3`

## Useful CDK commands

- `npm run build` compile typescript to js
- `npm run watch` watch for changes and compile

- `cdk diff` compare deployed stack with current state
- `cdk synth` emits the synthesized CloudFormation template
- `cdk deploy` deploy this stack to your default AWS account/region
