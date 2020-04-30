import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/views/Login'
import HomeView from '@/views/HomeView'
import Tours from '@/views/Tours'
import Ambassadors from '@/views/Ambassadors'
import Semesters from '@/views/Semesters'
import Statistics from '@/views/Statistics'
import CreateTour from '@/views/CreateTour'
import CreateAmbassador from '@/views/CreateAmbassador'
import CreateSemester from '@/views/CreateSemester'
import ChangePassword from '@/views/ChangePassword'
import GraduatedAmbassadors from '@/views/GraduatedAmbassadors';

Vue.use(Router)

const routes = [
  { 
    path: '/', name: 'HomeView', component: HomeView,
    children: [
      { path: '/tours', name: 'ToursView', component: Tours},
      { path: '/ambassadors', name: 'AmbassadorsView', component: Ambassadors},
      { path: '/semesters', name: 'SemestersView', component: Semesters},
      { path: '/statistics', name: 'StatisticsView', component: Statistics},
      { path: '/graduatedAmbassadors', name: 'GraduatedAmbassadorsView', component: GraduatedAmbassadors},
      { path: '/createTour', name: 'CreateTourView', component: CreateTour},
      { path: '/createAmbassador', name: 'CreateAmbassadorView', component: CreateAmbassador},
      { path: '/createSemester', name: 'CreateSemesterView', component: CreateSemester},
      { path: '/', name: 'DefaultView', component: Tours}
    ]
  },
  { path: '/login', name: 'LoginView', component: Login },
  { path: '/ChangePassword', name: 'ChangePassword', component: ChangePassword},
  { path: '*', redirect: '/'}
]
export default new Router({
  routes
})
