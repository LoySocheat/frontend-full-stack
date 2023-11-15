import { useEffect, useState } from "react";
import axiosClient from "../axios-client";
import { Link } from "react-router-dom";
import { useStateContext } from "../contexts/ContextProvider";

const Users = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const {setNotification} = useStateContext();

    useEffect(() => {
        getUsers();
    }, []);

    const getUsers = () => {
        setLoading(true)
        axiosClient.get('/users')
            .then(({data}) => {
                setLoading(false)
                setUsers(data.data);
            })
            .catch(() => {
                setLoading(false)
            })
    }

    const onDelete = (U) => {
        if(!window.confirm("Are you sure you want to delete this user?")){
            return
        }

        axiosClient.delete(`/users/${U.id}`)
            .then(() => {
                setNotification("User was successfully deleted")
                getUsers()
            })
    }

    return (
        <div>
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'

            }}>
                <h1>Users</h1>
                <Link to="/users/new" className="btn-add">Add new</Link>
            </div>
            <div className="card animated fadeInDown">
                <table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Enail</th>
                            <th>Create Date</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    { loading && <tbody>
                            <tr>
                                <td colSpan="5" className="text-center">Loading...</td>
                            </tr>
                        </tbody> 
                    }
                    { !loading && <tbody>
                        {users.map(U => (
                            <tr key={U.id}>
                                <td>{U.id}</td>
                                <td>{U.name}</td>
                                <td>{U.email}</td>
                                <td>{U.created_at}</td>
                                <td>
                                    <Link className="btn-edit" to={'/users/'+U.id}>Edit</Link>
                                    &nbsp;&nbsp;
                                    <button onClick={ev => onDelete(U)} className="btn-delete">Delete</button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    }
                </table>
            </div>
        </div>
    );
}
 
export default Users;