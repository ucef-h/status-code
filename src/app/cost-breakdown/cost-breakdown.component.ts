import { Component, Input, OnInit } from '@angular/core';
import { ApplicationDeployment, Deployment } from '../models/deployment.model';
import { S3Service } from '../services/s3.service';

@Component({
  selector: 'app-cost-breakdown',
  templateUrl: './cost-breakdown.component.html',
  styleUrls: ['./cost-breakdown.component.less']
})
export class CostBreakdownComponent implements OnInit {
  @Input() s3Url?: string;
  deploymentData: ApplicationDeployment | null = null;
  aggregatedCostsPerType: { [key: string]: number } = {};
  groupedDeployments: { [type: string]: Deployment[] } = {};
  deploymentCost: number = 0;
  selectedDisplayType: string = 'none';
  selectedApplication: string = 'none';
  selectedEnvironment: string = 'none';
  showStartCard:boolean = true

  constructor(private s3Service: S3Service) { }

  ngOnInit(): void {


  }

  aggregateCosts(): void {
    if (!this.deploymentData) return;
    this.aggregatedCostsPerType = {}
    this.deploymentCost = 0,
      this.deploymentData.Deployments.forEach(deployment => {
        if (this.aggregatedCostsPerType[deployment.DeploymentType]) {
          this.aggregatedCostsPerType[deployment.DeploymentType] += deployment.ResourcesCosts;
        } else {
          this.aggregatedCostsPerType[deployment.DeploymentType] = deployment.ResourcesCosts;
        }
        this.deploymentCost += deployment.ResourcesCosts;
      });
  }
  groupDeployments(): void {
    if (!this.deploymentData) return;
    this.deploymentData.Deployments.forEach(deployment => {
      if (!this.groupedDeployments[deployment.DeploymentType]) {
        this.groupedDeployments[deployment.DeploymentType] = [];
      }
      this.groupedDeployments[deployment.DeploymentType].push(deployment);
    });
  }

  onSelectionChanged(selection: { application: string, environment: string, displayType: string }): void {
    this.selectedDisplayType = selection.displayType

    if (selection.application === 'none' || selection.environment === 'none' || selection.displayType === 'none') {
      this.resetComponentState();
      this.showStartCard = true;
    }
    if (selection.displayType == 'breakdown') {
      const url = null
      this.s3Service.fetchDeploymentData('').subscribe(data => {
        this.deploymentData = data;
        this.aggregateCosts();
        this.groupDeployments();
        this.showStartCard = false;
      });
    }
    if (selection.displayType == 'history') {
      this.selectedApplication  = selection.application
      this.selectedEnvironment = selection.environment
      this.showStartCard = false;
    }

  }

  private resetComponentState(): void {
    this.deploymentData = null;
    this.aggregatedCostsPerType = {};
    this.deploymentCost = 0;
    this.groupedDeployments = {};
   
  }

  objectKeys(obj: any): string[] {
    return Object.keys(obj);
  }
}
