import React, { useState, useEffect } from 'react';
import { Grid, TextInput, Button } from '@mantine/core';

const Registration = () => {
  const [users, setUsers] = useState([]);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleNewUserSubmit = () => {
    fetch('http://127.0.0.1:80/admin/user/addUser', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userName: username, password: password }),
    })
      .then(response => response.json())
      .then(data => {
        console.log(data)
        if (data.code == 200) {
          setSuccessMessage('Registration successful! You can now log in.');
          window.location.href = './';
          setErrorMessage('');
        } else if (data.code == 400) {
          setErrorMessage('Username already exists. Please choose a different username.');
          setSuccessMessage('');
        }
      })
      .catch(error => {
        setErrorMessage('Username already existeeeeees. Please choose a different username.');
        console.error('Adding new user failed:', error);
      });
  };

  return (
    <div className="registration-page"
      style={{
        backgroundImage: 'url("/background.png")',
        opacity: 0.7,
        backgroundSize: 'cover',
      }}>
      <Grid style={{ height: '100vh' }}>
        <Grid.Col span={6} offset={3}>
          <div style={{ marginTop: '20vh' }}>
            <h1>Register</h1>

            <TextInput
              label="Username"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
            />
            <TextInput
              label="Password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
            <Button onClick={handleNewUserSubmit} fullWidth variant="filled">
              Register
            </Button>
            {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}
            {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
          </div>
        </Grid.Col>
      </Grid>
    </div>
  );
};

export default Registration;
