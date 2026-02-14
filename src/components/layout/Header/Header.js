import React from 'react';
import { Shield } from 'lucide-react';
import styles from './Header.module.css';

const Header = () => {
    return (
        <header className={styles.header}>
            <div className={styles.container}>
                <div className={styles.logo}>
                    <Shield className={styles.logoIcon} size={20} />
                    <span className={styles.logoText}>FIGA<span className={styles.logoAlt}>INTEL</span></span>
                </div>
            </div>
        </header>
    );
};

export default Header;
