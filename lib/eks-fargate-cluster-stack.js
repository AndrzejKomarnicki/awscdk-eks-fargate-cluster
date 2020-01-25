"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cdk = require("@aws-cdk/core");
const ec2 = require("@aws-cdk/aws-ec2");
const eks = require("@aws-cdk/aws-eks");
const iam = require("@aws-cdk/aws-iam");
class EksFargateClusterStack extends cdk.Stack {
    constructor(scope, id, props) {
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
exports.EksFargateClusterStack = EksFargateClusterStack;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZWtzLWZhcmdhdGUtY2x1c3Rlci1zdGFjay5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImVrcy1mYXJnYXRlLWNsdXN0ZXItc3RhY2sudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxxQ0FBcUM7QUFDckMsd0NBQXlDO0FBQ3pDLHdDQUF5QztBQUN6Qyx3Q0FBeUM7QUFFekMsTUFBYSxzQkFBdUIsU0FBUSxHQUFHLENBQUMsS0FBSztJQUNuRCxZQUFZLEtBQW9CLEVBQUUsRUFBVSxFQUFFLEtBQXNCO1FBQ2xFLEtBQUssQ0FBQyxLQUFLLEVBQUUsRUFBRSxFQUFFLEtBQUssQ0FBQyxDQUFDO1FBRXhCLFlBQVk7UUFDWixNQUFNLEdBQUcsR0FBRyxJQUFJLEdBQUcsQ0FBQyxHQUFHLENBQUMsSUFBSSxFQUFFLGVBQWUsRUFBRTtZQUM3QyxJQUFJLEVBQUUsYUFBYTtZQUNuQixNQUFNLEVBQUUsQ0FBQztZQUNULFdBQVcsRUFBRSxDQUFDO1NBQ2YsQ0FBQyxDQUFDO1FBRUgsNEVBQTRFO1FBQzVFLE1BQU0sV0FBVyxHQUFHLElBQUksR0FBRyxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsY0FBYyxFQUFFO1lBQ3JELFNBQVMsRUFBRSxJQUFJLEdBQUcsQ0FBQyxvQkFBb0IsRUFBRTtTQUMxQyxDQUFDLENBQUM7UUFFSCxxQkFBcUI7UUFDckIsTUFBTSxPQUFPLEdBQUcsSUFBSSxHQUFHLENBQUMsY0FBYyxDQUFDLElBQUksRUFBRSxxQkFBcUIsRUFBRTtZQUNsRSxXQUFXO1NBQ1osQ0FBQyxDQUFDO1FBRUgsd0NBQXdDO1FBQ3hDLE9BQU8sQ0FBQyxRQUFRLENBQUMsc0JBQXNCLEVBQUU7WUFDdkMsS0FBSyxFQUFFLDRCQUE0QjtZQUNuQyxVQUFVLEVBQUUsMkRBQTJEO1lBQ3ZFLFNBQVMsRUFBRSxhQUFhO1NBQ3pCLENBQUMsQ0FBQztRQUVILHlEQUF5RDtJQUMzRCxDQUFDO0NBQ0Y7QUE5QkQsd0RBOEJDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgY2RrIGZyb20gXCJAYXdzLWNkay9jb3JlXCI7XG5pbXBvcnQgZWMyID0gcmVxdWlyZShcIkBhd3MtY2RrL2F3cy1lYzJcIik7XG5pbXBvcnQgZWtzID0gcmVxdWlyZShcIkBhd3MtY2RrL2F3cy1la3NcIik7XG5pbXBvcnQgaWFtID0gcmVxdWlyZShcIkBhd3MtY2RrL2F3cy1pYW1cIik7XG5cbmV4cG9ydCBjbGFzcyBFa3NGYXJnYXRlQ2x1c3RlclN0YWNrIGV4dGVuZHMgY2RrLlN0YWNrIHtcbiAgY29uc3RydWN0b3Ioc2NvcGU6IGNkay5Db25zdHJ1Y3QsIGlkOiBzdHJpbmcsIHByb3BzPzogY2RrLlN0YWNrUHJvcHMpIHtcbiAgICBzdXBlcihzY29wZSwgaWQsIHByb3BzKTtcblxuICAgIC8vIFZQQyBzcGVjc1xuICAgIGNvbnN0IHZwYyA9IG5ldyBlYzIuVnBjKHRoaXMsIFwiRUtTRmFyZ2F0ZVZQQ1wiLCB7XG4gICAgICBjaWRyOiBcIjEwLjAuMC4wLzI0XCIsXG4gICAgICBtYXhBenM6IDEsXG4gICAgICBuYXRHYXRld2F5czogMVxuICAgIH0pO1xuXG4gICAgLy8gYWxsb3cgYWxsIGFjY291bnQgdXNlcnMgdG8gYXNzdW1lIHRoaXMgcm9sZSBpbiBvcmRlciB0byBhZG1pbiB0aGUgY2x1c3RlclxuICAgIGNvbnN0IG1hc3RlcnNSb2xlID0gbmV3IGlhbS5Sb2xlKHRoaXMsIFwiRUtTQWRtaW5Sb2xlXCIsIHtcbiAgICAgIGFzc3VtZWRCeTogbmV3IGlhbS5BY2NvdW50Um9vdFByaW5jaXBhbCgpXG4gICAgfSk7XG5cbiAgICAvLyBJbml0aWFsaXplIGNsdXN0ZXJcbiAgICBjb25zdCBjbHVzdGVyID0gbmV3IGVrcy5GYXJnYXRlQ2x1c3Rlcih0aGlzLCBcIk15RUtTRmFyZ2F0ZUNsdXN0ZXJcIiwge1xuICAgICAgbWFzdGVyc1JvbGVcbiAgICB9KTtcblxuICAgIC8vIEFkZCBBTEIgSW5ncmVzcyBDb250cm9sbGVyIHVzaW5nIEhlbG1cbiAgICBjbHVzdGVyLmFkZENoYXJ0KFwiQUxCSW5ncmVzc0NvbnRyb2xsZXJcIiwge1xuICAgICAgY2hhcnQ6IFwiYXdzLWFsYi1pbmdyZXNzLWNvbnRyb2xsZXJcIixcbiAgICAgIHJlcG9zaXRvcnk6IFwiaHR0cDovL3N0b3JhZ2UuZ29vZ2xlYXBpcy5jb20va3ViZXJuZXRlcy1jaGFydHMtaW5jdWJhdG9yXCIsXG4gICAgICBuYW1lc3BhY2U6IFwia3ViZS1zeXN0ZW1cIlxuICAgIH0pO1xuXG4gICAgLy8gY2x1c3Rlci5hZGRSZXNvdXJjZShcIkhlbGxvQXBwXCIsIC4uLmhlbGxvLnJlc291cmNlcyk7ID9cbiAgfVxufVxuIl19