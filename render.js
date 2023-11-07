

window.api.send('navigate', 'board.html?boardId=fdgh');

window.api.receive('login-response', (response) => {
    if (response.success) {
      
      window.api.sendToMain('navigate', 'board.html');
    } else {
      alert('Login failed: ' + (response.error || 'Unknown error'));
    }
  });
  
  window.api.receive('register-response', (response) => {
    if (response.success) {
     
      window.api.sendToMain('navigate', 'board.html');
    } else {
      alert('Registration failed: ' + (response.error || 'Unknown error'));
    }
  });
  