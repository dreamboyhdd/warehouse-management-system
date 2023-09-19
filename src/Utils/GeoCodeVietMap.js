import axios from "axios"
import { Alertwarning } from "../Utils";

export const GeoCodeVietMap = async (address) => {
    try {
        debugger
        let instance = axios.create({
            baseURL: `https://maps.vietmap.vn/api/search?api-version=1.1&apikey=71d17c8696052bd515b4c19509429548821da19ba1cae447&text=${address}&size=1&categories=`,
            timeout: 3000,
        });
        let res = await instance.get();
debugger
        if (res.data.code === "OK") {
            let newData = res.data.data.features[0]

            return [{
                lat: newData.geometry.coordinates[1],
                lng: newData.geometry.coordinates[0],
                AddressReturn: newData.properties.label
            }];

        } else {
            return "False";
        }

    } catch (error) {
        return "False";
    }
}