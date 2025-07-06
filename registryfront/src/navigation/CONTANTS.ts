export const URLS = {
    HOME: '/',
    LOGIN: '/login',
    REGISTER: '/register',
    GENEROS: {
        LIST: '/generos',
        LIST_EDIT: '/generos/listedit',
        CREATE: '/generos/crear',
        DETAIL: '/generos/:id',
        DETAIL_PATH: (id: number) => `/generos/${id}`,
        EDIT_PATH: (id: number) => `/generos/editar/${id}`,
    },
    REGALOS:{
        LIST: '/regalos',
        LIST_EDIT: '/regalos/listedit',
        CREATE: '/regalos/crear',
        DETAIL: '/regalos/:id',
        DETAIL_PATH: (id: number) => `/regalos/${id}`,
        EDIT_PATH: (id: number) => `/regalos/editar/${id}`,
        LIST_FOR_EVENT: (eventoId: number) => `/eventos/${eventoId}/regalos`,
    },
    EVENTOS:{
        LIST: '/eventos',
        LIST_EDIT: '/eventos/listedit',
        CREATE: '/eventos/crear',
        DETAIL: '/eventos/:id',
        DETAIL_PATH: (id: number) => `/eventos/${id}`,
        EDIT_PATH: (id: number) => `/eventos/editar/${id}`,
    },
    CATEGORIAS:{
        LIST: '/categorias',
        LIST_EDIT: '/categorias/listedit',
        CREATE:'/categorias/crear',
        DETAIL:'/categorias/:id',
        DETAIL_PATH: (id: number) => `/categorias/${id}`,
        EDIT_PATH: (id: number) => `/categorias/editar/${id}`,
    },
    PRODUCTOS:{
        LIST: '/productos',
        LIST_EDIT: '/productos/listedit',
        CREATE:'/productos/crear',
        DETAIL:'/productos/:id',
        DETAIL_PATH: (id: number) => `/productos/${id}`,
        EDIT_PATH: (id: number) => `/productos/editar/${id}`,
    },
    LIBROS: {
        LIST: "/libros",
        CREATE: "/libros/crear",
        LIST_EDIT: "/libros/listedit",
        DETAIL: "/libros/:id",
        DETAIL_PATH: (id: number) => `/libros/${id}`,
        EDIT_PATH: (id: number) => `/libros/editar/${id}`,
    },
    MIS_COMPRAS:{ 
        LIST: "/ComprasList",
       DETAIL: "/mis-compras"},
    CARRITO:{
        DETAIL:"/carrito",},
    USUARIOS:{ 
        LIST: "/usuarios",},
    ADMIN: '/admin/',

};