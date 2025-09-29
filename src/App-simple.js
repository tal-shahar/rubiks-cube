import React from 'react';

function AppSimple() {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: '20px',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    }}>
      <h1 style={{ color: 'white', textAlign: 'center', marginBottom: '30px' }}>
        Mobile Centering Test
      </h1>
      
      <div style={{
        display: 'flex',
        gap: '20px',
        justifyContent: 'center',
        alignItems: 'flex-start',
        margin: '20px 0',
        '@media (max-width: 768px)': {
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '30px',
          margin: '0',
          width: '100%'
        }
      }}>
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          background: 'rgba(255, 255, 255, 0.1)',
          borderRadius: '12px',
          padding: '15px',
          border: '2px solid rgba(255, 255, 255, 0.2)',
          width: '100%',
          maxWidth: '350px',
          margin: '0 auto'
        }}>
          <h3 style={{ color: '#fff', margin: '0 0 10px 0', textAlign: 'center' }}>
            Simple Revert Solver
          </h3>
          <div style={{
            width: '200px',
            height: '200px',
            background: 'linear-gradient(45deg, #ff6b6b, #4ecdc4)',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontWeight: 'bold',
            fontSize: '18px'
          }}>
            Cube 1
          </div>
        </div>
        
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          background: 'rgba(255, 255, 255, 0.1)',
          borderRadius: '12px',
          padding: '15px',
          border: '2px solid rgba(255, 255, 255, 0.2)',
          width: '100%',
          maxWidth: '350px',
          margin: '0 auto'
        }}>
          <h3 style={{ color: '#fff', margin: '0 0 10px 0', textAlign: 'center' }}>
            Advanced Kociemba Solver
          </h3>
          <div style={{
            width: '200px',
            height: '200px',
            background: 'linear-gradient(45deg, #4ecdc4, #45b7d1)',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontWeight: 'bold',
            fontSize: '18px'
          }}>
            Cube 2
          </div>
        </div>
      </div>
    </div>
  );
}

export default AppSimple;
