import axios from 'axios';
const API = axios.create({baseURL: 'http://localhost:5000'});

API.interceptors.request.use((req) => {
    if (localStorage.getItem('token')) {
        req.headers.authorization = `Bearer ${localStorage.getItem('token')}`;
    }
    return req;
});
export const login = (user) => API.post('/auth/login', user);
export const getUsers = async () => {
    try {
        const response = await API.get('/api/user/all');
        return response.data;
    } catch (error) {
        return error.response.data;
    }
}
export const updateUser = async (id, user) => await API.patch(`/api/user/update/${id}`, user);
export const updatePassword = async (id, passwords) => await API.patch(`/api/user/password/${id}`, passwords);

// all clients routes
export const createClient = (client) => API.post('/api/client/create', client);
export const getAllClients = async () => {
    try {
        const response = await API.get('/api/client/all');
        return response.data;
    } catch (error) {
        return error.response.data;
    }
}
export const updateClient = (client) => API.patch(`/api/client/update/${client.id}`, client);
export const deleteClient = (client) => API.delete(`/api/client/delete/${client.id}`);

// all client child routes
export const createClientChild = (child) => API.post('/api/client/child/create', child);
export const getAllChildren = async () => {
    try {
        const response = await API.get('/api/client/child/all');
        return response.data;
    } catch (error) {
        return error.response.data;
    }
}
export const updateClientChild = (child) => API.patch(`/api/client/child/update/${child.id}`, child);
export const deleteClientChild = (child) => API.delete(`/api/client/child/delete/${child.id}`);

// all invoices routes
export const createInvoice = (invoice) => API.post('/api/invoice/create', invoice);
export const getAllInvoices = () => API.get('/api/invoice/all');
export const verifyInvoice = (invoice) => API.post('/api/invoice/verify', invoice);
export const updateInvoice = (invoice) => API.patch(`/api/invoice/update/${invoice.id}`, invoice);
export const deleteInvoice = (invoice) => API.delete(`/api/invoice/delete/${invoice.id}`);
export const getDailyProgram = () => API.get('/api/invoice/program/all');
export const updateBonus = (id, bonus) => API.patch(`/api/bonus/update/${id}`, bonus);
export const bonusCodeVerification = (bonus) => API.post('/api/bonus/verify', bonus);
export const getAllBonus = () => API.get('/api/bonus/all');
export const getAllBoats = async () => {
    try {
        const response = await API.get('/api/boat/all');
        return response.data;
    } catch (error) {
        return error.response.data;
    }
}
export const getAllClasses = async () => {
    try {
        const response = await API.get('/api/invoice/class/all');
        return response.data;
    } catch (error) {
        return error.response.data;
    }
};

// all single profile routes both for admin and user
export const getProfile = async () => await API.get('/auth/single');
export const getAdminProfile = async () => await API.get('/api/user/admin');

// all conversation routes
export const sendMessage = (message) => API.post('/api/message/create', message);
export const getAllChats = () => API.get('/api/message/all');
export const deleteMessage = (message) => API.delete(`/api/message/delete/${message.id}`);

// all notification routes
export const getAllNotifications = async () => {
    try {
        const response = await API.get('/api/notification/all');
        return response.data;
    } catch (error) {
        return error.response.data;
    }
}

export const updateNotification = (notification) => API.patch(`/api/notification/update/${notification.id}`, notification);