import React, { useState, useEffect } from 'react';
import { Modal, TextInput, Table, Button } from '@mantine/core';

interface CustomerAI {
    userId: number;
    aiId: number;
    aiName: string;
    command: string;
    creativity: number;
    contextCount: number;
    replyLength: number;
}

const CustomAIList = () => {
    const baseURL = 'http://127.0.0.1:80/admin/ai';

    const [customerAIs, setCustomerAIs] = useState<CustomerAI[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editedAI, setEditedAI] = useState<CustomerAI | null>(null);
    const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
    const [aiToDelete, setAiToDelete] = useState<number | null>(null);
    const [searchQuery, setSearchQuery] = useState('');

    const fetchData = () => {
        fetch(`${baseURL}/getAllAIAssistance`)
            .then(response => response.json())
            .then(data => {
                console.log("Fetched data:", data);
                if (data && Array.isArray(data.data)) {
                    setCustomerAIs(data.data);
                } else {
                    console.error('Data is not in the expected format:', data);
                }
            })
            .catch(error => {
                console.error('Fetching AIs failed:', error);
            });
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleEditClick = (aiId: number) => {
        const ai = customerAIs.find(ai => ai.aiId === aiId);
        if (ai) {
            setEditedAI(ai);
            setIsModalOpen(true);
        }
    };

    const handleModalClose = () => {
        setIsModalOpen(false);
    };

    const handleSubmit = () => {
        if (editedAI) {
            fetch(`${baseURL}/updateAIAssistance`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(editedAI)
            })
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Network response was not ok ' + response.statusText);
                    }
                    return response.json();
                })
                .then(data => {
                    fetchData();  // Refresh the AI list from the backend
                    setIsModalOpen(false);  // Close the modal after refreshing the AI list
                })
                .catch(error => {
                    console.error('Updating AI failed:', error);
                });
        }
    };




    const handleDeleteClick = (aiId: number) => {
        setAiToDelete(aiId);
        setIsDeleteConfirmOpen(true);
    };

    const handleDeleteConfirm = () => {
        console.log('Delete confirm started');  // Log when function starts
        if (aiToDelete !== null) {
            console.log('Sending delete request to the server...');
            fetch(`${baseURL}/deleteAIAssistance/${aiToDelete}`, {
                method: 'DELETE',
            })
                .then(response => {
                    console.log('Received response from the server:', response);
                    if (!response.ok) {
                        throw new Error('Network response was not ok ' + response.statusText);
                    }
                    return response.json();
                })
                .then(data => {
                    console.log('Parsed JSON data:', data);
                    setIsDeleteConfirmOpen(false);  // Close the delete confirm modal
                    fetchData();  // Refresh the AI list from the backend
                })
                .catch(error => {
                    console.error('Deleting AI failed:', error);
                });
        } else {
            console.error('aiToDelete is null');
        }
    };



    const handleSearch = () => {
        if (!searchQuery.trim()) {
            // 如果搜索框为空，则获取并显示所有项目
            fetchData();
            return;
        }

        fetch(`${baseURL}/getAIAssistance?aiName=${searchQuery}`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok ' + response.statusText);
                }
                return response.json();
            })
            .then(data => {
                if (data.code === 200 && data.data) {
                    // 确保我们总是设置一个数组
                    const result = Array.isArray(data.data) ? data.data : [data.data];
                    setCustomerAIs(result);
                } else {
                    console.error('Data is not in the expected format:', data);
                }
            })
            .catch(error => {
                console.error('Searching AIs failed:', error);
            });
    };



    const rows = customerAIs.map((ai) => (
        <tr key={ai.aiId}>
            <td>{ai.userId}</td>
            <td>{ai.aiId}</td>
            <td>{ai.aiName}</td>
            <td>{ai.command}</td>
            <td>{ai.creativity}</td>
            <td>{ai.contextCount}</td>
            <td>{ai.replyLength}</td>
            <td>
                <Button variant="filled" color="teal" onClick={() => handleEditClick(ai.aiId)}>Edit</Button>
            </td>
            <td>
                <Button variant="filled" color="red" onClick={() => handleDeleteClick(ai.aiId)}>Delete</Button>
            </td>
        </tr>
    ));

    return (
        <div>
            <h1>Custom AI List</h1>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 20 }}>
                <TextInput
                    placeholder="Search by AI Name"
                    value={searchQuery}
                    onChange={(event) => setSearchQuery(event.currentTarget.value)}
                    style={{ marginRight: 10, width: '200px' }}
                />
                <Button onClick={handleSearch}>Search</Button>
            </div>
            {
                isModalOpen && editedAI && (
                    <Modal opened={isModalOpen} onClose={handleModalClose} title="Edit AI" withCloseButton>
                        <TextInput
                            label="AI Name"
                            value={editedAI.aiName}
                            onChange={(event) => setEditedAI({ ...editedAI, aiName: event.currentTarget.value })}
                        />

                        <TextInput
                            label="Command"
                            value={editedAI.command}
                            onChange={(event) => setEditedAI({ ...editedAI, command: event.currentTarget.value })}
                        />
                        <TextInput
                            label="Creativity"
                            type="number"
                            step="0.1"
                            value={editedAI.creativity.toString()}
                            onChange={(event) => setEditedAI({ ...editedAI, creativity: parseFloat(event.currentTarget.value) })}
                        />
                        <TextInput
                            label="Context Count"
                            type="number"
                            value={editedAI.contextCount.toString()}
                            onChange={(event) => setEditedAI({ ...editedAI, contextCount: parseInt(event.currentTarget.value, 10) })}
                        />
                        <TextInput
                            label="Reply Length"
                            type="number"
                            value={editedAI.replyLength.toString()}
                            onChange={(event) => setEditedAI({ ...editedAI, replyLength: parseInt(event.currentTarget.value, 10) })}
                        />
                        <Button onClick={handleSubmit} style={{ marginRight: 10 }}>Submit</Button>
                        <Button onClick={handleModalClose} color="gray">Close</Button>
                    </Modal>
                )
            }
            {
                isDeleteConfirmOpen && (
                    <Modal opened={isDeleteConfirmOpen} onClose={() => setIsDeleteConfirmOpen(false)} title="Confirm Delete" withCloseButton>
                        <p>Are you sure you want to delete this AI?</p>
                        <Button onClick={handleDeleteConfirm} style={{ marginRight: 10 }}>Yes, Delete</Button>
                        <Button onClick={() => setIsDeleteConfirmOpen(false)} color="gray">Cancel</Button>
                    </Modal>
                )
            }
            <Table>
                <thead>
                    <tr>
                        <th>UserID</th>
                        <th>CustomerAI ID</th>
                        <th>AI Name</th>
                        <th>Command</th>
                        <th>Creativity</th>
                        <th>Context Count</th>
                        <th>Reply Length</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>{rows}</tbody>
            </Table>
        </div>
    );
};

export default CustomAIList;
