import { useEffect, useState } from "react";
import axiosClient from "../axios-client";
import { Link } from "react-router-dom";
import { useStateContext } from "../contexts/ContextProvider";

const Users = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const { setNotification } = useStateContext();
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [goToPage, setGoToPage] = useState('');

    useEffect(() => {
        const getUsers = async () => {
            setLoading(true)
            try {
                const response = await axiosClient.get(`/users?page=${currentPage}`);
                const { data, meta } = response.data;
                setLoading(false)
                setUsers(data);
                setTotalPages(meta.last_page);
            } catch (error) {
                setLoading(false)
                console.error('Error fetching user data:', error);
            }
        };

        getUsers();
    }, [currentPage]);

    const handlePageChange = (page) => {
        setCurrentPage(page);
    }

    const handleGoToPage = () => {
        const parsedPage = parseInt(goToPage, 10);
        if (!isNaN(parsedPage) && parsedPage >= 1 && parsedPage <= totalPages) {
            setCurrentPage(parsedPage);
            setGoToPage('');
        } else {
            // Handle invalid input (e.g., show an error message)
        }
    };

    const onDelete = (U) => {
        if (!window.confirm("Are you sure you want to delete this user?")) {
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
            <div className="card animated fadeInDown ">
                <table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Create Date</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    {loading && <tbody>
                        <tr>
                            <td colSpan="5" className="text-center">Loading...</td>
                        </tr>
                    </tbody>
                    }
                    {!loading && <tbody>
                        {users.map(U => (
                            <tr key={U.id}>
                                <td>{U.id}</td>
                                <td>{U.name}</td>
                                <td>{U.email}</td>
                                <td>{U.created_at}</td>
                                <td>
                                    <Link className="btn-edit" to={'/users/' + U.id}>Edit</Link>
                                    &nbsp;&nbsp;
                                    <button onClick={ev => onDelete(U)} className="btn-delete">Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                    }
                </table>
            </div>
            <div className="pagination">
                <div className="current-search">
                    <p>
                        Page {currentPage} of {totalPages}
                    </p>
                    <input
                        type="text"
                        value={goToPage}
                        onChange={(e) => setGoToPage(e.target.value)}
                        placeholder={`1-${totalPages}`}
                    />
                    <button onClick={handleGoToPage}>Go</button>
                </div>
                <div>
                    <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>
                        Previous
                    </button>
                    <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}>
                        Next
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Users;