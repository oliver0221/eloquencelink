import React, { use, useEffect, useState } from 'react';
import { Grid, TextInput, Button, Select } from '@mantine/core';
import { Chat } from "@/components/Chat";
import { Link } from 'react-router-dom'; 


const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const postRequest = async (body: object) => {
    console.log(body);
    const result = await fetch(`http://127.0.0.1:80/admin/user/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body) || null,
    });
    const reusltdata = await result.json();
    console.log(reusltdata);
    if (reusltdata.code === 200) {
      localStorage.setItem('id', reusltdata.data.id);
      return reusltdata.data.userStatus;
    }else{
      alert('username or password is wrong');
    }
  };


  const handleLogin = async () => {
    const userStatus = await postRequest({ "userName": username,"password":password });
    console.log(userStatus);
    localStorage.setItem('userStatus', userStatus);
    console.log(userStatus)
    if (userStatus == 1 || userStatus == 2) {
          console.log('success');
          window.location.href = './chat';
      } else if (userStatus == 0) {

          window.location.href = '/admin';
      }
  };

  const handleRegistration = () => {
    window.location.href = './registration';
  };

  return (
    <div 
    className="login-page" 
    style={{ 
        backgroundImage: 'url("/loginBackground.png")', 
        opacity: 0.8,
        backgroundSize: 'cover',
    }}>
    <Grid style={{ height: '100vh' }}>
      <Grid.Col span={6} offset={3}>
        <div style={{ marginTop: '20vh' }}>
          <h1>Login</h1>

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
          <Button onClick={handleLogin} fullWidth variant="filled">
            Login
          </Button>
          <Button onClick={handleRegistration} fullWidth variant="outline">
              Register
            </Button>
        </div>
      </Grid.Col>
    </Grid>
     </div>
  );
};

export default Login;
