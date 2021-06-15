import React, { useEffect, useState } from 'react';
import { getShow, deletePerformance } from '../../network/requests';
import { parsePerformanceTime, removeArrayItem } from '../../util';
import { Button, CircularProgress } from '@material-ui/core';
import { useNavigation } from 'react-navi';
import { AdminMainMenuComponent } from '../../components/menu/AdminMainMenu';

interface ManagePerformanceProps {
    showId: string;
}

interface Performance {
    id: string;
    freeSeats: number;
    maxSeats: number;
    time: string;
    price: number;
}

export function ManagePerformances({ showId }: ManagePerformanceProps) {
    const [performanceList, setPerformanceList] = useState<Array<Performance>>();
    const navigation = useNavigation();

    useEffect(() => {
        async function fetchPerformances() {
            const showsResult = await getShow(showId);
            const mappedPerformances: Array<Performance> = showsResult.performances.map((performance) =>
                ({
                    id: performance.id,
                    freeSeats: performance.free_seats,
                    maxSeats: performance.max_seats,
                    time: parsePerformanceTime(new Date(performance.timestamp)),
                    price: performance.price,
                }))
            setPerformanceList(mappedPerformances);
        }
        fetchPerformances()
    }, [performanceList, setPerformanceList])

    if (!performanceList || performanceList === undefined) {
        return <div className="centerLoader">
            <CircularProgress />
        </div>;
    }

    const performances = performanceList.map((performance) => {
        return <div className="adminCard" key={performance.id}>
            <p>Date and time: </p>
            <p>{performance.time}</p>
            <p>Price: {performance.price}RSD</p>
            <p>Max seats: {performance.maxSeats}</p>
            <div className="adminCardButtonContainer">
                <Button className="adminCardButton" onClick={async () => {
                    await deletePerformance(performance.id)
                    setPerformanceList(removeArrayItem(performanceList, performance))
                }}>Delete</Button>
                <Button className="adminCardButton" onClick={async () => {
                    navigation.navigate(`/admin/edit-performance/${performance.id}`)
                }}>Edit</Button>
            </div>
        </div>
    })

    return <div>
        <AdminMainMenuComponent />
        <div className="container">
            <Button className="adminCardButton" onClick={async () => {
                navigation.navigate(`/admin/add-performance/${showId}`)
            }}>Add new performance</Button>
            <div className="container-horizontal">
                {performances}
            </div>
        </div>
    </div>
}