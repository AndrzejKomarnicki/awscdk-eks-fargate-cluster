export const resources = [
  {
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
  }
];
