import { createStore } from 'vuex'
import user from './user'
import chat from './chatsUser';
import chats from './chats';
import channels from './channels';
import games from './games';
import contacts from './contacts';
import online from './online';
import users_connected from './connected';


export default createStore({
  modules: {
    user,
    chat,
    chats,
    channels,
    contacts,
    online,
    games,
    users_connected,
  }
});
