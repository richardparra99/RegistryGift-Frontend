import { Navigate, Routes, Route } from "react-router";
import { URLS } from "./CONSTANTS";

// Páginas
import { LoginForm } from "../pages/LoginForm";
import { RegisterForm } from "../pages/RegisterForm";

import EventoList from "../pages/EventoList";
import EventoMioList from "../pages/EventoMioList";
import EventoForm from "../pages/EventoForm";
import EventoDetail from "../pages/EventoDetail";
import RegaloForm from "../pages/RegaloForm"

const RouterConfig = () => {
  return (
    <Routes>
      <Route path={URLS.HOME} element={<Navigate to={URLS.APP.LIST} />} />
      <Route path={URLS.LOGIN} element={<LoginForm />} />
      <Route path={URLS.REGISTER} element={<RegisterForm />} />

      <Route path={URLS.APP.LIST} element={<EventoList />}/>
      <Route path={URLS.APP.LIST_MY} element={<EventoMioList />}/>
      <Route path={URLS.APP.CREATE} element={<EventoForm />}/>
      <Route path={URLS.APP.EDIT} element={<EventoForm />}/>
      <Route path={URLS.APP.DETAIL} element={<EventoDetail/>}/>
      <Route path={URLS.APP.GIFT_CREATE} element={<RegaloForm/>}/>
      <Route path={URLS.APP.GIFT_EDIT} element={<RegaloForm/>}/>
    </Routes>  );
};

export default RouterConfig;
