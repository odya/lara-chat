import { Head, Link, useForm } from '@inertiajs/react';
import TextInput from "../TextInput";
import {Fragment, useRef, useEffect} from "react";
import moment from "moment";
import ChatMessage from "@/Components/Chat/ChatMessage.jsx";

export default function ChatMessagesList({ messages, currentContact }) {
    const lastElemRef = useRef(null);

    useEffect(() => {
        if (messages.length) {
            lastElemRef.current?.scrollIntoView({
                behavior: "instant",
                block: "end",
            });
        }
    }, [messages.length]);

    return (
        <div>
            {(messages || []).map((message, index) => (
                <ChatMessage key={index} message={message} currentContact={currentContact} />
            ))}
            <div ref={lastElemRef}></div>
        </div>
    );
}


