import React, { useState, useEffect } from 'react';
import { submitCustomDataRequest } from '../services/apiservice';

const CustomRequest = () => {
    const [customRequest, setCustomRequest] = useState({ 
        user_id: sessionStorage.getItem('userSub') || '', 
        username: '', 
        description: '' 
    });
    const [modalMessage, setModalMessage] = useState('');
    const [isModalVisible, setIsModalVisible] = useState(false);

    const decodeToken = (token) => {
        try {
            const base64Url = token.split('.')[1];
            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            const jsonPayload = decodeURIComponent(
                atob(base64)
                    .split('')
                    .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
                    .join('')
            );
            return JSON.parse(jsonPayload);
        } catch (error) {
            console.error("Error decoding token:", error);
            return null;
        }
    };

    useEffect(() => {
        if (!customRequest.username) {
            const accessToken = sessionStorage.getItem('accessToken');
            if (accessToken) {
                const decodedToken = decodeToken(accessToken);
                const username = decodedToken?.username || decodedToken?.['cognito:username'] || 'Unknown';
                if (username) {
                    setCustomRequest((prevRequest) => ({ ...prevRequest, username }));
                    sessionStorage.setItem('username', username);
                }
            }
        }
    }, [customRequest.username]);

    const handleCustomRequestSubmit = async () => {
        try {
            const response = await submitCustomDataRequest(customRequest);
            if (response.status === 200) {
                setModalMessage('Custom Data Request Submitted Successfully!');
                setCustomRequest({ 
                    user_id: sessionStorage.getItem('userSub') || '', 
                    username: sessionStorage.getItem('username') || '', 
                    description: '' 
                });
            } else {
                throw new Error(response.data.message || 'Failed to submit request');
            }
        } catch (error) {
            console.error('Error submitting custom request:', error);
            setModalMessage(error.message || 'An error occurred. Please try again.');
        } finally {
            setIsModalVisible(true); 
        }
    };

    const closeModal = () => setIsModalVisible(false);

    return (
        <div style={styles.container}>
            <div style={styles.content}>
                <h1 style={styles.heading}>Request Custom Data</h1>
                <textarea 
                    placeholder="Describe your custom data request..." 
                    value={customRequest.description} 
                    onChange={(e) => setCustomRequest({ ...customRequest, description: e.target.value })} 
                    style={styles.textarea} 
                />
                <button 
                    onClick={handleCustomRequestSubmit} 
                    style={styles.button}
                >
                    Submit Request
                </button>

                {/* Modal for success/error messages */}
                {isModalVisible && (
                    <div style={styles.modalOverlay}>
                        <div style={styles.modal}>
                            <p>{modalMessage}</p>
                            <button onClick={closeModal} style={styles.modalButton}>Close</button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

const styles = {
    container: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'top',
        height: '100%',
        backgroundColor: '#f0f4f8',
    },
    content: {
        width: '90%',
        maxWidth: '900px',
        backgroundColor: 'white',
        padding: '30px',
        borderRadius: '12px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
        height: '70%',
        marginTop: '50px',
        maxHeight: '450px',
    },
    heading: {
        fontSize: '32px',
        textAlign: 'center',
        marginBottom: '30px',
        color: '#333',
    },
    textarea: {
        width: '100%',
        padding: '15px',
        borderRadius: '5px',
        border: '1px solid #ccc',
        minHeight: '200px',
        marginBottom: '20px',
        fontSize: '16px',
    },
    button: {
        width: '50%',
        display: 'block',
        margin: '20px auto 0',
        padding: '10px 10px',
        backgroundColor: '#007bff',
        color: '#fff',
        border: 'none',
        borderRadius: '5px',
        fontSize: '18px',
        cursor: 'pointer',
        textAlign: 'center',
    },
    modalOverlay: {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000,
    },
    modal: {
        width: '80%',
        maxWidth: '500px',
        padding: '20px',
        backgroundColor: 'white',
        borderRadius: '8px',
        textAlign: 'center',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    },
    modalButton: {
        marginTop: '20px',
        padding: '10px 20px',
        backgroundColor: '#007bff',
        color: 'white',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
    },
};

export default CustomRequest;
