import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Component, inject, signal, ViewChildren, QueryList, AfterViewInit, OnInit, ChangeDetectorRef } from '@angular/core';
import { ChartModule } from 'primeng/chart';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ButtonComponent } from '../../../components/button/button.component';
import { PanelComponent } from '../../../components/panel/panel.component';
import { SurvyService } from '@app/services/survy.service';
import * as XLSX from 'xlsx';
import { jsPDF } from 'jspdf';
import { Document, Paragraph, TextRun, ImageRun, Packer } from 'docx';
import { UIChart } from 'primeng/chart';
import { sendNotification, ToastType } from '@adapters/sonner-adapter';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-statistics-view-page',
  standalone: true,
  imports: [
    RouterLink,
    ButtonComponent,
    PanelComponent,
    ChartModule,
    TableModule,
    TagModule,
    CommonModule
  ],
  templateUrl: './statistics-view-page.component.html',
  styleUrls: ['./statistics-view-page.component.css']
})
export default class StatisticsViewPageComponent implements OnInit, AfterViewInit {
  private router = inject(Router);
  private surveyService = inject(SurvyService);
  private route = inject(ActivatedRoute);
  private cdr = inject(ChangeDetectorRef);

  public dataSurvey = signal<any>({ formGeneralInfo: {}, formStats: [] });
  public chartOptions: { [key: number]: any } = {};
  private chartInstances: { [key: number]: any } = {};
  
  @ViewChildren(UIChart) chartComponents!: QueryList<UIChart>;

  ngOnInit(): void {
    const idForm = this.route.snapshot.params['formId'];
    if (idForm) {
      this.getStatistics(idForm);
    }
  }

  ngAfterViewInit(): void {
    // Wait for charts to render and then store references
    setTimeout(() => {
      this.storeChartReferences();
    }, 1000);

    // Subscribe to changes in chart components
    this.chartComponents.changes.subscribe(() => {
      setTimeout(() => {
        this.storeChartReferences();
      }, 500);
    });
  }

  getStatistics(idForm: number): void {
    this.surveyService.getStatisticsSurvey(idForm).then((response: any) => {
      if (response.success) {
        this.dataSurvey.set({
          formGeneralInfo: response.data.formGeneralInfo,
          formStats: response.data.formStats
        });
        this.initializeChartOptions();
        this.cdr.detectChanges();
        
        // Store chart references after data is loaded
        setTimeout(() => {
          this.storeChartReferences();
        }, 1000);
      } else {
        this.router.navigate(['/dashboard/survy/my-surveys']);
      }
    }).catch((error) => {
      console.error('Error loading statistics:', error);
      this.router.navigate(['/dashboard/survy/my-surveys']);
    });
  }

  initializeChartOptions(): void {
    this.dataSurvey().formStats.forEach((question: any) => {
      if (question.graphData) {
        const chartType = this.getChartType(question.type);
        this.chartOptions[question.idPregunta] = {
          type: chartType === 'stacked' ? 'bar' : chartType,
          data: {
            labels: question.graphData.labels,
            datasets: question.graphData.datasets.map((dataset: any, index: number) => ({
              ...dataset,
              backgroundColor: chartType === 'pie'
                ? this.generateColors(dataset.data.length)
                : this.generateColors(question.graphData.datasets.length)[index],
              borderColor: 'rgba(255, 255, 255, 0.8)',
              borderWidth: 1,
              stack: chartType === 'stacked' ? 'stack1' : undefined
            }))
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            interaction: { intersect: false },
            scales: chartType === 'pie' ? {} : {
              x: { stacked: chartType === 'stacked' },
              y: {
                stacked: chartType === 'stacked',
                beginAtZero: true,
                ticks: { stepSize: 1 }
              }
            },
            plugins: {
              legend: {
                display: chartType === 'stacked' || chartType === 'pie',
                position: 'bottom'
              },
              tooltip: { mode: 'index' }
            }
          }
        };
      }
    });
  }

  private storeChartReferences(): void {
    this.chartComponents.forEach((chartComponent, index) => {
      const questionId = this.dataSurvey().formStats[index]?.idPregunta;
      if (questionId && chartComponent.chart) {
        this.chartInstances[questionId] = chartComponent.chart;
        console.log(`Chart reference stored for question ${questionId}`);
      }
    });
  }

  private getCanvasFromChart(questionId: number): HTMLCanvasElement | null {
    // Try multiple methods to get the canvas
    
    // Method 1: From stored chart instance
    const chartInstance = this.chartInstances[questionId];
    if (chartInstance && chartInstance.canvas) {
      return chartInstance.canvas;
    }

    // Method 2: Direct DOM query
    const canvasElement = document.querySelector(`#chart-${questionId} canvas`) as HTMLCanvasElement;
    if (canvasElement) {
      return canvasElement;
    }

    // Method 3: Query by chart component
    const chartComponent = this.chartComponents.find((comp, index) => {
      return this.dataSurvey().formStats[index]?.idPregunta === questionId;
    });
    
    if (chartComponent && chartComponent.el) {
      const canvas = chartComponent.el.nativeElement.querySelector('canvas') as HTMLCanvasElement;
      if (canvas) {
        return canvas;
      }
    }

    return null;
  }

  getChartType(type: string): string {
    if (['true_false', 'single_choice', 'likert_scale'].includes(type)) {
      return 'pie';
    } else if (type === 'ranking') {
      return 'stacked';
    }
    return 'bar';
  }

  generateColors(count: number): string[] {
    const colors = [
      'rgba(255, 99, 132, 0.8)',
      'rgba(54, 162, 235, 0.8)',
      'rgba(255, 205, 86, 0.8)',
      'rgba(75, 192, 192, 0.8)',
      'rgba(153, 102, 255, 0.8)',
      'rgba(255, 159, 64, 0.8)',
      'rgba(201, 203, 207, 0.8)',
      'rgba(255, 99, 255, 0.8)'
    ];
    return Array(count).fill(0).map((_, i) => colors[i % colors.length]);
  }

  exportToImage(question: any): void {
    const canvas = this.getCanvasFromChart(question.idPregunta);
    
    if (!canvas) {
      console.error('Canvas not found for question:', question.idPregunta);
      sendNotification({
        type: 'error',
        summary: 'Error',
        message: 'No se pudo exportar la imagen. El gráfico no está disponible.'
      });
      return;
    }

    try {
      // Create a temporary canvas with title
      const tempCanvas = document.createElement('canvas');
      const originalWidth = canvas.width;
      const originalHeight = canvas.height;
      const titleHeight = 60;
      const padding = 20;

      tempCanvas.width = originalWidth + (padding * 2);
      tempCanvas.height = originalHeight + titleHeight + (padding * 2);
      const ctx = tempCanvas.getContext('2d')!;

      // White background
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);

      // Add title
      ctx.fillStyle = '#000000';
      ctx.font = 'bold 18px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      
      // Wrap text if too long
      const maxWidth = tempCanvas.width - (padding * 2);
      const words = question.shortQuestion.split(' ');
      let line = '';
      let y = titleHeight / 2 + padding;
      
      for (let n = 0; n < words.length; n++) {
        const testLine = line + words[n] + ' ';
        const metrics = ctx.measureText(testLine);
        const testWidth = metrics.width;
        
        if (testWidth > maxWidth && n > 0) {
          ctx.fillText(line, tempCanvas.width / 2, y);
          line = words[n] + ' ';
          y += 25;
        } else {
          line = testLine;
        }
      }
      ctx.fillText(line, tempCanvas.width / 2, y);

      // Draw the chart
      ctx.drawImage(canvas, padding, titleHeight + padding);

      // Download
      const link = document.createElement('a');
      link.download = `${question.shortQuestion.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.png`;
      link.href = tempCanvas.toDataURL('image/png');
      link.click();

      sendNotification({
        type: 'success',
        summary: 'Éxito',
        message: 'Imagen exportada correctamente.'
      });
    } catch (error) {
      console.error('Error exporting image:', error);
      sendNotification({
        type: 'error',
        summary: 'Error',
        message: 'Error al exportar la imagen.'
      });
    }
  }

  exportToExcel(question: any): void {
    try {
      if (!question.graphData || !question.graphData.labels) {
        sendNotification({
          type: 'error',
          summary: 'Error',
          message: 'No hay datos disponibles para exportar.'
        });
        return;
      }

      const exportData = question.graphData.labels.map((label: string, index: number) => {
        const dataPoint: any = { 'Opción': label };
        question.graphData.datasets.forEach((dataset: any) => {
          dataPoint[dataset.label || 'Valor'] = dataset.data[index] || 0;
        });
        return dataPoint;
      });

      const ws = XLSX.utils.json_to_sheet(exportData);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Datos');
      
      const fileName = `${question.shortQuestion.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.xlsx`;
      XLSX.writeFile(wb, fileName);

      sendNotification({
        type: 'success',
        summary: 'Éxito',
        message: 'Archivo Excel exportado correctamente.'
      });
    } catch (error) {
      console.error('Error exporting Excel:', error);
      sendNotification({
        type: 'error',
        summary: 'Error',
        message: 'Error al exportar el archivo Excel.'
      });
    }
  }

  exportToPDF(question: any): void {
    const canvas = this.getCanvasFromChart(question.idPregunta);
    
    if (!canvas) {
      console.error('Canvas not found for question:', question.idPregunta);
      sendNotification({
        type: 'error',
        summary: 'Error',
        message: 'No se pudo exportar el PDF. El gráfico no está disponible.'
      });
      return;
    }

    try {
      const pdf = new jsPDF();
      
      // Add title
      pdf.setFontSize(16);
      pdf.setFont('helvetica', 'bold');
      
      // Split long titles
      const splitTitle = pdf.splitTextToSize(question.shortQuestion, 170);
      pdf.text(splitTitle, 20, 20);
      
      // Calculate Y position after title
      const titleHeight = splitTitle.length * 7;
      const chartY = 20 + titleHeight + 10;

      // Add chart image
      const imgData = canvas.toDataURL('image/png');
      const imgWidth = 170;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      pdf.addImage(imgData, 'PNG', 20, chartY, imgWidth, imgHeight);

      // Add text results if available
      if (question.textResults && question.textResults.length > 0) {
        pdf.addPage();
        pdf.setFontSize(14);
        pdf.setFont('helvetica', 'bold');
        pdf.text('Respuestas detalladas', 20, 20);
        
        pdf.setFontSize(10);
        pdf.setFont('helvetica', 'normal');
        let yPos = 35;
        
        question.textResults.forEach((response: string, index: number) => {
          if (yPos > 270) { // New page if needed
            pdf.addPage();
            yPos = 20;
          }
          
          const splitResponse = pdf.splitTextToSize(`${index + 1}. ${response}`, 170);
          pdf.text(splitResponse, 20, yPos);
          yPos += splitResponse.length * 5 + 5;
        });
      }

      const fileName = `${question.shortQuestion.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.pdf`;
      pdf.save(fileName);

      sendNotification({
        type: 'success',
        summary: 'Éxito',
        message: 'PDF exportado correctamente.'
      });
    } catch (error) {
      console.error('Error exporting PDF:', error);
      sendNotification({
        type: 'error',
        summary: 'Error',
        message: 'Error al exportar el PDF.'
      });
    }
  }

  async exportToWord(question: any): Promise<void> {
    const canvas = this.getCanvasFromChart(question.idPregunta);
    
    if (!canvas) {
      console.error('Canvas not found for question:', question.idPregunta);
      sendNotification({
        type: 'error',
        summary: 'Error',
        message: 'No se pudo exportar el documento Word. El gráfico no está disponible.'
      });
      return;
    }

    try {
      // Convert canvas to image data
      const base64String = canvas.toDataURL('image/png').split(',')[1];
      const binaryString = atob(base64String);
      const len = binaryString.length;
      const bytes = new Uint8Array(len);
      for (let i = 0; i < len; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }

      const children = [
        new Paragraph({
          children: [
            new TextRun({ 
              text: question.shortQuestion, 
              bold: true, 
              size: 32 
            })
          ]
        }),
        new Paragraph({
          children: [
            new ImageRun({
              data: bytes,
              type: 'png',
              transformation: { 
                width: 600, 
                height: Math.round((canvas.height * 600) / canvas.width)
              }
            })
          ]
        })
      ];

      // Add text results if available
      if (question.textResults && question.textResults.length > 0) {
        children.push(
          new Paragraph({
            children: [
              new TextRun({ 
                text: 'Respuestas detalladas', 
                bold: true, 
                size: 24 
              })
            ]
          })
        );

        question.textResults.forEach((response: string, index: number) => {
          children.push(
            new Paragraph({
              children: [
                new TextRun({ 
                  text: `${index + 1}. ${response}`,
                  size: 20
                })
              ]
            })
          );
        });
      }

      const doc = new Document({
        sections: [{
          properties: {},
          children: children
        }]
      });

      const blob = await Packer.toBlob(doc);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${question.shortQuestion.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.docx`;
      link.click();
      window.URL.revokeObjectURL(url);

      sendNotification({
        type: 'success',
        summary: 'Éxito',
        message: 'Documento Word exportado correctamente.'
      });
    } catch (error) {
      console.error('Error exporting Word:', error);
      sendNotification({
        type: 'error',
        summary: 'Error',
        message: 'Error al exportar el documento Word.'
      });
    }
  }

  trackByQuestion(index: number, question: any): number {
    return question.idPregunta;
  }
}