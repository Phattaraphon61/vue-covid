import axios from "axios";
const apiHost = "https://disease.sh";

export const getAll = (day) => {
    return axios.get(apiHost + `/v3/covid-19/historical/all?lastdays=${day}`)
};