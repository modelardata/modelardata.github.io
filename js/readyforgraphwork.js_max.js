var ctx = document.getElementById('performance').getContext('2d');
                            var myBarChart = new Chart(ctx, {
                                type: 'bar',
                                xAxisID: 'test',
                                data: {
                                    labels: ["Statement 1", "Statement 2", "Statement 3"],
                                    datasets: [
                                        {
                                            barPercentage: 0.5,
                                            barThickness: 4,
                                            maxBarThickness: 8,
                                            minBarLength: 5,
                                            label: "Columno",
                                            backgroundColor: "#3e95cd",
                                            data: []
                                        },
                                        {
                                            barPercentage: 0.5,
                                            barThickness: 4,
                                            maxBarThickness: 8,
                                            minBarLength: 5,
                                            label: "PostgreSQL",
                                            backgroundColor: "#c45850",
                                            data: []
                                        }
                                    ]
                                },

                                options: {
                                    legend: {
                                        display: false

                                    },
                                    title: {
                                        //display: true,
                                        //text: 'Performance Results'
                                    }, scales: {
                                        yAxes: [{
                                            ticks: {
                                                beginAtZero: true
                                            },
                                            scaleLabel: {
                                                display: true,
                                                labelString: "milliseconds"
                                            }
                                        }],
                                        xAxes: [{
                                            scaleLabel: {
                                                display: false,
                                                labelString: "Statements"
                                            }
                                        }]
                                    }
                                },
                            });
                        var ctx = document.getElementById('cost').getContext('2d');
                            var myBarChart2 = new Chart(ctx, {
                                type: 'bar',
                                data: {
                                    labels: ["Statement 1", "Statement 2", "Statement 3"],
                                    datasets: [
                                        {
                                            barPercentage: 0.5,
                                            barThickness: 4,
                                            maxBarThickness: 8,
                                            minBarLength: 2,
                                            label: "Columno (back2back)",
                                            backgroundColor: "#3e95cd",
                                            data: []
                                        }, {
                                            barPercentage: 0.5,
                                            barThickness: 4,
                                            maxBarThickness: 8,
                                            minBarLength: 2,
                                            label: "Columno (1/sec)",
                                            backgroundColor: "#377fea",
                                            data: []
                                        },
                                        {
                                            barPercentage: 0.5,
                                            barThickness: 4,
                                            maxBarThickness: 8,
                                            minBarLength: 5,
                                            label: "PostgreSQL",
                                            backgroundColor: "#c45850",
                                            data: []
                                        }
                                    ]
                                },

                                options: {
                                    legend: {
                                        display: false

                                    },
                                    title: {
                                        //display: true,
                                        //text: 'Performance Results'
                                    }, scales: {
                                        yAxes: [{
                                            ticks: {
                                                //stepSize: 0.,
                                                beginAtZero: true,
                                            },
                                            scaleLabel: {
                                                display: true,
                                                labelString: "Price/month (USD)"
                                            }
                                        }],
                                        xAxes: [{
                                            scaleLabel: {
                                                display: false,
                                                labelString: "Statements"
                                            }
                                        }]
                                    }
                                },
                            });
