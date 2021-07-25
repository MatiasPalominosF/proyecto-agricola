///////////////////// Start Barchart ///////////////
export const barChartOptions: any = {
    responsive: true,
    scaleShowVerticalLines: false,
    maintainAspectRatio: false,
    legend: {
        labels: {
            padding: 30
        }
    },
    scales: {
        xAxes: [{
            categoryPercentage: 0.36,
            barPercentage: 0.68
        }]
    }
};
export const barChartLabels: string[] = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];
export const barChartType = 'bar';
export const barChartLegend = true;
export const barChartData: any[] = [
    { data: [70, 75, 90, 60, 80, 75, 65], label: 'Fulfilled' },
    { data: [60, 65, 80, 63, 90, 80, 70], label: 'Booked' },
    { data: [42, 45, 65, 40, 42, 63, 35], label: 'Arrived' },
    { data: [50, 55, 70, 40, 47, 65, 38], label: 'No show' },
    { data: [40, 40, 45, 45, 45, 40, 45], label: 'reschedule' },
    {

        type: 'line',  // override the default type
        data: [40, 60, 80, 60, 75, 60, 70],
        label: 'Appointment',
        backgroundColor: 'rgba(0,255,255,0)',
        borderColor: '#1e9ff2',
        fill: false,
        pointBorderColor: '#1e9ff2',
        pointBackgroundColor: '#FFF',
        pointBorderWidth: 2,
        pointHoverBorderWidth: 2,
        pointRadius: 4
    }
];
export const barChartColors: Array<any> = [
    {
        backgroundColor: '#00a5a8',
        borderColor: '#00a5a8',
        pointBackgroundColor: '#00a5a8',
        pointBorderColor: '#00a5a8',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: '#00a5a8',
    },
    {
        backgroundColor: '#ff4081',
        borderColor: '#ff4081',
        pointBackgroundColor: '#ff4081',
        pointBorderColor: '#ff4081',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: '#ff4081'
    },
    {
        backgroundColor: '#626e82',
        borderColor: '#626e82',
        pointBackgroundColor: '#626e82',
        pointBorderColor: '#626e82',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: '#626e82'
    },
    {
        backgroundColor: '#ff6e40',
        borderColor: '#ff6e40',
        pointBackgroundColor: '#ff6e40',
        pointBorderColor: '#ff6e40',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: '#ff6e40'
    },
    {
        backgroundColor: '#7c4dff',
        borderColor: '#7c4dff',
        pointBackgroundColor: '#7c4dff',
        pointBorderColor: '#7c4dff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: '#7c4dff'
    },
];
  ///////////////////// End barchart////////////////
