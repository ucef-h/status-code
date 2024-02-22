export interface Resource {
    ResourceType: string;
    ResourceCount: number;
    ResourceUnitCost: number;
    ResourceCost: number;
  }
  
  export interface Deployment {
    DeploymentType: string;
    DeploymentKey: string;
    DeploymentDescription: string;
    Resources: Resource[];
    ResourcesCosts: number;
  }
  
  export interface ApplicationDeployment {
    ApplicationName: string;
    ApplicationEnvironment: string;
    ApplicationURI: string;
    Deployments: Deployment[];
  }
  