
import { useState } from 'react';
import { memo, useMemo } from 'react';
const UserProfile = memo(({ user }) => {
    console.log('UserProfile rendered');

    return (
        <div>
            <h3>{user.name}</h3>
            <p>Role: {user.role}</p>
        </div>
    );
});

const Counter = memo(({ count }) => {
    console.log('Counter rendered');

    return <h3>Count: {count}</h3>;
});

const RenderPractice = () => {
    const [count, setCount] = useState(0);
    const [theme, setTheme] = useState('light');
    const [clickCount, setClickCount] = useState(0);
     const handleClick = () => {
        setClickCount(prev => prev + 1);
    };
    // before optimsation user profile renders unnecessary
    const user = {
        name: 'Ajith',
        role: 'Frontend Developer',
    };  

    // const user = useMemo(() => ({
    //     name: 'Ajith',
    //     role: 'Frontend Developer',
    // }), []);
    // const handleClick = () => {
    //     console.log('Button clicked');
    // };

    console.log('Parent rendered');

    return (
        <div
            style={{
                padding: '20px',
                background: theme === 'light' ? '#fff' : '#333',
                color: theme === 'light' ? '#000' : '#fff',
            }}
        >
            <h2>React Render Practice</h2>

            <button onClick={() => setCount((prev) => prev + 1)}>
                Increment
            </button>

            <button onClick={() => setTheme(
                (prev) => prev === 'light' ? 'dark' : 'light'
            )}>
                Toggle Theme
            </button>

            <button onClick={handleClick}>
                Normal Click
            </button>

            <p>Parent count: {count}</p>

            <Counter count={count} />

            <UserProfile user={user} />
        </div>
    );
};

export default RenderPractice;
