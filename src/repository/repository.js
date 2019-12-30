const BASE_URL = "https://better-nextbus.appspot.com"

import axios from 'axios'

export default axios.create({
    baseURL: BASE_URL
})
