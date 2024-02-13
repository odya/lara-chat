import {useEffect, useState} from 'react';
import {usePage} from '@inertiajs/react';
import {ChatContext} from "@/Context/ChatContext.jsx";

export default function Chat({children}) {
    const {auth} = usePage().props;
    const [onlineContactIds, setOnlineContactIds] = useState([]);
    const [wsMessages, setWsMessages] = useState([]);

    useEffect(() => {
        const dialogsChannelName = `dialogs.` + auth?.user.id;
        const dialogsChannelInternalName = `private-encrypted-${dialogsChannelName}`;
        const presenceChannelName = `presence`;
        const presenceChannelInternalName = `presence-${presenceChannelName}`;
        const dialogMessageSentEventName = 'DialogMessageSent';

        const updateOnlineContactIds = (channel) => {
            const members = channel.subscription.members;
            if(members.me !== null) {
                console.log('presenceChannel updateOnlineContactIds', members);
                let ids = [];
                members.each((member) => {
                    ids.push(parseInt(member.id));
                });
                setOnlineContactIds(ids);
            }
        }

        let presenceChannel = Echo.connector.channels[presenceChannelInternalName]
        console.log('Looking for presenceChannel', presenceChannel)
        if(presenceChannel === undefined) {
            presenceChannel = Echo.join(presenceChannelName);
        } else {
            updateOnlineContactIds(presenceChannel);
        }
        presenceChannel
            .here((members) => {
                console.log('presenceChannel here', members.length);
                updateOnlineContactIds(presenceChannel);
            })
            .joining((user) => {
                console.log('presenceChannel joining', user);
                updateOnlineContactIds(presenceChannel);
            })
            .leaving((user) => {
                console.log('presenceChannel leaving', user);
                updateOnlineContactIds(presenceChannel);
            })
            .error((error) => {
                console.error('presenceChannel error', error);
            })

        let dialogsChannel = Echo.connector.channels[dialogsChannelInternalName]
        console.log('Looking for dialogsChannel', dialogsChannel)
        if(dialogsChannel === undefined) {
            dialogsChannel = Echo.encryptedPrivate(dialogsChannelName);
            console.log('dialogsChannel connect');
        }
        dialogsChannel.listen(dialogMessageSentEventName, (e) => {
            console.log('New dialog message:', e);
            setWsMessages(wsMessages.concat([e.message]));
        });
        console.log(`dialogsChannel start listening ${dialogMessageSentEventName}`);

        return () => {
            dialogsChannel.stopListening(dialogMessageSentEventName);
            console.log(`dialogsChannel stop listening ${dialogMessageSentEventName}`);

            presenceChannel.subscription.unbind_all()
            console.log(`presenceChannel stop listening all`)
        };


    }, [wsMessages]);

    return (
        <ChatContext.Provider value={{wsMessages, setWsMessages, onlineContactIds}}>
            {children}
        </ChatContext.Provider>
    );
}
