import ChatLayout from '@/Layouts/ChatLayout.jsx';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout.jsx';
import {useContext, useEffect} from 'react';
import ChatNewMessageForm from "@/Components/Chat/ChatNewMessageForm.jsx";
import ChatContacts from "@/Components/Chat/ChatContacts.jsx";
import ChatMessagesList from "@/Components/Chat/ChatMessagesList.jsx";
import {ChatContext} from "@/Context/ChatContext.jsx";

const Chat = ({auth, contacts, currentContact, serverMessages}) => {
    const {wsMessages, setWsMessages, onlineContactIds} = useContext(ChatContext);
    // const [messages, setMessages] = useState(serverMessages);

    useEffect(() => {
        setWsMessages([]);
    }, [setWsMessages]);
    return (
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 container">
            <div className="shadow rounded-lg">
                <div className="flex flex-row">
                    <div className="mr-px basis-1/5">
                        <div className="flex flex-col h-[calc(100vh-4rem)] bg-gray-200">
                            <ChatContacts contacts={contacts} currentContact={currentContact} onlineContactIds={onlineContactIds}/>
                        </div>
                    </div>

                    <div className="grow">
                        <div className="flex flex-col h-[calc(100vh-4rem)] relative overflow-auto">
                            {currentContact?.id ? (
                                <>
                                    <div className="flex-none bg-gray-200 p-2">
                                        <h1 className="text-l font-semibold text-gray-800">Dialog with
                                            "{currentContact?.name}"</h1>
                                    </div>
                                    <div className="grow p-0 overflow-hidden">
                                        <div className="h-full overflow-y-auto p-4">
                                            <ChatMessagesList messages={serverMessages.concat(wsMessages)} currentContact={currentContact}/>
                                        </div>
                                    </div>
                                    <div className="flex-none inset-x-0 bottom-0 w-full bg-gray-200 p-4">
                                        <ChatNewMessageForm receiverUser={currentContact}/>
                                    </div>
                                </>

                            ) : (

                                <div className="flex h-full items-center self-center">
                                    <div className="p-6 text-gray-300 drop-shadow-sm">Select contact</div>
                                </div>
                            )}

                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

Chat.layout = page => <AuthenticatedLayout
    header="Dialogs"
    user={page.props.auth.user}
>
    <ChatLayout
        children={page}
    />
</AuthenticatedLayout>
export default Chat
