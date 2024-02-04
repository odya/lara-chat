import { Head, Link, useForm } from '@inertiajs/react';
import TextInput from "../TextInput";

export default function ChatContacts({ contacts, currentContact, onlineContactIds }) {
    return (
        <>
            <div className="bg-gray-200 p-2"><h1 className="text-l font-semibold text-gray-800">Contacts</h1></div>
            <div className="relative overflow-y-scroll p-2">
                <ul className="grid grid-cols-1 divide-y rounded-md bg-gray-50" role="list">
                    {contacts.map((contact, index) => (
                        <li
                            className={`hover:bg-sky-100 ${currentContact?.id == contact.id  ? "bg-sky-300" : ''} relative`}
                            key={index}
                        >
                            <Link
                                href={`/chat/${contact.id}`}
                                key={index}
                                className={`flex px-5 py-3 hover:cursor-pointer`}
                            >
                                <div className="text-md">{contact.name}</div>
                                {onlineContactIds.includes(contact.id) ? (
                                    <div className="absolute top-0 right-1 font-weight-bold text-xs text-green-600">online</div>
                                ) : (
                                    <div></div>
                                )}

                            </Link>
                        </li>
                    ))}
                </ul>
            </div>
        </>
    );
}
