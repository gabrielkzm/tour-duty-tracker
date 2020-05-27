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
import Logout from '@/components/Logout';
import LogoutAll from '@/components/LogoutAll';
import Settings from "@/views/Settings";
import ReplyTour from "@/views/ReplyTour";

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
  { path: '/replyTour', name: 'ReplyTour', component: ReplyTour},
  { path: '/changePassword', name: 'ChangePassword', component: ChangePassword},
  { path: '/settings', name: 'Settings', component: Settings},
  { path: '/logout', name: 'logout', component: Logout},
  { path: '/logoutAll', name: 'logoutAll', component: LogoutAll},
  { path: '*', redirect: '/'}
]

const router = new Router({
  mode: 'history',
  routes,
})

router.beforeEach((to, from, next) => {
  const publicPaths = ['/login']
  const isAuthRequiredPaths = !publicPaths.includes(to.path);
  const isLoggedIn = true;
  // const user = localStorage.getItem('user');
  // const isLoggedIn = user !== null ? true : false;
  // TODO: Uncomment when done
  if(isAuthRequiredPaths && !isLoggedIn){
    return next('/login');
  }else{
    next();
  }
})

export default router;
