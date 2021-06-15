import React, { useState, useEffect } from 'react';
import { useNavigation } from 'react-navi';
import { AdminMainMenuComponent } from '../../components/menu/AdminMainMenu';
import DatePicker from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css";
import { addPerformance } from '../../network/requests';
import { dateToMilliseconds } from '../../util';
import { toastSuccess } from '../../components/ToastComponent';

interface AddPerformanceProps {
    showId: string;
}

export function AddPerformance({ showId }: AddPerformanceProps) {
    const [startDate, setStartDate] = useState(new Date());
    const [performanceMaxSeats, setPerformanceMaxSeats] = useState(0);
    const [performancePrice, setPerformancePrice] = useState(0);
    const [showErrorMsg, setShowErrorMsg] = useState(false);
    const navigation = useNavigation();

    return <div>
        <AdminMainMenuComponent />
        <div className="container">
            <div className="addCityCard">
                <label>Price:</label><br />
                <input type="number" id="fprice" name="fprice" onChange={(event) => {
                    setPerformancePrice(parseInt(event.target.value));
                }}></input><br /><br /><br />
                <label>Max seats:</label><br />
                <input type="number" id="fseats" name="fseats" onChange={(event) => {
                    setPerformanceMaxSeats(parseInt(event.target.value));
                }}></input><br /><br /><br />
                <DatePicker selected={startDate} onChange={date => setStartDate(date)} showTimeSelect dateFormat="Pp" />
                {showErrorMsg ?
                    <label className="adminErrorLabel">Please provide valid time, price and max seats values.</label> : null}
                <br />
                <br />
                <br />
                {showErrorMsg ?
                    <label className="adminErrorLabel">Please provide name, city and upload image</label> : null}
                <button className="addCityButton" onClick={async () => {
                    if (performanceMaxSeats === 0 || performancePrice === 0) {
                        setShowErrorMsg(true)
                    } else {
                        await addPerformance(showId, performancePrice, performanceMaxSeats, dateToMilliseconds(startDate))
                        toastSuccess('Created performance.')
                        navigation.navigate(`/admin/performances/${showId}`)
                    }
                }}>Create performance</button>
            </div>
        </div>
    </div>
}