import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

const CursorSmokeEffect = () => {
    const location = useLocation();
    const blobRef = useRef(null);

    const isExcluded = ['/login', '/register'].includes(location.pathname);

    useEffect(() => {
        if (isExcluded) return;

        const handleMouseMove = (e) => {
            if (!blobRef.current) return;

            const { clientX, clientY } = e;

            // Minimal lag for "smoke" feel
            blobRef.current.animate({
                transform: `translate(${clientX}px, ${clientY}px)`
            }, { duration: 1500, fill: "forwards", easing: "ease-out" });
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, [isExcluded]);

    if (isExcluded) return null;

    return (
        <div className="fixed inset-0 pointer-events-none z-[5] overflow-hidden">
            <div
                ref={blobRef}
                className="absolute top-0 left-0 w-[600px] h-[600px] rounded-full mix-blend-multiply filter blur-[80px] opacity-20"
                style={{
                    // Red center fading to grey/charcoal edges
                    background: 'radial-gradient(circle at center, #ef4444 0%, #4b5563 50%, transparent 70%)',
                    marginLeft: '-300px',
                    marginTop: '-300px',
                    willChange: 'transform'
                }}
            />
        </div>
    );
};

export default CursorSmokeEffect;
