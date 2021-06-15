import { getCitiesUrl, getTheatersUrl, getShowsUrl, getUserRoleUrl, getActorsUrl, getReservationsUrl, makeReservationsUrl, getPerformanceUrl, getUsersUrl } from '../config';
import axios from 'axios';
import { getToken } from './tokenStorage';
import { Show } from 'components/user/ShowComponent';

export interface CityData {
    id: string;
    name: string;
    image_uri: string;
}

export interface TheaterData {
    id: string;
    name: string;
    image_uri: string;
    city: string;
}

export interface Actor {
    id: string;
    name: string;
    image_uri: string;
}

export interface Performance {
    id: string;
    free_seats: number;
    max_seats: number;
    max_tickets: number;
    price: number;
    timestamp: number;
    show_id: string;
}

export interface Reservation { 
    id: string;
    number_of_tickets: number;
    price: number;
    show: Show;
    timestamp: number;
}

export interface ShowData {
    id: string;
    name: string;
    image_uri: string;
    theater: string;
    description: string;
    actors: Array<Actor>;
    performances: Array<Performance>;
}

export interface User {
    username: string;
    role: string;
    email: string;
}

export const UserRole = ['SuperAdmin', 'Admin'] as const;
export type UserRole = typeof UserRole[number];

export interface UserRoleData {
    role: UserRole;
}

export async function getReservations() {
    const headers = await getRequestHeaders();
    const result = await axios.get(getReservationsUrl, headers);
    const reservationsArray: Array<Reservation> = result.data;
    return reservationsArray; 
}

export async function getCities() {
    const headers = await getRequestHeaders();
    const result = await axios.get(getCitiesUrl, headers);
    const cityArray: Array<CityData> = result.data;
    return cityArray;
}

export async function getUsers() {
    const headers = await getRequestHeaders();
    const result = await axios.get(getUsersUrl, headers);
    const usersArray: Array<User> = result.data;
    return usersArray;
}

export async function getUserRole() {
    const headers = await getRequestHeaders();
    const result = await axios.get(`${getUserRoleUrl}`, headers);
    const roleResult: UserRoleData = result.data;
    return roleResult.role;
}

export async function getTheatersForCity(id: string) {
    const headers = await getRequestHeaders();
    const result = await axios.get(`${getCitiesUrl}/${id}/theaters`, headers);
    const theaterArray: Array<TheaterData> = result.data;
    return theaterArray;
}

export async function getTheaters() {
    const headers = await getRequestHeaders();
    const result = await axios.get(`${getTheatersUrl}`, headers);
    const theaterArray: Array<TheaterData> = result.data;
    return theaterArray;
}

export async function deleteTheater(id: string) {
    const headers = await getRequestHeaders();
    return await axios.delete(`${getTheatersUrl}/${id}`, headers);
}

export async function addTheater(name: string, image: string, cityId: string) {
    const headers = await getRequestHeaders();
    const body = JSON.stringify({
        name,
        image,
        city: cityId
    })
    return await axios.post(`${getTheatersUrl}`, body, headers)
}

export async function addShow(name: string, description: string, image: string, theaterId: string, actors: Array<string>) {
    const headers = await getRequestHeaders();
    const body = JSON.stringify({
        name,
        image,
        theater: theaterId,
        description, 
        actors,
    })
    return await axios.post(`${getShowsUrl}`, body, headers)
}

export async function getShowsForTheater(id: string) {
    const headers = await getRequestHeaders();
    const result = await axios.get(`${getTheatersUrl}/${id}/shows`, headers);
    const showsArray: Array<ShowData> = result.data;
    return showsArray;
}

export async function getShow(id: string) {
    const headers = await getRequestHeaders();
    const result = await axios.get(`${getShowsUrl}/${id}`, headers);
    const show: ShowData = result.data;
    return show;
}

export async function getActor(id: string) {
    const headers = await getRequestHeaders();
    const result = await axios.get(`${getActorsUrl}/${id}`, headers);
    const actor: Actor = result.data;
    return actor;
}

export async function deleteShow(id: string) {
    const headers = await getRequestHeaders();
    return await axios.delete(`${getShowsUrl}/${id}`, headers);
}

export async function deleteCity(id: string) {
    const headers = await getRequestHeaders();
    return await axios.delete(`${getCitiesUrl}/${id}`, headers);
}

export async function deleteUser(id: string) {
    const headers = await getRequestHeaders();
    return await axios.delete(`${getUsersUrl}/${id}`, headers);
}

export async function addCity(name: string, image: string) {
    const headers = await getRequestHeaders();
    const body = JSON.stringify({
        name,
        image
    })
    return await axios.post(`${getCitiesUrl}`, body, headers)
}

export async function getUser(id: string) {
    const headers = await getRequestHeaders();
    const result = await axios.get(`${getUsersUrl}/${id}`, headers);
    const user: User = result.data;
    return user;
}

export async function addUser(email: string, password: string, role: string) {
    const headers = await getRequestHeaders();
    const body = JSON.stringify({
        email,
        password,
        role
    })
    return await axios.post(`${getUsersUrl}`, body, headers)
}

export async function updateUser(id: string, role: string) {
    const headers = await getRequestHeaders();
    const body = JSON.stringify({
        username: id,
        role
    })
    return await axios.put(`${getUsersUrl}`, body, headers)
}

export async function addActor(name: string, image: string) {
    const headers = await getRequestHeaders();
    const body = JSON.stringify({
        name,
        image
    })
    return await axios.post(`${getActorsUrl}`, body, headers)
}

export async function getRequestHeaders() {
    const token = await getToken();
    return {
        headers: { 'Authorization': `Bearer ${token}` }
    }
}

export async function getActors() {
    const headers = await getRequestHeaders();
    const result = await axios.get(getActorsUrl, headers);
    const actorArray: Array<Actor> = result.data;
    return actorArray;
}

export async function makeReservation(performanceId: string, numberOfTickets: number) { 
    const headers = await getRequestHeaders();
    const body = JSON.stringify({
        performanceId, 
        numberOfTickets
    })
    return await axios.post(makeReservationsUrl, body, headers)
}

export async function deleteReservation(id: string) {
    const headers = await getRequestHeaders();
    return await axios.delete(`${makeReservationsUrl}/${id}`, headers);
}

export async function deletePerformance(id: string) {
    const headers = await getRequestHeaders();
    return await axios.delete(`${getPerformanceUrl}/${id}`, headers);
}

export async function deleteActor(id: string) {
    const headers = await getRequestHeaders();
    return await axios.delete(`${getActorsUrl}/${id}`, headers);
}

export async function getPerformance(id: string) {
    const headers = await getRequestHeaders();
    const result = await axios.get(`${getPerformanceUrl}/${id}`, headers);
    const performance: Performance = result.data;
    return performance;
}

export async function addPerformance(showId: string, price: number, maxSeats: number, timestamp: number) { 
    const headers = await getRequestHeaders();
    const body = JSON.stringify({
        price, 
        max_seats: maxSeats,
        timestamp, 
        max_tickets: 5,
        show_id: showId, 
    })
    return await axios.post(getPerformanceUrl, body, headers)
}

export async function getCity(cityId: string) {
    const headers = await getRequestHeaders();
    const result = await axios.get(`${getCitiesUrl}/${cityId}`, headers);
    const city: CityData = result.data;
    return city;
}

export async function updateCity(id: string, name: string, image: string) { 
    const headers = await getRequestHeaders();
    const body = JSON.stringify({
        id,
        name,
        image: image ?? undefined
    })
    return await axios.put(`${getCitiesUrl}`, body, headers)
}

export async function updateActor(id: string, name: string, image: string) { 
    const headers = await getRequestHeaders();
    const body = JSON.stringify({
        id,
        name,
        image: image ?? undefined
    })
    return await axios.put(`${getActorsUrl}`, body, headers)
}


export async function getTheater(theaterId: string) {
    const headers = await getRequestHeaders();
    const result = await axios.get(`${getTheatersUrl}/${theaterId}`, headers);
    const city: TheaterData = result.data;
    return city;
}

export async function updateTheater(id: string, cityId: string, name: string, image: string) { 
    const headers = await getRequestHeaders();
    const body = JSON.stringify({
        id,
        name,
        city: cityId,
        image: image ?? undefined
    })
    return await axios.put(`${getTheatersUrl}`, body, headers)
}

export async function updateShow(id: string, description: string, name: string, image: string, theaterId: string, actors: Array<string>) { 
    const headers = await getRequestHeaders();
    const body = JSON.stringify({
        id,
        name,
        description,
        theater: theaterId,
        actors,
        image: image ?? undefined
    })
    return await axios.put(`${getShowsUrl}`, body, headers)
}

export async function updatePerformance(id: string, showId: string, price: number, maxSeats: number, timestamp: number) { 
    const headers = await getRequestHeaders();
    const body = JSON.stringify({
        id,
        price, 
        max_seats: maxSeats,
        timestamp, 
        max_tickets: 5,
        show_id: showId, 
    })
    return await axios.put(`${getPerformanceUrl}`, body, headers)
}