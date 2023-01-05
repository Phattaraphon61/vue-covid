<template>
    <div class="content">
        <div>
            <h1>Covid-19</h1>
        </div>
        <div class="inputcalendar">
            <DatePicker v-model="start" :masks="masks">
                <template #default="{ inputValue, inputEvents }">
                    <input :value="inputValue" v-on="inputEvents" />
                </template>
            </DatePicker>
            <DatePicker v-model="end" :masks="masks">
                <template #default="{ inputValue, inputEvents }">
                    <input :value="inputValue" v-on="inputEvents" />
                </template>
            </DatePicker>
        </div>
        <div>
            <Line id="my-chart-id" :options="chartOptions" :data="chartData" />
        </div>

    </div>
</template>
<script >
import { Calendar, DatePicker } from 'v-calendar';
import { getAll } from "../services/api";
import { Bar, Line } from 'vue-chartjs'
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale, PointElement, LineElement } from 'chart.js'

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale, PointElement, LineElement)
export default {
    name: 'BarChart',
    components: { Bar, Line, Calendar, DatePicker },
    data() {
        return {
            start: this.subtractMonths(1, new Date()),
            end: new Date(),

            masks: {
                input: 'DD/MM/YYYY',
            },
            data: [],
            day: "0",
            cases: [],
            deaths: [],
            labels: [],
            recovered: [],
            chartData: {
                labels: ['January', 'February', 'March'],
                datasets: [
                    {
                        label: 'Cases',
                        data: [100, 100, 100],
                        backgroundColor: [
                            'rgba(255, 200, 132, 0.2)',
                        ],
                        borderColor: [
                            'rgb(255, 99, 132)',
                        ],
                        borderWidth: 1
                    },
                     {
                        label: 'Deaths',
                        data: [100, 100, 100],
                        backgroundColor: [
                            'rgba(255, 99, 132, 0.2)',
                        ],
                        borderColor: [
                            'rgb(255, 99, 132)',
                        ],
                        borderWidth: 1
                    }, {
                        label: 'recovered',
                        data: [100, 100, 100],
                        backgroundColor: [
                            'rgba(85, 249, 0, 0.2)',
                        ],
                        borderColor: [
                            'rgb(255, 99, 132)',
                        ],
                        borderWidth: 1
                    }
                ]
            },
            chartOptions: {
                responsive: true
            }
        }
    },
    watch: {
        end: function () {
            // console.log(this.start, this.end)
            this.getData();
        }
    },
    methods: {
        subtractMonths: function (numOfMonths, date = new Date()) {
            date.setMonth(date.getMonth() - numOfMonths);

            return date;
        },
        setChart: function (datas) {
            this.resetData();
            for (let i in this.filterdate(datas.cases)) {
                this.labels.push(new Date(i).toLocaleDateString('th-TH', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                }))
                this.cases.push(datas.cases[i])
            }
            for (let i in this.filterdate(datas.deaths)) {
                this.deaths.push(datas.deaths[i])
            } for (let i in this.filterdate(datas.recovered)) {
                this.recovered.push(datas.recovered[i])
            }
            this.chartData = {
                labels: this.labels,
                datasets: [{
                    label: 'Cases',
                    data: this.cases,
                    backgroundColor: [
                        'rgba(255, 200, 132, 0.2)',
                    ],
                    borderColor: [
                        'rgb(255, 99, 132)',
                    ],
                    borderWidth: 1
                }
                    , {
                        label: 'Deaths',
                        data: this.deaths,
                        backgroundColor: [
                            'rgba(255, 99, 132, 0.2)',
                        ],
                        borderColor: [
                            'rgb(255, 99, 132)',
                        ],
                        borderWidth: 1
                    }, {
                        label: 'recovered',
                        data: this.recovered,
                        backgroundColor: [
                            'rgba(85, 249, 0, 0.2)',
                        ],
                        borderColor: [
                            'rgb(255, 99, 132)',
                        ],
                        borderWidth: 1
                    }
                ]
            }
        },
        filterdate: function (data) {
            const asArray = Object.entries(data);
            const filtered = asArray.filter(([key, value]) => new Date(key).getTime() >= this.start.getTime() && new Date(key).getTime() <= this.end.getTime());
            const justStrings = Object.fromEntries(filtered);

            return justStrings;
        },
        onEnter: function () {
            this.getData();
        },
        getData: function () {
            if (this.data.length != 0) {
                this.setChart(this.data)
            } else {
                getAll(this.day).then(res => {
                    this.data = res.data;
                    this.setChart(res.data)
                })
            }
        },
        resetData: function () {
            this.cases = [];
            this.deaths = [];
            this.recovered = [];
            this.labels = [];
        }
    },
    mounted() {
        this.getData();
    }
}
</script>
<style scoped>
.content {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100vh;
}

.inputcalendar {
    display: flex;
    gap: 20px;
}

#my-chart-id {
    width: 90vw;
    height: 60vh;
}
</style>