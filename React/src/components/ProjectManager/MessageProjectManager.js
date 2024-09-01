import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import { toast } from 'react-toastify';
import '../styles/MessageProjectManager.css';

const MessageProjectManager = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { username } = location.state || {};
    const [projectMessages, setProjectMessages] = useState({});

    useEffect(() => {
        if (username) {
            fetch(`https://revtaskmanageme-b7gmhschegevhuf0.southindia-01.azurewebsites.net/api/projects/by-username?username=${username}`)
                .then(response => response.json())
                .then(projects => {
                    const projectMessagesPromises = projects.map(project => {
                        return fetch(`https://revtaskmanageme-b7gmhschegevhuf0.southindia-01.azurewebsites.net/api/messages/getMessagesByReceiverName?receiverName=${username}&projectId=${project.projectId}`)
                            .then(response => response.json())
                            .then(messages => {
                                const filteredMessages = messages.filter(message =>
                                    project.teamMembers.some(member => member.username === message.sender.username)
                                );
                                return { projectName: project.projectName, messages: filteredMessages };
                            });
                    });
                    Promise.all(projectMessagesPromises)
                        .then(projectMessagesArray => {
                            const groupedMessages = {};
                            projectMessagesArray.forEach(({ projectName, messages }) => {
                                groupedMessages[projectName] = messages;
                            });
                            setProjectMessages(groupedMessages);
                        });
                })
                .catch(error => console.error('Error fetching projects:', error));
        }
    }, [username]);

    const handleDelete = (projectName, messageId) => {

        const confirmDelete = toast.info("Are you sure you want to delete this message?", {
            onClose: () => {
                navigate('/login');
            },
            autoClose: 5000,
            closeButton: true,
            draggable: true,
        });
        if (confirmDelete) {
            fetch(`https://revtaskmanageme-b7gmhschegevhuf0.southindia-01.azurewebsites.net/api/messages/delete/${messageId}`, {
                method: 'DELETE',
            })
            .then(response => {
                if (response.ok) {
                    setProjectMessages(prevProjectMessages => {
                        const updatedMessages = prevProjectMessages[projectName].filter(message => message.messageId !== messageId);
                        return { ...prevProjectMessages, [projectName]: updatedMessages };
                    });
                } else {
                    console.error('Error deleting the message');
                }
            })
            .catch(error => console.error('Error deleting the message:', error));
        }
    };

    return (
        <div id="message-page">
            <div id="message-container">
                <div id="message-title">Messages</div>
                {Object.keys(projectMessages).map(projectName => (
                    <div key={projectName} className="project-group">
                        <h3 className="project-name">{projectName}</h3>
                        <ul className="message-list">
                            {projectMessages[projectName].map((message) => (
                                <li key={message.messageId} className="message-item">
                                    <div className="message-item-header">
                                        <strong>From: </strong> {message.sender.username}
                                        <button className="message-delete-button" onClick={() => handleDelete(projectName, message.messageId)}>X</button>
                                    </div>
                                    <div className="message-body">
                                        <div className="message-subject"><strong>Subject: </strong>{message.subject}</div>
                                        <div><strong>Context: </strong>{message.context}</div>
                                        <div><strong>Date: </strong>{new Date(message.date).toLocaleString()}</div>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default MessageProjectManager;