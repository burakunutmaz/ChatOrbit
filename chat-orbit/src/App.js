import UserContext from './components/AccountContext';
import { ToggleColorMode } from './components/ToggleColorMode';
import { Views } from './components/Views';
import socket from './socket';

function App() {
  return (
        <UserContext>
          <Views/>
          <ToggleColorMode />
        </UserContext>


  );
}

export default App;
