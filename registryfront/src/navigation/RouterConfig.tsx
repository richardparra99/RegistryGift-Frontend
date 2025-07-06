import { Routes, Route } from "react-router";
import { URLS } from "./CONTANTS";

// Páginas
import { LoginForm } from "../pages/LoginForm";
import { RegisterForm } from "../pages/RegisterForm";
import TopLibros from "../pages/Libros10";

import EventoAdmin from "../pages/EventoAdmin";
import EventoForm from "../pages/EventoForm";
import EventoList from "../pages/EventoList";
import EventoDetail from "../pages/EventoDetail";

import RegaloListPorEvento from "../pages/RegaloListPorEvento";
import RegaloAdmin from "../pages/RegaloAdmin";
import RegaloDetail from "../pages/RegaloDetail";
import RegaloForm from "../pages/RegaloForm";
import RegaloList from "../pages/RegaloList";
import RegaloListPublico from "../pages/RegaloListPublico";
import UsuarioList from "../pages/UsuarioList";


import {AdminRoute} from "../components/AdminRoute";
import TodasComprasList from "../pages/TodasComprasList";

const RouterConfig = () => {
  return (
    <Routes>
      <Route path={URLS.LOGIN} element={<LoginForm />} />
      <Route path={URLS.REGISTER} element={<RegisterForm />} />
      <Route path={URLS.HOME} element={<TopLibros />} />


      <Route path={URLS.EVENTOS.LIST} element={<EventoList />}/>
       <Route path={URLS.EVENTOS.DETAIL} element={<EventoDetail/>}/>
      <Route path={URLS.EVENTOS.LIST_EDIT} element={<AdminRoute><EventoAdmin /></AdminRoute>} />

       <Route path={URLS.REGALOS.LIST} element={<RegaloList />}/>
       <Route path={URLS.REGALOS.DETAIL} element={<RegaloDetail/>}/>
      <Route path={URLS.REGALOS.LIST_EDIT} element={<AdminRoute><RegaloAdmin /></AdminRoute>} />
    <Route path="/eventos/:eventoId/regalos" element={<RegaloListPorEvento />} />
    <Route path="/eventos/:eventoId/publico" element={<RegaloListPublico />} />

      <Route
        path={URLS.USUARIOS.LIST}
        element={<AdminRoute><UsuarioList /></AdminRoute>}
      />
        <Route
        path={URLS.MIS_COMPRAS.LIST}
        element={<AdminRoute><TodasComprasList /></AdminRoute>}
      />
      <Route
        path={URLS.EVENTOS.CREATE}
        element={<AdminRoute><EventoForm /></AdminRoute>}
      />
       <Route
        path={URLS.REGALOS.CREATE}
        element={<AdminRoute><RegaloForm /></AdminRoute>}
      />
       <Route
        path="/eventos/editar/:id"
        element={<AdminRoute><EventoForm /></AdminRoute>}
      />
       <Route
        path="/regalos/editar/:id"
        element={<AdminRoute><RegaloForm /></AdminRoute>}
      />
    </Routes>  );
};

export default RouterConfig;
