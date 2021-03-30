# awscdk-eks-fargate-cluster

Serverless Kubernetes deployment with Amazon EKS on Fargate using AWS CDK (Cloud Development Kit).

---

This CDK app boilerplate will deploy a 'nodeless' EKS cluster and default Fargate profile that matches all pods from the "kube-system" and "default" namespaces. It's also configured to run CoreDNS on Fargate.

The Kubernetes resource currently added is an Express.js "Hello World" API.

When you `cdk deploy` this app you will notice that an output will be printed with the `update-kubeconfig` command, copy and paste it in your shell in order to connect to your EKS cluster with the "masters" role.

\*\*\* Note: You have to specify your AWS account # under /bin.

---

## Troubleshooting

If you have issues with the CoreDNS deployment, validate that the pod template has the following Annotations:
eks.amazonaws.com/compute-type: fargate

    $ kubectl describe deployment coredns --namespace kube-system

Trigger a rollout of the coredns Deployment:

    $ kubectl rollout restart -n kube-system deployment coredns
