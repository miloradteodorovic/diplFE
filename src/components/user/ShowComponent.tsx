import React, { useState, useEffect } from 'react';
import { getShow, makeReservation } from '../../network/requests';
import Loader from 'react-loader-spinner';
import { MainMenuComponent } from '../menu/MainMenuComponent';
import Select from "react-dropdown-select";
import { parsePerformanceTime } from '../../util';
import { toastSuccess } from '../../components/ToastComponent';
import { CircularProgress } from '@material-ui/core';

export interface ShowComponentProps {
    name: string;
    id: string;
}

export interface Actor {
    id: string;
    name: string;
}

export interface Performance {
    id: string;
    freeSeats: number;
    maxSeats: number;
    maxTickets: number;
    price: number;
    time: string;
}

export interface Show {
    name: string;
    id: string;
    imageSrc: string;
    performances: Array<Performance>;
    actors: Array<Actor>;
}

export function ShowComponent({ name, id }: ShowComponentProps) {
    const [show, setShow] = useState<Show>();
    const [ticketNumber, setTicketNumber] = useState(1);

    useEffect(() => {
        async function fetchShow() {
            const showResult = await getShow(id);
            const mappedPerformances: Array<Performance> = showResult.performances.map((performance) => ({
                id: performance.id,
                freeSeats: performance.free_seats,
                maxSeats: performance.max_seats,
                maxTickets: performance.max_tickets,
                price: performance.price,
                time: parsePerformanceTime(new Date(performance.timestamp)),
            }));

            const mappedActors: Array<Actor> = showResult.actors.map((actor) => ({
                id: actor.id,
                name: actor.name,
            }));

            const show: Show = {
                name: showResult.name,
                id: showResult.id,
                imageSrc: showResult.image_uri,
                performances: mappedPerformances,
                actors: mappedActors,
            }
            setShow(show);
        }
        fetchShow()
    }, [])

    if (!show || show === undefined) {
        return <div className="centerLoader">
            <CircularProgress />
        </div>;
    }

    const options = [
        {
            label: '1',
            value: 1
        }, 
        {
            label: '2',
            name: 2
        },
        {
            label: '3',
            name: 3
        },
        {
            label: '4',
            name: 4
        },
        {
            label: '5',
            name: 5
        }
    ]

    const actorList = show.actors.map((actor) => (<div key={actor.id}>{actor.name}</div>));
    const performanceList = show.performances.map((performance) => (
        <div key={performance.id}>
            <div>Datum i vreme izvodjenja: {performance.time}h</div>
            <div>Kapacitet: {performance.maxSeats}</div>
            <div>Slobodnih mesta: {performance.freeSeats}</div>
            <div>Cena: {performance.price}RSD</div>
            <button onClick={async () => {
                await makeReservation(performance.id, ticketNumber);
                toastSuccess('Reservation successfull.')
            }}>Rezervisi</button><br /><br />
        </div>));

    return (
        <div>
            <MainMenuComponent /><br />
            <div className="card">
                <img src={show.imageSrc} alt={show.name} />
                <h1>{name}</h1>
                <p className="price">Lista glumaca: </p>
                {actorList}
                <p>Broj karata: </p>
                <Select options={options} values={options} onChange={(values) => {
                    values[0].name != undefined ? setTicketNumber(values[0].name) : setTicketNumber(1);
                }} /><br /><br />
                <p>Raspolozivi termini: </p>
                {performanceList}
            </div>
        </div>
    )
}