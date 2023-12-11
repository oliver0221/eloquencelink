import React, { useState, useEffect } from 'react';
import { Modal, TextInput, Table, Button } from '@mantine/core';

interface User {
    id: number;
    userName: string;
    password: string;
    userStatus: number;
}



const UserManagement = () => {
    var [users, setUsers] = useState<User[]>([]);
    // const [users, setUsers] = useState<User[]>([]);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editedUser, setEditedUser] = useState<User | null>(null);

    const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
    const [userToDelete, setUserToDelete] = useState<number | null>(null);

    const [isNewUserModalOpen, setIsNewUserModalOpen] = useState(false);
    const [newUser, setNewUser] = useState({ userName: '', password: '', userStatus: 1 });
    const [searchQuery, setSearchQuery] = useState('');


    useEffect(() => {
        fetch('http://127.0.0.1:80/admin/user/getAllUsers')
            .then(response => response.json())
            .then(data => {
                console.log("Fetched data:", data);
                if (data && Array.isArray(data.data)) {
                    setUsers(data.data);
                } else {
                    console.error('Data is not in the expected format:', data);
                }
            })
            .catch(error => console.error('Fetching users failed:', error));
    }, []);

    // const handleEditClick = (userId: number) => {
    //     alert(`Edit button clicked for user with ID: ${userId}`);
    //   };

    // const handleDeleteClick = (userId: number) => {
    //     alert(`Delete button clicked for user with ID: ${userId}`);
    //   };


    const fetchData = () => {
        fetch('http://127.0.0.1:80/admin/user/getAllUsers')
            .then(response => response.json())
            .then(data => {
                console.log("Fetched data:", data);
                if (data && data.code === 200 && Array.isArray(data.data)) {
                    setUsers(data.data);
                } else {
                    console.error('Data is not in the expected format:', data);
                }
            })
            .catch(error => {
                console.error('Fetching users failed:', error);
            });
    };


    const handleEditClick = (userid: number) => {
        console.log(userid);
        const user = users.find(user => user.id === userid);
        if (user) {
            setEditedUser(user);
            setIsModalOpen(true);
        }
    };

    const handleModalClose = () => {
        setIsModalOpen(false);
    };


    // }
    const handleSubmit = () => {
        if (editedUser) {
            fetch('http://127.0.0.1:80/admin/user/updateUser', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(editedUser),
            })
                .then(response => response.json())
                .then(updatedUser => {
                    setIsModalOpen(false);  // Close the modal
                    fetchData();  // Fetch the latest users list from the server
                })
                .catch(error => {
                    console.error('Updating user failed:', error);
                });
        }
    }

    const handleDeleteClick = (userId: number) => {
        setUserToDelete(userId);
        setIsDeleteConfirmOpen(true);
    };

    const handleDeleteConfirm = async () => {
        if (userToDelete !== null) {
            const user = users.find(u => u.id === userToDelete);
            if (user) {
                try {
                    const response = await fetch(`http://127.0.0.1:80/admin/user/deleteUser`, {
                        method: 'DELETE',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ userName: user.userName })
                    });
                    if (response.ok) {
                        const data = await response.json();
                        console.log('Delete response:', data);
                        setIsDeleteConfirmOpen(false);  // Close the delete confirm modal
                        // Remove the deleted user from the users list
                        setUsers(prevUsers => prevUsers.filter(u => u.id !== userToDelete));
                    } else {
                        console.error('Server responded with an error:', response.statusText);
                    }
                } catch (error) {
                    console.error('Deleting user failed:', error);
                }
            }
        }
    };




    const handleNewUserSubmit = () => {
        fetch('http://127.0.0.1:80/admin/user/addUser', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newUser),
        })
            .then(response => response.json())
            .then(addedUser => {
                setIsNewUserModalOpen(false);
                fetchData();  // Fetch the latest users list from the server
            })
            .catch(error => {
                console.error('Adding new user failed:', error);
            });
    }


    const handleSearch = () => {
        if (searchQuery === '') {
            fetchData(); // 如果搜索框为空，获取所有用户数据
        } else {
            fetch(`http://127.0.0.1:80/admin/user/getUserByName?userName=${searchQuery}`, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
            })
                .then(response => response.json())
                .then(data => {
                    console.log("Fetched data:", data);
                    if (data && data.code === 200) {
                        setUsers(data.data || []); // Set to empty array if data.data is null or undefined
                    } else {
                        console.error('Data is not in the expected format:', data);
                        setUsers([]); // Set to empty array in case of an error
                    }
                })
                .catch(error => {
                    console.error('Searching users failed:', error);
                    setUsers([]); // Set to empty array in case of an error
                });
        }
    };




    const handleAddUserClick = () => {
        setIsNewUserModalOpen(true);
    };

    const handleNewUserModalClose = () => {
        setIsNewUserModalOpen(false);
    };


    const rows = users.length > 0 ? users.map((user) => (
        user && user.id != null ? (
            <tr key={user.id}>
                <td>{user.id}</td>
                <td>{user.userName || 'N/A'}</td>
                <td>{user.password || 'N/A'}</td>
                <td>{user.userStatus != null ? user.userStatus : 'N/A'}</td>
                <td>
                    <Button
                        variant="filled"
                        color="teal"
                        onClick={() => handleEditClick(user.id)}
                    >
                        Edit
                    </Button>
                </td>
                <td>
                    <Button
                        variant="filled"
                        color="red"
                        onClick={() => handleDeleteClick(user.id)}
                    >
                        Delete
                    </Button>
                </td>
            </tr>
        ) : null // 或者你可以渲染一个表示错误或不完整数据的行
    )) : <tr><td colSpan={6}>No users found</td></tr>;




    return (
        <div>
            <h1>User List</h1>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 20 }}>
                <TextInput
                    placeholder="Search by name"
                    value={searchQuery}
                    onChange={(event) => setSearchQuery(event.currentTarget.value)}
                    style={{ marginRight: 10, width: '200px' }}
                />
                <Button onClick={handleSearch}>Search</Button>
                <Button onClick={handleAddUserClick} style={{ marginLeft: 10 }}>Add User</Button>
                {
                    isModalOpen && editedUser && (
                        <Modal opened={isModalOpen} onClose={handleModalClose} title="Edit User" withCloseButton>
                            <TextInput
                                label="Username"
                                value={editedUser?.userName || ''}
                                onChange={(event) => editedUser && setEditedUser({ ...editedUser, userName: event.currentTarget.value })}
                            />
                            <TextInput
                                label="Password"
                                value={editedUser?.password || ''}
                                onChange={(event) => editedUser && setEditedUser({ ...editedUser, password: event.currentTarget.value })}
                            />
                            <TextInput
                                label="User Status"
                                type="number"
                                value={editedUser ? editedUser?.userStatus.toString() : ''}
                                onChange={(event) => editedUser && setEditedUser({ ...editedUser, userStatus: parseInt(event.currentTarget.value, 10) })}
                            />
                            <Button onClick={handleSubmit} style={{ marginRight: 10 }}>Submit</Button>
                            <Button onClick={handleModalClose} color="gray">Close</Button>
                        </Modal>
                    )
                }
                {
                    isDeleteConfirmOpen && (
                        <Modal opened={isDeleteConfirmOpen} onClose={() => setIsDeleteConfirmOpen(false)} title="Confirm Delete" withCloseButton>
                            <p>Are you sure you want to delete this user?</p>
                            <Button onClick={handleDeleteConfirm} style={{ marginRight: 10 }}>Yes, Delete</Button>
                            <Button onClick={() => setIsDeleteConfirmOpen(false)} color="gray">Cancel</Button>
                        </Modal>
                    )
                }
                {
                    isNewUserModalOpen && (
                        <Modal opened={isNewUserModalOpen} onClose={handleNewUserModalClose} title="Add New User" withCloseButton>
                            <TextInput
                                label="Username"
                                value={newUser.userName}
                                onChange={(event) => setNewUser({ ...newUser, userName: event.currentTarget.value })}
                            />
                            <TextInput
                                label="Password"
                                value={newUser.password}
                                onChange={(event) => setNewUser({ ...newUser, password: event.currentTarget.value })}
                            />
                            <TextInput
                                label="User Status"
                                type="number"
                                value={newUser.userStatus.toString()}
                                onChange={(event) => setNewUser({ ...newUser, userStatus: parseInt(event.currentTarget.value, 10) })}
                            />
                            <Button onClick={handleNewUserSubmit} style={{ marginRight: 10 }}>Submit</Button>
                            <Button onClick={handleNewUserModalClose} color="gray">Close</Button>
                        </Modal>
                    )
                }
            </div>

            <Table>
                <thead>
                    <tr>
                        <th>UserId</th>
                        <th>UserName</th>
                        <th>UserPassword</th>
                        <th>UserStatus</th>
                    </tr>
                </thead>
                <tbody>{rows}</tbody>
            </Table>
        </div>

    )

};

export default UserManagement;
