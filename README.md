# awscdk-eks-fargate-cluster

Serverless Kubernetes deployment with Amazon EKS on Fargate using AWS CDK v2 (Cloud Development Kit).

---

This CDK app boilerplate will deploy a 'nodeless' EKS cluster and default Fargate profile that matches all pods from the "kube-system" and "default" namespaces. It's also configured to run CoreDNS on Fargate.

The Kubernetes resource currently added is an Express.js "Hello World" API.

Also comes equipped with the following:

- AWS Load Balancer Controller with annotations in Ingress and Service K8s resources
- Kubernetes Secrets Encrypted with AWS KMS via EKS Encryption Provider
- AdminRole that can be assumed and provides EKS Console viewer access
- A VPC with two AZs and NAT GWs

When you `cdk deploy` this app you will notice that an output will be printed with the `update-kubeconfig` command, copy and paste it in your shell in order to connect to your EKS cluster with the "masters" role.

\*\*\* Note: You have to specify your AWS account # under /bin.

---

## Troubleshooting

If you have issues with the CoreDNS deployment, validate that the pod template has the following Annotations:
eks.amazonaws.com/compute-type: fargate

    $ kubectl describe deployment coredns --namespace kube-system

Trigger a rollout of the coredns Deployment:

    $ kubectl rollout restart -n kube-system deployment coredns
