import {useEffect, useState} from 'react';
import {usePage} from '@inertiajs/react';
import {ChatContext} from "@/Context/ChatContext.jsx";

export default function Chat({children}) {
    const {auth} = usePage().props;
    const [dialogsChannel, setDialogsChannel] = useState(undefined);
    const [presChannel, setPresChannel] = useState(undefined);
    const [onlineContactIds, setOnlineContactIds] = useState([]);
    const [wsMessages, setWsMessages] = useState([]);

    useEffect(() => {
        const dialogsChannelName = `dialogs.` + auth?.user.id;
        const dialogMessageSentEventName = 'DialogMessageSent';
        console.log("layout Chat setup");

        const connectDialogsChannel = () => {
            const channel = Echo.private(dialogsChannelName);
            console.log('ws connect');
            return channel;
        }
        const tmpDialogsChannel = (dialogsChannel === undefined) ? connectDialogsChannel() : dialogsChannel;

        const connectPresChannel = () => {
            return Echo.join('presence')
                .error((error) => {
                    console.error('pres error', error);
                })
                .joining((user) => {
                    console.log('pres joining', user);
                    setOnlineContactIds(onlineContactIds.concat([user.id]));
                    // axios.put(route("chat.user-presence", 1), {});
                })
                .leaving((user) => {
                    console.log('pres leaving', user);
                    const ids = onlineContactIds.filter(function (id) {
                        return id !== user.id;
                    });
                    setOnlineContactIds(ids);
                    // axios.put(route("chat.user-presence", 0), {});
                })
                .listen('UserOnline', (e) => {
                    console.log('pres UserOnline')
                    // this.friend = e.user;
                })
                .listen('UserOffline', (e) => {
                    console.log('pres UserOffline')
                    // this.friend = e.user;
                });
        }
        const tmpPresChannel = (presChannel === undefined) ? connectPresChannel() : presChannel;

        if(onlineContactIds.length == 0 && tmpPresChannel.subscription.members) {
            let ids = [];
            tmpPresChannel.subscription.members.each((onlineContact) => {
                ids.push(parseInt(onlineContact.id));
            });
            console.log('pres onlineContacts', ids);
            setOnlineContactIds(ids);
        }

        tmpDialogsChannel.listen(dialogMessageSentEventName, (e) => {
            console.log('New dialog message:', e);
            setWsMessages(wsMessages.concat([e.message]));
        });
        console.log(`ws start listening ${dialogMessageSentEventName}`);

        setDialogsChannel(tmpDialogsChannel);
        setPresChannel(tmpPresChannel);

        return () => {
            tmpDialogsChannel.stopListening(dialogMessageSentEventName);
            console.log(`ws stop listening ${dialogMessageSentEventName}`);

            console.log("layout Chat cleanup");
        };


    }, [dialogsChannel, presChannel, wsMessages, onlineContactIds]);

    return (
        <ChatContext.Provider value={{wsMessages, setWsMessages, onlineContactIds}}>
            {children}
        </ChatContext.Provider>
    );
}
