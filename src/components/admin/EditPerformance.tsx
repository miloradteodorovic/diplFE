import React, { useState, useEffect } from 'react';
import { dateToMilliseconds } from '../../util';
import { getPerformance, updatePerformance } from '../../network/requests';
import { useNavigation } from 'react-navi';
import { AdminMainMenuComponent } from '../../components/menu/AdminMainMenu';
import { CircularProgress } from '@material-ui/core';
import DatePicker from "react-datepicker";
import { toastSuccess } from '../../components/ToastComponent';

interface EditPerformanceProps {
    performanceId: string;
}

export interface Performance {
    id: string;
    freeSeats: number;
    maxSeats: number;
    maxTickets: number;
    price: number;
    time: number;
    showId: string;
}

export function EditPerformance({ performanceId }: EditPerformanceProps) {
    const [startDate, setStartDate] = useState(new Date());
    const [performanceMaxSeats, setPerformanceMaxSeats] = useState(0);
    const [performancePrice, setPerformancePrice] = useState(0);
    const [showErrorMsg, setShowErrorMsg] = useState(false);

    const [performance, setPerformance] = useState<Performance>({ id: '', maxSeats: 0, maxTickets: 5, time: dateToMilliseconds(new Date()), freeSeats: 0, price: 0, showId: '' });
    const navigation = useNavigation();

    useEffect(() => {
        async function fetchPerformances() {
            const performanceResult = await getPerformance(performanceId);
            const fetchedPerformance: Performance = {
                id: performanceResult.id,
                freeSeats: performanceResult.free_seats,
                maxTickets: performanceResult.max_tickets,
                maxSeats: performanceResult.max_seats,
                time: performance.time,
                price: performanceResult.price,
                showId: performanceResult.show_id,
            }
            setPerformance(fetchedPerformance);
        }
        fetchPerformances()
    }, [])

    useEffect(() => {
        setStartDate(new Date(performance.time))
        setPerformanceMaxSeats(performance.maxSeats)
        setPerformancePrice(performance.price)
        document.getElementById("fprice")!!.value = performance.price;
        document.getElementById("fseats")!!.value = performance.maxSeats;
    }, [performance, setPerformance])

    if (!performance || performance === undefined) {
        return <div className="centerLoader">
            <CircularProgress />
        </div>;
    }

    console.log(performance);
    return <div>
        <AdminMainMenuComponent />
        <div className="container">
            <h2>Edit performance</h2>
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
                    if (performanceMaxSeats <= 0 || performancePrice <= 0) {
                        setShowErrorMsg(true)
                    } else {
                        await updatePerformance(performance.id, performance.showId, performancePrice, performanceMaxSeats, dateToMilliseconds(startDate))
                        toastSuccess('Successfully updated performance!')
                        navigation.navigate(`/admin/performances/${performance.showId}`)
                    }
                }}>Save changes</button>
            </div>
        </div>
    </div>
}