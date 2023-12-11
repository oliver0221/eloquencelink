import React, { useState } from 'react';
import { Grid, UnstyledButton, Button } from '@mantine/core';
import UserManagement from '@/components/Administration/UserManagement';
import CustomAIList from '@/components/Administration/CustomAIList';

import styles from './style.module.css';

export const Administration = () => {
    const [activeComponent, setActiveComponent] = useState('User List');
    const [nav, setNav] = useState(['User List', 'Custom AI List']);

    const handleNavClick = (componentName: string) => {
        setActiveComponent(componentName);
    };

    const handleLogout = () => {
        window.location.href = '/'; //Redirecting to the login page.
    };

    const renderActiveComponent = () => {
        switch (activeComponent) {
            case 'User List':
                return <UserManagement />;
            case 'Custom AI List':
                return <CustomAIList />;
            default:
                return null;
        }
    };

    return (
        <Grid>
            <Grid.Col span={2}>
                <div style={{ height: '100vh', backgroundColor: 'lightblue' }}>
                    {nav.map((item, index) => (
                        <UnstyledButton
                            className={`${styles.unstyledButton} ${activeComponent === item ? styles.activeNavItem : ''}`}
                            key={index}
                            onClick={() => handleNavClick(item)}>
                            {item}
                        </UnstyledButton>
                    ))}
                    <div style={{ position: 'absolute', left: '10px', bottom: '10px' }}>
                        <Button onClick={handleLogout}>Logout</Button>
                    </div>
                </div>
            </Grid.Col>

            <Grid.Col span={10} style={{ position: 'relative' }}>
                <div style={{
                    backgroundImage: `url("/background.png")`,
                    backgroundSize: 'cover',
                    opacity: 0.3,
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    bottom: 1,
                    right: 0,
                }} />
                {renderActiveComponent()}
            </Grid.Col>
        </Grid>
    );
};
