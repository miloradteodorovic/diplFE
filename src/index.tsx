import { mount, route, map } from 'navi'
import React, { Suspense } from 'react'
import ReactDOM from 'react-dom'
import { Router, View } from 'react-navi'
import { CityComponent } from './components/user/CityIComponent'
import { HomeScreen } from './components/user/HomeScreen'
// Importing the Bootstrap CSS
import 'bootstrap/dist/css/bootstrap.min.css';
import { Login } from './components/Login'
import { getToken } from './network/tokenStorage'
import { TheaterComponent } from './components/user/TheaterComponent'
import { ShowComponent } from './components/user/ShowComponent'
import { getUserRole, UserRole } from './network/requests'
import { ErrorPage } from './components/ErrorPage'
import { AdminHome } from './components/admin/AdminHome'
import { ManageCities } from './components/admin/ManageCities'
import { ToastContainer } from 'react-toastify';
import { AddCity } from './components/admin/AddCity'
import { AddTheater } from './components/admin/AddTheater'
import { ManageTheaters } from './components/admin/ManageTheaters'
import { AddShow } from './components/admin/AddShow'
import { ManageShows } from './components/admin/ManageShows'
import { ReservationsComponent } from './components/user/ReservationsComponent'
import { ManagePerformances } from './components/admin/ManagePerformances'
import { EditPerformance } from './components/admin/EditPerformance'
import { AddPerformance } from './components/admin/AddPerformance'
import { EditCity } from './components/admin/EditCity'
import { EditTheater } from './components/admin/EditTheater'
import { EditShow } from './components/admin/EditShow'
import { ManageActors } from './components/admin/ManageActors'
import { AddActor } from './components/admin/AddActor'
import { EditActor } from './components/admin/EditActor'
import { ManageUsers } from './components/admin/ManageUsers'
import { AddAdminUser } from './components/admin/AddUser'
import { EditUser } from './components/admin/EditUser'

const routes =
  mount({
    '/': map(() => {
      return route({
        title: "",
        view: <Login />,
      });
    }),
    '/home': map(async (req) => {
      const code = req.params.code;
      localStorage.setItem('code', code);
      await getToken();
      const role: UserRole = await getUserRole();
      console.log('role: ', role);
      switch (role) {
        case UserRole[0]:
          return route({
            title: "Welcome to pozorista",
            view: <AdminHome isSuperAdmin={true} />,
          });
        case UserRole[1]:
          return route({
            title: "Welcome to pozorista",
            view: <AdminHome isSuperAdmin={false} />,
          })
        default:
          return route({
            title: "Welcome to pozorista",
            view: <HomeScreen />,
          });
      }
    }),
    'city/:cityName/:id': route(async (req) => {
      const cityName = req.params.cityName;
      const cityId = req.params.id;
      return ({
        title: cityName,
        view: <CityComponent id={cityId} name={cityName} />,
      })
    }),
    'theater/:theaterName/:id': route(async (req) => {
      const theaterName = req.params.theaterName;
      const theaterId = req.params.id;
      return ({
        title: theaterName,
        view: <TheaterComponent id={theaterId} name={theaterName} />,
      })
    }),
    'show/:showName/:id': route(async (req) => {
      const showName = req.params.showName;
      const showId = req.params.id;
      return ({
        title: showName,
        view: <ShowComponent id={showId} name={showName} />,
      })
    }),
    'reservations': route(async (req) => {
      return ({
        title: 'Reservations',
        view: <ReservationsComponent />,
      })
    }),


    // Admin routes
    'admin/cities': route(async (req) => {
      return ({
        title: 'Manage cities',
        view: <ManageCities />,
      })
    }),
    'admin/actors': route(async (req) => {
      return ({
        title: 'Manage actors',
        view: <ManageActors />,
      })
    }),
    '/add-city': route({
      title: 'Add city',
      view: <AddCity />,
    }),
    '/add-actor': route({
      title: 'Add actor',
      view: <AddActor />,
    }),
    'admin/theaters': route(async (req) => {
      return ({
        title: 'Manage theaters',
        view: <ManageTheaters />,
      })
    }),
    '/add-theater': route({
      title: 'Add theater',
      view: <AddTheater />,
    }),
    'admin/theater/:theaterName/:id': route(async (req) => {
      const theaterName = req.params.theaterName;
      const theaterId = req.params.id;
      return ({
        title: theaterName,
        view: <ManageShows theaterName={theaterName} theaterId={theaterId} />,
      })
    }),
    'admin/show/:showName/:id': route(async (req) => {
      const showName = req.params.showName;
      const showId = req.params.id;
      return ({
        title: showName,
        view: <ShowComponent id={showId} name={showName} />,
      })
    }),
    '/add-show/:theaterName/:theaterId': route(async (req) => {
      const theaterName = req.params.theaterName;
      const theaterId = req.params.theaterId;
      return {
        title: 'Add show',
        view: <AddShow theaterName={theaterName} theaterId={theaterId} />,
      }
    }),
    '/admin/performances/:showId': route(async (req) => {
      const showId = req.params.showId;
      return {
        title: 'Manage performances',
        view: <ManagePerformances showId={showId} />,
      }
    }),
    '/admin/edit-actor/:actorId': route(async (req) => {
      const actorId = req.params.actorId;
      return {
        title: 'Manage performances',
        view: <EditActor actorId={actorId} />,
      }
    }),
    '/admin/performance/:performanceId': route(async (req) => {
      const performanceId = req.params.performanceId;
      return {
        title: 'Edit performance',
        view: <EditPerformance performanceId={performanceId} />,
      }
    }),
    '/admin/add-performance/:showId': route(async (req) => {
      const showId = req.params.showId;
      return {
        title: 'Add performance',
        view: <AddPerformance showId={showId} />,
      }
    }),
    '/admin/edit-city/:cityId': route(async (req) => {
      const cityId = req.params.cityId;
      return {
        title: 'Edit city',
        view: <EditCity cityId={cityId} />,
      }
    }),
    '/admin/edit-theater/:theaterId': route(async (req) => {
      const theaterId = req.params.theaterId;
      return {
        title: 'Edit theater',
        view: <EditTheater theaterId={theaterId} />,
      }
    }),
    '/admin/edit-show/:theaterName/:showId': route(async (req) => {
      const showId = req.params.showId;
      const theaterName = req.params.theaterName;
      return {
        title: 'Edit show',
        view: <EditShow theaterName={theaterName} showId={showId} />,
      }
    }),
    '/admin/edit-performance/:performanceId': route(async (req) => {
      const performanceId = req.params.performanceId;
      return {
        title: 'Edit performance',
        view: <EditPerformance performanceId={performanceId} />,
      }
    }),
    'admin/users': route({
      title: 'Manage users',
      view: <ManageUsers />
    }),
    'admin/add-user': route({
      title: 'Add user',
      view: <AddAdminUser />
    }),
    '/admin/edit-user/:userId': route(async (req) => {
      const userId = req.params.userId;
      return {
        title: 'Edit user',
        view: <EditUser userId={userId} />,
      }
    }),

    
    '/error': route({
      title: 'Oops',
      view: <ErrorPage />,
    }),
  });


ReactDOM.render(
  <Router routes={routes}>
    <ToastContainer />
    <Suspense fallback={null}>
      <View />
    </Suspense>
  </Router >, document.getElementById('root'));