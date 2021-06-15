import React, { useEffect, useState } from 'react';
import { getReservations, deleteReservation } from '../../network/requests';
import Loader from 'react-loader-spinner';
import { MainMenuComponent } from '../../components/menu/MainMenuComponent';
import { toastSuccess } from '../../components/ToastComponent';
import { parsePerformanceTime, removeArrayItem } from '../../util';
import { CircularProgress } from '@material-ui/core';

interface Reservation {
    id: string;
    name: string;
    ticketNumber: number;
    timeAndDate: string;
    price: number;
}

export function ReservationsComponent() {
    const [reservationList, setReservationList] = useState<Array<Reservation>>();

    useEffect(() => {
        async function fetchReservations() {
            const reservationsResult = await getReservations();
            const mappedReservations: Array<Reservation> = reservationsResult.map((reservation) =>
                ({
                    id: reservation.id,
                    name: reservation.show.name,
                    price: reservation.price,
                    ticketNumber: reservation.number_of_tickets,
                    timeAndDate: parsePerformanceTime(new Date(reservation.timestamp)),

                }))
            setReservationList(mappedReservations);
        }
        fetchReservations()
    }, [reservationList, setReservationList])

    if (!reservationList || reservationList === undefined) {
        return <div className="centerLoader">
            <CircularProgress />
        </div>;
    }

    const reservations = reservationList.map((reservation) => {
        return <div className="card" key={reservation.id}>
            <p>Performance name: </p>
            <p>{reservation.name}</p>
            <br />
            <p>Time: </p>
            <p>{reservation.timeAndDate}</p>
            <br />
            <p>Price: </p>
            <p>{reservation.price} RSD</p>
            <br />
            <p>Number of reserved tickets: </p>
            <p>{reservation.ticketNumber} </p>
            <br />
            <br />
            <br />
            <button onClick={async () => {
                await deleteReservation(reservation.id);
                toastSuccess('Successfully deleted reservation.')
                const newList = removeArrayItem(reservationList, reservation);
                setReservationList(newList);
            }}>Delete reservation</button>
        </div>
    })

    return <div>
        <MainMenuComponent /><br />
        <div className="card-horizontal">
            {reservationList.length > 0 ? reservations : <h2>No reservations made.</h2>}
        </div>
    </div>
}