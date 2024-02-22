import { Component, Input, OnInit } from '@angular/core';
import { LegendPosition } from '@swimlane/ngx-charts';
import { ApplicationDeployment, Deployment } from '../../models/deployment.model';
import { S3Service } from 'src/app/services/s3.service';


interface DeploymentSeries {
  name: string;
  series: { name: string; value: number }[];
}

interface TransformedData {
  [key: string]: DeploymentSeries;
}

@Component({
  selector: 'app-history-graph',
  templateUrl: './history-graph.component.html',
  styleUrls: ['./history-graph.component.less']
})
export class HistoryGraphComponent implements OnInit {
  multi: any[] = [];
  view: [number, number] = [750, 400];
  showXAxis = true;
  showYAxis = true;
  gradient = false;
  showLegend = true;
  legendPosition = LegendPosition.Below
  showXAxisLabel = true;
  xAxisLabel = 'Date';
  showYAxisLabel = true;
  yAxisLabel = 'Cost(€)';

  @Input() application!: string;
  @Input() environment!: string;

  constructor(private s3Service: S3Service) {
    
  }

  ngOnInit(): void {
    this.fetchHistory();
  }

  fetchHistory(): void {
    const timestamps = ['1704105988', '1705315588', '1706611588'];

    if (this.application && this.environment) {
      this.s3Service.fetchDeploymentHistory(this.application, this.environment, timestamps)
        .subscribe({
          next: (data) => {
            const aggregatedData = this.aggregateDeploymentCostsByType(data);
            this.multi = this.transformForStackedChart(aggregatedData);
          },
          error: (error) => console.error('Error fetching history:', error)
        });
    }
  }


  aggregateDeploymentCostsByType(historyData: { timestamp: string; ApplicationDeployment: ApplicationDeployment }[]): any[] {
    const aggregatedData = historyData.map(data => {
      const deploymentCostsByType: { [type: string]: number } = {};
  
      data.ApplicationDeployment.Deployments.forEach((deployment: Deployment) => {
        const { DeploymentType, ResourcesCosts } = deployment;
        if (deploymentCostsByType[DeploymentType]) {
          deploymentCostsByType[DeploymentType] += ResourcesCosts;
        } else {
          deploymentCostsByType[DeploymentType] = ResourcesCosts;
        }
      });
  
      return {
        timestamp: data.timestamp,
        deploymentCostsByType
      };
    });
  
    return aggregatedData;
  }

  transformForStackedChart(aggregatedData: any[]): DeploymentSeries[] {
    const transformed: TransformedData = {};
    
    function isNumber(value: unknown): value is number {
      return typeof value === 'number' && !isNaN(value);
    }
    aggregatedData.forEach(({ timestamp, deploymentCostsByType }) => {
      Object.entries(deploymentCostsByType).forEach(([type, cost]) => {
        if (!transformed[type]) {
          transformed[type] = { name: type, series: [] };
        }
        transformed[type].series.push({ name: timestamp, value: isNumber(cost) ? cost : 0 });
      });
    });
  
    return Object.values(transformed);
  }
  

  
}
