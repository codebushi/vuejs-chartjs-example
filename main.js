var app = new Vue({
    el: '#app',
    data: {
        chart: null,
        city: '',
        dates: [],
        temps: [],
        loading: false,
        errored: false
    },
    methods: {
        getData: function() {

            this.loading = true;

            if (this.chart != null) {
                this.chart.destroy();
            }

            axios.get('https://api.openweathermap.org/data/2.5/forecast', {
                params: {
                    q: this.city,
                    units: 'imperial',
                    appid: 'fd3150a661c1ddc90d3aefdec0400de4'
                }
            })
            .then(response => {

                this.dates = response.data.list.map(list => {
                    return list.dt_txt
                })

                this.temps = response.data.list.map(list => {
                    return list.main.temp;
                })

                var ctx = document.getElementById("myChart");
                this.chart = new Chart(ctx, {
                    type: 'line',
                    data: {
                        labels: this.dates,
                        datasets: [{
                            label: 'Avg. Temp',
                            backgroundColor: 'rgba(54, 162, 235, 0.5)',
                            borderColor: 'rgb(54, 162, 235)',
                            fill: false,
                            data: this.temps
                        }]
                    },
                    options: {
                        title: {
                            display: true,
                            text: 'Temperature with Chart.js'
                        },
                        tooltips: {
                            callbacks: {
                                label: function(tooltipItem, data) {
                                    var label = data.datasets[tooltipItem.datasetIndex].label || '';

                                    if (label) {
                                        label += ': ';
                                    }

                                    label += Math.floor(tooltipItem.yLabel);
                                    return label + '°F';
                                }
                            }
                        },
                        scales: {
                            xAxes: [{
                                type: 'time',
                                time: {
                                    unit: 'hour',
                                    displayFormats: {
                                        hour: 'M/DD @ hA'
                                    },
                                    tooltipFormat: 'MMM. DD @ hA'
                                },
                                scaleLabel: {
                                    display: true,
                                    labelString: 'Date/Time'
                                }
                            }],
                            yAxes: [{
                                scaleLabel: {
                                    display: true,
                                    labelString: 'Temperature (°F)'
                                },
                                ticks: {
                                    callback: function(value, index, values) {
                                        return value + '°F';
                                    }
                                }
                            }]
                        },
                    }
                });

            })
            .catch(error => {
                console.log(error);
                this.errored = true;
            })
            .finally(() => this.loading = false)
        }
    }
})