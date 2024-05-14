import { useState } from 'react';
import { useSpring, animated } from '@react-spring/web';

export default function ListEntry({ id, text }) {
    const [modalOpen, setModalOpen] = useState(false);
    const [height,setHight]=useState(100);
    const [springProps, setSpringProps] = useState({
        x: 0,
        y: 20,
        scale: 1,
        shadow: 1,
        config: { duration: 450 }

    });

    const scaleup = () => {
        if (!modalOpen) {
            setSpringProps({
                ...springProps,
                scale: 1.3,
                shadow: 150,
            });
        }
    };

    const scaledown = () => {
        if (!modalOpen) {
            setSpringProps({
                ...springProps,
                scale: 1,
                shadow: 1,
            });
        }
    };

    const handleClick = () => {
        const elem = document.getElementById(id);
        const rect = elem.getBoundingClientRect();
        
        if (!modalOpen) {
            setHight(300);
            setSpringProps({
                ...springProps,
                x: (window.innerWidth / 2 - rect.left)-300,
                y: (window.innerHeight / 2 - rect.top)-100,
                scale: 2,
                shadow: 150,
                config: { duration: 150 }
            });
            setModalOpen(true);
        } else {
            setHight(100);
            setSpringProps({
                ...springProps,
                x: 0,
                y: 20,
                scale: 1,
                shadow: 1,
            });
            setModalOpen(false);
        }
    };

    return (
        <div>
            <animated.div
                id={id}
                onClick={handleClick}
                onMouseEnter={scaleup}
                onMouseLeave={scaledown}
                style={{
                    zIndex: modalOpen ? 1 : 0, 
                    width: 500,
                    height: height,
                    background: 'white',
                    borderColor: "#ff6d6d", // Border color (change "#000" to your desired color)
                    borderWidth: 2, // Border width (adjust as needed)
                    borderStyle: "solid", // Border style (e.g., solid, dashed, etc.)
                    borderRadius: 8,
                    position: 'relative',
                    top: 0,
                    left: 0,
                    ...useSpring(springProps),
                }}
            >
                {text}
                <button onClick={()=>{console.log()}}></button>
            </animated.div>
            <br></br>
            <br></br>
        </div>
    );
}
