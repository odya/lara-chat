import { Head, Link, useForm } from '@inertiajs/react';
import TextInput from "../TextInput";
import {Fragment} from "react";
import moment from "moment";

export default function ChatMessage({ message, currentContact }) {
    const isIncomingMessage = (message) => {
        return message.receiver_user_id === currentContact.id;
    };

    return (

        <div className={`flex items-end mb-4 last:mb-0 ${isIncomingMessage(message) ? "justify-end" : ""}`}>
            <div className={`mr-4 rounded-br-lg rounded-tl-lg rounded-tr-lg p-3 ${isIncomingMessage(message) ? "bg-blue-500 text-white" : "bg-gray-300"}`}>
                <p>{message.message}</p>
            </div>
            <span className="text-sm text-gray-500">{moment(message.created_at).format("LT")}</span>
        </div>

    );
}
